<script lang="ts">
    import ImageCard from "./ImageCard.svelte";

    export let image: string;
    export let image2 : string;
    export let scenario: string;
    export let scenarioId: string;
</script>

<div class="flex justify-center items-center overflow-x-auto p-2 space-x-4 container-img">
    <ImageCard image={image} scenario={scenario} route={`/scenario/${scenarioId}/play`} imageTitle="Go through base story" btnText="Start" />

    <ImageCard image={image2} scenario={scenario} route={`/scenario/${scenarioId}/adventure`} imageTitle="Create your own adventure" btnText="Start" />
</div>


<style>
    .container-img {
        overflow-x: hidden;
    }
</style>