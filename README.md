# X-Ray Debugging System

**An advanced tracing and visualization platform for debugging multi-step algorithmic decision processes**

[![Next.js](https://img.shields.io/badge/Next.js-16.1.1-black.svg)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19.2.3-blue.svg)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-blue.svg)](https://tailwindcss.com/)

## 🎯 Problem Statement

Modern software systems increasingly rely on complex, multi-step, non-deterministic processes. Think of an e-commerce competitor selection pipeline:

1. 🤖 **LLM generates search keywords** from product descriptions (non-deterministic)
2. 🔍 **Search API returns thousands** of candidate products (large result sets)
3. 📊 **Business rules filter** candidates (complex logic)
4. 🧠 **Ranking algorithm selects** the final output (algorithmic decisions)

When the final output is wrong, traditional logging tells you *what* happened, but not *why* specific decisions were made. You're left reverse-engineering the entire pipeline.

**X-Ray answers the critical question: "Why did the system make this decision?"**

## 🚀 Solution Overview

This X-Ray system provides complete transparency into multi-step decision processes through:

### 📚 **X-Ray Library/SDK**
- Lightweight wrapper for capturing decision context at each step
- Records inputs, candidates, filters applied, outcomes, and *reasoning*
- General-purpose design (not tied to specific domains)
- Easy integration with existing codebases

### 📊 **Dashboard UI**
- Visualizes complete decision trails for executions
- Shows each step with inputs, outputs, and decision reasoning
- Makes it easy to identify where things went wrong
- Responsive design with dark mode support

### 🎮 **Demo Application**
- Multi-step competitor product selection workflow
- Simulates real-world scenarios with good/bad outcomes
- Uses mock data to demonstrate system capabilities

## 🛠 Tech Stack

- **Frontend**: Next.js 16.1.1 with App Router, React 19.2.3
- **Styling**: Tailwind CSS 4 with Radix UI components
- **Language**: TypeScript for full type safety
- **Build Tool**: Turbopack for fast development
- **State Management**: File-based trace storage (JSON)
- **UI Components**: Custom accordion, cards, badges, and tables

## 📦 Installation & Setup

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Quick Start

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd xray-assignment
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Generate demo data**
   ```bash
   npm run demo
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   ```
   http://localhost:8080
   ```

### Available Scripts

```bash
npm run dev          # Start development server on port 8080
npm run build        # Build for production
npm run start        # Start production server
npm run demo         # Generate demo trace data
npm run lint         # Run ESLint
```

## 🏗 Architecture

### Core Components

```
src/
├── lib/
│   ├── xray.ts          # Core X-Ray SDK for trace collection
│   ├── traces.ts        # Trace file management and reading
│   └── utils.ts         # Utility functions
├── app/
│   ├── page.tsx         # Dashboard home page
│   └── trace/
│       └── [filename]/
│           └── page.tsx # Detailed trace visualization
├── components/
│   ├── StepAccordion.tsx    # Expandable step details
│   ├── StatusBadge.tsx      # Status indicators
│   ├── TraceList.tsx        # Trace file listing
│   └── ui/              # Reusable UI components
├── data/traces/         # JSON trace files
└── demo/
    └── pipeline.ts      # Demo pipeline implementation
```

### X-Ray SDK Usage

```typescript
import { createXRayTracer } from '@/lib/xray';

const tracer = createXRayTracer('competitor-selection');

// Trace a decision step
const trace = tracer.step('keyword-generation')
  .input({ productTitle: "Water Bottle", category: "Sports" })
  .reasoning("Generated keywords based on product attributes")
  .output({ keywords: ["water bottle", "sports bottle"] })
  .complete();

// Save trace data
await tracer.save();
```

## 🎯 Demo Application

The demo implements a **Competitor Product Selection Pipeline** with three key steps:

### Step 1: Keyword Generation 🤖
- **Input**: Product title and category
- **Process**: Simulated LLM keyword extraction
- **Output**: Relevant search keywords
- **Tracing**: Captures reasoning for keyword selection

### Step 2: Candidate Search 🔍
- **Input**: Generated keywords
- **Process**: Mock product search API
- **Output**: List of potential competitor products
- **Tracing**: Records search results and filtering

### Step 3: Filter & Rank 📊
- **Input**: Candidate products + reference product
- **Process**: Apply business rules (price, rating, reviews)
- **Output**: Selected best competitor or failure
- **Tracing**: Detailed filter evaluation and ranking logic

### Demo Scenarios

**✅ Good Run**: Normal reference price ($15+) → successful competitor found  
**⚠️ Bad Run**: Low reference price (<$1) → no qualifying competitors

## 🔍 Dashboard Features

### Main Dashboard
- **Run Overview**: Quick status of good vs bad pipeline executions
- **Statistics**: Total traces, success rate, failure analysis
- **Navigation**: Direct links to detailed trace analysis

### Trace Detail View
- **Step-by-step Breakdown**: Accordion interface for each pipeline step
- **Decision Context**: Input data, applied filters, and reasoning
- **Candidate Analysis**: Visual cards showing evaluated options
- **Failure Diagnosis**: Clear indicators of where problems occurred

### Key UI Features
- 🌙 **Dark Mode Support**
- 📱 **Responsive Design**
- ⚡ **Fast Navigation**
- 🎨 **Clean Visual Hierarchy**
- 🔄 **Real-time Updates**

## 📈 What Makes This Different

| Aspect | Traditional Tracing | X-Ray Debugging |
|--------|---------------------|-----------------|
| **Focus** | Performance & flow | Decision reasoning |
| **Data Captured** | Spans, timing, service calls | Candidates, filters, selection logic |
| **Question Answered** | "What happened?" | "Why this output?" |
| **Granularity** | Function/service level | Business logic level |
| **Use Case** | Performance debugging | Decision debugging |

## 📊 Example X-Ray Output

```json
{
  "step": "apply_filters",
  "input": {
    "candidates_count": 50,
    "reference_product": {
      "title": "Water Bottle",
      "price": 29.99
    }
  },
  "filters_applied": {
    "price_range": {"min": 14.99, "max": 59.98},
    "min_rating": {"value": 3.8}
  },
  "evaluations": [
    {
      "title": "HydroFlask 32oz",
      "metrics": {"price": 44.99, "rating": 4.5},
      "qualified": true,
      "reasoning": "Passed all filters"
    }
  ],
  "reasoning": "Applied filters reduced 50 candidates to 12 qualified"
}
```

## 🚧 Known Limitations & Future Improvements

### Current Limitations
- **Static Data**: Uses file-based storage instead of database
- **No Authentication**: Public access to all traces
- **Limited Filtering**: Basic trace filtering capabilities
- **Mock Data**: Demo uses simulated API responses
- **Single Pipeline**: Only demonstrates one use case

### Planned Improvements
- **Database Integration**: PostgreSQL/MongoDB for production scale
- **Real-time Streaming**: Live trace updates via WebSockets
- **Advanced Analytics**: Aggregated metrics and trend analysis
- **Multi-tenant Support**: Isolated environments per organization
- **Plugin Architecture**: Custom step types and visualizations
- **API Integration**: Connect to real product search APIs
- **Export Features**: PDF reports and data export
- **Alerting System**: Notifications for pipeline failures

## 🎥 Video Walkthrough

**Duration**: 5-10 minutes  
**Platform**: Loom/YouTube (unlisted)  
**Content Coverage**:
- System architecture and design decisions
- Dashboard demonstration with good/bad scenarios
- X-Ray SDK integration examples
- Trade-offs and improvement opportunities
- Code walkthrough of key components

## 📝 Submission Checklist

### Required Deliverables ✅

1. **✅ X-Ray Library/SDK** (`src/lib/xray.ts`)
   - Lightweight wrapper for decision tracing
   - General-purpose, domain-agnostic design
   - Clean integration API

2. **✅ Dashboard UI** (`src/app/` + `src/components/`)
   - Visualizes complete decision trails
   - Interactive step-by-step breakdown
   - Clear failure diagnosis

3. **✅ Demo Application** (`src/demo/pipeline.ts`)
   - Multi-step competitor selection workflow
   - Good/bad scenario demonstrations
   - Mock data integration

4. **✅ Video Walkthrough**
   - System demonstration
   - Design decision explanations
   - Future improvement discussions

### Submission Requirements

1. **GitHub Repository**: Push code to public repository
2. **README.md**: This comprehensive setup and explanation document
3. **Video Upload**: Loom/YouTube unlisted link
4. **Contact**: Send repository and video links

## 🤝 Development Philosophy

This project embraces **AI-assisted development** for:
- Architecture brainstorming and design discussions
- Code generation and optimization
- Problem-solving and rubber duck debugging
- Documentation and explanation refinement

Every component has been thoughtfully designed and thoroughly understood, leveraging AI as a powerful development accelerator rather than a replacement for engineering judgment.

## 📞 Support & Questions

For any questions about setup, architecture decisions, or implementation details, please refer to the video walkthrough or reach out directly.

---

**Built with ❤️ for transparent algorithmic decision making**
