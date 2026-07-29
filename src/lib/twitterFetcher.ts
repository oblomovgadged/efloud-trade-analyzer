const TWITTERAPI_BASE = 'https://api.twitterapi.io/twitter/user/last_tweets';
const NITTER_INSTANCES = [
  'https://nitter.privacydev.net',
  'https://nitter.poast.org',
  'https://nitter.cz',
];

export interface FetchedTweet {
  tweetId: string;
  tweetUrl: string;
  tweetText: string;
  imageUrls: string[];
  tweetDate: string;
  authorUsername: string;
  source: 'twitterapi' | 'nitter';
}

// PRIMARY: TwitterAPI.io
async function fetchViaTwitterApi(username: string): Promise<FetchedTweet[]> {
  const apiKey = process.env.TWITTER_API_KEY;
  if (!apiKey) throw new Error('TWITTER_API_KEY not configured');

  const url = `${TWITTERAPI_BASE}?userName=${encodeURIComponent(username)}`;
  const response = await fetch(url, {
    headers: { 'X-API-Key': apiKey },
  });

  if (!response.ok) {
    throw new Error(`TwitterAPI.io returned ${response.status}: ${response.statusText}`);
  }

  const data = await response.json();
  const tweets = data.tweets || data.data || [];

  return tweets
    .filter((t: any) => {
      // Only tweets with image media
      const media = t.extendedEntities?.media || t.media || t.entities?.media || [];
      return media.some((m: any) => m.type === 'photo' || (m.media_url_https && !m.video_info));
    })
    .map((t: any) => {
      const media = t.extendedEntities?.media || t.media || t.entities?.media || [];
      const imageUrls = media
        .filter((m: any) => m.type === 'photo' || (m.media_url_https && !m.video_info))
        .map((m: any) => m.media_url_https || m.url || m.media_url);

      return {
        tweetId: t.id || t.id_str || String(t.tweetId || ''),
        tweetUrl: `https://x.com/${username}/status/${t.id || t.id_str || t.tweetId || ''}`,
        tweetText: t.text || t.full_text || t.rawContent || '',
        imageUrls,
        tweetDate: t.created_at || t.createdAt || new Date().toISOString(),
        authorUsername: username,
        source: 'twitterapi' as const,
      };
    });
}

// FALLBACK: Nitter RSS
async function fetchViaNitter(username: string): Promise<FetchedTweet[]> {
  for (const instance of NITTER_INSTANCES) {
    try {
      const rssUrl = `${instance}/${username}/rss`;
      const response = await fetch(rssUrl, { signal: AbortSignal.timeout(8000) });
      if (!response.ok) continue;

      const xml = await response.text();
      // Simple RSS XML parsing
      const items = xml.match(/<item>[\s\S]*?<\/item>/g) || [];
      
      const results: FetchedTweet[] = [];
      for (const item of items) {
        const titleMatch = item.match(/<title><!\[CDATA\[([\s\S]*?)\]\]><\/title>/) || item.match(/<title>([\s\S]*?)<\/title>/);
        const descMatch = item.match(/<description><!\[CDATA\[([\s\S]*?)\]\]><\/description>/) || item.match(/<description>([\s\S]*?)<\/description>/);
        const linkMatch = item.match(/<link>([\s\S]*?)<\/link>/);
        const dateMatch = item.match(/<pubDate>([\s\S]*?)<\/pubDate>/);

        const description = descMatch?.[1] || '';
        // Find image URLs in description HTML
        const imgMatches = description.match(/src="(https:\/\/[^"]+\.(jpg|jpeg|png|webp)[^"]*)"/gi) || [];
        const imageUrls = imgMatches.map((m: string) => {
          const urlMatch = m.match(/src="([^"]+)"/);
          return urlMatch?.[1] || '';
        }).filter(Boolean);

        if (imageUrls.length === 0) continue; // Only chart tweets

        const tweetUrl = linkMatch?.[1] || '';
        const tweetIdMatch = tweetUrl.match(/status\/(\d+)/);

        results.push({
          tweetId: tweetIdMatch?.[1] || '',
          tweetUrl: tweetUrl.replace(instance, 'https://x.com'),
          tweetText: (titleMatch?.[1] || '').replace(/<[^>]+>/g, '').trim(),
          imageUrls,
          tweetDate: dateMatch?.[1] || new Date().toISOString(),
          authorUsername: username,
          source: 'nitter' as const,
        });
      }
      if (results.length > 0) return results;
    } catch (err) {
      console.warn(`Nitter instance ${instance} failed:`, err);
      continue;
    }
  }
  return [];
}

// MAIN EXPORT: Fetch latest chart tweet with fallback
export async function fetchLatestChartTweet(username: string): Promise<FetchedTweet | null> {
  // Clean username
  const cleanUsername = username.replace(/^@/, '').trim();
  
  // Try TwitterAPI.io first
  try {
    const tweets = await fetchViaTwitterApi(cleanUsername);
    if (tweets.length > 0) return tweets[0];
  } catch (err) {
    console.warn('TwitterAPI.io failed, trying Nitter fallback:', err);
  }

  // Fallback to Nitter RSS
  try {
    const tweets = await fetchViaNitter(cleanUsername);
    if (tweets.length > 0) return tweets[0];
  } catch (err) {
    console.warn('Nitter fallback also failed:', err);
  }

  return null;
}

export async function fetchAllChartTweets(username: string): Promise<FetchedTweet[]> {
  const cleanUsername = username.replace(/^@/, '').trim();
  
  try {
    const tweets = await fetchViaTwitterApi(cleanUsername);
    if (tweets.length > 0) return tweets;
  } catch (err) {
    console.warn('TwitterAPI.io failed:', err);
  }

  try {
    return await fetchViaNitter(cleanUsername);
  } catch {
    return [];
  }
}
