import { tracer } from '../lib/xray';
import dummyProducts from '../../public/dummy-products.json';

interface Product {
  asin: string;
  title: string;
  price: number;
  rating: number;
  reviews: number;
}

const referenceProduct: Product = {
  asin: "REF001",
  title: "ProBrand Stainless Steel Water Bottle 32oz Insulated",
  price: 29.99,
  rating: 4.2,
  reviews: 1247
};

async function generateKeywords(product: Product) {
  const traceId = tracer.startTrace('keyword-service', 'keyword_generation', product);

  const keywords = [
    "stainless steel water bottle insulated",
    "vacuum insulated bottle 32oz",
    "metal water bottle 32oz"
  ];

  tracer.endTrace(
    traceId,
    'keyword-service',
    'keyword_generation',
    'success',
    keywords,
    {
      reasoning: "Extracted key attributes: material (stainless steel), capacity (32oz), feature (insulated)",
      model: "mock-gpt-4"
    },
    product 
  );

  return keywords;
}

async function searchCandidates(keywords: string[]) {
  const traceId = tracer.startTrace('search-service', 'candidate_search', { keywords });

  const candidates = dummyProducts as Product[];

  tracer.endTrace(
    traceId,
    'search-service',
    'candidate_search',
    'success',
    candidates,
    {
      reasoning: `Mock search for keywords: ${keywords.join(', ')}. Returned ${candidates.length} candidate products.`,
      total_results_simulated: 2847,
      candidates_fetched: candidates.length
    },
    { keywords }
  );

  return candidates;
}

async function filterAndRank(candidates: Product[]) {
  const traceId = tracer.startTrace('ranking-service', 'filter_and_rank', {
    reference_product: referenceProduct,
    candidates_count: candidates.length
  });

  const minPrice = referenceProduct.price * 0.5;
  const maxPrice = referenceProduct.price * 2;

  const evaluations = candidates.map(candidate => {
    const pricePassed = candidate.price >= minPrice && candidate.price <= maxPrice;
    const ratingPassed = candidate.rating >= 3.8;
    const reviewsPassed = candidate.reviews >= 100;

    return {
      ...candidate,
      passed: pricePassed && ratingPassed && reviewsPassed,
      details: {
        price: { passed: pricePassed, actual: candidate.price, range: [minPrice, maxPrice] },
        rating: { passed: ratingPassed, actual: candidate.rating, threshold: 3.8 },
        reviews: { passed: reviewsPassed, actual: candidate.reviews, threshold: 100 }
      }
    };
  });

  const qualified = evaluations.filter(e => e.passed);

  let selected: any = null;
  let reasoning = "";

  if (qualified.length === 0) {
    reasoning = "No candidates passed all filters — filters were too strict given the reference price.";
    selected = { fallback: true, message: "No competitor found" };
  } else {
    qualified.sort((a, b) => b.reviews - a.reviews || b.rating - a.rating);
    selected = qualified[0];
    reasoning = `Selected "${selected.title}" — highest review count (${selected.reviews}) among ${qualified.length} qualified candidates.`;
  }

  const status = qualified.length === 0 ? 'warning' : 'success';

  tracer.endTrace(
    traceId,
    'ranking-service',
    'filter_and_rank',
    status,
    selected,
    {
      reasoning,
      filters_applied: {
        price_range: { min: minPrice, max: maxPrice },
        min_rating: 3.8,
        min_reviews: 100
      },
      evaluations,
      qualified_count: qualified.length
    },
    {
      reference_product: referenceProduct,
      candidates_count: candidates.length
    }
  );

  return selected;
}

export async function runPipeline(isBadRun: boolean = false) {
  const originalPrice = referenceProduct.price;
  if (isBadRun) {
    referenceProduct.price = 3.00; // Making filters too strict - range becomes [1.5, 4.5]
  }

  console.log(`\n=== Starting ${isBadRun ? 'BAD (no competitor found)' : 'GOOD'} run ===`);

  const keywords = await generateKeywords(referenceProduct);
  const candidates = await searchCandidates(keywords);
  const finalResult = await filterAndRank(candidates);

  referenceProduct.price = originalPrice; // restore

  console.log("Final result:", finalResult);
}

// Run both scenarios
async function main() {
  tracer.clearAllTraces(); // Fresh start

  await runPipeline(false); // Good run
  await runPipeline(true);  // Bad run
}

main().catch(console.error);