<script lang="ts">
    import comicBookImage from "../../assets/images/home_comic_img.png";
</script>

<div class="scenario-page">
    <div class="flex flex-col justify-center w-2/3 xl:w-1/2 mx-auto gap-12">
        <div class="flex relative mt-10 rounded-lg shadow-lg py-14 px-5">
            <div>
                <h1 class="text-3xl my-2">About LingoComics</h1>
                <p class="w-1/2 mt-10">LingoComics is an AI-Empowered web application using comic-themed stories for language learning immersion</p>
            </div>
            <img src={comicBookImage} alt="comic book" class="absolute w-1/2 xl:w-1/4 top-10 right-5" />
        </div>
    
        <div class="rounded-lg shadow-lg py-14 px-5">
            <h1 class="text-3xl">Story designer</h1>
            <p class="w-1/2 mt-10">A feature that allows you to create your own stories.</p>

            <h2 class="font-bold mt-5">To create your story:</h2>
            <ol class="list-decimal pl-5">
                <li class="mt-2 font-bold">Go to the story designer tab</li>
                <p>Navigate to the Story Designer section to get started</p>

                <li class="mt-2 font-bold">Specify information in the form</li>
                <p>Fill in the form, providing the context, setting, number of situations, emotional tone, and primary conflict of the desired story</p>

                <li class="mt-2 font-bold">Click the 'Generate Story' button</li>
                <p>Once you have completed the form, click the 'Generate Story' button. The system will use your inputs to create a story that aligns with your language learning goals</p>
            </ol>

            <h2 class="font-bold mt-5">Key features:</h2>
            <ul class="list-disc pl-5">
                <li class="mt-2 font-bold">Customizable characters and settings</li>
                <p>Personalize your stories by selecting characters, locations, and scenarios that interest you or relate to your real-life experiences</p>
                
                <li class="mt-2 font-bold">Save and revist</li>
                <p>Save your stories to revist or revise them to your own liking</p>
            </ul>
        </div>  

        <div class="rounded-lg shadow-lg py-14 px-5">
            <h1 class="text-3xl">StoryConnect</h1>
            <p class="w-1/2 mt-10">An activity to hone your contextual language learning abilities.</p>

            <h2 class="font-bold mt-5">How to use StoryConnect:</h2>
            <ol class="list-decimal pl-5">
                <li class="mt-2 font-bold">Select a scenario</li>
                <p>Select a story you created in story designer in the 'Scenario' tab</p>

                <li class="mt-2 font-bold">Select the 'Go through base story' option</li>
                <p>Once you have selected a scenario you wish to quiz yourself on, select the option of the left labeled, 'Go through base story'</p>
            
                <li class="mt-2 font-bold">Drag and drop sentences</li>
                <p>Inside the activity, drag and drop the sentence you think best matches the image</p>
            </ol>

            <h2 class="font-bold mt-5">Key features:</h2>
            <ul class="list-disc pl-5">
                <li class="mt-2 font-bold">Interactive learning:</li>
                <p>The drag-and-drop activity makes for an interactive and engaging learning experiences</p>

                <li class="mt-2 font-bold">Contextual understanding:</li>
                <p>By matching sentences to images, you enhance your ability to understand and describe visual contexts</p>
                
                <li class="mt-2 font-bold">Immediate feedback:</li>
                <p>Receive immediate feedback on your matches, helping you identify your areas for improvement</p>
            </ul>
        </div>

        <div class="rounded-lg shadow-lg py-14 px-5">
            <h1 class="text-3xl">Create your own adventure</h1>
            <p class="w-1/2 mt-10">Forge your own path from the stories that you created</p>

            <h2 class="font-bold mt-5">How to use 'Create your own adventure' activity:</h2>
            <ol class="list-decimal pl-5">
                <li class="mt-2 font-bold">Select a scenario</li>
                <p>Select a story you created in story designer in the 'Scenario' tab</p>

                <li class="mt-2 font-bold">Select the 'Create your own adventure' option</li>
                <p>Once you have selected a scneario you wish create your own adventure in, select the option on the right labeled, 'Create your own adventure'</p>
            
                <li class="mt-2 font-bold">Select any option you want the narrative to in</li>
                <p>Inside the activity, select an option on the right that you want the narrative to go in, this can last indefinitely</p>
            </ol>

            <h2 class="mt-2 font-bold">Key features:</h2>
            <ul class="list-disc pl-5">
                <li class="mt-2 font-bold">Interactive learning:</li>
                <p>Forging your own path from a story you designed introduces an engaging learning experience</p>
            
                <li class="mt-2 font-bold">Increased motivation:</li>
                <p>The gamified nature of creating your own path to a story you created keeps learners motivated and interested in exploring new story paths and outcomes.</p>
                
                <li class="mt-2 font-bold">Cultural insights:</li>
                <p>Creating adventures with cultural elements provides deeper insights into the story's culture and context</p>
            </ul>
        </div>
    </div>
</div>

<style>
    .scenario-page {
        overflow-y: scroll;
        height: calc(100vh - 80px);
        padding: 2rem;
    }
</style>