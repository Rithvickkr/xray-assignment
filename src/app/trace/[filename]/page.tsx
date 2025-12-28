import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { getTraceByFilename, getAllTraceFiles } from "@/lib/traces";
import { StepAccordion } from "@/components/StepAccordion";

interface Params {
  params: Promise<{ filename: string }>;
}

export default async function TraceDetail({ params }: Params) {
  const { filename } = await params;
  const current = getTraceByFilename(filename);
  if (!current) notFound();

  // Get all steps from the same specific run (good vs bad)
  const allFiles = getAllTraceFiles();
  
  // First, identify all ranking traces and group them by run type
  const rankingTraces = allFiles.filter(f => 
    f.trace.service === 'ranking-service' && f.trace.input?.reference_product?.price
  );
  
  // Separate good runs (price > $10) from bad runs (price <= $10)
  const goodRankingTraces = rankingTraces.filter(f => f.trace.input.reference_product.price > 10);
  const badRankingTraces = rankingTraces.filter(f => f.trace.input.reference_product.price <= 10);
  
  // Determine which run type we're currently viewing
  let currentRunType: 'good' | 'bad' | null = null;
  let targetRankingTrace = null;
  
  if (current.trace.service === 'ranking-service' && current.trace.input?.reference_product?.price) {
    // Current trace is ranking service - determine run type from its price
    currentRunType = current.trace.input.reference_product.price > 10 ? 'good' : 'bad';
    targetRankingTrace = current.trace;
  } else {
    // Current trace is keyword/search - find closest ranking trace
    const closeRankingTraces = rankingTraces.filter(f => 
      Math.abs(f.trace.timestamp - current.trace.timestamp) < 15000 // 15 second window
    );
    
    if (closeRankingTraces.length > 0) {
      // Sort by proximity and take the closest
      closeRankingTraces.sort((a, b) => 
        Math.abs(a.trace.timestamp - current.trace.timestamp) - 
        Math.abs(b.trace.timestamp - current.trace.timestamp)
      );
      targetRankingTrace = closeRankingTraces[0].trace;
      currentRunType = targetRankingTrace.input.reference_product.price > 10 ? 'good' : 'bad';
    }
  }
  
  let runSteps = [];
  
  if (currentRunType && targetRankingTrace) {
    // Get the specific ranking trace for this run type
    const targetRankingTraces = currentRunType === 'good' ? goodRankingTraces : badRankingTraces;
    const targetRanking = targetRankingTraces.find(r => r.trace.id === targetRankingTrace.id) || targetRankingTraces[0];
    
    if (targetRanking) {
      const targetTimestamp = targetRanking.trace.timestamp;
      
      // Get traces within a tight window (3 seconds) of this specific ranking trace
      const nearbyTraces = allFiles.filter(f => 
        Math.abs(f.trace.timestamp - targetTimestamp) < 3000
      );
      
      // Only include one trace per service to avoid duplicates
      const uniqueServices = new Map<string, typeof nearbyTraces[0]>();
      
      nearbyTraces.forEach(trace => {
        const service = trace.trace.service;
        if (!uniqueServices.has(service) || 
            (service === 'ranking-service' && trace.trace.id === targetRanking.trace.id)) {
          uniqueServices.set(service, trace);
        }
      });
      
      runSteps = Array.from(uniqueServices.values());
  } else {
    // Fallback: include all traces near current timestamp
    runSteps = allFiles.filter(f => 
      Math.abs(f.trace.timestamp - current.trace.timestamp) < 15000
    );
  }

  const isBadRun = runSteps.some(s => s.trace.status === 'warning');

  return (
    <main className="container mx-auto py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">
            Trace: {isBadRun ? "Bad Run (No Competitor)" : "Good Run"}
          </h1>
          <p className="text-muted-foreground">
            Full decision pipeline for competitor selection
          </p>
        </div>
        <Button variant="outline" asChild>
          <Link href="/">← Back to Dashboard</Link>
        </Button>
      </div>

      <StepAccordion steps={runSteps} />
    </main>
  );
}   
}
