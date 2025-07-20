<script lang="ts">
  let { text, search } = $props();

  let originalText = text;
  let textArray = $state([]);

  $effect(() => {
    if (search && search != "") {
      //   textArray = originalText.toLowerCase().split(search.toLowerCase());
      // console.log((textArray));
      textArray = splitString(text, search);
    } else {
      textArray = [originalText];
    }

  });

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function splitString(text, search, includeWhitespace = false) {
  if (search.includes("\\")) return false;
  const pattern = includeWhitespace
    ? `(\\s*${search}\\s*)`
    : `(${search})`;
  const regex = new RegExp(pattern, "gi"); 
  return text.split(regex).filter(Boolean);
}


</script>

{#each textArray as textPart, idx}
  <span
    class={`relative float-left inline ${textPart.toLowerCase() == search.toLowerCase() ? "text-slate-700 " : ""}`}
  >
    {#if textPart.toLowerCase() == search.toLowerCase()}
      <div
        class="bg-yellow-300/30 border-2 border-yellow-400 z-[0] left-[-2px] rounded-md absolute h-full"
      >
        <span class="invisible">{textPart}</span>
      {@html "&nbsp;"}
      </div>
    {/if}
    <span class="z-[10] whitespace-break-spaces">
      <!--
      {#if textPart[0] == " "}
      {@html "&nbsp;"}
      {:else}
      {textPart}
      {/if}
      -->
      {textPart}
    </span>
    </span>
{/each}

<!--

<span class="mr-[-3px]">   
{#if (search && search != "") && text.toLowerCase().includes(search.toLowerCase())}
{text.toLowerCase().split(search)[0]}
{:else}
{text}
{/if}
</span>

{#if (search && search != "") && text.toLowerCase().includes(search.toLowerCase())}
<span class="text-slate-200 underline">
{text.toLowerCase().split(search)}
</span>

{/if}

{#if (search && search != "") && text.toLowerCase().includes(search.toLowerCase())}
<span class="ml-[-3px]">
{text.toLowerCase().split(search)[1]}
</span>
{/if}
-->
