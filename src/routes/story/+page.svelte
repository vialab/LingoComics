<script lang="ts">
    import { generateImages, saveStory } from "$lib/services/apiService";
	import Form from "../../components/Form.svelte";
	import Loading from "../../components/Loading.svelte";
	import Spacer from "../../components/Spacer.svelte";
    import EditText from "../../components/story/EditText.svelte";
	import FormBottomNav from "../../components/story/FormBottomNav.svelte";
	import FormHeader from "../../components/story/FormHeader.svelte";
    import ScenarioEditor from "../../components/story/ScenarioEditor.svelte";
    import ScenarioImageGen from "../../components/story/ScenarioImageGen.svelte";
	import type { FirestoreData, StoryStruct } from "../../utils/types";
    import CollapseButton from "../../components/story/CollapseButton.svelte";
	

	// initialize all variables
	let isGenerating: boolean = false;
	let drawerOpen: boolean = true;
	let isFinish: boolean = false;
	let isEditing: boolean = false;
	let currentStep: number = 0;
	let storyData: StoryStruct;

	let scenarioImage = '';
	let situationImages : string[] = [];

	// get loaded data
	export let data: FirestoreData;
	let existingScenarios = data.scenarios;

	// handle form submit
	async function handleSubmit(event: Event) {
		isGenerating = true;

		// get form input elements
		const form = event.target as HTMLFormElement;
		const formData = new FormData(form);

		// generate a data object for form fields
		const data: any = {};
		for (let field of formData) {
			const [key, value] = field;
			data[key] = value;
		}

		// call api/generate
		try {
			const response = await fetch('/api/generate', {
				method: "POST",
				body: JSON.stringify(data)
			});

			const result = await response.json();
			
			console.log('result from generation', result);

			// store 
			storyData = result;
		} catch (error) {
			console.error(error);
		} finally {
			isGenerating = false;
			currentStep = 1;
			await saveStory(storyData);
		}
	}

	// handle image generation
	async function handleImageGeneration() {
		isGenerating = true;
		try {
			const result = await generateImages(storyData);

			console.log('image gen result', result);

			scenarioImage = result.data;
			situationImages = result.situationImages;
			storyData = { 
				...storyData, 
				image: result.data,
				situations: storyData.situations.map((situation, index) => {
					return {
						...situation,
						image: result.situationImages[index]
					}
				})
			}
		} catch (error) {
			console.error(error);
		} finally {
			isGenerating = false;
		}
	}

	// fetch story function
	export async function fetchStory(scenarioId: string) {
	    try {
	        const response = await fetch(`/api/scenario/${scenarioId}`, {
	            method: "GET",
	            headers: {
	                "Content-Type": "application/json"
	            }
	        });

	        const data = await response.json();
			storyData = data.story;
	    } catch (error) {
	        console.error("error fetching story:", error);
	    } finally {
			currentStep = 1;
		}
	}


	// handle step change for progress
	function handleStepChange(event: CustomEvent) {
		currentStep = event.detail.currentStep;
	}

	// handle scenario change
	function handleScenarioChange(event: Event) {
		const target = event.target as HTMLSpanElement;
		const updatedContent = target.textContent || "";

		storyData.scenario = updatedContent;
	}

	// handle content change (moment)
	function handleContentChange(event: Event, situationIndex: number, momentIndex: string | null = null) {
		const target = event.target as HTMLSpanElement;
		const updatedContent = target.textContent || "";
		let momentIdx = Number(momentIndex);

		// update moment
		storyData.situations[situationIndex].moments[momentIdx].momentSummarization = updatedContent;

		console.log("Updated content:", updatedContent, situationIndex, momentIndex);
	}

	// handle edit change on edit text
	function handleEditChange(event: CustomEvent<{ editText: string}>, propertyKey: string) {
		storyData = { ...storyData, [propertyKey]: event.detail.editText }
	}

	// handle story updates
	function handleStoryUpdate(event: CustomEvent<{ story: StoryStruct}>) {
		console.log("updated story content:", event.detail.story);
		storyData = event.detail.story;
	}

	// handle drawer toggle
	function handleDrawer(event: CustomEvent<{ drawerOpen: boolean}>) {
		drawerOpen = event.detail.drawerOpen;
	}
</script>


<div class="flex flex-col lg:flex-row justify-center items-center">
	<!-- left side -->
	<div class="relative {drawerOpen ? 'left-side' : 'left-side-close'}">
		<Form handleSubmit={handleSubmit} isGenerating={isGenerating} />
	</div>

	<!-- collapse button -->
	<CollapseButton on:change={(event) => handleDrawer(event)} />

	<!-- right side -->
	<div class="flex-1 self-start w-full lg:w-2/3 relative right-side">
		<div class="flex-1 scrollable-content w-full p-2">
			<!-- content header -->
			<div class="p-0">
				<FormHeader existingScenarios={existingScenarios} fetchScenario={fetchStory} />
			</div>

			<!-- spacer -->
			<Spacer height={70} />

			<!-- content body -->
			<div>
				<!-- show loading if generating -->
				{#if isGenerating}
					<Loading />
				<!-- show character -->
				{:else if currentStep === 1}
					<EditText title="Character description" editText={storyData?.character} story={storyData} updateType="character" on:change={(event) => handleEditChange(event, 'character')} on:update={handleStoryUpdate} />
				<!-- show setting -->
				{:else if currentStep === 2}
					<EditText title="Setting description" editText={storyData?.setting} on:change={(event) => handleEditChange(event, 'setting')} on:update={handleStoryUpdate} />
				<!-- story content -->
				{:else if currentStep === 3}
					<ScenarioEditor 
						responseData={storyData}  
						isEditing={isEditing}
						handleScenarioChange={handleScenarioChange}
						handleContentChange={handleContentChange}
						editableStyle={"border: 1px solid #ccc; padding: 4px; background-color: white; cursor: text; border-radius: 3px;"}
					/>
					<button class="btn rounded" on:click={() => isEditing = !isEditing}>Edit</button>
				<!-- image generation -->
				{:else if currentStep === 4}
					<ScenarioImageGen responseData={storyData} handleImageGeneration={handleImageGeneration} />
				{/if}
			</div>

			<!-- progress meter -->
			<FormBottomNav bind:isFinish currentStep={currentStep} on:stepchange={handleStepChange} />
		</div>
	</div>
</div>


<style>
	.scrollable-content {
		overflow-y: auto;
		max-height: calc(100vh - 160px);
	}
    .right-side {
        height: calc(100vh - 80px);
    }

	.left-side {
	    transition: width 0.5s;
	    width: 33%; 
	}

	.left-side-close {
	    transition: width 0.5s;
	    width: 0;
	    overflow: hidden;
	}
</style>