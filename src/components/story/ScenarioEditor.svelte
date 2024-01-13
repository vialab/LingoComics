<script lang="ts">
    import type { StoryStruct } from "../../utils/types";

    export let responseData : StoryStruct;
    export let isEditing : boolean;
    export let handleScenarioChange : (event: Event) => void;
    export let handleContentChange : (event: Event, situationIndex : number, momentIndex?: string) => void;
    export let editableStyle : string;
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
    {#each responseData?.situations as situation, situationIndex}
        <li class="text-lg font-medium py-2">
            <span
                style={isEditing ? editableStyle : null}
                contenteditable={isEditing}
                on:input={(event) => handleContentChange(event, situationIndex)}
            >{situation.title}</span>
        </li>
        <!-- Moments -->
        {#each Object.entries(situation.moments) as [momentKey, momentValue], momentIndex}
            <strong>{momentKey}:</strong>
            <p
                style={isEditing ? editableStyle : null}
                contenteditable={isEditing}
                on:input={(event) => handleContentChange(event, situationIndex, momentKey)}
            >{momentValue}</p>
        {/each}
    {/each}
</ul>
