<script lang="ts">
    export let situationLength : number = 0;
    export let currentSituationNumber : number = 0;
    export let handleSituationChange : (i: number) => void;
</script>

<div class="join flex flex-col gap-3 mr-5 pb-2">
    {#each { length: situationLength } as _, i}
        <div class="radio {i < currentSituationNumber ? 'bg-black' : ''}" on:click={() => handleSituationChange(i)} tabindex="0" role="button" on:keydown={(e) => e.key === 'Enter'} ></div>
    {/each}
</div>