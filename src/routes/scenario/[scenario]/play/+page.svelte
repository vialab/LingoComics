<script lang="ts">
    import { page } from "$app/stores";
    import { fade } from "svelte/transition";
    import Header from "../../../../components/Header.svelte";
    import type { Moment, Scenario, Situation } from "../../data";
    import QuizLayout from "../../../../components/QuizLayout.svelte";

    // get data from +page.ts
    export let data;

    let scenario : Scenario = data.scenario as Scenario;
    
    // initiailize variables
    let isPlayingQuiz : boolean = false;
    let currentSituationIndex : number = 0;
    let currentSituation : Situation = scenario.situations[currentSituationIndex];
    let situationMoments : Moment[] = currentSituation.moments;
    const scenarioId : number = Number($page.params.scenario);

    console.log(scenario);

    function toggleQuiz() : void {
        isPlayingQuiz = !isPlayingQuiz;
    }

    function navigateTo() : void {
        window.history.back();
    }
</script>

<Header>
    <div slot="back" class="flex-1">
        <button on:click={isPlayingQuiz ? toggleQuiz : navigateTo} class="back-btn">
            <div class="btn btn-square hover:bg-neutral svg-container">
                <svg viewBox="0 0 1024 1024"
                    xmlns="http://www.w3.org/2000/svg" fill="currentColor">
                    <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                    <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                    <g id="SVGRepo_iconCarrier">
                        <path fill="currentColor" d="M224 480h640a32 32 0 1 1 0 64H224a32 32 0 0 1 0-64z"></path>
                        <path fill="currentColor" d="m237.248 512 265.408 265.344a32 32 0 0 1-45.312 45.312l-288-288a32 32 0 0 1 0-45.312l288-288a32 32 0 1 1 45.312 45.312L237.248 512z"></path>
                    </g>
                </svg>
            </div>
        </button>
    </div>
    <!-- scenario.scenario is TEMPORARY and jank remove later -->
    <h1 slot="title" class="flex-2 text-center text-4xl pb-2" >{scenario.scenario} : Current situation </h1>
    <svelte:fragment slot="info">
        <!-- place holder -->
        <p class="flex-1"></p>
    </svelte:fragment> 
</Header>

<!-- when playing quiz -->
{#if isPlayingQuiz === true}
    <QuizLayout scenario={scenario} situation={currentSituation} moments={situationMoments} />
    <!-- when not playing the quiz -->
{:else}
    <div 
        class="flex justify-center items-center overflow-x-auto p-4 space-x-4" 
        in:fade={{ duration: 300, delay: 400 }} 
        out:fade={{ duration: 300 }}>
        <div class="scenario-card flex-none w-full sm:w-1/2 md:w-2/3 lg:w-2/4 xl:w-auto h-[42rem] overflow-hidden rounded-lg bg-black relative">
            <img src={currentSituation.image} alt={scenario.title} class="w-full h-full object-cover" />
            <div class="absolute inset-0" style="background: linear-gradient(180deg, transparent, rgba(0, 0, 0, 0.7) 90%);"></div>
            <div class="p-4 absolute bottom-0 left-0 right-0 flex justify-center items-center">
                <!-- <h2 class="text-4xl text-white text-center">{scenario.title}</h2> -->
                <button on:click={toggleQuiz} class="btn custom-btn-bg text-black text-2xl w-[10rem] hover:bg-transparent hover:text-white shadow-sm">Start quiz</button>
            </div>
            <span class="fold"></span>
        </div>
    </div>
{/if}