<script>
  import { onMount } from 'svelte';

  let tf = null
  let loadGraphModel = null
  let model = null
  let msg = ''
  const result = {}

  let guessURL = ''

  let cases = [
    // pizza
    'https://s3-media0.fl.yelpcdn.com/bphoto/okTCSmFEVC6Tr0N10RGqaA/l.jpg',
    'https://s3-media0.fl.yelpcdn.com/bphoto/olCiohzqhS0V9V6sISp-2A/ls.jpg',
    'https://s3-media0.fl.yelpcdn.com/bphoto/pgbTzTYe0D-keQE58YdNbQ/ls.jpg',
    'https://s3-media0.fl.yelpcdn.com/bphoto/PZEoHKfHbEhAGl7tYZ0XcA/ls.jpg',


    // tacos
    'https://i.insider.com/5a7dd9e1aee63c76008b4640?width=750&format=jpeg&auto=webp',
    'https://s3-media0.fl.yelpcdn.com/bphoto/VLj4WylvSfoUB9ove5QoNA/ls.jpg',
    'https://s3-media0.fl.yelpcdn.com/bphoto/_XWZGG0A-nB_26YE5Px_-Q/l.jpg',
    'https://s3-media0.fl.yelpcdn.com/bphoto/68y9BV2b9qDsLUMZpjdHgw/l.jpg',
    'https://hoodline.imgix.net/uploads/story/image/890217/o.jpg?auto=format',
  ]
  
  let imageURL = ''
  const categories = ['tacos', 'pizza']

  const MODEL_URL = 'web_model/model.json';

	onMount(async () => {
    tf = (await import('@tensorflow/tfjs'));
    loadGraphModel = (await import('@tensorflow/tfjs-converter')).loadGraphModel;

		model = await loadGraphModel(MODEL_URL);

    const zeros = tf.zeros([1, 224, 224, 3]);
    model.predict(zeros).print();
	})

  function resizeImage(img) {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);


    const scaledCanvas = document.createElement('canvas');
    scaledCanvas.width = 224;
    scaledCanvas.height = 224;

    scaledCanvas
      .getContext('2d')
      .drawImage(canvas, 0, 0, scaledCanvas.width, scaledCanvas.height);

    return scaledCanvas
  }

  async function setPredictedCategory(predictions) {
    const data = await predictions.data()

    const [index, confidence] = data.reduce((accu, item, index) => {
      const [, maxValue] = accu

      if (item > maxValue) {
        return [index, item]
      }

      return accu
    }, [null, -1])

    result.category = categories[index]
    result.confidence = `${Math.floor(confidence * 10000)/100} %`
  }
  
  function guessHandler(event) {
    if (!guessURL) {
      msg = "please paste an image URL in the box"
      return
    }

    msg = "...loading"
    imageURL = guessURL

    const image = new Image();
    image.crossOrigin = "Anonymous";
    image.onload = async function(){
      msg = ""
      const canvas = resizeImage(image)

      const imagePixels = tf.browser.fromPixels(canvas)

      let imageReshaped = imagePixels.reshape([1, 224, 224, 3])
      imageReshaped = tf.div(imageReshaped, 255.0)
      
      const predictions = model.predict(imageReshaped)
      predictions.print()
      
      await setPredictedCategory(predictions)
    };
    image.onerror = function () {
      msg = "Sorry couldn't download that image (maybe because of CORS), try using images from yelp"
    }
    image.src = imageURL
  }

  function caseClickHanddler(index) {
    guessURL = cases[index]
    guessHandler()
  }
</script>

<style>
  input, button {
    font-size: 48px;
    width: 100%;
    margin: 20px 0;
  }

  img {
    height: 224px;
    width: auto;
  }

  .image {
    height: 224px;
    width: 224px;
    background-size: cover;
    background-repeat: no-repeat;
  }

  .image:hover {
    cursor: pointer;
  }

  .image-wrapper {
    height: 224px;
  }

  .msg {
    color: darksalmon;
  }

  div, p {
    font-size: 24px;
  }
  
  .cases {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    column-gap: 15px;
    row-gap: 15px;
  }
</style>

<h1>Image Classifier [Level: Toddler 👶]</h1>
<p>Paste either a Pizza or Taco Image URL and with some luck this tool will tell you what it is 🤞.</p>
<p>
  Note: Most of the images are not public anymore 😞, 
  try one from <a href="https://www.google.com/search?q=yelp+taco&tbm=isch" target="_blank">Yelp Taco</a> or 
  <a href="https://www.google.com/search?q=yelp+pizza&tbm=isch" target="_blank">Yelp Pizza</a> instead 😎.
</p>

<input type="text" bind:value={guessURL}>
<br />
<button on:click={guessHandler}>Guess</button>

<br />

<div>
  Category: <strong>{result.category || ''}</strong> <br />
  Confidence: {result.confidence || ''}
</div>
<p class="msg">
  {msg}
</p>

<div class="image-wrapper">
  {#if imageURL}
    <img src={imageURL} alt="" crossorigin='anonymous'>
  {/if}
</div>

<br>
<h2>You can use one of these images, just click on it.</h2>
<div class="cases">
  {#each cases as imageCaseURL, index}
    <div class="image" on:click={() => caseClickHanddler(index)} style={`background-image: url(${imageCaseURL})`}></div>
  {/each}
</div>

