<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import type { Moment } from "../../utils/types";
    import { highlightKeywords } from "$lib/utils/highlight-keywords";
    import Icon from "@iconify/svelte";
    
    export let moment : Moment;

    let audio : string;
    let audioElement : HTMLAudioElement;
    
    let showModal = true;

    const dispatch = createEventDispatcher();

    function toggleModal() {
        showModal = !showModal;
        if (!showModal) {
            dispatch('close');
        }
    }
    const highlightClasses = ['highlight-1', 'highlight-2', 'highlight-3', 'highlight-4', 'highlight-5'];


    function handleTextToSpeech(text: string) {
        return async function(event: Event) {
            try {
                const response = await fetch(`/api/tts`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ text: text })
                });
                const data = await response.json();
                audio = data.audio;
                if (audioElement) {
                    audioElement.src = audio;
                    await audioElement.play();
                }
            } catch (error) {
                console.error("Error calling text-to-sepech API:", error);
            }
        }
    }
</script>

{#if showModal}
    <div class="modal modal-open">
        <div class="modal-box relative">
            <h1 class="text-3xl mb-2">Keywords</h1>

            <div class="flex flex-row gap-3">
                <p class="my-auto">{@html highlightKeywords(moment.momentSummarization, moment.keywords ?? {})}</p>
                <div class="util-btn flex justify-center items-center bg-white rounded-lg p-3" on:click={handleTextToSpeech(moment.momentSummarization)} tabindex="0" role="button" on:keydown={(e) => e.key === 'Enter'}>
                    <Icon icon="wpf:speaker" />
                    <audio bind:this={audioElement} src={audio} />
                </div>
            </div>

            {#each Object.entries(moment.keywords) as [word, description], i}
                <!-- main word -->
                <div class="text-xl mt-4 flex flex-row gap-3">
                    <span class="w-[120px] text-center highlight {highlightClasses[i % highlightClasses.length]}">{word.charAt(0).toUpperCase() + word.slice(1)}</span> 
                    <div class="util-btn flex justify-center items-center bg-white rounded-lg p-3" on:click={handleTextToSpeech(`${word}: ${description}.`)} tabindex="0" role="button" on:keydown={(e) => e.key === 'Enter'}>
                        <Icon icon="wpf:speaker" />
                        <audio bind:this={audioElement} src={audio} />
                    </div>
                </div>
                <!-- word description -->
                <p class="pb-2 mt-2">{description.charAt(0).toUpperCase() + description.slice(1)}</p>
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
        border: 2px solid #96CDFF;
        /* border: 2px solid #40bce2; */
    }
    .highlight-2 {
        border: 2px solid #96CDFF;
        /* border: 2px solid #4e9be3; */
    }
    .highlight-3 {
        border: 2px solid #96CDFF;
        /* border: 2px solid #6e87d9; */
    }
    .highlight-4 {
        border: 2px solid #96CDFF;
        /* border: 2px solid #a061a4; */
    }
    .highlight-5 {
        border: 2px solid #96CDFF;
        /* border: 2px solid #8d4862; */
    }
</style>

