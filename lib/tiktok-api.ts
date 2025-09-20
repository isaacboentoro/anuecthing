// TikTok API service
export interface TikTokVideo {
  id: string;
  title: string;
  desc: string;
  video: {
    duration: number;
    ratio: string;
    cover: string;
    dynamic_cover: string;
    origin_cover: string;
    play_addr: {
      uri: string;
      url_list: string[];
    };
  };
  author: {
    id: string;
    unique_id: string;
    nickname: string;
    avatar_thumb: {
      uri: string;
      url_list: string[];
    };
  };
  statistics: {
    comment_count: number;
    digg_count: number;
    download_count: number;
    play_count: number;
    share_count: number;
  };
  create_time: number;
  share_url: string;
}

export interface TikTokHashtag {
  hashtag_name: string;
  hashtag_id: string;
  view_count: number;
  is_commerce: boolean;
}

export interface TikTokApiResponse {
  data: TikTokVideo[];
  extra: {
    now: number;
    search_log_id: string;
  };
}

export interface TikTokTrendingResponse {
  hashtags: TikTokHashtag[];
  videos: TikTokVideo[];
}

// TikTok API configuration
const TIKTOK_API_BASE = process.env.NEXT_PUBLIC_TIKTOK_API_BASE || 'https://open.tiktokapis.com';
const TIKTOK_CLIENT_KEY = process.env.TIKTOK_CLIENT_KEY;
const TIKTOK_CLIENT_SECRET = process.env.TIKTOK_CLIENT_SECRET;
const TIKTOK_ACCESS_TOKEN = process.env.TIKTOK_ACCESS_TOKEN;

class TikTokApiService {
  private accessToken: string | null = null;
  private tokenExpiry: number = 0;

