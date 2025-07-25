<script>
  import EmojiMenu from "./EmojiMenu.svelte";
  let { fieldsObj, submitEvt } = $props();

  let tempObj = $state({
    type: "station",
    fields: [
      { name: "name", type: "text", value: "" },
      { name: "description", type: "textarea", value: "" },
      { name: "icon", type: "emoji", value: "" },
      { name: "color", row: "color", type: "color", value: "" },
      { name: "textColor", row: "color", type: "color", value: "" },
    ],
  });

  let showEmojiMenu = $state(false);

  function handleSubmit(event) {
    event.preventDefault();
    // submitEvt();
    console.log(event);
    // console.log("Form submitted with data:", tempObj);
  }
</script>

<div class="flex bg-slate-200 h-full p-2">
  <form class="flex flex-1 flex-col gap-2" onsubmit={handleSubmit}>
    {#each tempObj.fields as field}
      <div class="flex items-center gap-2">
        <div class="h-full flex items-center">
          <label for={field.name} class="block"
            >{field.name.charAt(0).toUpperCase() + field.name.slice(1)}</label
          >
        </div>
        {#if ["text", "color"].includes(field.type)}
          <input
            class={`${field.type == "color" ? "h-[50px]" : ""}`}
            type={field.type}
            id={field.name}
            name={field.name}
            bind:value={field.value}
            required
          />
        {:else if field.type === "emoji"}
          <button
            class="w-full flex-1"
            onclick={(e) => {
              e.preventDefault();
              showEmojiMenu = !showEmojiMenu;
            }}
          >
            test
          </button>

          {#if showEmojiMenu}
            <EmojiMenu />
          {/if}
        {:else if field.type === "textarea"}
          <textarea
            class="flex-1"
            id={field.name}
            name={field.name}
            bind:value={field.value}
          ></textarea>
        {/if}
      </div>
    {/each}

    <input type="submit" class="p-2" />
  </form>
</div>

<style>
  input,
  textArea {
    background: #fff;
  }
</style>
