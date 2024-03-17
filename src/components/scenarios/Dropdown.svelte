<script lang="ts">
    import { selectedLanguage } from "$lib/stores/languageStore";
    import { writable, type Writable } from "svelte/store";

    let isOpen = false;
    let languages : string[] = ["English", "French"];


    function toggleDropdown(language: string) {
        return function (event: Event) {
            isOpen = !isOpen;
            selectedLanguage.set(language);
        }
    }
</script>

<slot>
    <div class="flex flex-1 justify-center items-center">
        <details class="dropdown mx-auto" bind:open={isOpen}>
            <summary class="m-1 btn">Language</summary>
            <ul class="p-2 shadow menu dropdown-content z-[1] bg-base-100 rounded-box w-52">
                {#each languages as language}
                    <div 
                        class="p-2" 
                        on:click={toggleDropdown(language)} 
                        tabindex="0" 
                        role="button" 
                        on:keydown={(e) => e.key === "Enter"} 
                    >
                        {language}
                    </div>
                {/each}
            </ul>
          </details>
    </div>
</slot>