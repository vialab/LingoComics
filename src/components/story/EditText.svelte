<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import type { StoryStruct } from "../../utils/types";
    import { saveStory } from "$lib/services/apiService";

    export let title: string | null = null;
    export let editText: string | null = null;
    export let story: StoryStruct | null = null;
    export let updateType: string | null = null;
    let isLoading = false;
    let isEditable = false;
    let initialEditText: string | null = null;

    const dispatch = createEventDispatcher();

    // toggle between toggeable state
    function toggleEdit() {
        if (isEditable) {
            // toggle out of edit mode
            if (editText !== initialEditText) {
                console.log("UPDATE STORY", editText);
                dispatch('change', { editText });
                updateStoryMetadata();
            }
        } else {
            initialEditText = editText;
            console.log("NO CHANGES MADE");
        }
        isEditable = !isEditable;

        // dispatch event when confirming the edit
        // if (!isEditable) {
        //     dispatch('change', { editText });
        //     updateStoryMetadata();
        // }
    }

    // call /api/generate/update
    async function updateStoryMetadata() {
        isLoading = true;
        try {
            console.log("story updating:", updateType, editText, story);
            const body = { updateType, editText, story };
            const response = await fetch('/api/generate/update', {
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body)
            });

            const updatedStory = await response.json();
            console.log('Update successful', updatedStory);
            story = updatedStory.story;
            // dispatch event with updated story
            dispatch('update', { story: updatedStory.story });
        } catch (error) {
            console.error('Update failed', error);
        } finally {
            isLoading = false;
        }
    }

    // format editText string
    const regex = /-\s(.+?):\s(.+)/g;

    $: formattedString = editText?.replace(regex, (match, p1, p2) => {
        return `<strong>${p1}</strong>: ${p2}<br>`
    })
</script>

{#if isLoading}
    <span class="loading loading-dots loading-lg"></span>
{:else}
    <div class="mt-5">
        <h1 class="text-2xl text-bold">{title}</h1>
        {#if isEditable}
            <textarea bind:value={editText} class="editable-text" />
        {:else}
            <p id="editText">{@html formattedString}</p>
        {/if}
        <button class="btn rounded mt-5" on:click={toggleEdit}>{isEditable ? 'Confirm' : 'Edit'}</button>
    </div>
{/if}



<style>
    .editable-text {
        /* Styles for your textarea/input when editable */
        width: 100%;
        height: 300px; /* Adjust as needed */
        margin: 10px 0;
        padding: 10px;
        border: 1px solid gray;
        border-radius: 5px;
    }   
</style>