import cv2
import os
import numpy as np

folders = ['tacos', 'pizza'] #, 'dessert', 'sandwich', 'seafood', 'drink']
img_size = 224
dir_path = os.path.dirname(os.path.realpath(__file__))

def get_categories():
  return folders

def get_data(data_dir):
  images = []
  labels = []

  for folder in folders: 
    path = os.path.join(data_dir, folder)
    class_num = folders.index(folder)

    for img in os.listdir(path):
      try:
        img_arr = cv2.imread(os.path.join(path, img))[...,::-1] #convert BGR to RGB format
        resized_arr = cv2.resize(img_arr, (img_size, img_size)) # Reshaping images to preferred size
        images.append(resized_arr)
        labels.append(class_num)
      except Exception as e:
          print(e)

  return np.array(images), np.array(labels)

def main():
  train_images, train_labels = get_data('../website/static/images/')
  test_images, test_labels = get_data('../website/static/test/')

  # Normalize the data
  train_images = train_images / 255.0
  test_images = test_images / 255.0

  folder = get_images_folder()

  # Save test images
  np.save(folder + "/train_images", train_images)
  np.save(folder + "/train_labels", train_labels)

  np.save(folder + "/test_images", test_images)
  np.save(folder + "/test_labels", test_labels)

def get_images_folder():
  folder = "./data/food" 
  if not os.path.exists(folder):
    os.makedirs(folder)
  
  return folder

if __name__ == "__main__":
  main()
