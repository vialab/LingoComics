<script lang="ts">
    import type { Scenario } from "../routes/scenario/data";

    let isModalOpen = false;

    function toggleModal() {
        isModalOpen = !isModalOpen;
    }

    export let scenarios : Scenario[];
    export let selectedScenario : (scenarioId: string) => void;

    function handleScenarioClick(scenarioId: string) {
        if (selectedScenario) {
            selectedScenario(scenarioId);
        }
    }
</script>

<button class="btn mb-2 text-xl" on:click={toggleModal}>Load</button>

{#if isModalOpen}
    <div class="modal modal-open">
        <div class="modal-box relative">
            <h3 class="font-medium text-2xl mb-2">Existing scenarios</h3>

            <ul class="p-2 shadow menu dropdown-content z-[1] bg-base-100 rounded-box w-52 w-full">
                {#each scenarios as scenario}
                    <li class="px-5 py-1 my-1">
                        <button class="text-lg" on:click={() => handleScenarioClick(scenario.id)}>{ scenario.title }</button>
                    </li>
                {/each}
            </ul>   

            <div class="modal-action">
                <button class="btn" on:click={toggleModal}>Close</button>
            </div>
        </div>
    </div>
{/if}