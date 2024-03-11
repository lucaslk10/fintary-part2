import { ORDERS, TRANSACTIONS } from "./data";
import { MatchingService } from "./matching-service/matching-service";

const matchingService = new MatchingService();
const matchedRecords = matchingService.handler(ORDERS, TRANSACTIONS);

console.log(matchedRecords);
