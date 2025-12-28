import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StatusBadge } from "./StatusBadge";

interface Evaluation {
  asin: string;
  title: string;
  price: number;
  rating: number;
  reviews: number;
  passed: boolean;
  details: any;
}

interface CandidateTableProps {
  evaluations?: Evaluation[];
}

export function CandidateTable({ evaluations }: CandidateTableProps) {
  if (!evaluations || evaluations.length === 0) {
    return <p className="text-muted-foreground">No candidate evaluations recorded.</p>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Title</TableHead>
          <TableHead>Price</TableHead>
          <TableHead>Rating</TableHead>
          <TableHead>Reviews</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {evaluations.map((evaluation, i) => (
          <TableRow key={i} className={evaluation.passed ? "bg-green-50" : "bg-red-50"}>
            <TableCell className="font-medium">{evaluation.title}</TableCell>
            <TableCell>${evaluation.price.toFixed(2)}</TableCell>
            <TableCell>{evaluation.rating}★</TableCell>
            <TableCell>{evaluation.reviews.toLocaleString()}</TableCell>
            <TableCell>
              <StatusBadge status={evaluation.passed ? "success" : "warning"} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}