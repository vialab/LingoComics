<script lang="ts">
    import { createEventDispatcher } from "svelte";

    export let isFinishModalOpen : boolean = false;

    const dispatch = createEventDispatcher();

    function toggleModal() {
        isFinishModalOpen = !isFinishModalOpen;
        dispatch('toggle', { isFinishModalOpen });
    }

    function finish() {
        dispatch('toggle', { isFinishModalOpen });
        dispatch('finish', { finishStoryCreation: true });
    } 
</script>
    
{#if isFinishModalOpen}
    <div class="modal modal-open">
        <div class="modal-box relative">
            <!-- Modal title -->
            <h3 class="font-medium text-2xl mb-2">Finish story creation?</h3>
            <div class="modal-action">
                <button class="btn" on:click={finish}>Finish story creation</button>
                <button class="btn" on:click={toggleModal}>Close</button>
            </div>
        </div>
    </div>
{/if}