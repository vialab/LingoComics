<script lang="ts">
    import { onMount } from "svelte";
    import { messages } from "../utils/loading-messages";
    import { typewriter } from "../utils/transition";

    // typewriter effect
    let i = -1;
    onMount(() => {
        const interval = setInterval(() => {
            i += 1;
            i %= messages.length
        }, 2500);

        return () => {
            clearInterval(interval);
        };
    });

</script>

{#key i}
    <p in:typewriter={{ speed: 2 }}>
        {messages[i] || ""}
    </p>
{/key}