<svelte:head>
	<title>About</title>
</svelte:head>

<h1>To Taco or To Pizza</h1>

<p>
	The goal is to provide food options for the Chicago Area.
</p>

<p>
	How this works?
</p>

<ul>
	<li>
		<h2>Cron</h2>
		<p>
			Runs every hour and pulls latest posts from Instagram API using a hashtag: <a href="https://www.instagram.com/explore/tags/chicagofood/" target="_blank">#chicagofood.</a>
			Hosted in Heroku.
		</p>
	</li>
	<li>
		<h2>Database</h2>
		<p>
			Posts are saved in a Mongo Database hosted in <a href="https://cloud.mongodb.com/" target="_blank">Atlas</a>.
		</p>
	</li>
	<li>
		<h2>Server</h2>
		<p>
			A nodejs app that helps basically with 3 things:
		</p>
		<ul>
			<li>
				<h3>a) Download Images</h3>
				<p>
					There's a script that pulls Image URLs from the database and saves them into a static folder inside the website app.
				</p>
			</li>
			<li>
				<h3>b) Label images</h3>
				<p>
					There's an API that exposes a coupole of endpoints to help move the image to the correct folder inside the website app and to update the post in the database with the label selected.
				</p>
			</li>
			<li>
				<h3>c) Export data</h3>
				<p>
					There are a couple of scripts that export data that the website needs, eg. homepage images and images used for classification.
				</p>
			</li>
		</ul>
	</li>
	<li>
		<h2>Machine Learning</h2>
		<p>
			This module has a set of trained images and test images that were manually curated. From there it uses TensorFlow to generate a model, train it and <strong>export it</strong>.
		</p>

		<ul>
			<li>
				<h2>a) Prepare</h2>
				<p>
					The first thing is to adjust the images, they are resized to a smaller size, parsed to a numpy array and saved into numpy files.
				</p>
			</li>
			<li>
				<h2>b) Model</h2>
				<p>
						The model consists of three convolution blocks with a max pool layer in each of them. [<a href="https://www.tensorflow.org/tutorials/images/classification" target="_blank">ref</a>]
				</p>
			</li>
			<li>
				<h2>c) Train</h2>
				<p>
					Once the data is prepared and the model defined, the next part is to train the model, depending on the number of <strong>epochs</strong> this could be a long and resource consuming task. 
					<br /><br />
					In my machine: Mac 16GB Ram / 2.2 GHz Core i7 it takes about <strong>2 hours</strong> to train the model with 1000 epochs.
					<br /><br />
					Number of files: 140 for pizza, 147 for tacos and 24 for testing each.
				</p>	
			</li>
			<li>
				<h2>d) Test</h2>
				<p>
					Once the model is trained, now comes the fun part: making predictions, this script downloads a public image and provides a guess on whether the image is of a Taco or of a Pizza.
				</p>	
			</li>
			<li>
				<h2>e) Export</h2>
				<p>
					TensorFlow is really cool and let's you export the model into <strong>static files</strong>, which a website can load in order to use it (make predictions!!).
				</p>	
			</li>
		</ul>
	</li>
	<li>
		<h2>Website</h2>
		<p>
			Last but not least a website app that does:
		</p>
		<ul>
			<li>
				<h3>a) Show recommendations</h3>
				<p>
					The recommendations are already curated and based on Instagram posts.
				</p>
			</li>
			<li>
				<h3>b) Classify images</h3>
				<p>
					This section helps to manually assign a label to an image. The train and test images set are based on these curated images.
				</p>
			</li>
			<li>
				<h3>c) Make predictions</h3>
				<p>
					This sections allows you to enter a public URL, unfortunately now a days not all images are public, and make a wild prediction. <br />
					It also comes with a list of public images URL to try out.
				</p>
			</li>
		</ul>
	</li>
</ul>

<p>
	This is pretty much it, so in a few words:
</p>
<p>
	This is a tool that pulls Chicago Food posts from Instagram and uses Machine Learning techniques to classify the posts into: Pizza or Taco.
	<br /><br />
	Of course the intention is to expand it to more categories in the near future.
</p>
<p>
	Thanks for reading, this was fun for me, I hope it was for you too.
</p>
<p>
	If you have any question, comment, complaint, joke, job offer find me on Instagram: <a href="https://www.instagram.com/jimmy.jumps/" target="_blank">@jimmy.jumps</a>
</p>
	