  private async getAccessToken(): Promise<string | null> {
    // If we have a valid token, return it
    if (this.accessToken && Date.now() < this.tokenExpiry) {
      return this.accessToken;
    }

    // If we have a pre-configured access token, use it
    if (TIKTOK_ACCESS_TOKEN) {
      this.accessToken = TIKTOK_ACCESS_TOKEN;
      this.tokenExpiry = Date.now() + (24 * 60 * 60 * 1000); // Assume 24h validity
      return this.accessToken;
    }

    // Otherwise, try to get a client credentials token
    if (!TIKTOK_CLIENT_KEY || !TIKTOK_CLIENT_SECRET) {
      console.warn('TikTok client credentials not configured. Using mock data.');
      return null;
    }

    try {
      const response = await fetch(`${TIKTOK_API_BASE}/v2/oauth/token/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          client_key: TIKTOK_CLIENT_KEY,
          client_secret: TIKTOK_CLIENT_SECRET,
          grant_type: 'client_credentials',
        }),
      });

      if (!response.ok) {
        throw new Error(`Token request failed: ${response.status}`);
      }

      const data = await response.json();
      this.accessToken = data.access_token;
      this.tokenExpiry = Date.now() + (data.expires_in * 1000);
      
      return this.accessToken;
    } catch (error) {
      console.error('Failed to get TikTok access token:', error);
      return null;
    }
  }

  private async makeRequest(endpoint: string, params: Record<string, string> = {}) {
    const accessToken = await this.getAccessToken();
    
    if (!accessToken) {
      console.warn('No TikTok access token available. Using mock data.');
      return this.getMockData(endpoint);
    }

    const url = new URL(endpoint, TIKTOK_API_BASE);
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });

    try {
      const response = await fetch(url.toString(), {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        // If token is invalid, clear it and try once more
        if (response.status === 401) {
          this.accessToken = null;
          this.tokenExpiry = 0;
          
          const newToken = await this.getAccessToken();
          if (newToken) {
            const retryResponse = await fetch(url.toString(), {
              headers: {
                'Authorization': `Bearer ${newToken}`,
                'Content-Type': 'application/json',
              },
            });
            
            if (retryResponse.ok) {
              return await retryResponse.json();
            }
          }
        }
        
        throw new Error(`TikTok API error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('TikTok API request failed:', error);
      return this.getMockData(endpoint);
    }
  }

  private getMockData(endpoint: string): TikTokTrendingResponse {
    // Real TikTok videos for development/demo
    const mockVideos: TikTokVideo[] = [
      {
        id: '7549110798036028694',
        title: 'District Court Witnessing',
        desc: 'Just so happen to be working right out side of district court today to witness this 🫠 #yungfilly #perthcbd',
        video: {
          duration: 32,
          ratio: '720p',
          cover: 'https://via.placeholder.com/300x400/1a1a1a/ffffff?text=Court+Witness',
          dynamic_cover: 'https://via.placeholder.com/300x400/1a1a1a/ffffff?text=Court+Witness',
          origin_cover: 'https://via.placeholder.com/300x400/1a1a1a/ffffff?text=Court+Witness',
          play_addr: {
            uri: '7549110798036028694',
            url_list: ['https://www.tiktok.com/@avatoulson/video/7549110798036028694']
          }
        },
        author: {
          id: 'avatoulson_id',
          unique_id: 'avatoulson',
          nickname: 'avatoulson',
          avatar_thumb: {
            uri: 'avatoulson_avatar',
            url_list: ['https://via.placeholder.com/50x50/ff6b6b/ffffff?text=AV']
          }
        },
        statistics: {
          comment_count: 847,
          digg_count: 12400,
          download_count: 234,
          play_count: 89500,
          share_count: 567
        },
        create_time: Date.now() - 3600000,
        share_url: 'https://www.tiktok.com/@avatoulson/video/7549110798036028694'
      },
      {
        id: '7550480059090390290',
        title: 'Cheesy Toastie',
        desc: 'So cheesy #cheese #toastie',
        video: {
          duration: 24,
          ratio: '720p',
          cover: 'https://via.placeholder.com/300x400/2ecc71/ffffff?text=Cheese+Toastie',
          dynamic_cover: 'https://via.placeholder.com/300x400/2ecc71/ffffff?text=Cheese+Toastie',
          origin_cover: 'https://via.placeholder.com/300x400/2ecc71/ffffff?text=Cheese+Toastie',
          play_addr: {
            uri: '7550480059090390290',
            url_list: ['https://www.tiktok.com/@j_top/video/7550480059090390290']
          }
        },
        author: {
          id: 'j_top_id',
          unique_id: 'j_top',
          nickname: 'J Top',
          avatar_thumb: {
            uri: 'j_top_avatar',
            url_list: ['https://via.placeholder.com/50x50/2ecc71/ffffff?text=JT']
          }
        },
        statistics: {
          comment_count: 1230,
          digg_count: 45600,
          download_count: 890,
          play_count: 156000,
          share_count: 2340
        },
        create_time: Date.now() - 7200000,
        share_url: 'https://www.tiktok.com/@j_top/video/7550480059090390290'
      },
      {
        id: '7550555019594960149',
        title: 'iOS 26 Update Review',
        desc: 'ios 26 looks SOOOO ahh 🫩🥀💔 i\'m gonna stay on 18 as long as possible #iphone #newupdate #newfeature #yikes #ihateit',
        video: {
          duration: 41,
          ratio: '720p',
          cover: 'https://via.placeholder.com/300x400/3498db/ffffff?text=iOS+26+Review',
          dynamic_cover: 'https://via.placeholder.com/300x400/3498db/ffffff?text=iOS+26+Review',
          origin_cover: 'https://via.placeholder.com/300x400/3498db/ffffff?text=iOS+26+Review',
          play_addr: {
            uri: '7550555019594960149',
            url_list: ['https://www.tiktok.com/@ebayscam/video/7550555019594960149']
          }
        },
        author: {
          id: 'ebayscam_id',
          unique_id: 'ebayscam',
          nickname: 'ebayscam',
          avatar_thumb: {
            uri: 'ebayscam_avatar',
            url_list: ['https://via.placeholder.com/50x50/3498db/ffffff?text=ES']
          }
        },
        statistics: {
          comment_count: 2340,
          digg_count: 78900,
          download_count: 1560,
          play_count: 234000,
          share_count: 4560
        },
        create_time: Date.now() - 10800000,
        share_url: 'https://www.tiktok.com/@ebayscam/video/7550555019594960149'
      }
    ];

    const mockHashtags: TikTokHashtag[] = [
      { hashtag_name: 'yungfilly', hashtag_id: '1', view_count: 45600000, is_commerce: false },
      { hashtag_name: 'perthcbd', hashtag_id: '2', view_count: 12300000, is_commerce: false },
      { hashtag_name: 'cheese', hashtag_id: '3', view_count: 890000000, is_commerce: true },
      { hashtag_name: 'toastie', hashtag_id: '4', view_count: 156000000, is_commerce: true },
      { hashtag_name: 'iphone', hashtag_id: '5', view_count: 2800000000, is_commerce: true },
      { hashtag_name: 'newupdate', hashtag_id: '6', view_count: 340000000, is_commerce: false },
      { hashtag_name: 'newfeature', hashtag_id: '7', view_count: 290000000, is_commerce: false },
      { hashtag_name: 'yikes', hashtag_id: '8', view_count: 678000000, is_commerce: false },
      { hashtag_name: 'ihateit', hashtag_id: '9', view_count: 123000000, is_commerce: false },
      { hashtag_name: 'fyp', hashtag_id: '10', view_count: 5200000000, is_commerce: false },
      { hashtag_name: 'viral', hashtag_id: '11', view_count: 3400000000, is_commerce: false },
      { hashtag_name: 'trending', hashtag_id: '12', view_count: 1800000000, is_commerce: false },
      { hashtag_name: 'food', hashtag_id: '13', view_count: 1200000000, is_commerce: true },
      { hashtag_name: 'tech', hashtag_id: '14', view_count: 980000000, is_commerce: true },
      { hashtag_name: 'cooking', hashtag_id: '15', view_count: 750000000, is_commerce: true }
    ];

    return {
      hashtags: mockHashtags,
      videos: mockVideos
    };
  }

  async getTrendingVideos(count: number = 10): Promise<TikTokVideo[]> {
    const response = await this.makeRequest('/v2/research/trending/videos/', {
      count: count.toString(),
      region_code: 'US'
    });
    return response.data?.videos || [];
  }

  async getTrendingHashtags(count: number = 20): Promise<TikTokHashtag[]> {
    const response = await this.makeRequest('/v2/research/trending/hashtags/', {
      count: count.toString(),
      region_code: 'US'
    });
    return response.data?.hashtags || [];
  }

  async searchVideos(query: string, count: number = 10): Promise<TikTokVideo[]> {
    const response = await this.makeRequest('/v2/research/video/query/', {
      query,
      max_count: count.toString(),
      search_id: Date.now().toString()
    });
    return response.data?.videos || [];
  }

  async getTrendingContent(): Promise<TikTokTrendingResponse> {
    const [videos, hashtags] = await Promise.all([
      this.getTrendingVideos(6),
      this.getTrendingHashtags(15)
    ]);
    
    return { videos, hashtags };
  }
}

export const tiktokApi = new TikTokApiService();