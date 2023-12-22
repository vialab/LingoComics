<!-- scripts -->
<script lang="ts">
	import { page } from '$app/stores';

	import "tailwindcss/tailwind.css";
	import "../app.css";
	import ProfileIcon from "../components/svgs/ProfileIcon.svelte";
	import Hamburger from "../components/svgs/Hamburger.svelte";
	import { fly } from 'svelte/transition';

	function shouldTransition(route:string) {
  	  	return route === '/' || route === '/scenario';
  	}
	
	export let data;

	$: activeRoute = $page.url.pathname;
	$: transitionKey = shouldTransition(data.url) ? data.url : null;
</script>

<!-- <pre>
	{JSON.stringify(data.url, null, 2)}
</pre> -->

<!-- layout -->
<nav class="navbar bg-neutral text-neutral-content">
	<div class="navbar-start">
		<div class="dropdown">
			<div tabindex="0" role="button" class="btn btn-ghost lg:hidden">
				<Hamburger />
			</div>
			<ul class="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow rounded-box w-52 bg-neutral text-neutral-content">
				<li class="text-xl">
					<a href="/" class:primary-bg={$page.url.pathname === '/'}>Home</a>
				</li>
				<li class="text-xl">
					<a href="/scenario" class:primary-bg={$page.url.pathname.includes('/scenario')}>Scenario</a>
				</li>
				<li class="text-xl">
					<a href="/achievements" class:primary-bg={$page.url.pathname === '/achievements'}>Achievements</a>
				</li>
				<li class="text-xl">
					<a href="/story" class:primary-bg={$page.url.pathname === '/story'}>Create new scenario</a>
				</li>
			</ul>
		</div>
		<a href="/" class="btn btn-ghost text-xl">LingoComics</a>
	</div>
	<div class="navbar-center hidden lg:flex">
		<ul class="menu menu-horizontal px-1">
			<li class="text-xl px-1">
				<a href="/" class="transition-bg" class:primary-bg={$page.url.pathname === '/'}>Home</a>
			</li>
			<li class="text-xl px-1">
				<a href="/scenario" class="transition-bg" class:primary-bg={$page.url.pathname.includes('/scenario')}>Scenario</a>
			</li>
			<li class="text-xl px-1">
				<a href="/achievements" class="transition-bg" class:primary-bg={$page.url.pathname === '/achievements'}>Achievements</a>
			</li>
			<li class="text-xl px-1">
				<a href="/story" class="transition-bg" class:primary-bg={$page.url.pathname === '/story'}>Create new scenario</a>
			</li>
		</ul>
	</div>
	<div class="navbar-end">
		<ProfileIcon />
	</div>
</nav>


{#key data.url}	
	<div in:fly={{ x: -200, duration: 400, delay: 400 }} out:fly={{ x: 200, duration: 400 }}>
		<slot />
	</div>
{/key}
