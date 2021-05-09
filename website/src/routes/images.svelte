<script>
  import { onMount } from 'svelte';

  export let rawImages

  let images = []
  const categories = [ 'sandwich', 'pizza', 'seafood', 'tacos', 'drink', 'dessert', 'none', 'delete']
  let index = 0
  const url = 'http://10.0.0.113:3030'
  const showRawImages = process.env.show_raw_images

  onMount(async () => {
    if (!showRawImages) {
      images = rawImages
      return 
    }
  
		const res = await fetch(`${url}/images`);
    images = await res.json()
	});

  async function labelImage(category, image) {
    if (!showRawImages) {
      return 
    }

    const payload = {
      category,
    }

    const res = await fetch(`${url}/image/${image}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })

    return res.json()
  }

  async function clickHandler(category) {
    const image = images[index]
    await labelImage(category, image)
    
    index += 1
    if (index >= images.length) {
      location.reload()
    }
  }
</script>

<script context="module">
	export async function preload() {
		let response = await this.fetch('./data/rawImages.json')
		const rawImages = await response.json()

		return {
			rawImages,
		}
	}
</script>

<style>
  .content {
    display: flex;
  }

  button {
    font-size: 48px;
    background-color: white;
    width: 100%;
    height: 80px;
    white-space: nowrap;
    overflow: hidden;
  }

  button:hover {
    cursor: pointer;
    text-decoration: underline;
  }

  img {
    width: 100%;
    height: auto;
  }

  @media (max-width: 480px) {
		.content {
			display: block;
		}

    button {
      height: auto;
      width: 50%;
    }
	}
</style>

<div class="content">
  {#if images[index] }
  <img src={`/images/posts/${images[index]}`} alt="" />

  <div>
    {#each categories as category}
    <button on:click={() => clickHandler(category)}>{category}</button>
    {/each}
  </div>
  {:else}
  loading...
  {/if}
</div>

<br />
{#if !showRawImages}
<p>
  Note: This is for demostration purposes, values selected are not being saved.
</p>
{/if}


