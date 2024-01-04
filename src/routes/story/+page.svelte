<script lang="ts">
    import type { StoryStruct } from '../../utils/types';
    import { onMount } from 'svelte';
    import { typewriter } from '../../utils/transition';    
	import { messages } from '../../utils/loading-messages';
	import Header from '../../components/Header.svelte';

    // initialize all variables
    let isLoading : boolean | null = null;
    let responseData : StoryStruct | null = null;
    let error: string = '';
    

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

        // call /story endpoint to get api results
        try {
            const response = await fetch('/story', {
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
</script>

<div class="flex flex-col lg:flex-row justify-center items-center">
    <!-- left side -->
    <form on:submit|preventDefault={handleSubmit} class="form-bg bg-neutral text-neutral content shadow-md rounded p-4 sm:p-10 w-full sm:w-3/4 md:w-2/3 lg:w-2/5 m-5">
        <!-- story title question -->
        <div class="mb-4">
            <label class="block text-white text-md font-bold mb-2" for="question1">Specify the title of this story</label>
            <input value="Eating in restaurant" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="question1" type="text" placeholder="Title of story" name="title">
        </div>
    
        <!-- story setting question -->
        <div class="mb-6">
            <label class="block text-white text-md font-bold mb-2" for="question2">What is the setting of this story?</label>
            <input value="Canada" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="question2" type="text" placeholder="Setting of story" name="setting">
        </div>
    
        <!-- story of story -->
        <div class="mb-6">
            <label class="block text-white text-md font-bold mb-2" for="question3">How many situations happen in the story?</label>
            <input value={3} class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                id="question3" 
                type="number" 
                placeholder="Situations in story" 
                name="situation"
                >
        </div>
    
        <!-- emotions of story -->
        <div class="relative mb-6">
            <label class="block text-white text-md font-bold mb-2" for="question4">What is the emotional tone of this story?</label>
            <select value="Comedic" class="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="question4" name="tone">
                <option value="" disabled selected hidden class="text-gray-700">Select an option</option>
                <option>Don't specify</option>
                <option>Comedic</option>
                <option>Dramatic</option>
                <option>Suspenseful</option>
                <option>Romantic</option>
            </select>
        </div>
    
        <!-- primary challenge or conflict -->
        <div class="mb-6">
            <label class="block text-white text-md font-bold mb-2" for="question5">What is the primary challenge or conflict in this story?</label>
            <select value="Internal struggle" class="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="question5" name="conflict">
                <option value="" disabled selected hidden class="text-gray-700">Select an option</option>
                <option>Don't specify</option>
                <option>Internal struggle</option>
                <option>Conflict between characters</option>
                <option>Mystery to solve</option>
                <option>Obstacle to overcome</option>
            </select>
            <!-- <input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="question5" type="text" placeholder="Primary challenge of story"> -->
        </div>
    
        <!-- submit button -->
        <div class="flex justify-center items-center mb-6">
            <button class="btn btn-square hover:bg-transparent hover:text-white custom-btn-bg w-full text-xl">Submit</button>
        </div>
    </form>

    <!-- right side -->
    <div class="flex-1 self-start w-full lg:w-2/3"> 
        <div class="flex-1 scrollable-content p-4 sm:p-2 w-full">
            {#if isLoading}
                {#key i}
                    <p in:typewriter={{ speed: 2 }}>
                        {messages[i] || ''}
                    </p>
                {/key}
            {:else if isLoading !== null}
                <div class="p-0">
                    {#if responseData}
                        <Header>
                            <h1 slot="title" class="flex-1 text-left text-2xl pb-2 px-2">Generated scenario</h1>
                            <button slot="info" class="btn custom-btn-bg mb-2 text-xl">Save</button>
                        </Header>
                        
                        <h1 class="text-lg"><strong>Scenario:</strong> {responseData?.scenario}</h1>
                        <ul>
                            {#each responseData.situations as situation}
                                <li>{situation.title}</li>
                                {#each Object.entries(situation.moments) as [momentKey, momentValue]}
                                    <p><strong>{momentKey}</strong> {momentValue}</p>
                                {/each}
                            {/each}
                        </ul>
                    {/if}
                </div>
            {/if}
        </div>  
    </div>
</div>

<style>
    .form-bg {
        background-color: rgba(0, 0, 0, 0.76);  
        backdrop-filter: blur(5px);
    }

    .scrollable-content {
        overflow-y: auto;
        max-height: calc(100vh - 80px);
        padding: 20px;
    }
</style>