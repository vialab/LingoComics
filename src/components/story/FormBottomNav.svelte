<!-- Bottom Navigator for Scenario Designer -->
<script lang="ts">
    import { fade } from "svelte/transition";
    import { createEventDispatcher } from "svelte";

    // current step for scenario designer
    export let currentStep : number;
    export let isFinish : boolean;

    // dispatcher event
    const dispatch = createEventDispatcher();

    // updates current step and dispatch an event
    function updateStep(newStep : number) {
        currentStep = newStep;
        dispatch('stepchange', { currentStep });
    }

    // advances to the next step
    function nextStep() {
        updateStep(currentStep + 1);
    }

    // advances to the previous step
    function lastStep() {
        updateStep(currentStep - 1);
    }

    // finish or next btn function
    function nextOrFinish() {
        if (currentStep < 2) {
            updateStep(2);
        } else if (currentStep > 2) {
            isFinish = !isFinish;
            dispatch('finish', { isFinish });
        }
    }
</script>

<div class="flex justify-between absolute bottom-0 w-full p-2">
    {#if currentStep > 0}
        <button class="mr-5 px-5 py-2 custom-btn-bg-2 text-xl rounded" on:click={lastStep}>Back</button>
    {/if}

    <ul class="steps w-5/6">
        <li class="step {currentStep > 0 ? 'step-primary' : ''}">Character</li>
        <li class="step {currentStep > 1 ? 'step-primary' : ''}" transition:fade={{ delay: 250, duration: 300 }}>Setting</li>
        <li class="step {currentStep > 2 ? 'step-primary' : ''}">Story</li>
        <li class="step {currentStep > 3 ? 'step-primary' : ''}">Images</li>
        <li class="step {currentStep > 4 ? 'step-primary' : ''}">Finish</li>
    </ul>

    <!-- display after the first step is achieved -->
    {#if currentStep > 0}
        <button class="mr-5 px-5 py-2 custom-btn-bg-2 text-xl rounded" on:click={nextOrFinish}>{ currentStep === 2 ? 'Finish' : 'Next' }</button>
    {/if}
</div>

<style>
    .steps .step-primary + .step-primary:before, .steps .step-primary:after {
        background-color: var(--primary-background-color);
        color: #000;
    }
</style>