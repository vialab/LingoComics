<script lang="ts">
    import { page } from '$app/stores';
	import Header from '../../../components/Header.svelte';
    import type { StoryStruct } from '../../../utils/types';
    import type { Scenario } from '../data';

    const scenarioId : number = Number($page.params.scenario);

    // data from +page.ts for pre-loaded content for current scenario
    export let data;

    console.log(data.scenario);

    let scenario: StoryStruct = data.scenario as StoryStruct;
</script>

<div class="mx-auto pb-3 h-auto bg-white p-3 w-full">
    <Header>
        <a slot="back" href="/scenario" class="flex-1">
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
        </a>
        <h1 slot="title" class="flex-1 text-center text-2xl pb-2 w-full" >Scenario: { scenario.scenario.replaceAll('"', '') }</h1>
        <svelte:fragment slot="info">
            <!-- place holder -->
            <p class="flex-1"></p>
        </svelte:fragment> 
    </Header>

    <div class="flex justify-center items-center overflow-x-auto p-4 space-x-4">
        <div class="scenario-card flex-none w-full sm:w-1/2 md:w-2/3 lg:w-2/4 xl:w-auto h-[30rem] overflow-hidden rounded-lg bg-black relative">
            <img src={scenario.image} alt={scenario.scenario} class="w-full h-full object-cover" />
            <div class="absolute inset-0" style="background: linear-gradient(180deg, transparent, rgba(0, 0, 0, 0.7) 90%);"></div>
            <div class="p-4 absolute bottom-0 left-0 right-0 flex justify-center items-center">
                <!-- <h2 class="text-4xl text-white text-center">{scenario.title}</h2> -->
                <a href="/scenario/{scenarioId}/play" class="btn custom-btn-bg text-black text-2xl w-[10rem] shadow-sm hover:bg-transparent hover:text-white">Start</a>
            </div>
            <span class="fold"></span>
        </div>
    </div>
</div>