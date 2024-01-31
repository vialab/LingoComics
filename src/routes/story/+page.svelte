<script lang="ts">
	import type { FirestoreData, StoryStruct } from "../../utils/types";
	import Form from "../../components/Form.svelte";
	import { goto } from "$app/navigation";
    import { generateImages, saveStory } from "$lib/services/apiService";
    import Loading from "../../components/Loading.svelte";
    import FormBottomNav from "../../components/story/FormBottomNav.svelte";
    import FormHeader from "../../components/story/FormHeader.svelte";
    import ScenarioEditor from "../../components/story/ScenarioEditor.svelte";
	import ScenarioImageGen from "../../components/story/ScenarioImageGen.svelte";
	import ExitModal from '../../components/story/ExitModal.svelte';
	import Icon from '@iconify/svelte';

	// initialize all variables
    let isGenerating: boolean = false;
	let isGeneratingImage: boolean = false;
	let isSaving: boolean = false;
	let isEditing: boolean = false;
    let isExiting: boolean = false;
	let isFinish: boolean = false;
    let currentStep: number = 0;
	let responseData: StoryStruct;

	let scenarioImage = '';
	let situationImages : string[] = [];

	// reactive declarations
	const editableStyle =
		"border: 1px solid #ccc; padding: 4px; background-color: white; cursor: text; border-radius: 3px;";

	// get loaded data
	export let data: FirestoreData;

	let existingScenarios = data.scenarios;

	// handle step change
	function handleStepChange(event : CustomEvent) {
		currentStep = event.detail.currentStep;
	}

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

		// call /api/generate endpoint to get api results
		try {
			const response = await fetch("/api/generate", {
				method: "POST",
				body: JSON.stringify(data),
			});

			const result = await response.json();

			// store story in response
			responseData = result as StoryStruct;

			console.log("response from api", result, responseData);
		} catch (error) {
			console.error(error);
		} finally {
			isGenerating = false;
            currentStep = 1;
		}
	}

	// handle saving story
	async function handleSaveStory() {
		isSaving = true;
		try {
			if (responseData) {
				const result = await saveStory(scenarioImage, situationImages, responseData);
				console.log("response from api:", result);
			}
		} catch (error) {
			console.error(error);
		} finally {
			isSaving = false;
		}
	}

	// load stored stories
	async function fetchScenario(scenarioId: string) {
		try {
			const response = await fetch(`/api/scenario/${scenarioId}`, {
				method: "GET",
			});

			console.log("scenarioID", scenarioId);

			const result = await response.json();

			responseData = result as StoryStruct;
		} catch (error) {
			console.error(error);
		} finally {
            currentStep = 1;
        }
	}

	// handle changes in the scenario
	function handleScenarioChange(event: Event) {
		const target = event.target as HTMLSpanElement;
		const updatedContent = target.textContent || "";

		responseData!.scenario = updatedContent;
	}

	// handle changes for situation and moment on edit
	function handleContentChange(event: Event,situationIndex: number,momentIndex: string | null = null): void {
		const target = event.target as HTMLSpanElement;
		const updatedContent = target.textContent || "";

		// TODO: reconfigure later
		// if (momentIndex !== null) {
		// 	const moments = responseData!.situations[situationIndex].moments as {
		// 		[key: string]: string;
		// 	};

		// 	if (momentIndex in moments) {
		// 		moments[momentIndex] = updatedContent;
		// 	}
		// } else {
		// 	// Update the title of a situation
		// 	responseData!.situations[situationIndex].title = updatedContent;
		// }
	}

	// handle exiting
	async function exitPage() {
		// if not saved then 
		if (!isSaving) {
			isExiting = true;
		}
	}

	// save and exit page
	async function saveAndExit() {
	    try {
	        console.log("saving and exiting");
			
			await handleSaveStory().then(() => {
				goto('/');
			});
	    } catch (error) {
	        console.error(error);
	    }
	}

	// handle image generation
	async function handleImageGeneration() {
		console.log('response data for image gen', responseData);
		isGeneratingImage = true;
		try {
			const result = await generateImages(responseData);
			console.log(result);
			scenarioImage = result.data;
			situationImages = result.situationImages;
			responseData = { 
				...responseData, 
				image: result.data,
				situations: responseData.situations.map((situation, index) => {
					return {
						...situation,
						image: result.situationImages[index]
					}
				})
			}
		} catch (error) {
			console.error(error);
		} finally {
			isGeneratingImage = false;
		}
	}

	// toggle editing mode
	function toggleEditing() {
		isEditing = !isEditing;
	}

	// toggle exiting page
	function toggleExiting() {
		isExiting = !isExiting;
	}

	let drawerOpen = true;
</script>

<div class="flex flex-col lg:flex-row justify-center items-center">
	<!-- left side -->
    <div class="relative {drawerOpen ? 'left-side' : 'left-side-close'}">
        <Form handleSubmit={handleSubmit} isGenerating={isGenerating} />
        <button class="btn btn-square m-4 text-xl" style="width: 93%" on:click={exitPage}>Exit</button>
		<!-- Exit Modal below form -->
		{#if isExiting}
			<ExitModal 
				currentStep={currentStep} 
				toggleExiting={toggleExiting} 
				saveAndExit={saveAndExit} 
			/>
		{/if}
    </div>   

	<!-- button container -->
	<div class="self-start relative right-side relative">
		<div class="flex h-screen justify-center items-center">
			<button class="" on:click={() => drawerOpen = !drawerOpen}>
				{#if drawerOpen}
					<Icon icon="mingcute:left-fill" height={30}/>
				{:else}
					<Icon icon="mingcute:right-fill" height={30}/>
				{/if}
			</button>
		</div>
	</div>

	<!-- right side -->
	<div class="flex-1 self-start w-full lg:w-2/3 relative right-side">
		<div class="flex-1 scrollable-content w-full p-2">
			<div class="p-0">
				<!-- Header -->
				<FormHeader 
					responseData={responseData} 
					isSaving={isSaving} 
					isEditing={isEditing} 
					existingScenarios={existingScenarios} 
					handleSaveStory={handleSaveStory} 
					toggleEditing={toggleEditing}
					fetchScenario={fetchScenario}  
				/>

                <!-- content -->
				<div class="pt-20">
					<!-- Show loading text -->
					{#if isGenerating || isGeneratingImage }
						<Loading />
					<!-- Step 1: Show content for scenario, situations, and moments -->
					{:else if responseData && currentStep === 1}
						<ScenarioEditor 
							responseData={responseData} 
							isEditing={isEditing} 
							handleScenarioChange={handleScenarioChange} 
							handleContentChange={handleContentChange}
							editableStyle={editableStyle}
						/>
					<!-- Step 2 : image generation step -->
					{:else if currentStep === 2}
						<ScenarioImageGen responseData={responseData} handleImageGeneration={handleImageGeneration} />
					{/if}
				</div>
			</div>
		</div>

        <!-- bottom navigations -->
		<FormBottomNav bind:isFinish currentStep={currentStep} on:stepchange={handleStepChange} />
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
	    width: 33%; /* or your desired width */
	}

	.left-side-close {
	    transition: width 0.5s;
	    width: 0;
	    overflow: hidden;
	}
</style>