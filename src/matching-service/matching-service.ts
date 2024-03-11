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

  // Group transactions by date and price in order to optimize the matching process
  groupTransactionsByDateAndPrice(
    transactions: Transaction[]
  ): Record<string, Transaction[]> {
    const grouped: Record<string, Transaction[]> = {};

    transactions.forEach((transaction) => {
      const key = `${transaction.date}-${transaction.price}`;
      if (!grouped[key]) {
        grouped[key] = [];
      }
      grouped[key].push(transaction);
    });

    return grouped;
  }

  handler(
    orders: Order[],
    transactions: Transaction[]
  ): (Order | Transaction)[][] {
    const matchedRecords: (Order | Transaction)[][] = [];
    const SIMILARITY_THRESHOLD = 0.46;
    const groupedTransactions =
      this.groupTransactionsByDateAndPrice(transactions);

    orders.forEach((order) => {
      const orderKey = `${order.date}-${order.price}`;
      const potentialMatches = groupedTransactions[orderKey] || [];

      const matchesForOrder: Transaction[] = potentialMatches.filter(
        (transaction) => {
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
          return totalScore >= SIMILARITY_THRESHOLD;
        }
      );

      if (matchesForOrder.length > 0) {
        matchedRecords.push([order, ...matchesForOrder]);
      }
    });

    return matchedRecords;
  }
}

export { MatchingService };
