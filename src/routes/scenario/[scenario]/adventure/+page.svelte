<script lang="ts">
    import { onMount } from "svelte";
    import Header from "../../../../components/Header.svelte";
    import BackButton from "../../../../components/scenarios/BackButton.svelte";
    import type { StoryStruct } from "../../../../utils/types";

    // get data from +page.ts
    export let data;

    let scenario : StoryStruct = (data.scenario as { story: StoryStruct }).story;

    let sentenceTemp : string = '';

    onMount(() => {
        handleChatCompletion();
    })

    async function handleChatCompletion() {
        try {
            const response = await fetch(`/api/generate/gpt`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(scenario)
            });

            const data = await response.json();
            sentenceTemp = data.data;
            console.log("data from server:", data);
        } catch (error) {
            console.error(error);
        }
    }
</script>


<div class="mx-auto pb-3 h-auto bg-white p-3 w-full">
    <Header>
        <BackButton slot="back" route="/scenario/{scenario.scenarioId}" />
        <h1 slot="title" class="flex-1 text-center text-3xl pb-2 w-full title">{ scenario.scenario }</h1>
        <svelte:fragment slot="info">
            <p class="flex-1"></p>
        </svelte:fragment>
    </Header>

    <div class="scenario-page">
        <div class="flex flex-col lg:flex-row justify-center items-center max-w-7xl mx-auto p-3 h-auto gap-3">
            <!-- left side -->
            <div class="w-full h-full left-side flex items-center justify-center">
                <div class="p-3 bg-gray-100 rounded-lg">
                    <img class="rounded-lg" src={scenario.situations[0].image.momentImages[0].image} alt={scenario.situations[0].moments[0].momentSummarization} />
                </div>
            </div>

            <!-- right side -->
            <div class="w-full right-side h-full flex flex-col">
                <div class="bg-gray-100 rounded-lg p-3 flex flex-col flex-grow">
                    <div>{sentenceTemp}</div>
                </div>  
            </div>
        </div>
    </div>
</div>

<style>
    .scenario-page {
        overflow-y: scroll;
        height: calc(100vh - 80px);
    }
    .left-side {
        width: 60%;
    }
    .right-side {
        width: 40%;
    }
</style>