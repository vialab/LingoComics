<script lang="ts">
    import type { DragPair, Moment, Situation } from "../utils/types";
    import { touchDraggable } from "$lib/utils/dnd-touch";
    import { mouseDraggable } from '$lib/utils/dnd';
	import { onMount } from "svelte";
	import { shuffle } from "$lib/utils/helper";
    import ToastNotification from "./story/ToastNotification.svelte";
    import { createEventDispatcher } from "svelte";
    import { dragAssociationPairs } from "$lib/stores/dragStore";
    import PaginationButton from "./scenarios/PaginationButton.svelte";
    import Modal from "./scenarios/Modal.svelte";
    import { highlightKeywords } from "$lib/utils/highlight-keywords";
    import { selectedLanguage } from "$lib/stores/languageStore";
    
    export let currentSituation : Situation;
    export let allSituationLength : number;

    let isDragging: boolean = true;
    let showModal: boolean = false;
    let selectedMoment : Moment;
    let audio : string = '';
    let audioElement : HTMLAudioElement;
    
    // game points
    let points = 0;

    const dispatch = createEventDispatcher();

    let allCorrectAnswers: boolean = false;
    let completedQuiz: boolean = false;

    onMount(() => {
        currentSituation.moments = shuffle([...currentSituation.moments]);
    });

    $: () => console.log($selectedLanguage);

    // function to add a pair
    function addPair(pair: DragPair) {
        const existingPairs = $dragAssociationPairs.findIndex(p => p.draggable === pair.draggable);

        if (existingPairs !== -1) {
            $dragAssociationPairs[existingPairs] = pair;
        } else {
            $dragAssociationPairs.push(pair);
        }

    }

    // function to remove a pair
    function removePair(pairToRemove: DragPair) {
        // update svelte store
        dragAssociationPairs.update(items => {
            return items.filter(pair => pair.draggable !== pairToRemove.draggable && pair.target !== pairToRemove.target);
        });
    }

    // check if the answers are correct
    function checkAnswers() {
        let allCorrect = true;

        $dragAssociationPairs.forEach(({ draggable, target }) => {
            const correctMatch = draggable.dataset.id === target.dataset.id;
            draggable.style.border = correctMatch ? '3px solid green' : '3px solid red';
            target.style.border = correctMatch ? '3px solid green' : '3px solid red';

            // if any incorrct match then all correct is false
            if (!correctMatch) allCorrect = false;
        });
        
        if (allCorrect) {
            allCorrectAnswers = allCorrect;
            points += 100;
            dispatch('updatePoints', { points });
        } else {
            // reset incorrect pairs to original position
            resetIncorrectPairs();
        }

    }

    // reset incorrect image and option pairs
    function resetIncorrectPairs() {
        $dragAssociationPairs.forEach((pair) => {
            const correctMatch = pair.draggable.dataset.id === pair.target.dataset.id;
            if (!correctMatch) {
                pair.draggable.style.position = '';
                removePair(pair);
            }
        });
    }

    // function to complete quiz
    function completeQuiz() {
        completedQuiz = true;
        // clear writable when quiz ends
        $dragAssociationPairs = [];
    }

    // go to next situation and reset any variables needing reset
    function handleNextSituation() {
        $dragAssociationPairs.forEach((pair) => {
            pair.draggable.style.position = '';
            pair.draggable.style.border = '';
            pair.draggable.style.width = '';
            pair.draggable.style.borderRadius = '';
            pair.target.style.border = '';
        });
        $dragAssociationPairs = [];
        allCorrectAnswers = false;
        dispatch('nextSituation');
    }

    function handleParentClick(moment: Moment) {
        return function(event: MouseEvent) {
            showModal = true;
            selectedMoment = moment;
            const element: HTMLElement = event.target as HTMLElement;
            if (element.classList.contains('highlight')) {
                // selectedWord = element.textContent as string;
                // selectedDescription = moment.keywords[selectedWord];
            }
        }
    }

    // handle next situation change
    function handleSituationChange(situationIndex: number) {
        dispatch('changeSituation', situationIndex);
    }

    function handleTextToSpeech(moment: Moment) {
        return async function(event: Event) {
            try {
                const response = await fetch(`/api/tts`, {
                    method: "POST",
                    headers: {
                        'Content-Type': "application/json"
                    },
                    body: JSON.stringify({ text: moment.momentSummarization })
                });
                const data = await response.json();
                audio = data.audio;
                if (audioElement) {
                    audioElement.src = audio;
                    await audioElement.play();
                }
            } catch (error) {
                console.error("Error calling text-to-speech API:", error);
            }
        }
    }
