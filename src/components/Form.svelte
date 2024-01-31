<script lang="ts">
    export let handleSubmit : (event: Event) => void;
    export let isGenerating : boolean = false;
</script>

<form on:submit|preventDefault={handleSubmit} class="form-bg bg-neutral text-neutral content shadow-md rounded p-4 m-4">
    <!-- story title question -->
    <div class="mb-4">
        <label class="block text-white text-md font-bold mb-2" for="question1">What is the premise of this story?</label>
        <input value="At a coffee shop" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="question1" type="text" placeholder="Title of story" name="title">
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
        <select value="Don't specify" class="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="question4" name="tone">
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
    </div>

    <!-- submit button -->
    <div class="flex justify-center items-center mb-6">
        <button class="btn btn-square hover:bg-transparent hover:text-white custom-btn-bg w-full text-xl">{isGenerating ? 'Generating story...' : 'Generate'}</button>
    </div>
</form>

<style>
    .form-bg {
        background-color: rgba(0, 0, 0, 0.76);  
        backdrop-filter: blur(5px);
    }
</style>