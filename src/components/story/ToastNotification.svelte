<script lang="ts">
    import { onMount } from "svelte";
    import { goto } from "$app/navigation";

    export let toastTimer: number = 2000;

    let showToast = true;

    onMount(() => {
        setTimeout(() => {
            showToast = false;
            goto('/scenario')
        }, toastTimer)
    });
</script>

{#if showToast}
    <div class="toast toast-top toast-end">
        <div class="alert">
            <span>Story has been successfully created and can be viewed in the Scenario page</span>
            <div class="progress-overlay"></div>
        </div>
    </div>
{/if}


<style>
    .progress-overlay {
        position: absolute;
        border-radius: 15px;
        margin: 15px;
        top: 0;
        left: 0;
        width: 0%;
        height: 60px; /* Adjust height as needed */
        background-color: #26658f78; /* Or any color you prefer */
        animation: fillProgress 2s linear forwards; /* Animation duration matches the timeout */
    }

    @keyframes fillProgress {
        from {
            width: 0%;
        }
        to {
            width: 95%;
        }
    }
</style>