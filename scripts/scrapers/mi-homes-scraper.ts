import { BaseScraper, type RawIncentive } from "./base-scraper"

export class MIHomesScraper extends BaseScraper {
  constructor() {
    super("M/I Homes", "https://www.mihomes.com")
  }

  async scrape(): Promise<RawIncentive[]> {
    const items: RawIncentive[] = []

    try {
      const html = await this.fetch(`${this.baseUrl}/new-homes-for-sale`)
      const $ = this.parseHtml(html)

      $('[data-incentive], [class*="promotion"], [class*="special"]').each((_, el) => {
        const element = $(el)
        const raw_text = element.text().trim()
        const source_url = element.find("a").attr("href") || `${this.baseUrl}/new-homes-for-sale`

        if (raw_text.length > 20) {
          items.push({
            builder: "M/I Homes",
            raw_text,
            source_url: new URL(source_url, this.baseUrl).toString(),
          })
        }
      })

      console.log(`[v0] M/I Homes scraper found ${items.length} items`)
      return items
    } catch (error) {
      console.error("[v0] M/I Homes scraper error:", error)
      return items
    }
  }
}
