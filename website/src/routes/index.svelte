<script>
	export let postsByCategory = {}

	let post = {}
	let topic = ''
	let topics = [
		['tacos', 'tacos'],
		['pizza', 'pizza'],
	]
	const indexes = {}

	let selectedTopic = ''

	async function clickHandler(category) {
		topic = category

		if (indexes[category] === undefined) {
			indexes[category] = -1
		}

		indexes[category] = (indexes[category] + 1) % postsByCategory[category].length

		post = postsByCategory[category][indexes[category]]
	}
</script>

<script context="module">
	export async function preload() {
		let response = await this.fetch('./data/posts.json')
		const postsByCategory = await response.json()

		return {
			postsByCategory,
		}
	}
</script>

<style>
	ul {
		list-style-type: none;
		padding: 0;
		width: 100%;
		margin-top: 20px;
	}

	.topics-list li {
		display: inline-block;
		width: 33%;
		font-size: 3em;
		border: 1px solid #EEE;
		padding: 16px 0px;
		text-align: center;
		opacity: .8;
	}

	@media (max-width: 640px) {
		.topics-list li {
			width: 100%;
		}
	}

	.topics-list li:hover {
		text-decoration: underline;
		cursor: pointer;
	}

	.selected {
		color: rgb(255,62,0);;
	}

	small {
		color: gray;
	}
</style>

<svelte:head>
	<title>Sapper project template</title>
</svelte:head>

<h1>To Taco or To Pizza <small>that's the question</small></h1>


<p>
	This tool collects and analyzes data from Instagram about Chicago Food posts in the hope to help you find something delicious to eat in beautiful Chitown.
</p>

<p>
	The recommendations presented here are already curated, if you want more wild guesses go to the <a href="/guess">wild west</a> section.
</p>

<ul class="topics-list">
	{#each topics as topic}
	<li on:click={() => clickHandler(topic[0])} class:selected={selectedTopic === topic[0]}>{topic[0]}</li>
	{/each}
</ul>

{#if topic}
<div class="post">
	<a href={post.permalink} target="_blank">
		<img src={`/images/${topic}/${post.id}.jpg`} alt="">
	</a>
</div>
{/if}
