import { BaseScraper, type RawIncentive } from "./base-scraper"

export class LennarScraper extends BaseScraper {
  constructor() {
    super("Lennar", "https://www.lennar.com")
  }

  async scrape(): Promise<RawIncentive[]> {
    const items: RawIncentive[] = []

    try {
      const html = await this.fetch(`${this.baseUrl}/new-homes`)
      const $ = this.parseHtml(html)

      // Lennar specific selectors
      $('[data-offers], [class*="offer"], [class*="incentive"]').each((_, el) => {
        const element = $(el)
        const raw_text = element.text().trim()
        const source_url = element.find("a").attr("href") || `${this.baseUrl}/new-homes`

        if (raw_text.length > 20) {
          items.push({
            builder: "Lennar",
            raw_text,
            source_url: new URL(source_url, this.baseUrl).toString(),
          })
        }
      })

      console.log(`[v0] Lennar scraper found ${items.length} items`)
      return items
    } catch (error) {
      console.error("[v0] Lennar scraper error:", error)
      return items
    }
  }
}
