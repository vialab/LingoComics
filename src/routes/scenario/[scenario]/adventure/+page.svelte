<script lang="ts">
    import { onMount } from "svelte";
    import Header from "../../../../components/Header.svelte";
    import BackButton from "../../../../components/scenarios/BackButton.svelte";
    import { defaultScene, emptyMoment, type Scene, type StoryStruct, type Moment } from "../../../../utils/types";
    import Speaker from "../../../../components/adventure/Speaker.svelte";
    import { load } from "../+page";
    import AdventureSkeleton from "../../../../components/adventure/AdventureSkeleton.svelte";
    import { fade, fly } from "svelte/transition";
	import { highlightKeywords } from "$lib/utils/highlight-keywords";
	import Icon from "@iconify/svelte";
	import Modal from "../../../../components/scenarios/Modal.svelte";

    // get data from +page.ts
    export let data;

    let scenario : StoryStruct = (data.scenario as { story: StoryStruct }).story;

    let scene : Scene = defaultScene;
    let scenes : Scene[] = [];
    let currentImage : string = scenario.situations[0].image.momentImages[0].image;
    let loading : boolean = false;
    let showModal : boolean = false;
    let selectedOption : string = '';
    let selectedMoment : Moment = emptyMoment;

    onMount(() => {
        handlePhaseOne();
    })

    // call function on mount for initial start off
    async function handlePhaseOne() {
        loading = true;
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
            scenes.push(scene);
            console.log("data from server:", scene);
        } catch (error) {
            console.error(error);
        } finally {
            loading = false;
            await handleAutoSave();
        }
    }

    // handle function for subsequent phases
    async function handleContinue() {
        let body = {
            scenario: scenario,
            scene: scene,
            narrative: scene.narrative,
            selectedOption: selectedOption
        };
        loading = true;
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
            scenes.push(scene);
            console.log("data from server continue:", scene);
        } catch (error) {
            console.error(error);
        } finally {
            loading = false;
            await handleAutoSave();
        }
    }

    // function to select user's option
    // function selectOption(option: string) {
    //     if (selectedOption.length > 0 && selectedOption === option) {
    //         selectedOption = "";
    //     } else {
    //         selectedOption = option;
    //     }
    // }

    // function handle select moment
    function selectMoment(moment: Moment) {
        if (selectedMoment !== null && selectedMoment.momentSummarization === moment.momentSummarization) {
            selectedMoment = emptyMoment;
        } else {
            selectedMoment = moment;
        }
    }

    // handle dynamic auto-save
    async function handleAutoSave() {
        try {
            const response = await fetch('/api/generate/gpt/adventure/save', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ scenario, scenes })
            });
            const data = await response.json();
            console.log(data);
        } catch (error) {
            console.error(error);
        }
    }

    function handleShowInfo(moment: Moment) {
        return function(event: MouseEvent) {
            showModal = true;
            selectedMoment = moment;
        }
    }

    console.log('current scene:', scene);
</script> 


<div class="mx-auto pb-3 h-auto bg-white p-3 w-full">
    <Header>
        <BackButton slot="back" route="/scenario/{scenario.scenarioId}" />
        <h1 slot="title" class="flex-1 text-center text-3xl pb-2 w-full title">{ scenario.scenario }</h1>
        <svelte:fragment slot="info">
            <p class="flex-1"></p>
        </svelte:fragment>
    </Header>

    {#if loading}
        <div in:fly={{ x: -200, duration: 300 }}>
            <AdventureSkeleton />
        </div>
    {:else}
        <div class="scenario-page" in:fly={{ x: 200, duration: 300 }}>
            <div class="flex flex-col lg:flex-row justify-center items-center max-w-7xl mx-auto p-3 gap-3 p-container">

                {#if showModal}
                    <Modal moment={selectedMoment} on:close={() => showModal = false} />
                {/if}

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
                                {#each scene.moment as moment}
                                    <div class="grid grid-cols-[85%_15%] auto-cols-max gap-2">
                                        <button 
                                            on:click={() => selectMoment(moment)} 
                                            class="btn rounded-lg {selectedMoment.momentSummarization === moment.momentSummarization ? 'selected' : 'bg-white'} p-3 h-auto text-thin text-left"
                                        >
                                            {@html highlightKeywords(moment.momentSummarization, moment.keywords ?? {}).replace(/\[|\]/g, '')}
                                        </button>
                                        <div class="util-btn flex justify-center items-center bg-white rounded-lg p-3" on:click={handleShowInfo(moment)} tabindex="0" role="button" on:keydown={(e) => e.key === 'Enter'}>
                                            <Icon icon="material-symbols:info" height={30}  />
                                        </div>
                                        <!-- <Speaker textToSpeech={option} /> -->
                                    </div>
                                {/each}
                            </div> 
                        </div>

                        {#if selectedMoment.momentSummarization.length > 0} 
                            <button class="custom-btn-bg p-3 rounded-lg" on:click={handleContinue}>Choose selected option</button>
                        {/if}
                    </div>  
                </div>
            </div>
        </div>
    {/if}
</div>

<style>
    .scenario-page {
        overflow-y: hidden;
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
    :global(.highlight) {
        padding: 2px;
        border-radius: 5px;
        margin: 5px;
        z-index: 2000;
        line-height: 1.5rem;
    }
    :global(.highlight-1) {
        /* background-color: #96CDFF; */
        border: 1px solid #96CDFF;
        color: #96CDFF;
    }
    :global(.highlight-2) {
        /* background-color: #96CDFF; */
        border: 1px solid #96CDFF;
        color: #96CDFF;
    }
    :global(.highlight-3) {
        /* background-color: #D8E1FF; */
        border: 1px solid #96CDFF;
        color: #96CDFF;
    }
    :global(.highlight-4) {
        /* background-color: #DBBADD; */
        border: 1px solid #96CDFF;
        color: #96CDFF;
    }
    :global(.highlight-5) {
        /* background-color: #BE92A2; */
        border: 1px solid #96CDFF;
        color: #96CDFF;
    }
</style>