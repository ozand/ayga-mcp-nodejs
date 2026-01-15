/**
 * Parser configuration for all 40 parsers
 * Maps MCP tool names to A-Parser internal names
 */

export interface ParserConfig {
    id: string;
    name: string;
    category: string;
    description: string;
    aparserName: string;
}

export const PARSERS: ParserConfig[] = [
    // AI Chat (7 parsers)
    {
        id: "perplexity",
        name: "Perplexity AI",
        category: "AI Chat",
        description: "AI-powered search with sources and citations",
        aparserName: "FreeAI::Perplexity"
    },
    {
        id: "chatgpt",
        name: "ChatGPT",
        category: "AI Chat",
        description: "ChatGPT with web search capabilities",
        aparserName: "FreeAI::ChatGPT"
    },
    {
        id: "claude",
        name: "Claude AI",
        category: "AI Chat",
        description: "Anthropic Claude assistant",
        aparserName: "FreeAI::Claude"
    },
    {
        id: "gemini",
        name: "Google Gemini",
        category: "AI Chat",
        description: "Google Gemini AI assistant",
        aparserName: "FreeAI::Gemini"
    },
    {
        id: "copilot",
        name: "Microsoft Copilot",
        category: "AI Chat",
        description: "Microsoft Copilot with Bing integration",
        aparserName: "FreeAI::Copilot"
    },
    {
        id: "grok",
        name: "Grok AI",
        category: "AI Chat",
        description: "xAI Grok assistant",
        aparserName: "FreeAI::Grok"
    },
    {
        id: "deepseek",
        name: "DeepSeek",
        category: "AI Chat",
        description: "DeepSeek AI assistant",
        aparserName: "FreeAI::DeepSeek"
    },

    // Search Engines (3 parsers)
    {
        id: "google_search",
        name: "Google Search",
        category: "Search Engines",
        description: "Google web search results",
        aparserName: "Google::Search"
    },
    {
        id: "bing_search",
        name: "Bing Search",
        category: "Search Engines",
        description: "Bing web search results",
        aparserName: "Bing::Search"
    },
    {
        id: "duckduckgo",
        name: "DuckDuckGo",
        category: "Search Engines",
        description: "DuckDuckGo privacy-focused search",
        aparserName: "DuckDuckGo::Search"
    },

    // Social Media - Instagram (4 parsers)
    {
        id: "instagram_profile",
        name: "Instagram Profile",
        category: "Instagram",
        description: "Parse Instagram user profiles and posts",
        aparserName: "Instagram::Profile"
    },
    {
        id: "instagram_post",
        name: "Instagram Post",
        category: "Instagram",
        description: "Parse individual Instagram posts",
        aparserName: "Instagram::Post"
    },
    {
        id: "instagram_tag",
        name: "Instagram Tag",
        category: "Instagram",
        description: "Parse Instagram hashtag pages",
        aparserName: "Instagram::Tag"
    },
    {
        id: "instagram_geo",
        name: "Instagram Geo",
        category: "Instagram",
        description: "Parse Instagram location pages",
        aparserName: "Instagram::Geo"
    },

    // Social Media - TikTok (1 parser)
    {
        id: "tiktok_profile",
        name: "TikTok Profile",
        category: "TikTok",
        description: "Parse TikTok user profiles and videos",
        aparserName: "TikTok::Profile"
    },

    // YouTube (5 parsers)
    {
        id: "youtube_search",
        name: "YouTube Search",
        category: "YouTube",
        description: "Search YouTube videos",
        aparserName: "YouTube::Search"
    },
    {
        id: "youtube_video",
        name: "YouTube Video",
        category: "YouTube",
        description: "Parse YouTube video details",
        aparserName: "YouTube::Video"
    },
    {
        id: "youtube_comments",
        name: "YouTube Comments",
        category: "YouTube",
        description: "Parse YouTube video comments",
        aparserName: "YouTube::Comments"
    },
    {
        id: "youtube_channel_videos",
        name: "YouTube Channel Videos",
        category: "YouTube",
        description: "Get YouTube channel videos",
        aparserName: "YouTube::ChannelVideos"
    },
    {
        id: "youtube_channel_about",
        name: "YouTube Channel About",
        category: "YouTube",
        description: "Get YouTube channel information",
        aparserName: "YouTube::ChannelAbout"
    },

    // Google Trends (1 parser)
    {
        id: "google_trends",
        name: "Google Trends",
        category: "Google Trends",
        description: "Get Google Trends data for queries",
        aparserName: "Google::Trends"
    },

    // Pinterest (1 parser)
    {
        id: "pinterest_search",
        name: "Pinterest Search",
        category: "Pinterest",
        description: "Search Pinterest pins",
        aparserName: "Pinterest::Search"
    },

    // Reddit (2 parsers)
    {
        id: "reddit_posts",
        name: "Reddit Posts",
        category: "Reddit",
        description: "Search Reddit posts",
        aparserName: "Reddit::Posts"
    },
    {
        id: "reddit_comments",
        name: "Reddit Comments",
        category: "Reddit",
        description: "Get Reddit post comments",
        aparserName: "Reddit::Comments"
    },

    // Translation (3 parsers)
    {
        id: "google_translate",
        name: "Google Translate",
        category: "Translation",
        description: "Translate text using Google Translate",
        aparserName: "Google::Translate"
    },
    {
        id: "bing_translate",
        name: "Bing Translate",
        category: "Translation",
        description: "Translate text using Bing Translator",
        aparserName: "Bing::Translate"
    },
    {
        id: "yandex_translate",
        name: "Yandex Translate",
        category: "Translation",
        description: "Translate text using Yandex Translator",
        aparserName: "Yandex::Translate"
    },

    // HTML Content Extraction (3 parsers)
    {
        id: "link_extractor",
        name: "Link Extractor",
        category: "HTML Content",
        description: "Extract all links from web pages",
        aparserName: "HTML::LinkExtractor"
    },
    {
        id: "article_extractor",
        name: "Article Extractor",
        category: "HTML Content",
        description: "Extract article content using Mozilla Readability",
        aparserName: "HTML::ArticleExtractor"
    },
    {
        id: "text_extractor",
        name: "Text Extractor",
        category: "HTML Content",
        description: "Extract all text content from web pages",
        aparserName: "HTML::TextExtractor"
    },

    // Additional Search (6 parsers)
    {
        id: "yahoo_search",
        name: "Yahoo Search",
        category: "Search Engines",
        description: "Yahoo web search results",
        aparserName: "Yahoo::Search"
    },
    {
        id: "yandex_search",
        name: "Yandex Search",
        category: "Search Engines",
        description: "Yandex web search results",
        aparserName: "Yandex::Search"
    },
    {
        id: "baidu_search",
        name: "Baidu Search",
        category: "Search Engines",
        description: "Baidu web search results",
        aparserName: "Baidu::Search"
    },
    {
        id: "rambler_search",
        name: "Rambler Search",
        category: "Search Engines",
        description: "Rambler web search results",
        aparserName: "Rambler::Search"
    },
    {
        id: "you_search",
        name: "You.com Search",
        category: "Search Engines",
        description: "You.com AI-powered search",
        aparserName: "You::Search"
    },
    {
        id: "deepai",
        name: "DeepAI",
        category: "AI Chat",
        description: "DeepAI assistant",
        aparserName: "FreeAI::DeepAI"
    }
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
