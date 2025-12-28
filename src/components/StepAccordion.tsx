// StepAccordion component// src/components/StepAccordion.tsx
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { XRayTrace } from "@/lib/xray";
import { CandidateTable } from "./CandidateTable";
import { ReasoningCard } from "./ReasoningCard";
import { StatusBadge } from "./StatusBadge";
import { Badge } from "@/components/ui/badge";

interface StepAccordionProps {
  steps: { filename: string; trace: XRayTrace }[];
}

export function StepAccordion({ steps }: StepAccordionProps) {
  return (
    <Accordion type="single" collapsible className="w-full">
      {steps.map(({ filename, trace }) => (
        <AccordionItem key={filename} value={filename}>
          <AccordionTrigger>
            <div className="flex items-center gap-4">
              <StatusBadge status={trace.status} />
              <span className="font-medium">{trace.operation.replace(/_/g, ' ').toUpperCase()}</span>
              <Badge variant="outline">{trace.service}</Badge>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {trace.metadata?.reasoning && <ReasoningCard reasoning={trace.metadata.reasoning} />}
                
                {trace.metadata?.evaluations && (
                  <>
                    <h4 className="font-semibold">Candidate Evaluations</h4>
                    <CandidateTable evaluations={trace.metadata.evaluations} />
                    <p className="text-sm text-muted-foreground">
                      {trace.metadata.qualified_count} qualified out of {trace.metadata.evaluations.length} evaluated
                    </p>
                  </>
                )}

                {trace.output && typeof trace.output === 'object' && 'title' in trace.output && (
                  <div>
                    <h4 className="font-semibold">Selected Competitor</h4>
                    <p className="text-lg font-medium">{(trace.output as any).title}</p>
                  </div>
                )}

                {trace.output && (trace.output as any).fallback && (
                  <p className="text-red-600 font-medium">No competitor found — fallback triggered</p>
                )}
              </CardContent>
            </Card>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}