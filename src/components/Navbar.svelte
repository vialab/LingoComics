<script>
    import { page } from '$app/stores';
    import Hamburger from './svgs/Hamburger.svelte';
    import ProfileIcon from './svgs/ProfileIcon.svelte';
</script>

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