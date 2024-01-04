<script lang="ts">
    import type { FirestoreData, MomentObject, StoryStruct } from '../../utils/types';
    import { onMount } from 'svelte';
    import { typewriter } from '../../utils/transition';    
	import { messages } from '../../utils/loading-messages';
	import Form from '../../components/Form.svelte';
	import type { Moment } from '../scenario/data';

    // initialize all variables
    let isLoading : boolean = false;
    let isSaving  : boolean = false;
    let isEditing : boolean = false;
    let responseData : StoryStruct | null = null;
    const editableStyle = "border: 1px solid #ccc; padding: 4px; background-color: white; cursor: text; border-radius: 3px;";

    // get loaded data
    export let data : FirestoreData;
    
    let existingScenarios = data.scenarios;

    // typewriter effect
    let i = -1;
    onMount(() => {
        const interval = setInterval(() => {
            i += 1;
            i %= messages.length;
        }, 2500);

        return () => {
            clearInterval(interval);
        }
    });

    // handle form submit
    async function handleSubmit(event: Event) {
        isLoading = true;

        // get form input elements
        const form = event.target as HTMLFormElement;
        const formData = new FormData(form);

        // generate a data object for form fields
        const data: any = {};
        for (let field of formData) {
            const [key, value] = field;
            data[key] = value;
        }

        // call /api/generate endpoint to get api results
        try {
            const response = await fetch('/api/generate', {
                method: "POST",
                body: JSON.stringify(data)
            });

            const result = await response.json();

            console.log('response from api', result);

            // store story in response
            responseData = result as StoryStruct;
        } catch (error) {
            console.error(error);
        } finally {
            isLoading = false;
        }
    }   

    // handle saving story
    async function saveStory(event: Event) {
        isSaving = true;

        try {
            const response = await fetch('/api/save', {
                method: "POST",
                body: JSON.stringify(responseData)
            });

            const result = await response.json();

            console.log("response from api", result);
        } catch (error) {
            console.error(error);
        } finally {
            isSaving = false;
        }
    }

    function handleScenarioChange(event: Event) {
        const target = event.target as HTMLSpanElement;
        const updatedContent = target.textContent || '';

        responseData!.scenario = updatedContent;
    }

    function handleContentChange(event: Event, situationIndex: number, momentIndex : string | null = null): void {
        const target = event.target as HTMLSpanElement;
        const updatedContent = target.textContent || '';

        if (momentIndex !== null) {
            // Update a specific moment in a situation
            responseData!.situations[situationIndex].moments[momentIndex] = updatedContent;
        } else {
            // Update the title of a situation
            responseData!.situations[situationIndex].title = updatedContent;
        }
    }
 
    // toggle editing mode
    function toggleEditing() {
        isEditing = !isEditing;
    }
</script>

<div class="flex flex-col lg:flex-row justify-center items-center">
    <!-- left side -->
    <Form handleSubmit={handleSubmit}/>

    <!-- right side -->
    <div class="flex-1 self-start w-full lg:w-2/3"> 
        <div class="flex-1 scrollable-content p-4 w-full">
                <div class="p-0">
                    <!-- Header -->
                    <div class="max-w-7xl mx-auto pb-3 h-auto">
                        <header class="flex justify-center items-end border-b border-black gap-2 header-container">
                            <h1  class="flex-1 text-left text-2xl pb-2 px-2">Generated scenario</h1>
                            <!-- {#if responseData} -->
                                <button class="btn custom-btn-bg mb-2 text-xl" on:click={saveStory}>{ isSaving ? `Saving` : `Save` }</button>
                                <button class="btn custom-btn-bg-2 mb-2 text-xl" on:click={toggleEditing}>Edit</button>
                                {#if existingScenarios.length > 0}
                                    <select name="load" id="scenarios" class="mb-2 text-lg">
                                        <option disabled selected value>Load</option>
                                        {#each existingScenarios as scenario}  
                                            <option>{ scenario.title }</option>
                                        {/each}
                                    </select>
                                {/if}
                                <!-- {/if} -->
                        </header>
                    </div>

                    <div>
                        <!-- Show loading text -->
                        {#if isLoading}
                            {#key i}
                                <p in:typewriter={{ speed: 2 }}>
                                    {messages[i] || ''}
                                </p>
                            {/key}
                        <!-- show response from api -->
                        {:else}
                            {#if responseData}
                                {#if isEditing}
                                    <!-- Scenario Title -->
                                    <h1 class="text-lg">
                                        <strong>Scenario:</strong> 
                                        <span style={editableStyle} contenteditable="true" on:input={(event) => handleScenarioChange(event)} >{responseData?.scenario}</span>
                                    </h1>
                                    <ul>
                                        <!-- Situations -->
                                        {#each responseData?.situations as situation, situationIndex}
                                            <li class="text-lg font-medium py-2">
                                                <span style={editableStyle} contenteditable="true" on:input={(event) => handleContentChange(event, situationIndex)}>{situation.title}</span>
                                            </li>
                                            <!-- Moments -->
                                            {#each Object.entries(situation.moments) as [momentKey, momentValue], momentIndex}
                                                <strong>{momentKey}:</strong>
                                                <p style={editableStyle} contenteditable="true" on:input={(event) => handleContentChange(event, situationIndex, momentKey)}>{momentValue}</p>
                                            {/each}
                                        {/each}
                                    </ul>
                                {:else}
                                    <h1 class="text-lg"><strong>Scenario:</strong> {responseData?.scenario}</h1>
                                    <ul>
                                        {#each responseData.situations as situation}
                                            <li class="text-lg font-medium py-2">{situation.title}</li>
                                            {#each Object.entries(situation.moments) as [momentKey, momentValue], index}
                                                <strong>Moment {index + 1}:</strong>
                                                <p>{momentValue}</p>
                                            {/each}
                                        {/each}
                                    </ul>
                                {/if}
                            {/if}
                        {/if}
                    </div>
                </div>
        </div>  
    </div>
</div>

<style>


    .scrollable-content {
        overflow-y: auto;
        max-height: calc(100vh - 80px);
        padding: 20px;
    }
</style>