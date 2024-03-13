<script lang="ts">
	import type { Moment, Situation } from "../utils/types";
    import { touchDraggable } from "$lib/utils/dnd";

    export let currentSituation : Situation;

</script>

<div class="scenario-page">
    <div class="flex flex-col lg:flex-row justify-center items-center max-w-7xl mx-auto p-8 h-auto">
        <!-- left side -->
        <div class="w-full lg:w-2/3 items-center justify-center">
            <div class="grid grid-cols-2 gap-3 w-[550px] bg-gray-100 px-5 py-5">
                {#each currentSituation.image.momentImages as moment}
                    <img draggable="true" src={moment.image} alt={moment.title || ""} />
                {/each}
            </div>
        </div>

        <!-- right side -->
        <div class="w-full lg:w-1/3">
            <div class="bg-gray-100 rounded-lg p-5">
                <h1 class="text-2xl ">Options</h1>
                <ul class="max-h-96 flex flex-col gap-5 p-3 overflow-auto">
                    {#each currentSituation.moments as moment}
                        <li 
                            use:touchDraggable
                            class="bg-white rounded-lg p-3 rounded-lg"
                        >{ moment.momentSummarization }
                        </li>
                    {/each}
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
</style>