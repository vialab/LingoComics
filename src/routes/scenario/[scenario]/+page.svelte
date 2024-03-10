<script lang="ts">
    import { page } from '$app/stores';
	import Header from '../../../components/Header.svelte';
	import BackButton from '../../../components/scenarios/BackButton.svelte';
	import ScenarioCard from '../../../components/scenarios/ScenarioCard.svelte';
    import type { StoryStruct } from '../../../utils/types';
    import type { Scenario } from '../data';

    const scenarioId : number = Number($page.params.scenario);

    // data from +page.ts for pre-loaded content for current scenario
    export let data;

    let scenario: StoryStruct = data.scenario as StoryStruct;
</script>

<div class="mx-auto pb-3 h-auto bg-white p-3 w-full">
    <Header>
        <BackButton slot="back" route="/scenario" />
        <h1 slot="title" class="flex-1 text-center text-3xl pb-2 w-full" >{ scenario.scenario.replaceAll('"', '') }</h1>
        <svelte:fragment slot="info">
            <p class="flex-1"></p>
        </svelte:fragment> 
    </Header>

    <ScenarioCard image={scenario.image} scenario={scenario.scenario} scenarioId={scenario.scenarioId} />
</div>