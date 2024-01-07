<script lang="ts">
    import { page } from '$app/stores';
	import Header from '../../../components/Header.svelte';

    const scenarioId : number = Number($page.params.scenario);

    // load scenario from firestore
    async function loadScenario() {
        
    }
</script>

<div class="mx-auto pb-3 h-auto bg-white p-3 w-full">
    <Header>
        <a slot="back" href="/scenario" class="flex-1">
            <div class="btn btn-square hover:bg-neutral svg-container">
                <svg viewBox="0 0 1024 1024"
                    xmlns="http://www.w3.org/2000/svg" fill="currentColor">
                    <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                    <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                    <g id="SVGRepo_iconCarrier">
                        <path fill="currentColor" d="M224 480h640a32 32 0 1 1 0 64H224a32 32 0 0 1 0-64z"></path>
                        <path fill="currentColor" d="m237.248 512 265.408 265.344a32 32 0 0 1-45.312 45.312l-288-288a32 32 0 0 1 0-45.312l288-288a32 32 0 1 1 45.312 45.312L237.248 512z"></path>
                    </g>
                </svg>
            </div>
        </a>
        <h1 slot="title" class="flex-1 text-center text-4xl pb-2" >Title</h1>
        <svelte:fragment slot="info">
            <!-- place holder -->
            <p class="flex-1"></p>
        </svelte:fragment> 
    </Header>

</div>