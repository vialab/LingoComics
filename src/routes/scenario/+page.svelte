<script lang="ts">
	import type { Scenario } from './data.js';

    // get data from +page.server.ts
    export let data;

    // transform the images to be adherent to Scenario type
    let scenarios : Scenario[] = data.imageUrls.map((img, index) => ({
        id: index,
        image: img,
        title: `Scenario ${index}`,
        situation: []
    }));
</script>


<div class="flex justify-center items-center overflow-x-auto p-4 space-x-4">
    <div class="grid grid-cols-5 gap-4 w-full max-w-6xl">
        {#each scenarios as scenario}
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