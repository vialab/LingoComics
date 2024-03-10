<script lang="ts">
    export let image: string;
    export let scenario: string;
    export let scenarioId: string;
</script>

<div class="flex justify-center items-center overflow-x-auto p-4 space-x-4">
    <div class="scenario-card flex-none w-full sm:w-1/2 md:w-2/3 lg:w-2/4 xl:w-auto h-[30rem] overflow-hidden rounded-lg bg-black relative">
        <img src={image} alt={scenario} class="w-full h-full object-cover" />
        <div class="absolute inset-0" style="background: linear-gradient(180deg, transparent, rgba(0, 0, 0, 0.7) 90%);"></div>
        <div class="p-4 absolute bottom-0 left-0 right-0 flex justify-center items-center">
            <!-- <h2 class="text-4xl text-white text-center">{scenario.title}</h2> -->
            <a href="/scenario/{scenarioId}/play" class="btn custom-btn-bg text-black text-2xl w-[10rem] shadow-sm hover:bg-transparent hover:text-white">Start</a>
        </div>
        <span class="fold"></span>
    </div>
</div>