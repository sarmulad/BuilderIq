import { BaseScraper, type RawIncentive } from "./base-scraper"

export class DRHortonScraper extends BaseScraper {
  constructor() {
    super("D.R. Horton", "https://www.drhorton.com")
  }

  async scrape(): Promise<RawIncentive[]> {
    const items: RawIncentive[] = []

    try {
      // Scrape incentives page
      const incentivesHtml = await this.fetch(`${this.baseUrl}/incentives`)
      const $ = this.parseHtml(incentivesHtml)

      // Example selectors - adjust based on actual D.R. Horton HTML structure
      $('[data-incentive-block], .incentive-card, [class*="incentive"]').each((_, el) => {
        const element = $(el)
        const raw_text = element.text().trim()
        const source_url = element.find("a").attr("href") || `${this.baseUrl}/incentives`

        if (raw_text.length > 20) {
          items.push({
            builder: "D.R. Horton",
            raw_text,
            source_url: new URL(source_url, this.baseUrl).toString(),
          })
        }
      })

      // Scrape quick-move-in homes
      const qmiHtml = await this.fetch(`${this.baseUrl}/quick-move-in`)
      const $qmi = this.parseHtml(qmiHtml)

      $qmi("[data-qmi-home], .qmi-listing").each((_, el) => {
        const element = $qmi(el)
        const raw_text = element.text().trim()

        if (raw_text.length > 20) {
          items.push({
            builder: "D.R. Horton",
            raw_text,
            source_url: `${this.baseUrl}/quick-move-in`,
            community: element.find("[data-community]").attr("data-community"),
            city: element.find("[data-city]").attr("data-city"),
          })
        }
      })

      console.log(`[v0] D.R. Horton scraper found ${items.length} items`)
      return items
    } catch (error) {
      console.error("[v0] D.R. Horton scraper error:", error)
      return items
    }
  }
}
