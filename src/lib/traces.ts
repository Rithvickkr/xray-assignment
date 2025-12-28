import fs from 'fs';
import path from 'path';
import { XRayTrace } from '@/lib/xray';

const tracesDir = path.join(process.cwd(), 'src/data/traces');

export function getAllTraceFiles() {
  if (!fs.existsSync(tracesDir)) return [];
  
  return fs.readdirSync(tracesDir)
    .filter(f => f.endsWith('.json'))
    .map(filename => {
      const filepath = path.join(tracesDir, filename);
      const content = fs.readFileSync(filepath, 'utf-8');
      const trace: XRayTrace = JSON.parse(content);
      return { filename, trace };
    })
    .sort((a, b) => b.trace.timestamp - a.trace.timestamp);
}

export function getTraceByFilename(filename: string): { trace: XRayTrace; filename: string } | null {
  if (!filename || typeof filename !== 'string') return null;
  
  const filepath = path.join(tracesDir, filename);
  if (!fs.existsSync(filepath)) return null;
  
  const content = fs.readFileSync(filepath, 'utf-8');
  const trace: XRayTrace = JSON.parse(content);
  return { trace, filename };
}