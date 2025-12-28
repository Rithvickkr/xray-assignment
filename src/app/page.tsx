// src/app/page.tsx
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getAllTraceFiles } from "@/lib/traces";
import { StatusBadge } from "@/components/StatusBadge";

export default function Home() {
  const files = getAllTraceFiles();

  // Group by run (we know from filenames: good vs bad via the ranking step status)
  const goodRunFiles = files.filter(f => 
    f.trace.operation === 'filter_and_rank' && f.trace.status === 'success'
  );
  
  const badRunFiles = files.filter(f => 
    f.trace.operation === 'filter_and_rank' && f.trace.status === 'warning'
  );

  const runs = [
    { 
      name: "Good Run", 
      description: "Normal price → successful competitor found", 
      hasData: goodRunFiles.length > 0, 
      badge: "success" as const,
      filename: goodRunFiles[0]?.filename
    },
    { 
      name: "Bad Run", 
      description: "Low reference price → no competitor found", 
      hasData: badRunFiles.length > 0, 
      badge: "warning" as const,
      filename: badRunFiles[0]?.filename
    },
  ];

  return (
    <main className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto py-16 px-6">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-6 dark:bg-blue-900/20 dark:text-blue-300">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            X-Ray Debugging System
          </div>
          <h1 className="text-5xl font-bold mb-6 bg-linear-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent dark:from-slate-100 dark:to-slate-400">
            Pipeline Decision Tracer
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Visualize and debug multi-step algorithmic decision processes with complete transparency into every choice point
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="border-0 shadow-lg bg-white/50 backdrop-blur dark:bg-slate-800/50">
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">{files.length}</div>
              <div className="text-sm text-slate-600 dark:text-slate-400">Total Traces</div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg bg-white/50 backdrop-blur dark:bg-slate-800/50">
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-green-600">{goodRunFiles.length}</div>
              <div className="text-sm text-slate-600 dark:text-slate-400">Successful Runs</div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg bg-white/50 backdrop-blur dark:bg-slate-800/50">
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-amber-600">{badRunFiles.length}</div>
              <div className="text-sm text-slate-600 dark:text-slate-400">Failed Runs</div>
            </CardContent>
          </Card>
        </div>

        {/* Pipeline Runs */}
        <div className="grid gap-8 md:grid-cols-2 max-w-4xl mx-auto">
          {runs.map((run, index) => (
            <Card key={run.name} className="group hover:shadow-2xl transition-all duration-300 border-0 shadow-lg bg-white/70 backdrop-blur dark:bg-slate-800/70 hover:-translate-y-1">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${run.badge === 'success' ? 'bg-green-500' : 'bg-amber-500'} animate-pulse`}></div>
                    <CardTitle className="text-xl font-semibold">{run.name}</CardTitle>
                  </div>
                  <StatusBadge status={run.badge} />
                </div>
                <CardDescription className="text-base leading-relaxed">{run.description}</CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                {run.hasData ? (
                  <Button asChild className="w-full h-12 text-base font-medium group-hover:bg-slate-900 transition-colors">
                    <Link href={`/trace/${run.filename}`} className="flex items-center justify-center gap-2">
                      <span>View Decision Trail</span>
                      <span className="group-hover:translate-x-1 transition-transform">→</span>
                    </Link>
                  </Button>
                ) : (
                  <div className="text-center p-8">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
                      <span className="text-2xl">📊</span>
                    </div>
                    <p className="text-slate-500 dark:text-slate-400 mb-4">No trace data available</p>
                    <Button variant="outline" className="text-sm">
                      Run Pipeline First
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Footer */}
        <div className="text-center mt-16 pt-8 border-t border-slate-200 dark:border-slate-700">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Built with Next.js, TypeScript, and Tailwind CSS
          </p>
        </div>
      </div>
    </main>
  );
}