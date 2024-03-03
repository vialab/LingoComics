<script lang="ts">
    import type { StoryStruct } from "../../utils/types";
    import Modal from "../Modal.svelte";
    import { createEventDispatcher } from "svelte";

    const dispatch = createEventDispatcher();

    export let responseData : StoryStruct | null = null;
    export let isSaving : boolean = false;
    export let isEditing : boolean = false;
    export let existingScenarios : StoryStruct[] = [];
    export let handleSaveStory : () => Promise<void> = async() => {};
    export let toggleEditing : () => void = () => {};
    export let fetchScenario : (scenarioId : string) => Promise<void> = async() => {};
    export let currentStep: number = 0;

    // dispatch event for clear
    function handleClear() {
        dispatch('click', { clear: true });
    }

</script>

<div class="mx-auto pb-3 h-auto absolute top-0 left-0 right-0 bg-white p-3 w-full">
    <header class="flex justify-center items-end border-b border-black gap-2 header-container">
        <h1 class="flex-1 text-left text-2xl pb-2 px2">{responseData?.scenario ? responseData?.scenario : 'Generated scenario'}</h1>
        {#if currentStep > 0}
            <button class="btn custom-btn-bg mb-2 text-xl" on:click={handleClear}>Clear</button>
        {/if}
        {#if responseData}
            <!-- <button class="btn custom-btn-bg mb-2 text-xl" on:click={handleSaveStory}>{isSaving ? 'Saving' : 'Save'}</button>
            <button class="btn custom-btn-bg-2 mb-2 text-xl" on:click={toggleEditing}>{isEditing ? 'Confirm changes' : 'Edit'}</button> -->
        {/if}
        {#if existingScenarios.length > 0}
            <Modal selectedScenario={fetchScenario} scenarios={existingScenarios} />
        {/if}
    </header>
</div>