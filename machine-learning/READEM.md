## Virtualenv

https://docs.python-guide.org/dev/virtualenvs/

https://janakiev.com/blog/jupyter-virtual-envs/


## Commands

```bash
virtualenv [name]

source [name]/bin/activate

pip install -r requirements.txt
```


## zip folder
```
zip -r jaimeg4_mp5.zip . -x '*.git*' -x '*mp5*' -x '*.vscode*' -x '*.DS_Store*' -x '*results*' -x '*background_frames*' -x '*foreground_frames*' -x '*homography_frames*'
```

# Reference

https://www.analyticsvidhya.com/blog/2020/10/create-image-classification-model-python-keras/

https://www.tensorflow.org/tutorials/images/classification

https://www.tensorflow.org/js/tutorials/conversion/import_saved_model



## TensorFlow JS

```
tensorflowjs_converter \
    --input_format=tf_saved_model \
    --output_node_names='MobilenetV1/Predictions/Reshape_1' \
    --saved_model_tags=serve \
    ./data/saved_model/food \
    ./data/web_model

rm -rf ../website/static/web_model

cp -r data/web_model ../website/static
```
