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
    <QuizLayout currentSituation={currentSituation} />
</div>


<style>
    h1 {
        flex-grow: 1;
        flex-shrink: 0;
        white-space: nowrap;
    }
</style>