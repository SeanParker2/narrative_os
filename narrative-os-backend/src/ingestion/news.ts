import Parser from 'rss-parser';

const parser = new Parser();

export interface NewsItem {
  title: string;
  summary: string;
  source: string;
  url?: string;
  timestamp?: Date;
}

async function fetchRSS(url: string, sourceName: string): Promise<NewsItem[]> {
  try {
    const feed = await parser.parseURL(url);
    return feed.items.map(item => ({
      title: item.title || 'No Title',
      summary: item.contentSnippet || item.content || '',
      source: sourceName,
      url: item.link,
      timestamp: item.pubDate ? new Date(item.pubDate) : new Date(),
    }));
  } catch (error) {
    console.error(`Error fetching RSS from ${sourceName} (${url}):`, error);
    return [];
  }
}

/**
 * Fetch news from 36kr
 */
export async function fetch36Kr(): Promise<NewsItem[]> {
  // 36Kr RSS Feed
  return fetchRSS('https://36kr.com/feed', '36kr');
}

/**
 * Fetch news from TechCrunch (replacing Cailianshe for demo stability)
 */
export async function fetchCailianshe(): Promise<NewsItem[]> {
  // Using TechCrunch as a stable tech news source for now
  return fetchRSS('https://techcrunch.com/feed/', 'TechCrunch');
}

/**
 * Fetch news from CoinDesk (replacing Sina Finance for crypto focus)
 */
export async function fetchSinaFinance(): Promise<NewsItem[]> {
  // Using CoinDesk for crypto narratives
  return fetchRSS('https://www.coindesk.com/arc/outboundfeeds/rss/', 'CoinDesk');
}
