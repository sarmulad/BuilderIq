import * as cheerio from "cheerio"

export interface RawIncentive {
  builder: string
  raw_text: string
  source_url: string
  community?: string
  city?: string
}

export class BaseScraper {
  protected builderName: string
  protected baseUrl: string
  protected timeout = 20000

  constructor(builderName: string, baseUrl: string) {
    this.builderName = builderName
    this.baseUrl = baseUrl
  }

  protected async fetch(url: string): Promise<string> {
    try {
      const response = await fetch(url, {
        timeout: this.timeout,
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        },
      })
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      return await response.text()
    } catch (error) {
      console.error(`[v0] Failed to fetch ${url}:`, error)
      throw error
    }
  }

  protected parseHtml(html: string) {
    return cheerio.load(html)
  }

  async scrape(): Promise<RawIncentive[]> {
    throw new Error("scrape() must be implemented by subclass")
  }
}
