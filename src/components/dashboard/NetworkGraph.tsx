import { useEffect, useRef } from "react";
import { Network, ZoomIn, ZoomOut, Maximize2 } from "lucide-react";
import { Button } from "@/components/ui/button";

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

interface NetworkGraphProps {
  data: {
    nodes: Node[];
    edges: Edge[];
  };
}

const NetworkGraph = ({ data }: NetworkGraphProps) => {
  const { nodes, edges } = data;
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    if (nodes.length === 0) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const w = rect.width;
    const h = rect.height;
    
    // Find bounds of node positions
    const minX = Math.min(...nodes.map(n => n.x));
    const maxX = Math.max(...nodes.map(n => n.x));
    const minY = Math.min(...nodes.map(n => n.y));
    const maxY = Math.max(...nodes.map(n => n.y));
    
    const rangeX = maxX - minX || 1;
    const rangeY = maxY - minY || 1;
    
    const padding = 50;
    const scaleX = (w - padding * 2) / rangeX;
    const scaleY = (h - padding * 2) / rangeY;

    const getPos = (node: Node) => ({
      x: padding + (node.x - minX) * scaleX,
      y: padding + (node.y - minY) * scaleY,
    });

    const nodeMap = new Map(nodes.map((n) => [n.id, n]));

    // Draw edges
    ctx.lineWidth = 1;
    edges.forEach((edge) => {
      const from = nodeMap.get(edge.from);
      const to = nodeMap.get(edge.to);
      if (!from || !to) return;
      const p1 = getPos(from);
      const p2 = getPos(to);

      const isSuspicious = from.suspicious || to.suspicious;
      ctx.strokeStyle = isSuspicious
        ? "hsla(0, 72%, 55%, 0.4)"
        : "hsla(215, 60%, 56%, 0.2)";
      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.stroke();
    });

    // Draw nodes
    nodes.forEach((node) => {
      const pos = getPos(node);
      const r = node.suspicious ? 10 : 7;

      // Glow
      if (node.suspicious) {
        const gradient = ctx.createRadialGradient(pos.x, pos.y, r, pos.x, pos.y, r * 3);
        gradient.addColorStop(0, "hsla(0, 72%, 55%, 0.3)");
        gradient.addColorStop(1, "hsla(0, 72%, 55%, 0)");
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, r * 3, 0, Math.PI * 2);
        ctx.fill();
      }

      // Node circle
      ctx.fillStyle = node.suspicious
        ? "hsl(0, 72%, 55%)"
        : "hsl(215, 90%, 56%)";
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, r, 0, Math.PI * 2);
      ctx.fill();

      // Label
      ctx.fillStyle = "hsl(210, 20%, 75%)";
      const scale = Math.min(scaleX, scaleY, 1);
      ctx.font = `${10 * scale}px 'JetBrains Mono', monospace`;
      ctx.textAlign = "center";
      ctx.fillText(node.label, pos.x, pos.y + r + 14);
    });
  }, [nodes, edges]);

  return (
    <section className="container mx-auto max-w-6xl px-6">
      <div className="rounded-lg border border-border bg-card overflow-hidden">
        <div className="flex items-center justify-between border-b border-border px-5 py-3">
          <div className="flex items-center gap-2">
            <Network className="h-5 w-5 text-primary" />
            <h3 className="text-sm font-semibold text-foreground">Transaction Network Graph</h3>
          </div>
          <div className="flex items-center gap-1">
            <div className="flex items-center gap-1.5 mr-4 text-xs text-muted-foreground">
              <span className="inline-block h-2.5 w-2.5 rounded-full bg-primary" /> Normal
              <span className="inline-block h-2.5 w-2.5 rounded-full bg-alert ml-2" /> Suspicious
            </div>
            <Button variant="ghost" size="icon" className="h-7 w-7">
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-7 w-7">
              <ZoomOut className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-7 w-7">
              <Maximize2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="relative bg-background/50 p-2" style={{ minHeight: 400 }}>
          <canvas
            ref={canvasRef}
            className="w-full rounded"
            style={{ height: 400 }}
          />
        </div>
      </div>
    </section>
  );
};

export default NetworkGraph;
