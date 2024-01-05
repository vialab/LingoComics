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

	// initialize all variables
	let isLoading: boolean = false;
	let isSaving: boolean = false;
	let isEditing: boolean = false;
    let isStoryGenerated : boolean, isImageGenerated : boolean, isFinish : boolean = false;
	let responseData: StoryStruct | null = null;
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
			isLoading = false;
            isStoryGenerated = true;
		}
	}

	// handle saving story
	async function saveStory(event: Event) {
		isSaving = true;

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
            isStoryGenerated = true;
        }
	}

	// handle changes in the scenario
	function handleScenarioChange(event: Event) {
		const target = event.target as HTMLSpanElement;
		const updatedContent = target.textContent || "";

		responseData!.scenario = updatedContent;
	}

	// handle changes for situation and moment on edit
	function handleContentChange(
		event: Event,
		situationIndex: number,
		momentIndex: string | null = null
	): void {
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

	// toggle editing mode
	function toggleEditing() {
		isEditing = !isEditing;
	}
</script>

<div class="flex flex-col lg:flex-row justify-center items-center">
	<!-- left side -->
	<Form {handleSubmit} />

	<!-- right side -->
	<div class="flex-1 self-start w-full lg:w-2/3 relative right-side">
		<div class="flex-1 scrollable-content p-4 w-full">
			<div class="p-0">
				<!-- Header -->
				<div class="max-w-7xl mx-auto pb-3 h-auto">
					<header
						class="flex justify-center items-end border-b border-black gap-2 header-container"
					>
						<h1 class="flex-1 text-left text-2xl pb-2 px-2">
							Generated scenario
						</h1>
						<!-- {#if responseData} -->
						<button class="btn custom-btn-bg mb-2 text-xl" on:click={saveStory}
							>{isSaving ? `Saving` : `Save`}</button
						>
						<button
							class="btn custom-btn-bg-2 mb-2 text-xl"
							on:click={toggleEditing}>Edit</button
						>
						{#if existingScenarios.length > 0}
							<Modal
								selectedScenario={fetchScenario}
								scenarios={existingScenarios}
							/>
						{/if}
					</header>
				</div>

				<div>
					<!-- Show loading text -->
					{#if isLoading}
						{#key i}
							<p in:typewriter={{ speed: 2 }}>
								{messages[i] || ""}
							</p>
						{/key}
						<!-- show response from api -->
					{:else if responseData}
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
					{/if}
				</div>
			</div>
		</div>

        <ul class="steps absolute bottom-0 left-0 right-0">
            <li class="step {isStoryGenerated ? 'step-primary' : ''}">Generate story</li>
            <li class="step {isImageGenerated ? 'step-primary' : ''}">Generate images</li>
            <li class="step {isFinish ? 'step-primary': ''}">Finish</li>
        </ul>
	</div>
</div>

<style>
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
