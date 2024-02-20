<script lang="ts">
    import { writable } from 'svelte/store';
    import type { StoryStruct } from "../../utils/types";

    export let responseData : StoryStruct;
    export let handleImageGeneration : () => Promise<void>;


    // reactive state for selected situation and its moments
    let selectedSituation = writable(null);
    let moments = writable([]);

    // function to handle situation selection
    function selectSituation(situation) {
        selectedSituation.set(situation);
        // moments.set(situation.moments);
    }

    // function to reset to initial view
    function goBack() {
        selectedSituation.set(null);
        moments.set([]);
    }

    // console.log(responseData);
</script>
<!-- /*&& !responseData.image.includes("undefined")*/ -->
{#if $selectedSituation }
    <div class="flex gap-2 w-full h-[30rem]">
        <!-- Situation image -->
        <div class="scenario-card rounded-lg relative w-[10rem] overflow-hidden flex-1">
            <img src="{$selectedSituation.image}" alt="selected situation" class="w-full h-full object-cover" />
            <div class="image-overlay absolute inset-0"></div>
            <div class="p-4 absolute bottom-0 left-0 right-0">
                <h2 class="text-white text-xl">Situation: { $selectedSituation.title }</h2>
            </div>
        </div>

    </div>

    <!-- Go back button -->
    <button on:click={goBack}>Go Back</button>
{:else if responseData.hasOwnProperty('image') && responseData.image && typeof responseData.image === 'string' && !responseData.image.includes("undefined")}    
    <div class="flex gap-2 w-full h-[30rem]">
        <!-- Scenario image -->
        <div class="scenario-card rounded-lg relative w-[10rem] overflow-hidden flex-1">
            <img class="w-full h-full object-cover" src={responseData.image} alt={responseData.scenario} />
            <div class="image-overlay absolute inset-0"></div>
            <div class="p-4 absolute bottom-0 left-0 right-0">
                <h2 class="text-white text-xl">Scenario: { responseData.scenario.replaceAll(`"`, '') }</h2>
            </div>
        </div>

        <!-- Situation Images Container -->
        <div class="flex flex-col gap-2 w-1/2">
            {#each responseData.situations as situation, situationIndex}
                <div class="scenario-card relative overflow-hidden w-full" on:click={() => selectSituation(situation)}>
                    <img class="border h-[9.7rem] object-cover rounded-lg w-full" src={situation.image} alt={situation.title} />
                    <div class="image-overlay absolute inset-0"></div>
                    <div class="p-4 absolute bottom-0 left-0 right-0">
                        <h3 class="text-white text-xl">{ situation.title }</h3>
                    </div>
                </div>
            {/each}
        </div>
    </div>
{:else}
    <button class="btn w-full" on:click={handleImageGeneration}>Generate images</button>
{/if}

<style>
    .scenario-card {
      background: #fff;
      /* box-shadow: 0 2px 2px #000; */
      transition: transform 0.3s ease;
    }

    .image-overlay {
        background: linear-gradient(180deg, transparent, rgba(0, 0, 0, 0.7)) 90%;
    }
</style>

<!-- <div class="w-1/2 h-full flex flex-col m-2 justify-between pl-2">
    {#each responseData.situations as img}
        <div class="h-1/3">
            <img class="scenario-card w-full h-full object-cover rounded-lg" src={img.image} alt={img.title} />
        </div>
    {/each}
</div> -->