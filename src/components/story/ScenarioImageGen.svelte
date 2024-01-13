<script lang="ts">
    import type { StoryStruct } from "../../utils/types";

    export let responseData : StoryStruct;
</script>

{#if responseData.image.length > 0} 
    <div class="flex gap-2 w-full h-[30rem]">
        <div class="scenario-card rounded-lg relative w-[10rem] overflow-hidden flex-1">
            <img class="w-full h-full object-cover" src={responseData.image} alt={responseData.scenario} />
        </div>
    </div>
{/if}