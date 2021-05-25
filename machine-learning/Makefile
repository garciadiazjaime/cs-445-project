all: prepare train export deploy

prepare:
	@echo "Prepare Images"
	python ./module/food/prepare.py

train:
	@echo "Training model"
	python ./module/food/train.py

export:
	tensorflowjs_converter \
    --input_format=tf_saved_model \
    ./data/saved_model/food \
    ./data/web_model

deploy:
	rm -rf ../website/static/web_model
	mv data/web_model ../website/static

count@tacos:
	@ls ../website/static/images/tacos | wc -l

count@pizza:
	@ls ../website/static/images/pizza | wc -l

count@posts:
	@ls ../website/static/images/posts | wc -l
