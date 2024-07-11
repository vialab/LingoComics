<script lang="ts">
    import type { FirestoreData, StoryStruct } from '../../utils/types';

    export let data : FirestoreData;

    let scenarios : StoryStruct[] = data.scenarios;

</script>

<div class="flex justify-center items-center w-full h-full">
    <div class="flex flex-col justify-center items-center w-3/5 h-full">
        <h1 class="m-2 text-bold text-3xl">Your achievements</h1>
        <div class="w-full m-3 achievements-container">
            {#each scenarios as scenario}
                <div class="p-3 flex">
                    <img class="rounded-lg m-2" src={scenario.image} alt={scenario.scenario} width="150" />
                    <div class="w-full m-2">
                        <h1 class="text-xl">{scenario.scenario}</h1>
                        <h3 class="my-2">Times played: {scenario.achievements.length}</h3>
                        <h3 class="my-2">Last played: {new Date(Math.max(...scenario.achievements.map(a => new Date(a.timestamp).getTime()))).toLocaleDateString()}</h3>
                        <h3 class="my-2">Max score: {Math.max(...scenario.achievements.map(o => o.points))}</h3>
                    </div>
                </div>
                <hr />
            {/each}
        </div>
    </div>
</div>

<style>
    .achievements-container {
        height: calc(100vh - 150px);
        overflow-y: scroll;
    }
</style>
