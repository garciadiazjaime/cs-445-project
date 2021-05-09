<script>
	let topics = [
		['tacos', 'tacos'],
	]
	// ['drink', 'drink'],
	// ['pizza', 'pizza'],
	//, 'sandwich', 'seafood', 'tacos', 'dessert']
	let selectedTopic = ''

	async function clickHandler() {
		console.log('clickHandler')
		// showOptions = true
		// options = []

		// const { innerText: topic } = this
		// selectedTopic = topic
		// document.getElementById('options').scrollIntoView();

		// const res = await fetch(`process.API_URL/search?category=${topic}`);
		// options = await res.json();

		// validatePosts(options)
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
</style>

<svelte:head>
	<title>Sapper project template</title>
</svelte:head>

<h1>What to eat in Chicago?</h1>


<p>
	#feedmechicago collects and analyzes data from Instagram about Chicago Food posts in the hope to help you find something delicious to eat in beautiful Chitown.
</p>

<h1>Food Options:</h1>
<ul class="topics-list">
	{#each topics as topic}
	<li on:click={clickHandler} class:selected={selectedTopic === topic[0]}>{topic[0]}</li>
	{/each}
</ul>
