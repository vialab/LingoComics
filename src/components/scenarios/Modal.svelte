<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import type { Moment } from "../../utils/types";
    import BackButton from "./BackButton.svelte";
    import { highlightKeywords } from "$lib/utils/highlight-keywords";
    export let moment : Moment;
    
    console.log(moment);

    let showModal = true;

    const dispatch = createEventDispatcher();

    function toggleModal() {
        showModal = !showModal;
        if (!showModal) {
            dispatch('close');
        }
    }
    const highlightClasses = ['highlight-1', 'highlight-2', 'highlight-3', 'highlight-4', 'highlight-5'];

</script>

{#if showModal}
    <div class="modal modal-open">
        <div class="modal-box relative">
            <h1 class="text-3xl mb-2">Keywords</h1>

            <p class="mb-5">{@html highlightKeywords(moment.momentSummarization, moment.keywords ?? {})}</p>

            {#each Object.entries(moment.keywords)  as [word, description], i}
                
                <h3 class="text-xl">
                    <span class="highlight {highlightClasses[i % highlightClasses.length]}">{word.charAt(0).toUpperCase() + word.slice(1)}</span> 
                </h3>
                <p class="pb-2">{description.charAt(0).toUpperCase() + description.slice(1)}</p>
                <hr />
            {/each}
            <div class="modal-action">
                <button class="btn" on:click={toggleModal}>Close</button>
            </div>
        </div>
    </div>
{/if}

<style>
    .modal {
        z-index: 3000;
    }
    .highlight-1 {
        border: 2px solid #40bce2;
    }
    .highlight-2 {
        border: 2px solid #4e9be3;
    }
    .highlight-3 {
        border: 2px solid #6e87d9;
    }
    .highlight-4 {
        border: 2px solid #a061a4;
    }
    .highlight-5 {
        border: 2px solid #8d4862;
    }
</style>

