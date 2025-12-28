// src/components/ReasoningCard.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ReasoningCardProps {
  reasoning?: string;
}

export function ReasoningCard({ reasoning }: ReasoningCardProps) {
  if (!reasoning) return null;

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle className="text-lg">Reasoning</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{reasoning}</p>
      </CardContent>
    </Card>
  );
}