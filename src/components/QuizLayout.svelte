<script lang="ts">
    import type { DragPair, Situation } from "../utils/types";
    import { touchDraggable } from "$lib/utils/dnd-touch";
    import { mouseDraggable } from '$lib/utils/dnd';
	import { onMount } from "svelte";
	import { shuffle } from "$lib/utils/helper";
    import ToastNotification from "./story/ToastNotification.svelte";
    import { createEventDispatcher } from "svelte";
    import { dragAssociationPairs } from "$lib/stores/dragStore";

    export let currentSituation : Situation;
    export let allSituationLength : number;

    console.log(currentSituation);

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

    function escapeRegExp(string: string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // Escapes special characters
    }

    function highlightKeywords(summary: string, keywords: Record<string, string>): string {
        let highlightedSummary = summary;
        const highlightClasses = ['highlight-1', 'highlight-2', 'highlight-3', 'highlight-4', 'highlight-5'];
        let colorIndex = 0;
        if (keywords) {
            Object.keys(keywords).forEach(keyword => {
                const escapedKeyword = escapeRegExp(keyword);
                const regex = new RegExp(`\\b${escapedKeyword}\\b`, 'gi');
                const highlightClass = highlightClasses[colorIndex % highlightClasses.length];
                highlightedSummary = highlightedSummary.replace(regex, `<span class="highlight ${highlightClass}">$&</span>`);
                colorIndex += 1;
            });
        }
        return highlightedSummary;
    }

    function handleParentClick(event: Event) {
        const element : HTMLElement = event.target as HTMLElement;
        if (element.classList.contains('highlight')) {
            console.log("keyword: clicked: ", element.textContent);
        }
    }

    // handle next situation change
    function handleSituationChange(situationIndex: number) {
        dispatch('changeSituation', situationIndex);
    }
</script>

<div class="scenario-page">
    <p class="text-center italic">Drag each option from the right and drop it onto the image that you believe matches its description best</p>
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
                <!-- <h1 class="text-2xl ">Options</h1> -->
                <ul class="flex flex-col gap-5 p-3 overflow-auto flex-grow">
                    {#each currentSituation.moments as moment}
                        <div
                            on:click={handleParentClick}
                            use:touchDraggable={{ addPair, removePair }}
                            use:mouseDraggable={{ addPair, removePair }}
                            data-id={moment.momentId}
                            class="bg-white rounded-lg p-3 rounded-lg"
                            tabindex="0" 
                            role="button" 
                            on:keydown={(e) => e.key === 'Enter'}
                        >
                            {@html highlightKeywords(moment.momentSummarization, moment.keywords ?? {}) }
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