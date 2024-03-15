<script lang="ts">
	import type { DragPair, Moment, Situation } from "../utils/types";
    import { touchDraggable } from "$lib/utils/dnd";
	import { onMount } from "svelte";
	import { shuffle } from "$lib/utils/helper";

    export let currentSituation : Situation;

    let dragPairs: DragPair[] = [];

    onMount(() => {
        currentSituation.moments = shuffle([...currentSituation.moments]);
    })

    // function to add a pair
    function addPair(pair: DragPair) {
        const existingPairs = dragPairs.findIndex(p => p.draggable === pair.draggable);
        if (existingPairs !== -1) {
            dragPairs[existingPairs] = pair;
        } else {
            dragPairs.push(pair);
        }
    }

    // function to remove a pair
    function removePair(pairToRemove: DragPair) {
        dragPairs = dragPairs.filter(pair => pair.draggable !== pairToRemove.draggable && pair.target !== pairToRemove.target);
    }

    // check if the answers are correct
    function checkAnswers() {
        dragPairs.forEach(({ draggable, target }) => {
            const correctMatch = draggable.dataset.id === target.dataset.id;
            draggable.style.border = correctMatch ? '3px solid green' : '3px solid red';
            target.style.border = correctMatch ? '3px solid green' : '3px solid red';
        });
        resetIncorrectPairs();
    }


    function resetIncorrectPairs() {
        dragPairs.forEach((pair) => {
            const correctMatch = pair.draggable.dataset.id === pair.target.dataset.id;
            if (!correctMatch) {
                pair.draggable.style.position = '';
                removePair(pair);
            }
        })
    }

</script>

<div class="scenario-page">
    <div class="flex flex-col lg:flex-row justify-center items-center max-w-7xl mx-auto p-8 h-auto">
        <!-- left side -->
        <div class="w-full lg:w-2/3 items-center justify-center">
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
                            data-id={moment.momentId}
                            class="bg-white rounded-lg p-3 rounded-lg"
                        >{ moment.momentSummarization }
                        </li>
                    {/each}
                    <button class="btn custom-btn-bg" id="checkMatches" on:click={checkAnswers} >Check answers</button>
                </ul>
            </div>
        </div>
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
</style>