<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    import Icon from '@iconify/svelte';

    const dispatch = createEventDispatcher();

    let drawerOpen: boolean = true;

    function toggleDrawer() {
        drawerOpen = !drawerOpen;
        dispatch('change', { drawerOpen });
    }

</script>

<div class="self-start relative right-side relative">
    <div class="flex h-screen justify-center items-center">
        <button class="" on:click={toggleDrawer}>
            {#if drawerOpen}
                <Icon icon="mingcute:left-fill" height={30}/>
            {:else}
                <Icon icon="mingcute:right-fill" height={30}/>
            {/if}
        </button>
    </div>
</div>

<style>
    .right-side {
        height: calc(100vh - 80px);
    }
</style>