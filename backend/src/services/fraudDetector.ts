import type { Transaction, AccountStats, SuspiciousAccount, FraudRing } from "../types/transaction.js";

export class FraudDetector {
  private transactions: Transaction[] = [];
  private accountStats: Map<string, AccountStats> = new Map();
  private suspiciousAccounts: SuspiciousAccount[] = [];
  private fraudRings: FraudRing[] = [];

  processTransactions(transactions: Transaction[]): void {
    this.transactions = transactions;
    this.accountStats.clear();
    this.suspiciousAccounts = [];
    this.fraudRings = [];

    // Build account statistics
    this.buildAccountStats();

    // Detect suspicious accounts
    this.detectSuspiciousAccounts();

    // Detect fraud rings
    this.detectFraudRings();
  }

  private buildAccountStats(): void {
    for (const tx of this.transactions) {
      // Process sender
      if (!this.accountStats.has(tx.sender_id)) {
        this.accountStats.set(tx.sender_id, {
          accountId: tx.sender_id,
          totalIncoming: 0,
          totalOutgoing: 0,
          transactionCount: 0,
          uniqueConnections: new Set(),
          transactions: [],
          timestamps: [],
        });
      }
      const senderStats = this.accountStats.get(tx.sender_id)!;
      senderStats.totalOutgoing += tx.amount;
      senderStats.transactionCount++;
      senderStats.uniqueConnections.add(tx.receiver_id);
      senderStats.transactions.push(tx);
      senderStats.timestamps.push(new Date(tx.timestamp));

      // Process receiver
      if (!this.accountStats.has(tx.receiver_id)) {
        this.accountStats.set(tx.receiver_id, {
          accountId: tx.receiver_id,
          totalIncoming: 0,
          totalOutgoing: 0,
          transactionCount: 0,
          uniqueConnections: new Set(),
          transactions: [],
          timestamps: [],
        });
      }
      const receiverStats = this.accountStats.get(tx.receiver_id)!;
      receiverStats.totalIncoming += tx.amount;
      receiverStats.transactionCount++;
      receiverStats.uniqueConnections.add(tx.sender_id);
      receiverStats.transactions.push(tx);
      receiverStats.timestamps.push(new Date(tx.timestamp));
    }
  }

  private detectSuspiciousAccounts(): void {
    const suspicious: SuspiciousAccount[] = [];

    for (const [accountId, stats] of this.accountStats.entries()) {
      const patterns: string[] = [];
      let score = 0;

      // Pattern 1: Rapid Layering (many transactions in short time)
      const timeSpan = this.getTimeSpan(stats.timestamps);
      const transactionsPerHour = stats.transactionCount / Math.max(timeSpan, 1);
      if (transactionsPerHour > 10) {
        patterns.push("Rapid layering");
        score += 0.3;
      }

      // Pattern 2: Circular Flow (account sends to someone who sends back)
      if (this.hasCircularFlow(accountId)) {
        patterns.push("Circular flow");
        score += 0.35;
      }

      // Pattern 3: Smurfing (many small transactions)
      const avgAmount = (stats.totalOutgoing + stats.totalIncoming) / stats.transactionCount;
      if (stats.transactionCount > 20 && avgAmount < 100) {
        patterns.push("Smurfing");
        score += 0.25;
      }

      // Pattern 4: Funnel Account (high incoming, low outgoing or vice versa)
      const funnelRatio = stats.totalIncoming > 0
        ? stats.totalOutgoing / stats.totalIncoming
        : stats.totalOutgoing > 0
        ? stats.totalIncoming / stats.totalOutgoing
        : 0;
      if (funnelRatio < 0.1 && stats.totalIncoming > 10000) {
        patterns.push("Funnel account");
        score += 0.3;
      }

      // Pattern 5: High Velocity (many unique connections)
      if (stats.uniqueConnections.size > 15) {
        patterns.push("High velocity");
        score += 0.2;
      }

      // Pattern 6: Chain Transfer (linear transaction chain)
      if (this.isChainTransfer(accountId)) {
        patterns.push("Chain transfer");
        score += 0.15;
      }

      // Normalize score to 0-1 range
      score = Math.min(score, 1.0);

      if (score > 0.5 || patterns.length > 0) {
        suspicious.push({
          id: accountId,
          score: Math.round(score * 100) / 100,
          patterns,
        });
      }
    }

    // Sort by score descending
    this.suspiciousAccounts = suspicious.sort((a, b) => b.score - a.score);
  }

