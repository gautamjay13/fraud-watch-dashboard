import { AlertTriangle } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface SuspiciousTableProps {
  data: Array<{
    id: string;
    score: number;
    patterns: string[];
    ringId?: string;
  }>;
}

const SuspiciousTable = ({ data }: SuspiciousTableProps) => {
  return (
    <section className="container mx-auto max-w-6xl px-6">
      <div className="rounded-lg border border-border bg-card overflow-hidden">
        <div className="flex items-center gap-2 border-b border-border px-5 py-3">
          <AlertTriangle className="h-5 w-5 text-alert" />
          <h3 className="text-sm font-semibold text-foreground">Suspicious Accounts</h3>
          <Badge variant="destructive" className="ml-auto text-xs">
            {data.length} flagged
          </Badge>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="text-muted-foreground font-mono text-xs">Account ID</TableHead>
                <TableHead className="text-muted-foreground font-mono text-xs">Suspicion Score</TableHead>
                <TableHead className="text-muted-foreground font-mono text-xs">Detected Patterns</TableHead>
                <TableHead className="text-muted-foreground font-mono text-xs">Ring ID</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((row) => (
                <TableRow key={row.id} className="border-border hover:bg-accent/50">
                  <TableCell className="font-mono text-sm text-foreground">{row.id}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-16 rounded-full bg-muted overflow-hidden">
                        <div
                          className="h-full rounded-full bg-alert"
                          style={{ width: `${row.score * 100}%` }}
                        />
                      </div>
                      <span className="text-sm font-mono text-alert">{row.score.toFixed(2)}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {row.patterns.map((p) => (
                        <Badge key={p} variant="outline" className="text-xs border-border text-muted-foreground">
                          {p}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-sm text-primary">{row.ringId}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </section>
  );
};

export default SuspiciousTable;
