/**
 * Parser configuration - synchronized with API /parsers endpoint
 * Maps MCP tool IDs to A-Parser internal names
 * 
 * IMPORTANT: This file should match the real parsers from redis.ayga.tech/parsers
 * Last updated: 2026-01-19
 */

export interface ParserConfig {
    id: string;
    name: string;
    category: string;
    description: string;
    aparserName: string;
}

export const PARSERS: ParserConfig[] = [
    // FreeAI (6 parsers) - AI Chat and Research
    {
        id: "perplexity",
        name: "Perplexity AI",
        category: "FreeAI",
        description: "Research with Perplexity AI - comprehensive answers with sources",
        aparserName: "FreeAI::Perplexity"
    },
    {
        id: "googleai",
        name: "Google AI Mode",
        category: "FreeAI",
        description: "Google AI-powered search with structured sources",
        aparserName: "FreeAI::GoogleAI"
    },
    {
        id: "chatgpt",
        name: "ChatGPT",
        category: "FreeAI",
        description: "ChatGPT conversational AI with sources and images",
        aparserName: "FreeAI::ChatGPT"
    },
    {
        id: "kimi",
        name: "Kimi AI",
        category: "FreeAI",
        description: "Kimi AI for translations, explanations, summaries",
        aparserName: "FreeAI::Kimi"
    },
    {
        id: "deepai",
        name: "Deep AI",
        category: "FreeAI",
        description: "Deep AI with poems, stories, math, and code assistance",
        aparserName: "FreeAI::DeepAI"
    },
    {
        id: "copilot",
        name: "Microsoft Copilot",
        category: "FreeAI",
        description: "Microsoft Copilot for code and technical documentation",
        aparserName: "FreeAI::Copilot"
    },

    // Net (1 parser)
    {
        id: "http",
        name: "HTTP Fetcher",
        category: "Net",
        description: "Fetch raw content from publicly accessible URLs",
        aparserName: "Net::HTTP"
    },

    // YouTube (6 parsers)
    {
        id: "youtube_video",
        name: "YouTube Video",
        category: "YouTube",
        description: "Parse YouTube video metadata, subtitles, comments",
        aparserName: "SE::YouTube::Video"
    },
    {
        id: "youtube_search",
        name: "YouTube Search",
        category: "YouTube",
        description: "Search YouTube videos by keywords",
        aparserName: "SE::YouTube"
    },
    {
        id: "youtube_suggest",
        name: "YouTube Suggestions",
        category: "YouTube",
        description: "Get search suggestions/autocomplete for keywords",
        aparserName: "SE::YouTube::Suggest"
    },
    {
        id: "youtube_channel_videos",
        name: "YouTube Channel Videos",
        category: "YouTube",
        description: "Collect all videos from a YouTube channel",
        aparserName: "JS::Example::Youtube::Channel::Videos"
    },
    {
        id: "youtube_channel_about",
        name: "YouTube Channel About",
        category: "YouTube",
        description: "Parse channel information from About page",
        aparserName: "Net::HTTP"
    },
    {
        id: "youtube_comments",
        name: "YouTube Comments",
        category: "YouTube",
        description: "Parse comments from YouTube videos",
        aparserName: "JS::Example::Youtube::Comments"
    },

    // Social Media (9 parsers)
    {
        id: "telegram_group",
        name: "Telegram Group",
        category: "Social",
        description: "Parse messages and members from public Telegram groups",
        aparserName: "Telegram::GroupScraper"
    },
    {
        id: "reddit_posts",
        name: "Reddit Posts",
        category: "Social",
        description: "Parse posts from Reddit by keywords or communities",
        aparserName: "Reddit::Posts"
    },
    {
        id: "reddit_post_info",
        name: "Reddit Post Info",
        category: "Social",
        description: "Parse detailed information about a specific Reddit post",
        aparserName: "Reddit::PostInfo"
    },
    {
        id: "reddit_comments",
        name: "Reddit Comments",
        category: "Social",
        description: "Parse comments from Reddit by keyword or community",
        aparserName: "Reddit::Comments"
    },
    {
        id: "instagram_profile",
        name: "Instagram Profile",
        category: "Social",
        description: "Parse Instagram profile data: posts, followers, bio",
        aparserName: "Social::Instagram::Profile"
    },
    {
        id: "instagram_post",
        name: "Instagram Post",
        category: "Social",
        description: "Parse Instagram post data: likes, comments, caption",
        aparserName: "Social::Instagram::Post"
    },
    {
        id: "instagram_tag",
        name: "Instagram Tag",
        category: "Social",
        description: "Parse posts by hashtag from Instagram",
        aparserName: "Social::Instagram::Tag"
    },
    {
        id: "instagram_geo",
        name: "Instagram Geo",
        category: "Social",
        description: "Parse Instagram posts by location/geotag",
        aparserName: "Social::Instagram::Geo"
    },
    {
        id: "instagram_search",
        name: "Instagram Search",
        category: "Social",
        description: "Search Instagram: profiles, hashtags, locations",
        aparserName: "Social::Instagram::Search"
    },
    {
        id: "tiktok_profile",
        name: "TikTok Profile",
        category: "Social",
        description: "Parse TikTok profile data: videos, followers, bio",
        aparserName: "Social::TikTok::Profile"
    },

    // Translation (4 parsers)
    {
        id: "google_translate",
        name: "Google Translate",
        category: "Translation",
        description: "Fast translation with transliteration and alternatives",
        aparserName: "SE::Google::Translate"
    },
    {
        id: "deepl_translate",
        name: "DeepL Translator",
        category: "Translation",
        description: "High-quality translation via DeepL",
        aparserName: "DeepL::Translator"
    },
    {
        id: "bing_translate",
        name: "Bing Translator",
        category: "Translation",
        description: "Reliable translation via Bing Translator",
        aparserName: "SE::Bing::Translator"
    },
    {
        id: "yandex_translate",
        name: "Yandex Translate",
        category: "Translation",
        description: "Fast translation via Yandex with captcha bypass",
        aparserName: "SE::Yandex::Translate"
    },

    // Search Engines (8 parsers)
    {
        id: "google_search",
        name: "Google Search",
        category: "SE",
        description: "Google web search results with all operators",
        aparserName: "SE::Google"
    },
    {
        id: "yandex_search",
        name: "Yandex Search",
        category: "SE",
        description: "Yandex search with captcha bypass",
        aparserName: "SE::Yandex"
    },
    {
        id: "bing_search",
        name: "Bing Search",
        category: "SE",
        description: "Bing search results up to 200 pages",
        aparserName: "SE::Bing"
    },
    {
        id: "duckduckgo_search",
        name: "DuckDuckGo Search",
        category: "SE",
        description: "Privacy-focused DuckDuckGo search",
        aparserName: "SE::DuckDuckGo"
    },
    {
        id: "baidu_search",
        name: "Baidu Search",
        category: "SE",
        description: "Chinese search engine Baidu",
        aparserName: "SE::Baidu"
    },
    {
        id: "yahoo_search",
        name: "Yahoo Search",
        category: "SE",
        description: "Yahoo search results",
        aparserName: "SE::Yahoo"
    },
    {
        id: "rambler_search",
        name: "Rambler Search",
        category: "SE",
        description: "Russian search engine Rambler",
        aparserName: "SE::Rambler"
    },
    {
        id: "you_search",
        name: "You.com Search",
        category: "SE",
        description: "You.com AI-powered search",
        aparserName: "SE::You"
    },

    // Content Extraction (3 parsers)
    {
        id: "article_extractor",
        name: "Article Extractor",
        category: "Content",
        description: "Extract articles using Mozilla Readability",
        aparserName: "HTML::ArticleExtractor"
    },
    {
        id: "text_extractor",
        name: "Text Extractor",
        category: "Content",
        description: "Parse text blocks from web pages",
        aparserName: "HTML::TextExtractor"
    },
    {
        id: "link_extractor",
        name: "Link Extractor",
        category: "Content",
        description: "Extract all links from HTML pages",
        aparserName: "HTML::LinkExtractor"
    },

    // Analytics (1 parser)
    {
        id: "google_trends",
        name: "Google Trends",
        category: "Analytics",
        description: "Parse trending keywords from Google Trends",
        aparserName: "SE::Google::Trends"
    },

    // Visual (1 parser)
    {
        id: "pinterest_search",
        name: "Pinterest Search",
        category: "Visual",
        description: "Parse Pinterest search results: images, titles",
        aparserName: "SE::Pinterest"
    },
];

export function getParserById(id: string): ParserConfig | undefined {
    return PARSERS.find(p => p.id === id);
}

export function getParserByAParserName(name: string): ParserConfig | undefined {
    return PARSERS.find(p => p.aparserName === name);
}

export function getParsersByCategory(category: string): ParserConfig[] {
    return PARSERS.filter(p => p.category === category);
}

export function getAllCategories(): string[] {
    return [...new Set(PARSERS.map(p => p.category))];
}
