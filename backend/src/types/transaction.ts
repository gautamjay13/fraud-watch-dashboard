export interface Transaction {
  transaction_id: string;
  sender_id: string;
  receiver_id: string;
  amount: number;
  timestamp: string;
}

export interface AccountStats {
  accountId: string;
  totalIncoming: number;
  totalOutgoing: number;
  transactionCount: number;
  uniqueConnections: Set<string>;
  transactions: Transaction[];
  timestamps: Date[];
}

export interface SuspiciousAccount {
  id: string;
  score: number;
  patterns: string[];
  ringId?: string;
}

export interface FraudRing {
  ringId: string;
  pattern: string;
  memberCount: number;
  riskScore: number;
  members: string[];
}

export interface AnalysisResult {
  summary: {
    totalAccounts: number;
    suspiciousAccounts: number;
    fraudRings: number;
    processingTime: number;
  };
  suspiciousAccounts: SuspiciousAccount[];
  fraudRings: FraudRing[];
  networkGraph: {
    nodes: Array<{
      id: string;
      x: number;
      y: number;
      suspicious: boolean;
      label: string;
    }>;
    edges: Array<{
      from: string;
      to: string;
    }>;
  };
}
