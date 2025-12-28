import fs from 'fs';
import path from 'path';

export interface XRayTrace {
  id: string;
  timestamp: number;
  duration: number;
  service: string;
  operation: string;
  status: 'success' | 'error' | 'warning';
  input?: any;
  output?: any;
  metadata?: Record<string, any>;
}

class XRayTracer {
  private tracesDir = path.join(process.cwd(), 'src/data/traces');

  constructor() {
    // Ensure the traces directory exists
    if (!fs.existsSync(this.tracesDir)) {
      fs.mkdirSync(this.tracesDir, { recursive: true });
    }
  }

  startTrace(
    service: string,
    operation: string,
    input?: any
  ): string {
    const id = Math.random().toString(36).substr(2, 9);
    return id;
  }

  endTrace(
    id: string,
    service: string,
    operation: string,
    status: 'success' | 'error' | 'warning' = 'success',
    output?: any,
    metadata?: Record<string, any>,
    input?: any // optional, in case startTrace didn't capture it
  ) {
    const timestamp = Date.now();
    const trace: XRayTrace = {
      id,
      timestamp,
      duration: 0, // duration not critical for this demo, but kept for structure
      service,
      operation,
      status,
      input,
      output,
      metadata,
    };

    // Generate clean filename
    const safeOperation = operation.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    const filename = `${service}_${safeOperation}_${id}.json`;
    const filepath = path.join(this.tracesDir, filename);

    fs.writeFileSync(filepath, JSON.stringify(trace, null, 2));

    console.log(`✓ Trace saved: ${filename} (${status})`);
  }

  // Helper to get all saved traces (sorted newest first) — used by dashboard
  getSavedTraces(): { filename: string; trace: XRayTrace }[] {
    if (!fs.existsSync(this.tracesDir)) return [];

    return fs
      .readdirSync(this.tracesDir)
      .filter((f) => f.endsWith('.json'))
      .map((filename) => {
        const filepath = path.join(this.tracesDir, filename);
        const content = fs.readFileSync(filepath, 'utf-8');
        const trace = JSON.parse(content) as XRayTrace;
        return { filename, trace };
      })
      .sort((a, b) => b.trace.timestamp - a.trace.timestamp); // newest first
  }

  // Clear all saved trace files — useful for fresh runs
  clearAllTraces() {
    if (fs.existsSync(this.tracesDir)) {
      fs.readdirSync(this.tracesDir).forEach((file) => {
        fs.unlinkSync(path.join(this.tracesDir, file));
      });
      console.log('All previous traces cleared.');
    }
  }
}

export const tracer = new XRayTracer();