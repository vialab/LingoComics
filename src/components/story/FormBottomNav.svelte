<!-- Bottom Navigator for Scenario Designer -->
<script lang="ts">
    import { fade } from "svelte/transition";

    // current step for scenario designer
    export let currentStep : number;
    export let isFinish : boolean;

    // advances to the next step
    function nextStep() {
        currentStep += 1;
    }

    // advances to the previous step
    function lastStep() {
        currentStep -= 1;
    }

    // finish or next btn function
    function nextOrFinish() {
        if (currentStep < 2) {
            currentStep = 2;
        } else if (currentStep > 2) {
            isFinish = !isFinish;
        }
    }
</script>

<div class="flex justify-between absolute bottom-0 w-full">
    {#if currentStep > 0}
        <button class="mr-5 px-5 py-2 custom-btn-bg-2 text-xl rounded" on:click={nextStep}>Button</button>
    {/if}

    <ul class="steps w-5/6">
        <li class="step {currentStep > 0 ? 'step-primary' : ''}">Generate story</li>
        <li class="step {currentStep > 1 ? 'step-primary' : ''}" transition:fade={{ delay: 250, duration: 300 }}>Generate images</li>
        <li class="step {currentStep > 2 ? 'step-primary' : ''}">Finish</li>
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