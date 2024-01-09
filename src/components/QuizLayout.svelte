<script lang="ts">
    import type { Scenario, Situation, Moment } from "../routes/scenario/data";
    import { fade } from 'svelte/transition';
    export let scenario : Scenario;
    export let situation : Situation;
    export let moments : Array<Moment>;
    
    let allTextOptions = situation.moments.reduce((acc, moment) => {
        return acc.concat(moment.textOptions);
    }, [] as string[]);

    let debugMode: boolean = false;

    function toggleDebug() : void {
        debugMode = !debugMode;
    }
</script>



<div class="scenario-page">
    <!-- debug situation -->
    <button on:click={toggleDebug}>{debugMode ? "turn off debug": "turn on debug"}</button>
    {#if debugMode}
        <pre>
            {JSON.stringify(situation, null, 2)}
        </pre>
    {/if}

    <!-- quiz grid layout -->
    <div class="flex flex-col lg:flex-row justify-center items-center max-w-7xl mx-auto p-8 h-auto" in:fade={{ duration: 300, delay: 400 }} out:fade={{ duration: 300 }}>

        <!-- Left side (images) - Takes 2/3 of the space -->
        <div class="w-full lg:w-2/3">
            <div class="grid grid-cols-2 gap-4">
                {#each moments as moment}
                    <img src={moment.image} alt={moment.id.toString()} />
                {/each}
            </div>
        </div>
        
        <!-- Right side (options) - Takes 1/3 of the space -->
        <div class="w-full lg:w-1/3">
            <ul>
                {#each allTextOptions as options}
                    <li>{options}</li>
                {/each}
            </ul>
        </div>
    
    </div>
</div>


<style>
    .scenario-page {
        overflow-y: scroll;
        height: calc(100vh - 80px);
    }
</style>