</script>

<div class="scenario-page">
    <p class="text-center italic">Drag each option from the right and drop it onto the image that you believe matches its description best</p>
    <div class="flex flex-col lg:flex-row justify-center items-center max-w-7xl mx-auto p-3 h-auto gap-3">
        {#if showModal}
            <Modal moment={selectedMoment} on:close={() => showModal = false} />
        {/if}

        <!-- left side -->
        <div class="w-full left-side flex items-center justify-center">
            <PaginationButton situationLength={allSituationLength} currentSituationNumber={currentSituation.situationSort} handleSituationChange={handleSituationChange} />

            <div class="grid grid-cols-2 gap-3 w-[500px] bg-gray-100 px-5 py-5 rounded-lg">
                {#each currentSituation.image.momentImages as moment}
                    <img src={moment.image} alt={moment.title || ""}  data-id={moment.momentId} />
                {/each}
            </div>
        </div>

        <!-- right side -->
        <div class="w-full right-side h-full flex flex-col">
            <div class="bg-gray-100 rounded-lg p-3 flex flex-col flex-grow">
                <!-- <h1 class="text-2xl ">Options</h1> -->
                <ul class="flex flex-col gap-5 p-3 overflow-auto flex-grow">
                    {#each currentSituation.moments as moment}
                        <div class="flex flex-row w-full text-sm">
                            <div
                                use:touchDraggable={{ addPair, removePair, isDragging }}
                                use:mouseDraggable={{ addPair, removePair, isDragging }}
                                data-id={moment.momentId}
                                class="bg-white rounded-lg p-3 draggable"
                            >
                                {@html highlightKeywords(moment.momentSummarization, moment.keywords ?? {}) }
                            </div>  
                            <div class="flex flex-col gap-3 ml-3">
                                <div class="util-btn flex justify-center items-center bg-white rounded-lg p-3" on:click={handleParentClick(moment)} tabindex="0" role="button" on:keydown={(e) => e.key === 'Enter'}>
                                    Expand
                                </div>
                                <div class="util-btn flex justify-center items-center bg-white rounded-lg p-3" on:click={handleTextToSpeech(moment)} tabindex="0" role="button" on:keydown={(e) => e.key === 'Enter'}>
                                    Speech
                                    <audio bind:this={audioElement} src={audio}></audio>
                                </div>
                            </div>
                        </div>
                    {/each}
                    {#if allCorrectAnswers && allSituationLength === currentSituation.situationSort}
                        <button class="btn custom-btn-bg" id="checkMatches" on:click={completeQuiz}>Complete</button>
                    {:else if allCorrectAnswers}
                        <button class="btn custom-btn-bg" on:click={handleNextSituation}>Next situation</button>
                    {:else}
                        <button class="btn custom-btn-bg" id="checkMatches" on:click={checkAnswers}>Check answers</button>
                    {/if}
                </ul>
            </div>
        </div>

        {#if completedQuiz}
            <ToastNotification navigateTo="/scenario" text="Your quiz results have been saved in your Achievements" toastTimer={2000} />
        {/if}
    </div>
</div>

<style>
    .left-side {
        width: 60%;
    }
    .right-side {
        width: 40%;
        height: 502px;
    }
    .scenario-page {
        overflow-y: scroll;
        height: calc(100vh - 80px);
    }
    ul {
        max-height: 475px;
        transition: all 0.5s ease;
    }
    .draggable {
        width: 80%;
    }
    .draggable:hover {
        cursor: grab;
    }
    .util-btn {
        transition: all 0.5s ease;
    }
    :global(.highlight) {
        padding: 3px;
        border-radius: 5px;
        margin: 1px;
        z-index: 2000;
    }
    :global(.highlight-1) {
        background-color: #69DDFF;
    }
    :global(.highlight-2) {
        background-color: #96CDFF;
    }
    :global(.highlight-3) {
        background-color: #D8E1FF;
    }
    :global(.highlight-4) {
        background-color: #DBBADD;
    }
    :global(.highlight-5) {
        background-color: #BE92A2;
    }

</style>