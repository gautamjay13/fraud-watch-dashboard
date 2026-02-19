const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

export interface AnalysisResult {
  summary: {
    totalAccounts: number;
    suspiciousAccounts: number;
    fraudRings: number;
    processingTime: number;
  };
  suspiciousAccounts: Array<{
    id: string;
    score: number;
    patterns: string[];
    ringId?: string;
  }>;
  fraudRings: Array<{
    ringId: string;
    pattern: string;
    memberCount: number;
    riskScore: number;
    members: string[];
  }>;
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

export async function analyzeCSV(file: File): Promise<AnalysisResult> {
  const formData = new FormData();
  formData.append("file", file);

  try {
    console.log(`Uploading file to ${API_BASE_URL}/api/upload/analyze`);
    
    const response = await fetch(`${API_BASE_URL}/api/upload/analyze`, {
      method: "POST",
      body: formData,
      // Don't set Content-Type header - browser will set it with boundary for multipart/form-data
    });

    console.log("Response status:", response.status);

    if (!response.ok) {
      let errorMessage = "Failed to analyze CSV";
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
        console.error("Error response:", errorData);
      } catch (e) {
        errorMessage = `Server error: ${response.status} ${response.statusText}`;
        console.error("Failed to parse error response:", e);
      }
      throw new Error(errorMessage);
    }

    const result = await response.json();
    console.log("Analysis result received:", result.summary);
    return result;
  } catch (error) {
    if (error instanceof TypeError && error.message.includes("fetch")) {
      console.error("Network error - is the backend running?", error);
      throw new Error(`Cannot connect to backend at ${API_BASE_URL}. Make sure the backend server is running.`);
    }
    throw error;
  }
}
