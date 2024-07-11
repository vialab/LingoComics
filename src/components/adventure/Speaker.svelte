<script lang="ts">
    import Icon from "@iconify/svelte";

    export let textToSpeech : string = "";

    let audioElement : HTMLAudioElement;
    let audio : string = "";

    function handleTextToSpeech(text: string) {
        return async function(event: Event) {
            try {
                console.log(text);
                const response = await fetch(`/api/tts`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ text: text })
                });

                const data = await response.json();
                audio = data.audio;
                if (audioElement) {
                    audioElement.src = audio;
                    await audioElement.play();
                }
            } catch (error) {
                console.error(error);
            }
        }
    }    
</script>

<div class="flex justify-center items-center" on:click={handleTextToSpeech(textToSpeech)} tabindex="0" role="button" on:keydown={(e) => e.key === 'Enter'}>
    <Icon icon="wpf:speaker" />
    <audio bind:this={ audioElement } src={ audio }></audio>
</div>