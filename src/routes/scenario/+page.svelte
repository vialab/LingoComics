<!-- scripts -->
<script lang="ts">
	import type { Scenario, Situation } from './data.js';
    import Header from '../../components/Header.svelte';

    // Define the expected structure of the data received from +page.server.ts
    type FirestoreData = {
        scenarios: Array<{
            id: string;
            image: string;
            title: string;
        }>;
    };

    // Get data from +page.server.ts
    export let data: FirestoreData;

    // Transform the images to be adherent to Scenario type
    function transformToScenario(data: FirestoreData): Array<Scenario> {
        return data.scenarios.map(item => ({
            id: parseInt(item.id),
            image: item.image,
            title: item.title,
            situation: [] as Array<Situation>
        }));
    }

    // Transform the received data
    let scenarios: Array<Scenario> = transformToScenario(data);
</script>

<!-- display -->
<div class="scenario-page">
    <Header>
        <h1 slot="title" class="flex-1 text-left text-4xl pb-2 px-2">Recent scenarios</h1>
    </Header>
    
    <div class="flex justify-center items-center overflow-x-auto p-4 space-x-4">
        <div class="grid grid-cols-5 gap-4 w-full max-w-6xl">
            {#each data.scenarios.slice(0, 5) as scenario}
              <!-- Scenario card with a fixed aspect ratio for images -->
                <a href="/scenario/{scenario.id}" class="scenario-card flex-none sm:w-1/2 md:w-full lg:w-full xl:w-48 h-[30rem] overflow-hidden rounded-lg bg-black relative">
                    <img src={scenario.image} alt={scenario.title} class="w-full h-full object-cover absolute top-0 left-0" />
                    <div class="absolute inset-0" style="background: linear-gradient(180deg, transparent, rgba(0, 0, 0, 0.7) 90%);"></div>
                    <div class="p-4 absolute bottom-0 left-0 right-0">
                        <h2 class="text-white">{scenario.title}</h2>
                    </div>
                    <span class="fold"></span>
                </a>
            {/each}
        </div>
    </div>

    <Header>
        <h1 slot="title" class="flex-1 text-left text-4xl py-5 px-2">All scenarios</h1>
    </Header>

    <div class="flex justify-center items-center overflow-x-auto p-4 space-x-4">
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 w-full max-w-6xl">
            {#each data.scenarios as scenario}
              <!-- Scenario card with a fixed aspect ratio for images -->
                <a href="/scenario/{scenario.id}" class="scenario-card flex-none sm:w-1/2 md:w-full lg:w-full xl:w-48 h-[10rem] overflow-hidden rounded-lg bg-black relative">
                    <img src={scenario.image} alt={scenario.title} class="w-full h-full object-cover absolute top-0 left-0" />
                    <div class="absolute inset-0" style="background: linear-gradient(180deg, transparent, rgba(0, 0, 0, 0.7) 90%);"></div>
                    <div class="p-4 absolute bottom-0 left-0 right-0">
                        <h2 class="text-white">{scenario.title}</h2>
                    </div>
                    <span class="fold"></span>
                </a>
            {/each}
        </div>
    </div>

</div>

<!-- styles -->
<style>
    .scenario-page {
        overflow-y: scroll;
        height: calc(100vh - 80px);
    }

    .scenario-card {
      position: relative;
      cursor: pointer;
      background: #fff;
      box-shadow: 0 2px 2px #000;
      transition: transform 0.3s ease;
    }
    
    .scenario-card:hover {
        transition: 0.2s ease-in-out;
        border-radius: 0.5rem 0.5rem 0px 0.5rem;
        box-shadow: none;
    }

    .scenario-card .fold {
      position: absolute;
      bottom: 0;
      right: 0;
      border-style: solid;
      border-color: transparent transparent transparent #fff;
      transition: border-width 0.2s ease-out;
      border-width: 0;
      box-shadow: 0 2px 2px #000;
    }

    .scenario-card:hover .fold {
      background: #00000071;
      border-width: 50px 50px 0px 0px;
      border-color:transparent #fff transparent #fff;
      box-shadow: 0 2px 2px 2px #000;
    }

</style>