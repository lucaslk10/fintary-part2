# fintary-part2

# Project

- In this project to find the most likely match, I'm using a score based approach after getting the edit distance using Levenshtein Distance algorithm. The score is calculated based on how far is the distance in terms of characters so that the both strings are similar.

- For calculating the similarity score, I'm using the following formula:

```javascript
Similarity Score =
1 − Levenshtein Distance / Max Length of Two Strings

// This formula takes into account the maximum possible distance, which would be the length of the longer string among the two being compared. This way, the score reflects the proportion of the distance to the string length, giving a normalized measure of similarity.

```

- Based on the score calculation of name, order and product, I'm finding the most likely match.

- I'm assuming orderId have higher priority than name and product, as it is unique id. For that reason I'm giving more weight to orderId.

- Based on some experiments, I'm using the `SIMILARITY_THRESHOLD = 0.46` as the threshold for the similarity score. If the score is higher than this threshold, I'm considering the match as valid.

# fast-levenshtein library

> For assisting in the distance algorithm, I'm using the fast-levenshtein library.

A Javascript implementation of the Levenshtein algorithm.
Levenshtein Distance (Edit Distance): Measures the minimum number of edits (insertions, deletions, or substitutions) required to change one string into the other. It's quite effective for catching typos and small variations.

# How to run

You should first install deps:

```bash
npm install
```

Then you can run the project:

```bash
npm dev
```

You can change the list of orders/transactions in the `src/data.ts` file.

# Input/Output

I'm using the same output data structure as the exercise examples (array of arrays).

Given the Input:

```javascript
ORDERS = [
  {
    type: "order",
    customerName: "Bryan",
    orderId: "12OB-1",
    date: "2023-07-11",
    product: "Product ABC-1",
    price: 1.23,
  },
  {
    type: "order",
    customerName: "Michael",
    orderId: "L2OB-I",
    date: "2023-07-11",
    product: "Product ABC-1",
    price: 1.23,
  },
];
TRANSACTIONS = [
  {
    type: "txn",
    customerName: "Brian",
    orderId: "I208-L",
    date: "2023-07-11",
    product: "ABC Product v1",
    price: 1.23,
    transactionType: "paymentReceived",
    transactionDate: "2023-07-12",
    transactionAmount: 1.23,
  },
];
```

It will Output:

```javascript
[
  [
    {
      type: "order",
      customerName: "Bryan",
      orderId: "12OB-1",
      date: "2023-07-11",
      product: "Product ABC-1",
      price: 1.23,
    },
    {
      type: "txn",
      customerName: "Brian",
      orderId: "I208-L",
      date: "2023-07-11",
      product: "ABC Product v1",
      price: 1.23,
      transactionType: "paymentReceived",
      transactionDate: "2023-07-12",
      transactionAmount: 1.23,
    },
  ],
];
```
