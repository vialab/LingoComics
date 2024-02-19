<script lang="ts">
    import type { StoryStruct } from "../../utils/types";

    export let responseData : StoryStruct;
    export let isEditing : boolean;
    export let handleScenarioChange : (event: Event) => void;
    export let handleContentChange : (event: Event, situationIndex : number, momentIndex?: string) => void;
    export let editableStyle : string;

    // reactive statement to sort situations
    $: sortedSituations = responseData?.situations?.slice().sort((a, b) => a.situationSort - b.situationSort);
</script>

<!-- content -->
<!-- Scenario title -->
<h1 class="text-lg">
    <strong>Scenario:</strong>
    <span 
        style={isEditing ? editableStyle : null}
        contenteditable={isEditing}
        on:input={(event) => handleScenarioChange(event)}
    >{responseData?.scenario}</span>
</h1>
<!-- Situations -->
<ul>
    {#each sortedSituations as situation, situationIndex (situation.id)}
        <li class="text-lg font-medium py-2 indent-2">
            <span
                style={isEditing ? editableStyle : null}
                contenteditable={isEditing}
                on:input={(event) => handleContentChange(event, situationIndex)}
            >{situation.title}</span>
        </li>
        <!-- Moments -->
        {#each Object.entries(situation.moments) as [momentKey, momentValue], momentIndex}
            <p class="indent-4">
                <strong>Moment: {momentIndex + 1}</strong>
            </p>
            <p
                style={isEditing ? editableStyle : null}
                contenteditable={isEditing}
                on:input={(event) => handleContentChange(event, situationIndex, momentKey)}
                class="pl-8"
            >{momentValue.momentSummarization}</p>
        {/each}
    {/each}
</ul>
