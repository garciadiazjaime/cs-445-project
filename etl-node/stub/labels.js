module.exports = {
  "$metadata": {
    "httpStatusCode": 200,
    "requestId": "89a53a74-78e2-4a12-b556-bbf316bf4781",
    "attempts": 1,
    "totalRetryDelay": 0
  },
  "LabelModelVersion": "2.0",
  "Labels": [{
    "Confidence": 99.80423736572266,
    "Instances": [],
    "Name": "Dish",
    "Parents": [{
      "Name": "Meal"
    }, {
      "Name": "Food"
    }]
  }, {
    "Confidence": 99.80423736572266,
    "Instances": [],
    "Name": "Meal",
    "Parents": [{
      "Name": "Food"
    }]
  }, {
    "Confidence": 99.80423736572266,
    "Instances": [],
    "Name": "Food",
    "Parents": []
  }, {
    "Confidence": 98.11699676513672,
    "Instances": [{
      "BoundingBox": {
        "Height": 0.24688194692134857,
        "Left": 0.3496100604534149,
        "Top": 0.4759839177131653,
        "Width": 0.33665645122528076
      },
      "Confidence": 98.11699676513672
    }],
    "Name": "Egg",
    "Parents": [{
      "Name": "Food"
    }]
  }, {
    "Confidence": 97.59412384033203,
    "Instances": [],
    "Name": "Curry",
    "Parents": [{
      "Name": "Food"
    }]
  }, {
    "Confidence": 94.41757202148438,
    "Instances": [],
    "Name": "Bowl",
    "Parents": []
  }, {
    "Confidence": 90.618896484375,
    "Instances": [],
    "Name": "Stew",
    "Parents": [{
      "Name": "Dish"
    }, {
      "Name": "Meal"
    }, {
      "Name": "Food"
    }]
  }, {
    "Confidence": 56.54010009765625,
    "Instances": [],
    "Name": "Soup Bowl",
    "Parents": [{
      "Name": "Bowl"
    }]
  }]
}
