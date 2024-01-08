<script lang="ts">
	import type {
		FirestoreData,
		MomentObject,
		StoryStruct,
	} from "../../utils/types";
	import { onMount } from "svelte";
	import { typewriter } from "../../utils/transition";
	import { messages } from "../../utils/loading-messages";
	import Form from "../../components/Form.svelte";
	import Modal from "../../components/Modal.svelte";
    import { fade } from "svelte/transition";
	import { goto } from "$app/navigation";

	// initialize all variables
    let isGenerating: boolean = false;
	let isGeneratingImage: boolean = false;
	let isLoading: boolean = false;
	let isSaving: boolean = false;
	let isEditing: boolean = false;
    let isExiting: boolean = false;
	let isFinish: boolean = false;
    let currentStep: number = 0;
	let responseData: StoryStruct | null = null;

	let scenarioImage = '';
	let situationImages : string[] = [];

	const editableStyle =
		"border: 1px solid #ccc; padding: 4px; background-color: white; cursor: text; border-radius: 3px;";

	// get loaded data
	export let data: FirestoreData;

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
		};
	});

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

			console.log("response from api", result);

			// store story in response
			responseData = result as StoryStruct;
		} catch (error) {
			console.error(error);
		} finally {
			isGenerating = false;
            currentStep = 1;
		}
	}

	// handle saving story
	async function saveStory(event: Event) {
		isSaving = true;

		if (situationImages.length > 0 && scenarioImage.length > 0) {
			responseData!.image = scenarioImage;
			responseData!.situations.forEach((situation, index) => {
				situation.image = situationImages[index]
			});
		}

		try {
			const response = await fetch("/api/scenario", {
				method: "POST",
				body: JSON.stringify(responseData),
			});

			const result = await response.json();

			console.log("response from api", result);
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

		if (momentIndex !== null) {
			const moments = responseData!.situations[situationIndex].moments as {
				[key: string]: string;
			};

			if (momentIndex in moments) {
				moments[momentIndex] = updatedContent;
			}
		} else {
			// Update the title of a situation
			responseData!.situations[situationIndex].title = updatedContent;
		}
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
			
			const dummyEvent = new Event('dummy');
			await saveStory(dummyEvent).then(() => {
				goto('/');
			});
	    } catch (error) {
	        console.error(error);
	    }
	}

	// handle image generation
	async function generateImages() {
		isGeneratingImage = true;
		try {
			const response = await fetch('/api/generate/images', {
				method: "POST",
				body: JSON.stringify(responseData)
			});

			const result = await response.json();

			console.log(result);

			scenarioImage = result.data;
			situationImages = result.situationImages;
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
</script>

<div class="flex flex-col lg:flex-row justify-center items-center">
	<!-- left side -->
    <div class="relative left-side">
        <Form handleSubmit={handleSubmit} isGenerating={isGenerating} />
        <button class="btn btn-square m-4 text-xl" style="width: 93%" on:click={exitPage}>Exit</button>
		{#if isExiting}
			<div class="modal modal-open">
				<div class="modal-box relative">
					<h3 class="font-medium text-2xl mb-2">Exit story designer?</h3>
					{#if currentStep > 0}
						<p>Unsaved changes will be lost.</p>
					{/if}
					<div class="modal-action">
						<button class="btn" on:click={() => isExiting = !isExiting}>Close</button>
						<a class="btn" href="/">Exit page</a>
						{#if currentStep > 0} 
							<button class="btn" on:click={saveAndExit}>Save and Exit</button>
						{/if}
					</div>
				</div>
			</div>
		{/if}
    </div>   

	<!-- right side -->
	<div class="flex-1 self-start w-full lg:w-2/3 relative right-side">
		<div class="flex-1 scrollable-content p-4 w-full">
			<div class="p-0">
				<!-- Header -->
				<div class="max-w-7xl mx-auto pb-3 h-auto absolute top-0 left-0 right-0 bg-white p-3 w-full">
					<header
						class="flex justify-center items-end border-b border-black gap-2 header-container"
					>
						<h1 class="flex-1 text-left text-2xl pb-2 px-2">
							Generated scenario
						</h1>
						{#if responseData}
						    <button class="btn custom-btn-bg mb-2 text-xl" on:click={saveStory}>{isSaving ? `Saving` : `Save`}</button>
						    <button class="btn custom-btn-bg-2 mb-2 text-xl" on:click={toggleEditing}>{isEditing ? 'Save changes' : 'Edit'}</button>
                        {/if}
						{#if existingScenarios.length > 0}
							<Modal selectedScenario={fetchScenario} scenarios={existingScenarios}/>
						{/if}
					</header>
				</div>

                <!-- content -->
				<div class="pt-20">
					<!-- Show loading text -->
					{#if isGenerating || isGeneratingImage }
						{#key i}
							<p in:typewriter={{ speed: 2 }}>
								{messages[i] || ""}
							</p>
						{/key}
						<!-- show response from api SHOW CONTENT -->
					{:else if responseData && currentStep === 1}
						{#if isEditing}
							<!-- Scenario Title -->
							<h1 class="text-lg">
								<strong>Scenario:</strong>
								<span
									style={editableStyle}
									contenteditable="true"
									on:input={(event) => handleScenarioChange(event)}
									>{responseData?.scenario}</span
								>
							</h1>
							<ul>
								<!-- Situations -->
								{#each responseData?.situations as situation, situationIndex}
									<li class="text-lg font-medium py-2">
										<span
											style={editableStyle}
											contenteditable="true"
											on:input={(event) =>
												handleContentChange(event, situationIndex)}
											>{situation.title}</span
										>
									</li>
									<!-- Moments -->
									{#each Object.entries(situation.moments) as [momentKey, momentValue], momentIndex}
										<strong>{momentKey}:</strong>
										<p
											style={editableStyle}
											contenteditable="true"
											on:input={(event) =>
												handleContentChange(event, situationIndex, momentKey)}
										>
											{momentValue}
										</p>
									{/each}
								{/each}
							</ul>
						{:else}
							<h1 class="text-lg">
								<strong>Scenario:</strong>
								{responseData?.scenario}
							</h1>
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

					<!-- step 2 : generate images -->
					{:else if currentStep === 2}
						{#if scenarioImage.length > 0}
							<div class="flex gap-2 w-full h-[30rem]">
								<!-- Scenario Image Container -->
								<div class="scenario-card rounded-lg relative w-[10rem] overflow-hidden flex-1">
								  <img class="w-full h-full object-cover" src="{scenarioImage}" alt="scenario" />
								</div>
							
								<!-- Situations Images Container -->
								<div class="w-1/2 h-full flex flex-col m-2 justify-between pl-2">
								  {#each situationImages as img}
									<div class="h-1/3">
									  <img class="scenario-card w-full h-full object-cover rounded-lg p-2" src="{img}" alt="situation" />
									</div>
								  {/each}
								</div>
							</div>
						{:else}
							<button class="btn w-full" on:click={generateImages}>Generate images</button>
						{/if}
					{/if}

				</div>
			</div>
		</div>

        <!-- bottom navigations -->
        <div class="flex justify-between absolute bottom-0 w-full">
            {#if currentStep > 0}
                <button class="mr-5 px-5 py-2 custom-btn-bg-2 text-xl rounded" on:click={() => currentStep -= 1}>
                    Back
                </button>
            {/if}

            <ul class="steps w-5/6">
                <li class="step {currentStep > 0 ? 'step-primary' : ''}">Generate story</li>
                <li class="step {currentStep > 1 ? 'step-primary' : ''}" transition:fade={{ delay: 250, duration: 300 }}>Generate images</li>
                <li class="step {currentStep > 2 ? 'step-primary': ''}">Finish</li>
            </ul>

            <!-- display after the first step is achieved -->
            {#if currentStep > 0}
                <button class="mr-5 px-5 py-2 custom-btn-bg-2 text-xl rounded" on:click={() => {
					if (currentStep < 2) {
						currentStep = 2;
					} else if (currentStep > 2) {
						isFinish = !isFinish;
					}
				}}>
                    { currentStep === 2 ? 'Finish' : 'Next' }
                </button>
            {/if}
        </div>
	</div>
</div>

<style>
	.scenario-card {
      background: #fff;
      box-shadow: 0 2px 2px #000;
      transition: transform 0.3s ease;
    }
	.scrollable-content {
		overflow-y: auto;
		max-height: calc(100vh - 160px);
		padding: 20px;
	}
    .right-side {
        height: calc(100vh - 80px);
    }
    .steps .step-primary + .step-primary:before, .steps .step-primary:after {
        background-color: var(--primary-background-color);
        color: #000;
    }
</style>
