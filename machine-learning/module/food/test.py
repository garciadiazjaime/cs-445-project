import os
import cv2
import numpy as np
import tensorflow as tf
import matplotlib.pyplot as plt

from model import create_model
from prepare import get_images_folder, get_categories

img_size = 224

def latest(test_images, test_labels, train_folder):
  checkpoint_path = train_folder + "/checkpoints/cp-{epoch:04d}.ckpt"
  checkpoint_dir = os.path.dirname(checkpoint_path)

  os.listdir(checkpoint_dir)
  latest = tf.train.latest_checkpoint(checkpoint_dir)

  if not latest:
    return print("Latest model not found")

  print("----- LATEST -----")
  print("latest", latest)

  # Create a new model instance
  model = create_model()

  # Load the previously saved weights
  model.load_weights(latest)

  # Re-evaluate the model
  loss, acc = model.evaluate(test_images, test_labels, verbose=2)
  print("----- LATEST MODEL -----")
  print("Latest model, accuracy: {:5.2f}%".format(100 * acc))

  return model


def restore_model(test_images, test_labels):
  path = "data/saved_model/food"
  if not os.path.isdir(path):
    return print("Restored model not found")

  model = tf.keras.models.load_model(path)

  # Evaluate the restored model
  loss, acc = model.evaluate(test_images, test_labels, verbose=2)
  print("----- RESTORED MODEL -----")
  print("Restored model, accuracy: {:5.2f}%\n".format(100 * acc))

  return model


def predict(model):
  if not model:
    return

  # [url, name] = ["https://storage.googleapis.com/download.tensorflow.org/example_images/592px-Red_sunflower.jpg", "sunflower"]
  # [url, name] = ["https://media.ford.com/content/fordmedia/fsa/br/pt/news/2020/04/14/ford-cria-canal-de-atendimento-que-permite-comprar-carro-sem-sai/jcr:content/image.img.881.495.jpg/1586890161685.jpg", "car"]
  # [url, name] = ["https://urbanmatter.com/chicago/wp-content/uploads/2016/08/61658265_1031292940394672_2473784691572867072_o.jpg", "taco"]
  # [url, name] = ["https://s3-media0.fl.yelpcdn.com/bphoto/okTCSmFEVC6Tr0N10RGqaA/l.jpg", "pizza"]

  # [url, name] = ["https://s3-media0.fl.yelpcdn.com/bphoto/okTCSmFEVC6Tr0N10RGqaA/l.jpg", "pizza2"]
  # [url, name] = ["https://cdn.vox-cdn.com/thumbor/dhIGCe8OGUK2YslVIcxYaW-QILQ=/0x0:1280x853/1200x900/filters:focal(538x325:742x529)/cdn.vox-cdn.com/uploads/chorus_image/image/63729432/taqueria_el_mezquite.0.jpg", "tacos2"]
  # [url, name] = ["https://s3-media0.fl.yelpcdn.com/bphoto/ugGTotA0JMmYASS5mGeiig/ls.jpg", "pizza3"]
  [url, name] = ["https://s3-media0.fl.yelpcdn.com/bphoto/T7AGG4yUrbN4KFj097VOdA/ls.jpg", "pizza4"]

  path = tf.keras.utils.get_file(name, origin=url)

  img = tf.keras.preprocessing.image.load_img(
    path, target_size=(img_size, img_size)
  )

  # plt.figure()
  # plt.imshow(img)
  # plt.show()

  img_array = tf.keras.preprocessing.image.img_to_array(img)
  img_array = tf.expand_dims(img_array, 0) / 255.0 # Create a batch

  predictions = model.predict(img_array)
  print("----- PREDICTIONS -----")
  score = tf.nn.softmax(predictions[0])

  class_names = get_categories()
  print(
    "This image most likely belongs to {} with a {:.2f} percent confidence."
    .format(class_names[np.argmax(score)], 100 * np.max(score))
  )


def predict_image(model):
  exclude = ['.DS_Store']
  images_path = '../website/static/images/posts'
  entries = os.listdir(images_path)
  images = []

  for (i, entry) in enumerate(entries):
    if entry not in exclude:
      img = tf.keras.preprocessing.image.load_img(images_path + '/' + entry, target_size=(img_size, img_size))
      img_array = tf.keras.preprocessing.image.img_to_array(img)
      img_array = tf.expand_dims(img_array, 0) / 255.0 # Create a batch

      predictions = model.predict(img_array)
      class_names = get_categories()

      score = tf.nn.softmax(predictions[0])
      label = class_names[np.argmax(score)]
      confidence = 100 * np.max(score)

      images.append([
        img_array[0],
        label,
        confidence
      ])

  sorted_images = sorted(images, key=lambda x: -x[2])

  for (i, item) in enumerate(sorted_images[:30]):
      print("----- PREDICTION:", i + 1)

      [img_array, label, confidence] = item
      
      title = "{} with a {:.2f} % confidence.".format(label, confidence)
      print(title)

      plt.figure()
      plt.imshow(img_array)
      plt.title(title)
      plt.show()


def main():
  train_folder = get_images_folder()

  with open(train_folder + "/test_images.npy", "rb") as f:
    test_images = np.load(f)
  with open(train_folder + "/test_labels.npy", "rb") as f:
    test_labels = np.load(f)
  
  # model = latest(test_images, test_labels, train_folder)
  # predict(model)

  model = restore_model(test_images, test_labels)
  predict_image(model)



if __name__ == "__main__":
  main()
