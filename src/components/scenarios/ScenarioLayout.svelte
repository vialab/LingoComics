<script lang="ts">
	import type { StoryStruct } from "../../utils/types";

    export let scenarios: StoryStruct[];
</script>

<div class="flex justify-center items-center overflow-x-auto p-4 space-x-4">
    <div class="grid grid-cols-5 gap-4 w-full max-w-6xl">
        {#each scenarios as scenario} 
            <a href="/scenario/{scenario.scenarioId}" class="scenario-card flex-none sm:w-1/2 md:w-full lg:w-full xl:w-48 h-[30rem] overflow-hidden rounded-lg bg-black relative">
                <img src={scenario.image} alt={scenario.scenario} class="w-full h-full object-cover absolute top-0 left-0" />
                <div class="absolute inset-0" style="background: linear-gradient(180deg, transparent, rgba(0, 0, 0, 0.7) 90%);"></div>
                <div class="p-4 absolute bottom-0 left-0 right-0">
                    <h2 class="text-white">{scenario.scenario}</h2>
                </div>
                <span class="fold"></span>
            </a>
        {/each}
    </div>
</div>

<style>
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