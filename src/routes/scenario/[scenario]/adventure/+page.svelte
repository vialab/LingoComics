<script lang="ts">
    import { onMount } from "svelte";
    import Header from "../../../../components/Header.svelte";
    import BackButton from "../../../../components/scenarios/BackButton.svelte";
    import { defaultScene, type Scene, type StoryStruct } from "../../../../utils/types";
    import Icon from "@iconify/svelte";

    // get data from +page.ts
    export let data;

    let scenario : StoryStruct = (data.scenario as { story: StoryStruct }).story;

    let scene : Scene = defaultScene;
    let selectedOption : string = '';

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
            scene = data.data;
            console.log("data from server:", scene);
        } catch (error) {
            console.error(error);
        }
    }

    // function to select user's option
    function selectOption(option: string) {
        if (selectedOption.length > 0 && selectedOption === option) {
            selectedOption = "";
        } else {
            selectedOption = option;
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
        <div class="flex flex-col lg:flex-row justify-center items-center max-w-7xl mx-auto p-3 gap-3 p-container">
            <!-- left side -->
            <div class="w-full h-full left-side flex items-center justify-center">
                <div class="p-3 bg-gray-100 rounded-lg left-side-content">
                    <img class="rounded-lg w-[500px]" src={scenario.situations[0].image.momentImages[0].image} alt={scenario.situations[0].moments[0].momentSummarization} />
                </div>
            </div>

            <!-- right side -->
            <div class="w-full right-side h-full flex flex-col flex-grow">
                <div class="bg-gray-100 right-side-content rounded-lg p-3 flex flex-col flex-grow justify-between">
                    <div class="upper-content">
                        <p class="pb-2">{scene.narrative}</p>
                        <hr />
                        <p class="py-2">{scene.nextStep}</p>
                        <hr />
                        <div class="flex flex-col gap-5 py-2">
                            {#each scene.options as option}
                                <button on:click={() => selectOption(option)} class="btn rounded-lg {selectedOption === option ? 'selected' : 'bg-white'} p-3 h-auto text-thin text-left">{option}</button>
                            {/each}
                        </div>  
                    </div>

                    {#if selectedOption.length > 0} 
                        <button class="custom-btn-bg p-3 rounded-lg">Choose selected option</button>
                    {/if}
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
    .p-container {
        height: 85%;
    }
    .left-side {
        width: 60%;
        height: 100%;
        display: flex;
        flex-direction: column;
    }
    .right-side {
        width: 40%;
        display: flex;
        flex-direction: column;
        height: 100%;
    }
    .left-side-content {
        flex-grow: 1;
    }
    img {
        height: 100%;
    }
    .right-side-content {
        flex-grow: 1;
    }
    .selected {
        background-color: #fa745955;
    }
    .btn {
        font-weight: 400;
    }
</style>