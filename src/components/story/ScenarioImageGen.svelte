<script lang="ts">
    import type { StoryStruct } from "../../utils/types";

    export let responseData : StoryStruct;
    export let handleImageGeneration : () => Promise<void>;
</script>

{#if responseData.image.length > 0} 
    <div class="flex gap-2 w-full h-[30rem]">
        <!-- Scenario image -->
        <div class="scenario-card rounded-lg relative w-[10rem] overflow-hidden flex-1">
            <img class="w-full h-full object-cover" src={responseData.image} alt={responseData.scenario} />
        </div>

        <!-- Situation Images Container -->
        <div class="w-1/2 h-full flex flex-col m-2 justify-between pl-2">
            {#each responseData.situations as img}
                <div class="h-1/3">
                    <img class="scenario-card w-full h-full object-cover rounded-lg p-2" src={img.image} alt={img.title} />
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
      box-shadow: 0 2px 2px #000;
      transition: transform 0.3s ease;
    }
</style>