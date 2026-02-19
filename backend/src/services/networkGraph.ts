import type { Transaction, AccountStats } from "../types/transaction.js";
import type { SuspiciousAccount } from "../types/transaction.js";

interface Node {
  id: string;
  x: number;
  y: number;
  suspicious: boolean;
  label: string;
}

interface Edge {
  from: string;
  to: string;
}

export class NetworkGraphGenerator {
  generateGraph(
    transactions: Transaction[],
    accountStats: Map<string, AccountStats>,
    suspiciousAccounts: SuspiciousAccount[]
  ): { nodes: Node[]; edges: Edge[] } {
    const suspiciousIds = new Set(suspiciousAccounts.map(a => a.id));
    const accountIds = Array.from(accountStats.keys());

    // Generate nodes with force-directed layout approximation
    const nodes: Node[] = accountIds.map((id, index) => {
      const angle = (index / accountIds.length) * 2 * Math.PI;
      const radius = 150 + Math.random() * 100;
      const x = 400 + radius * Math.cos(angle);
      const y = 250 + radius * Math.sin(angle);

      return {
        id,
        x: Math.round(x),
        y: Math.round(y),
        suspicious: suspiciousIds.has(id),
        label: id,
      };
    });

    // Generate edges from transactions
    const edgeMap = new Map<string, Edge>();
    for (const tx of transactions) {
      const key = `${tx.sender_id}-${tx.receiver_id}`;
      if (!edgeMap.has(key)) {
        edgeMap.set(key, {
          from: tx.sender_id,
          to: tx.receiver_id,
        });
      }
    }

    const edges = Array.from(edgeMap.values());

    return { nodes, edges };
  }
}
