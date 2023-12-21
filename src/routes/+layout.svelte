<script lang="ts">
	import Navbar from "../components/Navbar.svelte";
    import "../app.css";
	import { page } from "$app/stores";
	import { fly } from "svelte/transition";

    export let data;

    function shouldTransition(route:string) {
  	  	return route === '/' || route === '/scenario';
  	}

    $: activeRoute = $page.url.pathname;
    $: transitionKey = shouldTransition(data.url) ? data.url : null;
</script>

<!-- Layout -->
<Navbar />

{#key data.url} 
    <div in:fly={{ x: -200, duration: 400, delay: 400 }} out:fly={{ x: 200, duration: 400 }}>
        <slot />
    </div>
{/key}
<!-- Layout -->