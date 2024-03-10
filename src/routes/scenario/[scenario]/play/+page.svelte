<script lang="ts">
    import { page } from "$app/stores";
    import { fade } from "svelte/transition";
    import Header from "../../../../components/Header.svelte";
    import type { Moment, Scenario, Situation } from "../../data";
    import QuizLayout from "../../../../components/QuizLayout.svelte";
	import type { StoryStruct } from "../../../../utils/types";
	import BackButton from "../../../../components/scenarios/BackButton.svelte";

    // get data from +page.ts
    export let data;

    // variables
    let scenario : StoryStruct = (data.scenario as { story: StoryStruct }).story;
    let currentSituationIndex : number = 0;
    let currentSituation = scenario.situations[currentSituationIndex];

    console.log('playing: scenario', scenario.situations[currentSituationIndex].moments);    
</script>


<div class="mx-auto pb-3 h-auto bg-white p-3 w-full">
    <!-- header elements -->
    <Header>
        <BackButton slot="back"  route="/scenario/{scenario.scenarioId}"/>
        <h1 slot="title" class="flex-1 text-center text-3xl pb-2 w-full title">{ scenario.scenario.replaceAll('"', '') }</h1>
        <svelte:fragment slot="info">
            <p class="flex-1"></p>
        </svelte:fragment>
    </Header>

    <!-- main content -->
    <div class="scenario-page">
        <div class="flex flex-col lg:flex-row justify-center items-center max-w-7xl mx-auto p-8 h-auto">
            <!-- left side -->
            <div class="w-full lg:w-2/3 items-center justify-center">
                <div class="grid grid-cols-2 gap-3 w-[550px] bg-gray-100 px-5 py-5">
                    {#each currentSituation.image.momentImages as moment}
                        <img src={moment.image} alt={moment.title || ""} />
                    {/each}
                </div>  
            </div>

            <!-- right side -->
            <div class="w-full lg:w-1/3">
                <div class="bg-gray-100 rounded-lg p-5">
                    <h1 class="text-2xl ">Options</h1>
                    <ul class="max-h-96 flex flex-col gap-5 p-3 overflow-auto">
                        {#each currentSituation.moments as moment}
                            <li class="bg-white rounded-lg p-3 rounded-lg">{ moment.momentSummarization }</li>
                        {/each}
                    </ul>
                </div>
            </div>
        </div>
    </div>
</div>


<style>
    .scenario-page {
        overflow-y: scroll;
        height: calc(100vh - 80px);
    }

    h1 {
        flex-grow: 1;
        flex-shrink: 0;
        white-space: nowrap;
    }
</style>