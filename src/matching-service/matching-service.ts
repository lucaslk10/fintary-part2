import * as fastLevenshtein from "fast-levenshtein";

interface Order {
  customerName: string;
  orderId: string;
  date: string;
  product: string;
  price: number;
}

interface Transaction extends Order {
  transactionType: string;
  transactionDate: string;
  transactionAmount: number;
}

class MatchingService {
  calculateSimilarityScore(str1: string, str2: string): number {
    const distance = fastLevenshtein.get(str1, str2);
    const maxLength = Math.max(str1.length, str2.length);
    const similarityScore = 1 - distance / maxLength;
    return similarityScore;
  }

  handler(
    orders: Order[],
    transactions: Transaction[]
  ): (Order | Transaction)[][] {
    const matchedRecords: (Order | Transaction)[][] = [];
    const SIMILARITY_THRESHOLD = 0.46;

    orders.forEach((order) => {
      const matchesForOrder: Transaction[] = [];

      transactions.forEach((transaction) => {
        if (
          transaction.date === order.date &&
          transaction.price === order.price
        ) {
          // Calculate the similarity score for each field
          const nameScore = this.calculateSimilarityScore(
            transaction.customerName,
            order.customerName
          );
          const idScore = this.calculateSimilarityScore(
            transaction.orderId,
            order.orderId
          );
          const productScore = this.calculateSimilarityScore(
            transaction.product,
            order.product
          );

          const totalScore = (nameScore + productScore + 2 * idScore) / 4; // Adjusted weighting
          // Determine if the scores are above the similarity threshold
          if (totalScore >= SIMILARITY_THRESHOLD) {
            matchesForOrder.push(transaction);
          }
        }
      });

      // If there are matches, group the order with its matched transactions
      if (matchesForOrder.length > 0) {
        matchedRecords.push([order, ...matchesForOrder]);
      }
    });

    return matchedRecords;
  }
}

export { MatchingService };
