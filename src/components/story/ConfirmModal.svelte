<script lang="ts">
    import { createEventDispatcher } from "svelte";
    export let numImages: number = 0;

    const dispatch = createEventDispatcher();

    let cost = numImages * 0.04;

    function closeModal() {
        dispatch('close');
    }

    function handleImageGeneration() {
        dispatch('runImageGeneration');
    }
</script>

<div class="modal modal-open">
    <div class="modal-box relative">
        <!-- Modal Title -->
        <h3 class="font-medium text-2xl mb-2">Are you sure?</h3>
        <!-- Modal body -->
        <p>Regenerating images will cause all previous images to be removed and we will generate new ones, the estmated cost is ${cost}.</p>
        <div class="modal-action">
            <button class="btn" on:click={closeModal}>Close</button>
            <button class="btn bg-emerald-600 text-white" on:click={handleImageGeneration}>Regenerate images</button>
        </div>
    </div>
</div>