import os
import numpy as np
import tensorflow as tf

from model import create_model

checkpoint_path = "data/training_food/cp-{epoch:04d}.ckpt"
checkpoint_dir = os.path.dirname(checkpoint_path)


def latest(test_images, test_labels):
  os.listdir(checkpoint_dir)
  latest = tf.train.latest_checkpoint(checkpoint_dir)

  if not latest:
    return print("Latest model not found")

  print("latest", latest)

  # Create a new model instance
  model = create_model()

  # Load the previously saved weights
  model.load_weights(latest)

  # Re-evaluate the model
  loss, acc = model.evaluate(test_images, test_labels, verbose=2)
  print("----- LATEST -----")
  print("Latest model, accuracy: {:5.2f}%".format(100 * acc))

  print("----- PREDICT -----")
  print(model.predict(test_images).shape)


def restore_model(test_images, test_labels):
  path = 'data/saved_model/food'
  if not os.path.isdir(path):
    return print("Restored model not found")

  model = tf.keras.models.load_model(path)

  # Evaluate the restored model
  loss, acc = model.evaluate(test_images, test_labels, verbose=2)
  print("----- RESTORED -----")
  print('Restored model, accuracy: {:5.2f}%'.format(100 * acc))

  print(model.predict(test_images).shape)


def main():
  with open("./data/training_food/test_images.npy", "rb") as f:
    test_images = np.load(f)
  with open("./data/training_food/test_labels.npy", "rb") as f:
    test_labels = np.load(f)
  
  latest(test_images, test_labels)

  restore_model(test_images, test_labels)


if __name__ == "__main__":
  main()
