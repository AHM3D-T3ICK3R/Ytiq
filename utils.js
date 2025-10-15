// YTIQ Utilities

// API Configuration
const API_CONFIG = {
    youtube: {
        // Using YouTube Data API v3 (requires API key for production)
        baseURL: 'https://www.googleapis.com/youtube/v3',
        apiKey: 'YOUR_API_KEY', // Replace with actual API key
        quotaLimit: 10000 // Daily quota limit
    },
    social: {
        // Social Blade equivalent data
        baseURL: 'https://api.socialblade.com/v2',
    }
};

// Utility Functions
const Utils = {
    // Format numbers with appropriate suffixes
    formatNumber(num) {
        if (num >= 1000000000) {
            return (num / 1000000000).toFixed(1) + 'B';
        } else if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        } else if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        return num.toString();
    },

    // Format currency
    formatCurrency(amount) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    },

    // Format duration
    formatDuration(seconds) {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;

        if (hours > 0) {
            return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        } else {
            return `${minutes}:${secs.toString().padStart(2, '0')}`;
        }
    },

    // Format date
    formatDate(date) {
        return new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        }).format(new Date(date));
    },

    // Format relative time
    formatRelativeTime(date) {
        const now = new Date();
        const diffInSeconds = Math.floor((now - new Date(date)) / 1000);
        
        if (diffInSeconds < 60) return 'Just now';
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
        if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`;
        if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)}mo ago`;
        return `${Math.floor(diffInSeconds / 31536000)}y ago`;
    },

    // Generate random ID
    generateId() {
        return Math.random().toString(36).substr(2, 9);
    },

    // Debounce function
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    // Show notification
    showNotification(message, type = 'info', duration = 3000) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Trigger animation
        setTimeout(() => notification.classList.add('show'), 100);
        
        // Remove notification
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => document.body.removeChild(notification), 300);
        }, duration);
    },

    // Local storage helpers
    storage: {
        set(key, value) {
            try {
                localStorage.setItem(key, JSON.stringify(value));
            } catch (e) {
                console.error('Failed to save to localStorage:', e);
            }
        },
        
        get(key, defaultValue = null) {
            try {
                const item = localStorage.getItem(key);
                return item ? JSON.parse(item) : defaultValue;
            } catch (e) {
                console.error('Failed to read from localStorage:', e);
                return defaultValue;
            }
        },
        
        remove(key) {
            try {
                localStorage.removeItem(key);
            } catch (e) {
                console.error('Failed to remove from localStorage:', e);
            }
        }
    },

    // YouTube URL helpers
    youtube: {
        extractVideoId(url) {
            const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
            const match = url.match(regExp);
            return (match && match[2].length === 11) ? match[2] : null;
        },

        extractChannelId(url) {
            // Handle different YouTube channel URL formats
            const patterns = [
                /youtube\.com\/channel\/([a-zA-Z0-9_-]+)/,
                /youtube\.com\/c\/([a-zA-Z0-9_-]+)/,
                /youtube\.com\/user\/([a-zA-Z0-9_-]+)/,
                /youtube\.com\/@([a-zA-Z0-9_-]+)/
            ];
            
            for (const pattern of patterns) {
                const match = url.match(pattern);
                if (match) return match[1];
            }
            return null;
        },

        getThumbnailUrl(videoId, quality = 'maxresdefault') {
            return `https://img.youtube.com/vi/${videoId}/${quality}.jpg`;
        }
    },

    // SEO helpers
    seo: {
        calculateScore(data) {
            let score = 0;
            const factors = {
                titleLength: data.title?.length >= 40 && data.title?.length <= 60 ? 20 : 10,
                descriptionLength: data.description?.length >= 100 && data.description?.length <= 160 ? 15 : 8,
                tagsCount: data.tags?.length >= 5 && data.tags?.length <= 15 ? 15 : 8,
                thumbnail: data.thumbnail ? 20 : 0,
                keywords: data.keywords?.length > 0 ? 10 : 0,
                customThumbnail: data.customThumbnail ? 10 : 5,
                endScreen: data.endScreen ? 5 : 0,
                cards: data.cards ? 5 : 0
            };
            
            return Object.values(factors).reduce((sum, val) => sum + val, 0);
        },

        generateSuggestions(data) {
            const suggestions = [];
            
            if (!data.title || data.title.length < 40) {
                suggestions.push({
                    type: 'title',
                    message: 'Consider making your title longer (40-60 characters) for better SEO',
                    priority: 'high'
                });
            }
            
            if (!data.description || data.description.length < 100) {
                suggestions.push({
                    type: 'description',
                    message: 'Add a detailed description (100-160 characters minimum)',
                    priority: 'high'
                });
            }
            
            if (!data.tags || data.tags.length < 5) {
                suggestions.push({
                    type: 'tags',
                    message: 'Add more relevant tags (5-15 recommended)',
                    priority: 'medium'
                });
            }
            
            if (!data.customThumbnail) {
                suggestions.push({
                    type: 'thumbnail',
                    message: 'Use a custom thumbnail to increase click-through rate',
                    priority: 'high'
                });
            }
            
            return suggestions;
        }
    },

    // Analytics helpers
    analytics: {
        calculateGrowthRate(current, previous) {
            if (previous === 0) return 0;
            return ((current - previous) / previous) * 100;
        },

        calculateEngagementRate(likes, views) {
            if (views === 0) return 0;
            return (likes / views) * 100;
        },

        predictTrending(data) {
            const factors = {
                recentViews: data.views24h || 0,
                engagementRate: this.calculateEngagementRate(data.likes, data.views),
                growthRate: this.calculateGrowthRate(data.currentViews, data.previousViews),
                shareCount: data.shares || 0,
                commentRate: data.comments / data.views * 100 || 0
            };
            
            // Simple trending score calculation
            const trendingScore = (
                (factors.recentViews / 1000) * 0.3 +
                factors.engagementRate * 0.2 +
                factors.growthRate * 0.25 +
                (factors.shareCount / 100) * 0.15 +
                factors.commentRate * 0.1
            );
            
            return {
                score: Math.min(trendingScore, 100),
                trending: trendingScore > 50,
                factors
            };
        }
    }
};

