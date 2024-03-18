<script lang="ts">
    import Header from "../../../../components/Header.svelte";
    import QuizLayout from "../../../../components/QuizLayout.svelte";
	import type { StoryStruct } from "../../../../utils/types";
	import BackButton from "../../../../components/scenarios/BackButton.svelte";
    import Dropdown from "../../../../components/scenarios/Dropdown.svelte";

    // get data from +page.ts
    export let data;

    let points : number = 0;

    // variables
    let scenario : StoryStruct = (data.scenario as { story: StoryStruct }).story;
    let currentSituationIndex : number = 0;
    let allSituationsLength: number = scenario.situations.length;
    
    // current situation is reactive
    $: currentSituation = scenario.situations[currentSituationIndex];

    function handleNextSituation() {
        currentSituationIndex += 1;
    }
    
    function handleSituationChange(event: CustomEvent) {
        currentSituationIndex = event.detail;
    }

    function handlePoints(event: CustomEvent) {
        points = event.detail.points;
    }
</script>


<div class="mx-auto pb-3 h-auto bg-white p-3 w-full">
    <!-- header elements -->
    <Header>
        <BackButton slot="back"  route="/scenario/{scenario.scenarioId}"/>
        <h1 slot="title" class="flex-1 text-center text-3xl pb-2 w-full title">{ scenario.situations[currentSituationIndex].title }</h1>
        <div slot="info" class="flex flex-1 h-full justify-center items-center">
            <p class="text-xl text-bold">Points: { points }</p>
        </div>
    </Header>

    <!-- main content -->
    <QuizLayout 
        currentSituation={currentSituation} 
        allSituationLength={allSituationsLength} 
        on:nextSituation={handleNextSituation} 
        on:changeSituation={handleSituationChange} 
        on:updatePoints={handlePoints}
    />
</div>


<style>
    h1 {
        flex-grow: 1;
        flex-shrink: 0;
        white-space: nowrap;
    }
</style>