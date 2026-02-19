import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { AnalysisResult } from "@/lib/api";

interface DownloadButtonProps {
  data: AnalysisResult;
}

const DownloadButton = ({ data }: DownloadButtonProps) => {
  const handleDownload = () => {
    const report = {
      generatedAt: new Date().toISOString(),
      version: "1.0",
      summary: data.summary,
      suspiciousAccounts: data.suspiciousAccounts,
      fraudRings: data.fraudRings,
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "investigation-report.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <section className="container mx-auto max-w-6xl px-6">
      <Button onClick={handleDownload} size="lg" className="gap-2 glow-blue w-full sm:w-auto">
        <Download className="h-5 w-5" />
        Download Investigation Report (JSON)
      </Button>
    </section>
  );
};

export default DownloadButton;
