<script lang="ts">
    import { onMount } from "svelte";
    import Header from "../../../../components/Header.svelte";
    import BackButton from "../../../../components/scenarios/BackButton.svelte";
    import { defaultScene, type Scene, type StoryStruct } from "../../../../utils/types";
    import Speaker from "../../../../components/adventure/Speaker.svelte";

    // get data from +page.ts
    export let data;

    let scenario : StoryStruct = (data.scenario as { story: StoryStruct }).story;

    let scene : Scene = defaultScene;
    let selectedOption : string = '';
    let currentImage : string = scenario.situations[0].image.momentImages[0].image;

    onMount(() => {
        handlePhaseOne();
    })

    // call function on mount for initial start off
    async function handlePhaseOne() {
        try {
            const response = await fetch(`/api/generate/gpt/adventure`, {
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

    async function handleContinue() {
        let body = {
            scenario: scenario,
            scene: scene,
            narrative: scene.narrative,
            selectedOption: selectedOption
        };
        try {
            const response = await fetch(`/api/generate/gpt/adventure/continue`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(body)
            });

            const data = await response.json();
            scene = data.data;
            currentImage = scene.image;
            console.log("data from server continue:", scene);
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
                <div class="p-3 bg-gray-100 rounded-lg left-side-content relative">
                    <img class="rounded-lg w-[500px]" src={currentImage} alt={scenario.situations[0].moments[0].momentSummarization} />
                    <div class="absolute opacity-90 bg-white rounded-sm border-solid border-2 border-black bottom-0 left-0 m-5 p-3 z-10">{scene.narrative}</div>
                </div>
            </div>

            <!-- right side -->
            <div class="w-full right-side h-full flex flex-col flex-grow">
                <div class="bg-gray-100 right-side-content rounded-lg p-3 flex flex-col flex-grow justify-between">
                    <div class="upper-content">
                        <p class="py-2">{scene.nextStep}</p>
                        <hr />
                        <div class="flex flex-col gap-5 py-2">
                            {#each scene.options as option}
                                <div class="grid grid-cols-[90%_10%] auto-cols-max gap-2">
                                    <button 
                                        on:click={() => selectOption(option)} 
                                        class="btn rounded-lg {selectedOption === option ? 'selected' : 'bg-white'} p-3 h-auto text-thin text-left"
                                        >{option}
                                    </button>
                                    <Speaker textToSpeech={option} />
                                </div>
                            {/each}
                        </div>  
                    </div>

                    {#if selectedOption.length > 0} 
                        <button class="custom-btn-bg p-3 rounded-lg" on:click={handleContinue}>Choose selected option</button>
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
        display: block;
        font-weight: 400;
        width: 100%;
        text-align: left;
    }
</style>