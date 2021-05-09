<script>
  import { onMount } from 'svelte';

  let tf = null
  let loadGraphModel = null
  let model = null
  const result = {}

  // let guessURL = 'https://s3-media0.fl.yelpcdn.com/bphoto/okTCSmFEVC6Tr0N10RGqaA/l.jpg'
  let guessURL = 'https://cdn.vox-cdn.com/thumbor/dhIGCe8OGUK2YslVIcxYaW-QILQ=/0x0:1280x853/1200x900/filters:focal(538x325:742x529)/cdn.vox-cdn.com/uploads/chorus_image/image/63729432/taqueria_el_mezquite.0.jpg'
  
  let imageURL = ''
  const categories = ['tacos', 'pizza']

  const MODEL_URL = 'web_model/model.json';

	onMount(async () => {
    console.log('onMount')
    tf = (await import('@tensorflow/tfjs'));
    loadGraphModel = (await import('@tensorflow/tfjs-converter')).loadGraphModel;

    console.log('loadGraphModel')
		model = await loadGraphModel(MODEL_URL);

    console.log('test')
    const zeros = tf.zeros([1, 224, 224, 3]);
    model.predict(zeros).print();
	})

  async function resizeImage(img) {
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");
    
    const oc = document.createElement('canvas'),
        octx = oc.getContext('2d');

    octx.drawImage(img, 0, 0, 224, 224);

    ctx.drawImage(oc, 0, 0, 224, 224, 0, 0, canvas.width, canvas.height);
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
    imageURL = guessURL

    const image = new Image(); // Image constructor
    image.crossOrigin = "Anonymous";
    image.onload = async function(){
      resizeImage(image)      

      const canvas = document.getElementById("canvas");
      const item = tf.browser.fromPixels(canvas)

      let item2 = item.reshape([1, 224, 224, 3])
      item2 = tf.div(item2, 255.0)
      
      let predictions = model.predict(item2)
      predictions.print()
      
      await setPredictedCategory(predictions)
    };
    image.src = imageURL
  }
</script>

<style>
  input, button {
    font-size: 48px;
  }

  img {
    width: auto;
    height: 224px;
  }
</style>


<input type="text" bind:value={guessURL}>
<br />
<button on:click={guessHandler}>Guess</button>

<br />

<div>
  Category: <strong>{result.category || ''}</strong> <br />
  Confidence: {result.confidence || ''}
</div>

{#if imageURL}
<div>
  <img src={imageURL} alt="" id="guess-image" crossorigin='anonymous'>
  <canvas id="canvas" width=224 height=224></canvas>
</div>
{/if}

