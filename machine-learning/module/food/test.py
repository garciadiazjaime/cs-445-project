import os
import numpy as np
import tensorflow as tf
# import matplotlib.pyplot as plt

from model import create_model
from prepare import get_images_folder, get_categories


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
  print("Restored model, accuracy: {:5.2f}%".format(100 * acc))

  print(model.predict(test_images).shape)

  return model


def predict(model):
  if not model:
    return

  # [url, name] = ["https://storage.googleapis.com/download.tensorflow.org/example_images/592px-Red_sunflower.jpg", "sunflower"]
  # [url, name] = ["https://media.ford.com/content/fordmedia/fsa/br/pt/news/2020/04/14/ford-cria-canal-de-atendimento-que-permite-comprar-carro-sem-sai/jcr:content/image.img.881.495.jpg/1586890161685.jpg", "car"]
  # [url, name] = ["https://urbanmatter.com/chicago/wp-content/uploads/2016/08/61658265_1031292940394672_2473784691572867072_o.jpg", "taco"]
  # [url, name] = ["https://s3-media0.fl.yelpcdn.com/bphoto/okTCSmFEVC6Tr0N10RGqaA/l.jpg", "pizza"]

  [url, name] = ["https://s3-media0.fl.yelpcdn.com/bphoto/okTCSmFEVC6Tr0N10RGqaA/l.jpg", "pizza2"]
  # [url, name] = ["https://cdn.vox-cdn.com/thumbor/dhIGCe8OGUK2YslVIcxYaW-QILQ=/0x0:1280x853/1200x900/filters:focal(538x325:742x529)/cdn.vox-cdn.com/uploads/chorus_image/image/63729432/taqueria_el_mezquite.0.jpg", "tacos2"]

  path = tf.keras.utils.get_file(name, origin=url)

  img_size = 224
  img = tf.keras.preprocessing.image.load_img(
    path, target_size=(img_size, img_size)
  )

  # plt.figure()
  # plt.imshow(img)
  # plt.show()

  img_array = tf.keras.preprocessing.image.img_to_array(img)
  img_array = tf.expand_dims(img_array, 0) # Create a batch
  print("shape", img_array.shape)

  predictions = model.predict(img_array)
  print("----- PREDICTIONS -----")
  print("predictions", predictions)
  score = tf.nn.softmax(predictions[0])

  class_names = get_categories()
  print(
    "This image most likely belongs to {} with a {:.2f} percent confidence."
    .format(class_names[np.argmax(score)], 100 * np.max(score))
)


def main():
  train_folder = get_images_folder()

  with open(train_folder + "/test_images.npy", "rb") as f:
    test_images = np.load(f)
  with open(train_folder + "/test_labels.npy", "rb") as f:
    test_labels = np.load(f)
  
  model = latest(test_images, test_labels, train_folder)
  predict(model)

  model = restore_model(test_images, test_labels)
  predict(model)


if __name__ == "__main__":
  main()