  private detectFraudRings(): void {
    const rings: Map<string, Set<string>> = new Map();
    const suspiciousIds = new Set(this.suspiciousAccounts.map(a => a.id));

    // Find connected suspicious accounts
    for (const tx of this.transactions) {
      const senderSuspicious = suspiciousIds.has(tx.sender_id);
      const receiverSuspicious = suspiciousIds.has(tx.receiver_id);

      if (senderSuspicious && receiverSuspicious) {
        // Find existing ring or create new one
        let ringId: string | null = null;
        for (const [id, members] of rings.entries()) {
          if (members.has(tx.sender_id) || members.has(tx.receiver_id)) {
            ringId = id;
            members.add(tx.sender_id);
            members.add(tx.receiver_id);
            break;
          }
        }

        if (!ringId) {
          ringId = `R-${String(rings.size + 1).padStart(3, "0")}`;
          rings.set(ringId, new Set([tx.sender_id, tx.receiver_id]));
        }
      }
    }

    // Convert to fraud rings with pattern detection
    this.fraudRings = Array.from(rings.entries()).map(([ringId, members]) => {
      const memberArray = Array.from(members);
      const pattern = this.detectRingPattern(memberArray);
      const riskScore = this.calculateRingRiskScore(memberArray);

      // Assign ring IDs to suspicious accounts
      memberArray.forEach(accountId => {
        const account = this.suspiciousAccounts.find(a => a.id === accountId);
        if (account) {
          account.ringId = ringId;
        }
      });

      return {
        ringId,
        pattern,
        memberCount: memberArray.length,
        riskScore: Math.round(riskScore * 100) / 100,
        members: memberArray,
      };
    });
  }

  private hasCircularFlow(accountId: string): boolean {
    const stats = this.accountStats.get(accountId);
    if (!stats) return false;

    // Check if account sends to someone who sends back
    for (const tx of stats.transactions) {
      if (tx.sender_id === accountId) {
        const receiverStats = this.accountStats.get(tx.receiver_id);
        if (receiverStats) {
          const hasReturnFlow = receiverStats.transactions.some(
            t => t.sender_id === tx.receiver_id && t.receiver_id === accountId
          );
          if (hasReturnFlow) return true;
        }
      }
    }
    return false;
  }

  private isChainTransfer(accountId: string): boolean {
    const stats = this.accountStats.get(accountId);
    if (!stats) return false;

    // Chain transfer: mostly one incoming and one outgoing connection
    return stats.uniqueConnections.size <= 2 && stats.transactionCount > 5;
  }

  private detectRingPattern(members: string[]): string {
    if (members.length === 0) return "Unknown";

    // Check for circular pattern
    const hasCircular = members.some(memberId => {
      const stats = this.accountStats.get(memberId);
      if (!stats) return false;
      return members.some(otherId => 
        otherId !== memberId && stats.uniqueConnections.has(otherId)
      );
    });

    if (hasCircular && members.length <= 5) {
      return "Circular Layering";
    }

    // Check for star topology (one central account)
    const connectionCounts = members.map(memberId => {
      const stats = this.accountStats.get(memberId);
      return stats ? stats.uniqueConnections.size : 0;
    });
    const maxConnections = Math.max(...connectionCounts);
    if (maxConnections > members.length * 0.7) {
      return "Star Topology";
    }

    // Check for funnel pattern
    const hasFunnel = members.some(memberId => {
      const stats = this.accountStats.get(memberId);
      if (!stats) return false;
      const funnelRatio = stats.totalIncoming > 0
        ? stats.totalOutgoing / stats.totalIncoming
        : 0;
      return funnelRatio < 0.2;
    });

    if (hasFunnel) {
      return "Funnel & Disperse";
    }

    // Check for rapid transactions
    const hasRapid = members.some(memberId => {
      const stats = this.accountStats.get(memberId);
      if (!stats) return false;
      const timeSpan = this.getTimeSpan(stats.timestamps);
      return stats.transactionCount / Math.max(timeSpan, 1) > 10;
    });

    if (hasRapid) {
      return "Rapid Smurfing";
    }

    // Default to chain pattern
    return "Chain Transfer";
  }

  private calculateRingRiskScore(members: string[]): number {
    let totalScore = 0;
    let count = 0;

    for (const memberId of members) {
      const account = this.suspiciousAccounts.find(a => a.id === memberId);
      if (account) {
        totalScore += account.score;
        count++;
      }
    }

    return count > 0 ? totalScore / count : 0;
  }

  private getTimeSpan(timestamps: Date[]): number {
    if (timestamps.length < 2) return 1;
    const sorted = [...timestamps].sort((a, b) => a.getTime() - b.getTime());
    const diff = sorted[sorted.length - 1].getTime() - sorted[0].getTime();
    return Math.max(diff / (1000 * 60 * 60), 1); // Convert to hours, minimum 1
  }

  getSuspiciousAccounts(): SuspiciousAccount[] {
    return this.suspiciousAccounts;
  }

  getFraudRings(): FraudRing[] {
    return this.fraudRings;
  }

  getAccountStats(): Map<string, AccountStats> {
    return this.accountStats;
  }

  getTransactions(): Transaction[] {
    return this.transactions;
  }
}