// Mock Data Generator for Demo
const MockData = {
    // Generate mock channel data
    generateChannelData(channelName = 'Demo Channel') {
        const baseViews = Math.floor(Math.random() * 10000000) + 100000;
        const baseSubscribers = Math.floor(Math.random() * 1000000) + 10000;
        
        return {
            id: Utils.generateId(),
            name: channelName,
            handle: '@' + channelName.toLowerCase().replace(/\s+/g, ''),
            subscribers: baseSubscribers,
            totalViews: baseViews,
            videoCount: Math.floor(Math.random() * 500) + 50,
            joinedDate: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000),
            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(channelName)}&background=random`,
            verified: Math.random() > 0.7,
            country: ['US', 'UK', 'CA', 'AU', 'IN'][Math.floor(Math.random() * 5)],
            category: ['Entertainment', 'Gaming', 'Music', 'Education', 'Technology'][Math.floor(Math.random() * 5)],
            monthlyViews: Math.floor(baseViews * 0.1),
            avgViews: Math.floor(baseViews / 100),
            engagementRate: Math.random() * 10 + 2
        };
    },

    // Generate mock video data
    generateVideoData(count = 10) {
        const videos = [];
        for (let i = 0; i < count; i++) {
            const views = Math.floor(Math.random() * 5000000) + 1000;
            const likes = Math.floor(views * (Math.random() * 0.1 + 0.02));
            const comments = Math.floor(views * (Math.random() * 0.05 + 0.005));
            
            videos.push({
                id: Utils.generateId(),
                title: `Sample Video Title ${i + 1} - How to Improve Your YouTube Channel`,
                description: `This is a sample video description for video ${i + 1}. It contains useful information about YouTube growth strategies and optimization techniques.`,
                thumbnail: `https://picsum.photos/320/180?random=${i}`,
                duration: Math.floor(Math.random() * 600) + 120,
                views,
                likes,
                dislikes: Math.floor(likes * 0.05),
                comments,
                publishedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
                tags: ['youtube', 'growth', 'tutorial', 'marketing', 'seo'].slice(0, Math.floor(Math.random() * 4) + 2),
                category: 'Education',
                language: 'en'
            });
        }
        return videos;
    },

    // Generate mock keyword data
    generateKeywordData(keyword) {
        const baseVolume = Math.floor(Math.random() * 100000) + 1000;
        return {
            keyword,
            searchVolume: baseVolume,
            competition: Math.random(),
            difficulty: Math.floor(Math.random() * 100),
            trend: Math.random() > 0.5 ? 'up' : 'down',
            cpc: Math.random() * 5 + 0.5,
            relatedKeywords: [
                `${keyword} tutorial`,
                `best ${keyword}`,
                `${keyword} 2024`,
                `how to ${keyword}`,
                `${keyword} guide`
            ],
            monthlySearches: Array.from({length: 12}, () => Math.floor(baseVolume * (Math.random() * 0.4 + 0.8)))
        };
    },

    // Generate analytics data
    generateAnalyticsData(days = 30) {
        const data = [];
        const baseValue = Math.floor(Math.random() * 10000) + 1000;
        
        for (let i = days; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            
            data.push({
                date: date.toISOString().split('T')[0],
                views: Math.floor(baseValue * (Math.random() * 0.4 + 0.8)),
                subscribers: Math.floor(Math.random() * 100),
                watchTime: Math.floor(Math.random() * 10000),
                impressions: Math.floor(baseValue * 2 * (Math.random() * 0.4 + 0.8)),
                ctr: Math.random() * 15 + 2,
                revenue: Math.random() * 500 + 50
            });
        }
        
        return data;
    }
};

// Export for use in other files
window.Utils = Utils;
window.MockData = MockData;
window.API_CONFIG = API_CONFIG;