import cv2
import os
import numpy as np
import matplotlib.pyplot as plt

def main():
  img = cv2.imread('./module/post/image.jpg')
  img_arr = np.array(img) / 255.0
  
  
  kernel = np.array([
    [0,  -1,  0],
    [-1,  0,  1],
    [0,  1,  0]
  ])

  # high pass filter (vertical edge filter)
  # kernel = np.array([
  #   [0,   0,  0],
  #   [-1,  0,  1],
  #   [0,   0,  0]
  # ])

  dst = cv2.filter2D(img_arr, -1, kernel)

  plt.figure()
  plt.imshow(img_arr[:, :, [2,1,0]])

  plt.figure()
  plt.imshow(dst[:, :, [2,1,0]])

  plt.show()


if __name__ == "__main__":
  main()
