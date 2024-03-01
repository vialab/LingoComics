<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import type { StoryStruct } from "../../utils/types";

    export let title: string | null = null;
    export let editText: string | null = null;
    export let story: StoryStruct | null = null;
    export let updateType: string | null = null;
    let isEditable = false;

    const dispatch = createEventDispatcher();

    // toggle between toggeable state
    function toggleEdit() {
        isEditable = !isEditable;
        // dispatch event when confirming the edit
        if (!isEditable) {
            dispatch('change', { editText });
            updateStoryMetadata();
        }
    }

    // call /api/generate/update
    async function updateStoryMetadata() {
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

            // const data = await response.json();
            // console.log('Update successful', data);
        } catch (error) {
            console.error('Update failed', error);
        }
    }
</script>

<div>
    <h1 class="text-2xl text-bold">{title}</h1>
    {#if isEditable}
        <textarea bind:value={editText} class="editable-text" />
    {:else}
        <p>{editText}</p>
    {/if}
    <button class="btn rounded" on:click={toggleEdit}>{isEditable ? 'Confirm' : 'Edit'}</button>
</div>

<style>
    .editable-text {
        /* Styles for your textarea/input when editable */
        width: 100%;
        height: 100px; /* Adjust as needed */
        margin: 10px 0;
        padding: 10px;
        border: 1px solid gray;
        border-radius: 5px;
    }   
</style>