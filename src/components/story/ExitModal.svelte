<script lang="ts"> 
    export let currentStep : number;
    export let toggleExiting : () => void;
    export let saveAndExit : () => Promise<void>;
</script>


<div class="modal modal-open">
    <div class="modal-box relative">
        <!-- Modal Title -->
        <h3 class="font-medium text-2xl mb-2">Exit story designer?</h3>
        {#if currentStep > 0}
            <p>Unsaved changes will be lost.</p>
        {/if}
        <div class="modal-action">
            <button class="btn" on:click={toggleExiting}>Close</button>
            <a class="btn" href="/">Exit page</a>
            {#if currentStep > 0} 
                <button class="btn" on:click={saveAndExit}>Save & Exit</button>
            {/if}
        </div>
    </div>
</div>