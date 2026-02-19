import { Users, AlertTriangle, GitBranch, Clock } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  variant: "blue" | "red" | "warning" | "green";
}

const variantStyles = {
  blue: "text-primary glow-blue border-primary/20",
  red: "text-alert glow-red border-alert/20",
  warning: "text-warning border-warning/20",
  green: "text-success glow-green border-success/20",
};

const iconBg = {
  blue: "bg-primary/10",
  red: "bg-alert/10",
  warning: "bg-warning/10",
  green: "bg-success/10",
};

const StatCard = ({ icon: Icon, label, value, variant }: StatCardProps) => (
  <div
    className={`group rounded-lg border bg-card p-5 transition-all duration-300 hover:scale-[1.02] hover:bg-accent/50 ${variantStyles[variant]}`}
  >
    <div className="flex items-center gap-3 mb-3">
      <div className={`rounded-md p-2 ${iconBg[variant]}`}>
        <Icon className="h-5 w-5" />
      </div>
      <span className="text-xs uppercase tracking-wider text-muted-foreground font-medium">{label}</span>
    </div>
    <p className="text-3xl font-bold font-mono text-foreground">{value}</p>
  </div>
);

interface SummaryCardsProps {
  data: {
    totalAccounts: number;
    suspiciousAccounts: number;
    fraudRings: number;
    processingTime: number;
  };
}

const SummaryCards = ({ data }: SummaryCardsProps) => {
  const stats: StatCardProps[] = [
    { icon: Users, label: "Total Accounts Analyzed", value: data.totalAccounts.toLocaleString(), variant: "blue" },
    { icon: AlertTriangle, label: "Suspicious Accounts Flagged", value: data.suspiciousAccounts.toString(), variant: "red" },
    { icon: GitBranch, label: "Fraud Rings Detected", value: data.fraudRings.toString(), variant: "warning" },
    { icon: Clock, label: "Processing Time (sec)", value: data.processingTime.toFixed(2), variant: "green" },
  ];

  return (
    <section className="container mx-auto max-w-6xl px-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>
    </section>
  );
};

export default SummaryCards;
