import { GitBranch } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface FraudRingsTableProps {
  data: Array<{
    ringId: string;
    pattern: string;
    memberCount: number;
    riskScore: number;
    members: string[];
  }>;
}

const riskColor = (score: number) => {
  if (score >= 0.85) return "text-alert";
  if (score >= 0.75) return "text-warning";
  return "text-muted-foreground";
};

const FraudRingsTable = ({ data: rings }: FraudRingsTableProps) => {
  return (
    <section className="container mx-auto max-w-6xl px-6">
      <div className="rounded-lg border border-border bg-card overflow-hidden">
        <div className="flex items-center gap-2 border-b border-border px-5 py-3">
          <GitBranch className="h-5 w-5 text-warning" />
          <h3 className="text-sm font-semibold text-foreground">Fraud Rings Summary</h3>
          <Badge variant="outline" className="ml-auto text-xs border-warning/30 text-warning">
            {rings.length} rings
          </Badge>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="text-muted-foreground font-mono text-xs">Ring ID</TableHead>
                <TableHead className="text-muted-foreground font-mono text-xs">Pattern Type</TableHead>
                <TableHead className="text-muted-foreground font-mono text-xs">Member Count</TableHead>
                <TableHead className="text-muted-foreground font-mono text-xs">Risk Score</TableHead>
                <TableHead className="text-muted-foreground font-mono text-xs">Members</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rings.map((ring) => (
                <TableRow key={ring.ringId} className="border-border hover:bg-accent/50">
                  <TableCell className="font-mono text-sm text-primary">{ring.ringId}</TableCell>
                  <TableCell className="text-sm text-foreground">{ring.pattern}</TableCell>
                  <TableCell className="font-mono text-sm text-foreground">{ring.memberCount}</TableCell>
                  <TableCell>
                    <span className={`font-mono text-sm font-semibold ${riskColor(ring.riskScore)}`}>
                      {ring.riskScore.toFixed(2)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {ring.members.map((m) => (
                        <Badge key={m} variant="secondary" className="text-xs font-mono">
                          {m}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </section>
  );
};

export default FraudRingsTable;
