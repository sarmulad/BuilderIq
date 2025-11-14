import { DRHortonScraper } from "./scrapers/dr-horton-scraper"
import { LennarScraper } from "./scrapers/lennar-scraper"
import { MIHomesScraper } from "./scrapers/mi-homes-scraper"
import { normalizeIncentives } from "./normalize-incentives"

const scrapers = [new DRHortonScraper(), new LennarScraper(), new MIHomesScraper()]

async function runAllScrapers() {
  console.log("[v0] Starting data ingestion pipeline...")

  try {
    let allRawItems = []

    // Run all scrapers in parallel
    const results = await Promise.allSettled(scrapers.map((scraper) => scraper.scrape()))

    for (const result of results) {
      if (result.status === "fulfilled") {
        allRawItems = allRawItems.concat(result.value)
      } else {
        console.error("[v0] Scraper failed:", result.reason)
      }
    }

    console.log(`[v0] Collected ${allRawItems.length} raw items from all builders`)

    // Normalize all items via AI
    const normalized = await normalizeIncentives(allRawItems)

    console.log(`[v0] Successfully normalized ${normalized.length} incentives`)
    return normalized
  } catch (error) {
    console.error("[v0] Pipeline error:", error)
    throw error
  }
}

// Execute if run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runAllScrapers()
    .then((data) => {
      console.log("[v0] Final data:", JSON.stringify(data, null, 2))
      process.exit(0)
    })
    .catch((err) => {
      console.error("[v0] Fatal error:", err)
      process.exit(1)
    })
}

export { runAllScrapers }
