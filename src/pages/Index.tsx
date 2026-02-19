import { useState } from "react";
import Header from "@/components/dashboard/Header";
import CsvUpload from "@/components/dashboard/CsvUpload";
import ProcessingStatus from "@/components/dashboard/ProcessingStatus";
import SummaryCards from "@/components/dashboard/SummaryCards";
import NetworkGraph from "@/components/dashboard/NetworkGraph";
import SuspiciousTable from "@/components/dashboard/SuspiciousTable";
import FraudRingsTable from "@/components/dashboard/FraudRingsTable";
import DownloadButton from "@/components/dashboard/DownloadButton";
import Footer from "@/components/dashboard/Footer";
import { analyzeCSV, type AnalysisResult } from "@/lib/api";
import { toast } from "sonner";

type Status = "idle" | "processing" | "success" | "error";

const Index = () => {
  const [status, setStatus] = useState<Status>("idle");
  const [showResults, setShowResults] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);

  const handleUpload = async (file: File) => {
    setStatus("processing");
    setShowResults(false);
    
    try {
      const result = await analyzeCSV(file);
      setAnalysisResult(result);
      setStatus("success");
      setShowResults(true);
      toast.success("Analysis completed successfully");
    } catch (error) {
      setStatus("error");
      toast.error(error instanceof Error ? error.message : "Failed to analyze CSV");
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1 flex flex-col gap-6 py-8">
        <CsvUpload onUpload={handleUpload} />
        <ProcessingStatus status={status} />

        {showResults && analysisResult && (
          <div className="flex flex-col gap-6 animate-fade-in">
            <SummaryCards data={analysisResult.summary} />
            <NetworkGraph data={analysisResult.networkGraph} />
            <SuspiciousTable data={analysisResult.suspiciousAccounts} />
            <FraudRingsTable data={analysisResult.fraudRings} />
            <DownloadButton data={analysisResult} />
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Index;
