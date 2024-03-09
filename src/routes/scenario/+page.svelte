<!-- scripts -->
<script lang="ts">
	import type { FirestoreData } from '../../utils/types.js';
	import ScenarioLayout from '../../components/scenarios/ScenarioLayout.svelte';
	import ScenarioLayoutGrid from '../../components/scenarios/ScenarioLayoutGrid.svelte';
	import HeaderDivider from '../../components/scenarios/HeaderDivider.svelte';

    // Get data from +page.server.ts
    export let data: FirestoreData;

    // system scenarios
    let systemScenarios = data.scenarios.filter(scenario => ['1', '2', '3', '4', '5'].includes(scenario.scenarioId));

    // generated scenarios
    let generatedScenarios = data.scenarios.filter(scenario => !['1', '2', '3', '4', '5'].includes(scenario.scenarioId));

</script>

<!-- display -->
<div class="scenario-page">
    <!-- display system scenarios -->
    <HeaderDivider headerTitle="Our scenarios" />
    <ScenarioLayout scenarios={systemScenarios} />

    <!-- display generated scenarios -->
    <HeaderDivider headerTitle="Your scenarios" />
    <ScenarioLayoutGrid scenarios={generatedScenarios} />

    <!-- display all scenarios -->
    <HeaderDivider headerTitle="All scenarios" />
    <ScenarioLayoutGrid scenarios={data.scenarios} />
</div>

<!-- styles -->
<style>
    .scenario-page {
        overflow-y: scroll;
        height: calc(100vh - 80px);
        padding: 2rem;
    }
</style>