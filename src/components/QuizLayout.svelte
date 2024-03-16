<script lang="ts">
    import type { DragPair, Situation } from "../utils/types";
    import { touchDraggable } from "$lib/utils/dnd-touch";
    import { mouseDraggable } from '$lib/utils/dnd';
	import { onMount } from "svelte";
	import { shuffle } from "$lib/utils/helper";
    import ToastNotification from "./story/ToastNotification.svelte";
    import { createEventDispatcher } from "svelte";
    import { writable } from "svelte/store";
    import { dragAssociationPairs } from "$lib/stores/dragStore";

    export let currentSituation : Situation;
    export let allSituationLength : number;

    const dispatch = createEventDispatcher();

    let allCorrectAnswers: boolean = false;
    let completedQuiz: boolean = false;

    onMount(() => {
        currentSituation.moments = shuffle([...currentSituation.moments]);
    })

    // function to add a pair
    function addPair(pair: DragPair) {
        const existingPairs = $dragAssociationPairs.findIndex(p => p.draggable === pair.draggable);

        if (existingPairs !== -1) {
            $dragAssociationPairs[existingPairs] = pair;
        } else {
            $dragAssociationPairs.push(pair);
        }
        console.log($dragAssociationPairs);

    }

    // function to remove a pair
    function removePair(pairToRemove: DragPair) {
        // update svelte store
        dragAssociationPairs.update(items => {
            return items.filter(pair => pair.draggable !== pairToRemove.draggable && pair.target !== pairToRemove.target);
        });
        console.log($dragAssociationPairs);
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
            console.log("all pairs are correct");
            allCorrectAnswers = allCorrect;
        } else {
            console.log("some are incorrect");

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

    function handleSituationChange(situationIndex: number) {
        dispatch('changeSituation', situationIndex);
    }
</script>

<div class="scenario-page">
    <div class="flex flex-col lg:flex-row justify-center items-center max-w-7xl mx-auto p-3 h-auto">
        <!-- left side -->
        <div class="w-full lg:w-2/3 flex items-center justify-center">
            
            <div class="join flex flex-col gap-3 mr-5">
                {#each { length: allSituationLength} as _, i}
                    <div class="radio {i < currentSituation.situationSort ? 'bg-black' : ''}" on:click={() => handleSituationChange(i)} tabindex="0" role="button" on:keydown={(e) => e.key === 'Enter'} aria-label="1"></div>   
                {/each}
            </div>

            <div class="grid grid-cols-2 gap-3 w-[550px] bg-gray-100 px-5 py-5">
                {#each currentSituation.image.momentImages as moment}
                    <img src={moment.image} alt={moment.title || ""}  data-id={moment.momentId} />
                {/each}
            </div>
        </div>

        <!-- right side -->
        <div class="w-full lg:w-1/3 h-full flex flex-col">
            <div class="bg-gray-100 rounded-lg p-5 flex flex-col flex-grow">
                <h1 class="text-2xl ">Options</h1>
                <ul class="flex flex-col gap-5 p-3 overflow-auto flex-grow">
                    {#each currentSituation.moments as moment}
                        <li 
                            use:touchDraggable={{ addPair, removePair }}
                            use:mouseDraggable={{ addPair, removePair }}
                            data-id={moment.momentId}
                            class="bg-white rounded-lg p-3 rounded-lg"
                        >{ moment.momentSummarization }
                        </li>
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
    .scenario-page {
        overflow-y: scroll;
        height: calc(100vh - 80px);
    }

    ul {
        max-height: 475px;
        transition: all 0.5s ease;
    }
    li:hover {
        cursor: grab;
    }
</style>