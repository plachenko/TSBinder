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

  function splitString(text, search) {
    const regex = new RegExp(`(${search})`, "gi");
    return text.split(regex).filter(Boolean);
  }

  function splitBySearch(str, search) {
    const searcStr = search.toLowerCase();
    const index = searcStr.indexOf(search.toLowerCase());

    console.log(index, search, searcStr);

    if (index === -1) {
      return [str]; // search string not found
    }

    const before = str.slice(0, index);
    const match = search;
    const after = str.slice(index + search.length);

    console.log([before, match, after]);

    return [before, match, after];
  }
</script>

{#each textArray as textPart, idx}
  <span
    class={`relative float-left inline ${textPart.toLowerCase() == search.toLowerCase() ? "text-slate-700 underline " : ""}`}
  >
    {#if textPart.toLowerCase() == search.toLowerCase()}
      <div
        class="bg-yellow-300/30 z-[0] pl-[2px] pr-[2px] left-[-2px] rounded-md absolute h-full"
      >
        <span class="invisible">{textPart} &nbsp;</span>
      </div>
    {/if}
    <span class="z-[10]">
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
