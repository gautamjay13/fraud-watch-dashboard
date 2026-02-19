import { parse } from "csv-parse/sync";
import type { Transaction } from "../types/transaction.js";

export function parseCSV(fileBuffer: Buffer): Transaction[] {
  try {
    const records = parse(fileBuffer.toString(), {
      columns: true,
      skip_empty_lines: true,
      trim: true,
    }) as Record<string, string>[];

    const transactions: Transaction[] = [];

    for (const record of records) {
      // Normalize column names (case-insensitive, handle variations)
      const normalized: Record<string, string> = {};
      for (const [key, value] of Object.entries(record)) {
        normalized[key.toLowerCase().trim()] = value;
      }

      const transactionId = normalized["transaction_id"] || normalized["id"] || "";
      const senderId = normalized["sender_id"] || normalized["sender"] || "";
      const receiverId = normalized["receiver_id"] || normalized["receiver"] || "";
      const amount = parseFloat(normalized["amount"] || "0");
      const timestamp = normalized["timestamp"] || normalized["date"] || "";

      if (transactionId && senderId && receiverId && !isNaN(amount) && timestamp) {
        transactions.push({
          transaction_id: transactionId,
          sender_id: senderId,
          receiver_id: receiverId,
          amount,
          timestamp,
        });
      }
    }

    return transactions;
  } catch (error) {
    throw new Error(`Failed to parse CSV: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}
