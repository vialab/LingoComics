<script lang="ts">
    import type { Scenario } from "../../routes/scenario/data";
    import type { StoryStruct } from "../../utils/types";
    import Modal from "../Modal.svelte";

    export let responseData : StoryStruct | null;
    export let isSaving  : boolean;
    export let isEditing : boolean;
    export let existingScenarios : Scenario[];
    export let handleSaveStory : () => Promise<void>;
    export let toggleEditing : () => void;
    export let fetchScenario : (scenarioId : string) => Promise<void>
</script>

<div class="mx-auto pb-3 h-auto absolute top-0 left-0 right-0 bg-white p-3 w-full">
    <header class="flex justify-center items-end border-b border-black gap-2 header-container">
        <h1 class="flex-1 text-left text-2xl pb-2 px2">{responseData?.scenario ? responseData?.scenario : 'Generated scenario'}</h1>
        {#if responseData}
            <button class="btn custom-btn-bg mb-2 text-xl" on:click={handleSaveStory}>{isSaving ? 'Saving' : 'Save'}</button>
            <button class="btn custom-btn-bg-2 mb-2 text-xl" on:click={toggleEditing}>{isEditing ? 'Save changes' : 'Edit'}</button>
        {/if}
        {#if existingScenarios.length > 0}
            <Modal selectedScenario={fetchScenario} scenarios={existingScenarios} />
        {/if}
    </header>
</div>