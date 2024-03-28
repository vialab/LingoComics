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
    import Icon from "@iconify/svelte";
    
    export let currentSituation : Situation;
    export let allSituationLength : number;

    let isDragging: boolean = true;
    let showModal: boolean = false;
    let selectedMoment : Moment;
    let audio : string = '';
    let audioElement : HTMLAudioElement;

    
    // game variables
    let points : number = 0;
    let itemsMatched : number = 0;
    let checked : boolean = false;

    const dispatch = createEventDispatcher();

    let allCorrectAnswers: boolean = false;
    let completedQuiz: boolean = false;

    onMount(() => {
        currentSituation.moments = shuffle([...currentSituation.moments]);
    });

    // when itemsMatched changes then change the checked to false   
    $: if (itemsMatched !== 0) {
        // console.log(itemsMatched);
        checked = false;
    }

    // function to add a pair
    function addPair(pair: DragPair) {
        const existingPairs = $dragAssociationPairs.findIndex(p => p.draggable === pair.draggable);

        if (existingPairs !== -1) {
            $dragAssociationPairs[existingPairs] = pair;
        } else {
            $dragAssociationPairs.push(pair);
            itemsMatched += 1;
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
        let incorrectMatches = false;

        $dragAssociationPairs.forEach(({ draggable, target }) => {
            const correctMatch = draggable.dataset.id === target.dataset.id;
            draggable.style.border = correctMatch ? '3px solid green' : '3px solid red';
            target.style.border = correctMatch ? '3px solid green' : '3px solid red';

            // logic for accumulating points
            
            if (correctMatch) {
                points += 25;
            } else {
                incorrectMatches = true;
                if (points > 0) points -= 10;
            }

            // if any incorrct match then all correct is false
            if (!correctMatch) allCorrect = false;
        });
        
        if (allCorrect) {
            allCorrectAnswers = allCorrect;
            // if ($dragAssociationPairs.length === 4) points += 100;

            // bonus points
            // if (!incorrectMatches && $dragAssociationPairs.length === currentSituation.moments.length) {
            //     points += 100;
            // }
        } else {
            // reset incorrect pairs to original position
            resetIncorrectPairs();
        }
        checked = true;
        dispatch('updatePoints', { points });
    }

    // reset incorrect image and option pairs
    function resetIncorrectPairs() {
        $dragAssociationPairs.forEach((pair) => {
            const correctMatch = pair.draggable.dataset.id === pair.target.dataset.id;
            if (!correctMatch) {
                resetDraggable(pair);
                removePair(pair);
            }
        });
    }

    // function to complete quiz
    function completeQuiz() {
        completedQuiz = true;
        // clear writable when quiz ends
        $dragAssociationPairs = [];
        dispatch('saveResults', { points: points });
    }

    // go to next situation and reset any variables needing reset
    function handleNextSituation() {
        $dragAssociationPairs.forEach((pair) => {
            resetDraggable(pair);
        });
        $dragAssociationPairs = [];
        allCorrectAnswers = false;
        dispatch('nextSituation');
    }

    // function to reset/clear positions of the draggable elements
    function resetPositions() {
        $dragAssociationPairs.forEach((pair) => {
            resetDraggable(pair);
        });
        // reset drag pairs
        $dragAssociationPairs = [];
    }

    function resetDraggable(element: DragPair) {
        element.draggable.style.position = '';
        element.draggable.style.top = '';
        element.draggable.style.left = '';
        element.draggable.style.border = '';
        element.draggable.style.width = '';
        element.draggable.style.borderRadius = '';
        element.draggable.style.border = '';
        element.draggable.style.transform = '';
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
</script>

<div class="scenario-page">
    <p class="text-center italic">Drag each option from the right and drop it onto the image that you believe matches its description best</p>
    <div class="flex flex-col lg:flex-row justify-center items-center max-w-7xl mx-auto p-3 h-auto gap-3">
        {#if showModal}
            <Modal moment={selectedMoment} on:close={() => showModal = false} />
        {/if}

        <!-- left side -->
        <div class="w-full left-side flex flex-col items-center justify-center">
            <div class="bg-gray-100 px-5 py-5 rounded-lg flex flex-col justify-center items-center">
                <PaginationButton situationLength={allSituationLength} currentSituationNumber={currentSituation.situationSort} handleSituationChange={handleSituationChange} />
                <div class="grid grid-cols-2 gap-3 w-[450px]">
                    {#each currentSituation.image.momentImages as moment}
                        <img src={moment.image} alt={moment.title || ""}  data-id={moment.momentId} />
                    {/each}
                </div>
                
            </div>
        </div>

        <!-- right side -->
        <div class="w-full right-side h-full flex flex-col h-[700px]">
            <div class="bg-gray-100 rounded-lg p-3 flex flex-col flex-grow h-[500px]">
                <!-- <h1 class="text-2xl ">Options</h1> -->
                <ul class="flex flex-col gap-5 p-3 overflow-auto flex-grow" >
                    {#each currentSituation.moments as moment}
                        <div class="flex flex-row w-full text-sm w-full bg-white rounded-lg p-3 xl:h-[108px] lg:h-[78px] md:h-[68px]" >
                            <div class="container">
                                <div class="absolute rounded-lg p-2 back">{@html highlightKeywords(moment.momentSummarization, moment.keywords ?? {})}</div>
                                <div
                                    use:touchDraggable={{ addPair, removePair, isDragging }}
                                    use:mouseDraggable={{ addPair, removePair, isDragging }}
                                    data-id={moment.momentId}
                                    class="front bg-white rounded-lg p-3 draggable"
                                >
                                    {@html highlightKeywords(moment.momentSummarization, moment.keywords ?? {}) }
                                </div>      
                            </div>
                            
                            <div class="flex flex-col ml-3 h-full justify-center items-center">
                                <div class="util-btn flex justify-center items-center bg-white rounded-lg p-3" on:click={handleParentClick(moment)} tabindex="0" role="button" on:keydown={(e) => e.key === 'Enter'}>
                                    <Icon icon="material-symbols:info" height={30} />
                                </div>
                                <!-- <div class="util-btn flex justify-center items-center bg-white rounded-lg p-3" on:click={handleTextToSpeech(moment)} tabindex="0" role="button" on:keydown={(e) => e.key === 'Enter'}>
                                    Speech
                                    <audio bind:this={audioElement} src={audio}></audio>
                                </div> -->
                            </div>
                        </div>
                    {/each}
                </ul>
                <div class="p-3 w-full">
                    {#if allCorrectAnswers && allSituationLength === currentSituation.situationSort}
                        <button class="btn custom-btn-bg w-full" id="checkMatches" on:click={completeQuiz}>Complete</button>
                    {:else if allCorrectAnswers}
                        <button class="btn custom-btn-bg w-full" on:click={handleNextSituation}>Next situation</button>
                    {:else}
                        <div class="flex flex-row gap-2">
                            <button class="btn custom-btn-bg w-1/2" id="checkMatches" on:click={checkAnswers} disabled={checked}>Check answers</button>
                            <button class="btn clear-btn w-1/2" on:click={resetPositions}>Clear all</button>
                        </div>
                    {/if}
                </div>
            </div>
        </div>

        {#if completedQuiz}
            <ToastNotification navigateTo="/scenario" text="Your quiz results have been saved in your Achievements" toastTimer={2000} />
        {/if}
    </div>
</div>

<style>
    .left-side {
        width: 50%;
    }
    .right-side {
        width: 50%;
        height: 100%;
    }
    .scenario-page {
        overflow-y: scroll;
        height: calc(100vh - 80px);
    }
    ul {
        max-height: 475px;
        transition: all 0.5s ease;
    }
    .util-btn {
        transition: all 0.5s ease;
    }

    .container {
        position: relative;
    }
    .draggable {
        position: sticky;
        z-index: 10;
    }
    .draggable:hover {
        cursor: grab;
    }
    .back {
        background-color: #e7e7e7;
        border: 1px dashed gray;
    }
    .clear-btn {
        background-color: #f86565;
    }
    :global(.highlight) {
        padding: 3px;
        border-radius: 5px;
        margin: 1px;
        line-height: 1.5rem;
        z-index: 2000;
    }
    :global(.highlight-1) {
        background-color: #96CDFF;
    }
    :global(.highlight-2) {
        /* background-color: #96CDFF; */
        background-color: #96CDFF;
    }
    :global(.highlight-3) {
        /* background-color: #D8E1FF; */
        background-color: #96CDFFFF;
    }
    :global(.highlight-4) {
        /* background-color: #DBBADD; */
        background-color: #96CDFF;
    }
    :global(.highlight-5) {
        /* background-color: #BE92A2; */
        background-color: #96CDFF;
    }

</style>