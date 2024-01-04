<script lang="ts">
    import { onMount } from 'svelte';
    import { typewriter } from '../../utils/transition';    
	import { messages } from '../../utils/loading-messages';

    type Situation = {
        title: string
    }

    let isLoading : boolean | null = null;
    let scenario = '';
    let situations : Situation[] = [];

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

    async function handleSubmit(event: Event) {
        isLoading = true;
        const form = event.target as HTMLFormElement;
        const formData = new FormData(form);

        const data: any = {};
        for (let field of formData) {
            const [key, value] = field;
            data[key] = value;
        }

        try {
            const response = await fetch('/story', {
                method: "POST",
                body: JSON.stringify(data)
            });

            const result = await response.json();

            console.log('response from api', result);

        } catch (error) {
            console.error(error);
        } finally {
            isLoading = false;
        }
    }   
</script>

<div class="flex flex-col lg:flex-row justify-center items-center">
    <form on:submit|preventDefault={handleSubmit} class="flex-1 form-bg bg-neutral text-neutral content shadow-md rounded p-4 sm:p-10 w-full sm:w-3/4 md:w-2/3 lg:w-1/3 xl:w-1/3 m-10">
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

    <div class="flex-1 self-start"> 
        <div class="flex-1 p-4 sm:p-10 w-full">
            {#if isLoading}
                {#key i}
                    <p in:typewriter={{ speed: 2 }}>
                        {messages[i] || ''}
                    </p>
                {/key}
            {:else if isLoading !== null}
                <div class="flex justify-between items-center">
                    <h1 class="text-xl">Generated situation</h1>
                    <button class="btn btn-square custom-btn-bg hover:bg-transparent px-10 text-lg">Save</button>
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
</style>