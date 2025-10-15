// YTIQ Main Application

class YTIQApp {
    constructor() {
        this.isInitialized = false;
        this.currentUser = null;
        this.currentPage = 'dashboard';
    }

    async init() {
        if (this.isInitialized) return;

        try {
            // Wait for DOM to be fully loaded
            if (document.readyState === 'loading') {
                await new Promise(resolve => {
                    document.addEventListener('DOMContentLoaded', resolve);
                });
            }

            // Show loading screen
            this.showLoadingScreen();

            // Initialize core components
            await this.initializeComponents();

            // Setup global event listeners
            this.setupGlobalEventListeners();

            // Setup service worker for offline functionality
            this.setupServiceWorker();

            this.isInitialized = true;

        } catch (error) {
            console.error('Failed to initialize YTIQ app:', error);
            Utils.showNotification('Failed to initialize application', 'error');
        }
    }

    showLoadingScreen() {
        const loadingScreen = document.getElementById('loadingScreen');
        if (loadingScreen) {
            loadingScreen.style.display = 'flex';
        }
    }

    hideLoadingScreen() {
        const loadingScreen = document.getElementById('loadingScreen');
        if (loadingScreen) {
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 1000);
        }
    }

    async initializeComponents() {
        // Initialize authentication first
        if (window.Auth) {
            // Auth manager initializes automatically via DOMContentLoaded
            await new Promise(resolve => setTimeout(resolve, 100));
        }

        // Initialize analytics engine
        if (window.AnalyticsEngine) {
            window.AnalyticsEngine.init?.();
        }

        // Initialize keyword research
        if (window.KeywordResearch) {
            window.KeywordResearch.init?.();
        }

        // Setup page routing
        this.setupPageRouting();

        this.hideLoadingScreen();
    }

    setupPageRouting() {
        // Update Dashboard methods to use AnalyticsEngine for specialized pages
        if (window.Dashboard) {
            const originalShowPage = window.Dashboard.showPage;
            
            window.Dashboard.showPage = async (pageName) => {
                const content = document.getElementById('content');
                if (!content) return;

                // Show loading state
                content.innerHTML = `
                    <div class="flex items-center justify-center h-64">
                        <div class="text-center">
                            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-ytiq-600 mx-auto"></div>
                            <p class="mt-4 text-gray-500">Loading ${this.getPageTitle(pageName)}...</p>
                        </div>
                    </div>
                `;

                // Simulate loading delay
                await new Promise(resolve => setTimeout(resolve, 300));

                // Route to appropriate handler
                switch (pageName) {
                    case 'dashboard':
                        return originalShowPage.call(window.Dashboard, pageName);
                        
                    case 'keyword-research':
                        content.innerHTML = window.KeywordResearch.getHTML();
                        window.KeywordResearch.initialize();
                        break;
                        
                    case 'channel-audit':
                        content.innerHTML = window.AnalyticsEngine.getChannelAuditHTML();
                        window.AnalyticsEngine.initializeChannelAudit();
                        break;
                        
                    case 'video-analytics':
                        content.innerHTML = window.AnalyticsEngine.getVideoAnalyticsHTML();
                        window.AnalyticsEngine.initializeVideoAnalytics();
                        break;
                        
                    case 'competitor-analysis':
                        content.innerHTML = window.AnalyticsEngine.getCompetitorAnalysisHTML();
                        window.AnalyticsEngine.initializeCompetitorAnalysis();
                        break;
                        
                    case 'subscriber-tracking':
                        content.innerHTML = window.AnalyticsEngine.getSubscriberTrackingHTML();
                        window.AnalyticsEngine.initializeSubscriberTracking();
                        break;
                        
                    case 'trending-videos':
                        content.innerHTML = this.getTrendingVideosHTML();
                        this.initializeTrendingVideos();
                        break;
                        
                    case 'tag-suggestions':
                        content.innerHTML = this.getTagSuggestionsHTML();
                        this.initializeTagSuggestions();
                        break;
                        
                    case 'seo-optimizer':
                        content.innerHTML = this.getSEOOptimizerHTML();
                        this.initializeSEOOptimizer();
                        break;
                        
                    case 'thumbnail-analyzer':
                        content.innerHTML = this.getThumbnailAnalyzerHTML();
                        this.initializeThumbnailAnalyzer();
                        break;
                        
                    case 'best-time-post':
                        content.innerHTML = this.getBestTimePostHTML();
                        this.initializeBestTimePost();
                        break;
                        
                    case 'monetization-insights':
                        content.innerHTML = this.getMonetizationInsightsHTML();
                        this.initializeMonetizationInsights();
                        break;
                        
                    default:
                        content.innerHTML = this.getNotFoundHTML();
                }

                // Update current page
                this.currentPage = pageName;
                
                // Add fade-in animation
                content.classList.add('fade-in');
                
                // Update URL without page refresh
                this.updateURL(pageName);
            };
        }
    }

    getPageTitle(pageName) {
        const titles = {
            'dashboard': 'Dashboard',
            'keyword-research': 'Keyword Research',
            'channel-audit': 'Channel Audit',
            'video-analytics': 'Video Analytics',
            'competitor-analysis': 'Competitor Analysis',
            'trending-videos': 'Trending Videos',
            'tag-suggestions': 'Tag Suggestions',
            'seo-optimizer': 'SEO Optimizer',
            'thumbnail-analyzer': 'Thumbnail Analyzer',
            'best-time-post': 'Best Time to Post',
            'subscriber-tracking': 'Subscriber Tracking',
            'monetization-insights': 'Monetization Insights'
        };
        return titles[pageName] || 'Page';
    }

    updateURL(pageName) {
        if (window.history && window.history.pushState) {
            const url = pageName === 'dashboard' ? '/' : `/${pageName}`;
            window.history.pushState({ page: pageName }, '', url);
        }
    }

    setupGlobalEventListeners() {
        // Handle browser back/forward buttons
        window.addEventListener('popstate', (event) => {
            if (event.state && event.state.page) {
                window.Dashboard?.showPage(event.state.page);
            }
        });

        // Handle keyboard shortcuts
        document.addEventListener('keydown', (event) => {
            this.handleKeyboardShortcuts(event);
        });

        // Handle global search
        document.addEventListener('input', (event) => {
            if (event.target.id === 'globalSearch') {
                this.handleGlobalSearch(event.target.value);
            }
        });

        // Handle window resize for responsive charts
        window.addEventListener('resize', Utils.debounce(() => {
            this.handleWindowResize();
        }, 250));

        // Handle online/offline status
        window.addEventListener('online', () => {
            Utils.showNotification('Connection restored', 'success');
        });

        window.addEventListener('offline', () => {
            Utils.showNotification('You are now offline', 'warning');
        });
    }

    handleKeyboardShortcuts(event) {
        // Ctrl/Cmd + K for global search
        if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
            event.preventDefault();
            const searchInput = document.getElementById('globalSearch');
            if (searchInput) {
                searchInput.focus();
            }
        }

        // Escape to clear search
        if (event.key === 'Escape') {
            const searchInput = document.getElementById('globalSearch');
            if (searchInput && searchInput === document.activeElement) {
                searchInput.value = '';
                searchInput.blur();
            }
        }
    }

    handleGlobalSearch(query) {
        if (!query.trim()) return;

        // Implement global search across different modules
        const searchResults = this.performGlobalSearch(query);
        this.displaySearchResults(searchResults);
    }

    performGlobalSearch(query) {
        const results = [];
        
        // Search in saved keywords
        const savedKeywords = Utils.storage.get('ytiq_individual_keywords', []);
        savedKeywords.forEach(keyword => {
            if (keyword.toLowerCase().includes(query.toLowerCase())) {
                results.push({
                    type: 'keyword',
                    title: keyword,
                    description: 'Saved keyword',
                    action: () => {
                        document.getElementById('globalSearch').value = keyword;
                        window.Dashboard?.showPage('keyword-research');
                    }
                });
            }
        });

        // Add more search logic here for other content types
        
        return results;
    }

    displaySearchResults(results) {
        // Create and show search results dropdown
        let dropdown = document.getElementById('searchDropdown');
        if (!dropdown) {
            dropdown = document.createElement('div');
            dropdown.id = 'searchDropdown';
            dropdown.className = 'absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-md shadow-lg z-50 max-h-64 overflow-y-auto';
            
            const searchContainer = document.getElementById('globalSearch').parentNode;
            searchContainer.style.position = 'relative';
            searchContainer.appendChild(dropdown);
        }

        if (results.length === 0) {
            dropdown.innerHTML = '<div class="p-3 text-gray-500 text-center">No results found</div>';
        } else {
            dropdown.innerHTML = results.map(result => `
                <div class="p-3 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0" 
                     onclick="(${result.action.toString()})()">
                    <div class="font-medium text-gray-900">${result.title}</div>
                    <div class="text-sm text-gray-500">${result.description}</div>
                </div>
            `).join('');
        }

        dropdown.style.display = 'block';

        // Hide dropdown when clicking outside
        setTimeout(() => {
            document.addEventListener('click', function hideDropdown(event) {
                if (!dropdown.contains(event.target) && event.target.id !== 'globalSearch') {
                    dropdown.style.display = 'none';
                    document.removeEventListener('click', hideDropdown);
                }
            });
        }, 100);
    }

    handleWindowResize() {
        // Trigger chart resize for responsive behavior
        Object.values(window.Dashboard?.charts || {}).forEach(chart => {
            if (chart && chart.resize) {
                chart.resize();
            }
        });

        Object.values(window.AnalyticsEngine?.charts || {}).forEach(chart => {
            if (chart && chart.resize) {
                chart.resize();
            }
        });
    }

    setupServiceWorker() {
        // Service worker setup - skip for now as sw.js doesn't exist
        if ('serviceWorker' in navigator && window.location.protocol === 'https:') {
            navigator.serviceWorker.register('/sw.js')
                .then(registration => {
                    console.log('Service Worker registered:', registration);
                })
                .catch(error => {
                    console.log('Service Worker registration skipped:', error.message);
                });
        }
    }

    // Additional page HTML generators
    getTrendingVideosHTML() {
        return `
            <div class="space-y-6">
                <div class="flex justify-between items-center">
                    <div>
                        <h1 class="text-3xl font-bold text-gray-900">Trending Videos</h1>
                        <p class="text-gray-600 mt-1">Discover what's trending on YouTube right now</p>
                    </div>
                    <div class="flex space-x-3">
                        <select class="px-4 py-2 border border-gray-300 rounded-md">
                            <option>All Categories</option>
                            <option>Technology</option>
                            <option>Gaming</option>
                            <option>Entertainment</option>
                            <option>Education</option>
                        </select>
                        <button class="btn-primary">
                            <i class="fas fa-sync mr-2"></i>Refresh
                        </button>
                    </div>
                </div>
                
                <div class="card p-6">
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        ${Array.from({length: 12}, (_, i) => `
                            <div class="bg-white border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                                <img src="https://picsum.photos/320/180?random=${i}" alt="Trending Video" class="w-full h-40 object-cover">
                                <div class="p-4">
                                    <h3 class="font-semibold text-gray-900 mb-2">Trending Video Title ${i + 1}</h3>
                                    <p class="text-sm text-gray-600 mb-2">Channel Name • ${Utils.formatNumber(Math.floor(Math.random() * 1000000) + 100000)} views</p>
                                    <div class="flex items-center justify-between">
                                        <span class="text-xs px-2 py-1 bg-red-100 text-red-800 rounded-full">#${i + 1} Trending</span>
                                        <button class="text-blue-600 hover:text-blue-800 text-sm">Analyze</button>
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
    }

    getTagSuggestionsHTML() {
        return `
            <div class="space-y-6">
                <div class="flex justify-between items-center">
                    <div>
                        <h1 class="text-3xl font-bold text-gray-900">Tag Suggestions</h1>
                        <p class="text-gray-600 mt-1">AI-powered tag recommendations for your videos</p>
                    </div>
                </div>
                
                <div class="card p-6">
                    <div class="mb-6">
                        <label class="block text-sm font-medium text-gray-700 mb-2">Video Title or Description</label>
                        <textarea class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ytiq-500" rows="3" placeholder="Enter your video title or description to get tag suggestions..."></textarea>
                        <button class="mt-3 btn-primary">Generate Tags</button>
                    </div>
                    
                    <div class="space-y-4">
                        <div>
                            <h3 class="font-medium text-gray-900 mb-2">Recommended Tags</h3>
                            <div class="flex flex-wrap gap-2">
                                ${['youtube tutorial', 'tech review', 'how to', 'beginner guide', 'tips and tricks', 'best practices'].map(tag => 
                                    `<span class="tag cursor-pointer hover:bg-gray-200">${tag}</span>`
                                ).join('')}
                            </div>
                        </div>
                        
                        <div>
                            <h3 class="font-medium text-gray-900 mb-2">High Volume Tags</h3>
                            <div class="flex flex-wrap gap-2">
                                ${['tech', 'tutorial', 'review', '2024', 'guide'].map(tag => 
                                    `<span class="tag high-volume cursor-pointer">${tag}</span>`
                                ).join('')}
                            </div>
                        </div>
                        
                        <div>
                            <h3 class="font-medium text-gray-900 mb-2">Low Competition Tags</h3>
                            <div class="flex flex-wrap gap-2">
                                ${['specific tutorial', 'advanced guide', 'detailed review'].map(tag => 
                                    `<span class="tag low-competition cursor-pointer">${tag}</span>`
                                ).join('')}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    getSEOOptimizerHTML() {
        return `
            <div class="space-y-6">
                <div class="flex justify-between items-center">
                    <div>
                        <h1 class="text-3xl font-bold text-gray-900">SEO Optimizer</h1>
                        <p class="text-gray-600 mt-1">Optimize your video SEO for maximum visibility</p>
                    </div>
                </div>
                
                <div class="card p-6">
                    <h3 class="text-lg font-semibold text-gray-900 mb-4">Video SEO Analysis</h3>
                    
                    <div class="space-y-6">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Video Title</label>
                            <input type="text" class="w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="Enter your video title">
                            <p class="text-sm text-gray-500 mt-1">Current score: <span class="font-medium text-yellow-600">72/100</span></p>
                        </div>
                        
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Description</label>
                            <textarea class="w-full px-3 py-2 border border-gray-300 rounded-md" rows="4" placeholder="Enter your video description"></textarea>
                            <p class="text-sm text-gray-500 mt-1">Current score: <span class="font-medium text-green-600">85/100</span></p>
                        </div>
                        
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Tags</label>
                            <input type="text" class="w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="Enter tags separated by commas">
                            <p class="text-sm text-gray-500 mt-1">Current score: <span class="font-medium text-red-600">45/100</span></p>
                        </div>
                        
                        <button class="btn-primary">Analyze & Optimize</button>
                    </div>
                    
                    <div class="mt-8 p-6 bg-blue-50 rounded-lg">
                        <h4 class="font-semibold text-blue-900 mb-3">SEO Recommendations</h4>
                        <ul class="space-y-2 text-sm text-blue-800">
                            <li>• Add your main keyword to the title</li>
                            <li>• Include more relevant tags (recommended: 5-15)</li>
                            <li>• Optimize description with trending keywords</li>
                            <li>• Add timestamps to improve user experience</li>
                        </ul>
                    </div>
                </div>
            </div>
        `;
    }

    getThumbnailAnalyzerHTML() {
        return `
            <div class="space-y-6">
                <div class="flex justify-between items-center">
                    <div>
                        <h1 class="text-3xl font-bold text-gray-900">Thumbnail Analyzer</h1>
                        <p class="text-gray-600 mt-1">Optimize your thumbnails for maximum click-through rates</p>
                    </div>
                </div>
                
                <div class="card p-6">
                    <h3 class="text-lg font-semibold text-gray-900 mb-4">Upload Thumbnail for Analysis</h3>
                    
                    <div class="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                        <i class="fas fa-cloud-upload-alt text-4xl text-gray-400 mb-4"></i>
                        <p class="text-gray-600 mb-2">Drop your thumbnail image here or click to browse</p>
                        <input type="file" accept="image/*" class="hidden" id="thumbnailUpload">
                        <button class="btn-secondary" onclick="document.getElementById('thumbnailUpload').click()">
                            Choose File
                        </button>
                    </div>
                    
                    <div class="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div>
                            <h4 class="font-semibold text-gray-900 mb-3">Analysis Results</h4>
                            <div class="space-y-3">
                                <div class="flex justify-between items-center">
                                    <span class="text-sm text-gray-600">Color Contrast</span>
                                    <span class="text-sm font-medium text-green-600">Excellent</span>
                                </div>
                                <div class="flex justify-between items-center">
                                    <span class="text-sm text-gray-600">Text Readability</span>
                                    <span class="text-sm font-medium text-yellow-600">Good</span>
                                </div>
                                <div class="flex justify-between items-center">
                                    <span class="text-sm text-gray-600">Face Detection</span>
                                    <span class="text-sm font-medium text-green-600">Face Found</span>
                                </div>
                                <div class="flex justify-between items-center">
                                    <span class="text-sm text-gray-600">Brightness</span>
                                    <span class="text-sm font-medium text-green-600">Optimal</span>
                                </div>
                            </div>
                        </div>
                        
                        <div>
                            <h4 class="font-semibold text-gray-900 mb-3">Recommendations</h4>
                            <ul class="space-y-2 text-sm text-gray-600">
                                <li>• Make text larger for mobile viewing</li>
                                <li>• Add more contrasting colors</li>
                                <li>• Position face in rule of thirds</li>
                                <li>• Consider A/B testing variations</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    getBestTimePostHTML() {
        return `
            <div class="space-y-6">
                <div class="flex justify-between items-center">
                    <div>
                        <h1 class="text-3xl font-bold text-gray-900">Best Time to Post</h1>
                        <p class="text-gray-600 mt-1">Discover optimal posting times for your audience</p>
                    </div>
                </div>
                
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div class="card p-6">
                        <h3 class="text-lg font-semibold text-gray-900 mb-4">Audience Activity Heatmap</h3>
                        <div class="space-y-2">
                            ${['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => `
                                <div class="flex items-center space-x-2">
                                    <span class="w-10 text-sm text-gray-600">${day}</span>
                                    <div class="flex space-x-1 flex-1">
                                        ${Array.from({length: 24}, (_, hour) => {
                                            const activity = Math.random();
                                            const color = activity > 0.7 ? 'bg-green-500' : activity > 0.4 ? 'bg-yellow-500' : 'bg-gray-300';
                                            return `<div class="w-3 h-6 ${color} rounded-sm" title="${hour}:00"></div>`;
                                        }).join('')}
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                        <div class="flex items-center justify-between mt-4 text-xs text-gray-500">
                            <span>12 AM</span>
                            <span>6 AM</span>
                            <span>12 PM</span>
                            <span>6 PM</span>
                            <span>11 PM</span>
                        </div>
                    </div>
                    
                    <div class="card p-6">
                        <h3 class="text-lg font-semibold text-gray-900 mb-4">Recommended Post Times</h3>
                        <div class="space-y-4">
                            <div class="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                                <div>
                                    <p class="font-medium text-green-900">Tuesday, 2:00 PM</p>
                                    <p class="text-sm text-green-700">Peak engagement time</p>
                                </div>
                                <span class="text-lg">🥇</span>
                            </div>
                            <div class="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                                <div>
                                    <p class="font-medium text-blue-900">Friday, 6:00 PM</p>
                                    <p class="text-sm text-blue-700">Weekend traffic boost</p>
                                </div>
                                <span class="text-lg">🥈</span>
                            </div>
                            <div class="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                                <div>
                                    <p class="font-medium text-yellow-900">Sunday, 10:00 AM</p>
                                    <p class="text-sm text-yellow-700">Morning engagement</p>
                                </div>
                                <span class="text-lg">🥉</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    getMonetizationInsightsHTML() {
        return `
            <div class="space-y-6">
                <div class="flex justify-between items-center">
                    <div>
                        <h1 class="text-3xl font-bold text-gray-900">Monetization Insights</h1>
                        <p class="text-gray-600 mt-1">Maximize your YouTube revenue potential</p>
                    </div>
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div class="stat-card card p-6">
                        <div class="flex items-center">
                            <i class="fas fa-dollar-sign text-3xl text-green-600 mr-4"></i>
                            <div>
                                <p class="text-sm text-gray-600">Est. Monthly Revenue</p>
                                <p class="text-2xl font-bold text-gray-900">$2,340</p>
                                <p class="text-sm text-green-600">+18.5% vs last month</p>
                            </div>
                        </div>
                    </div>
                    
                    <div class="stat-card card p-6">
                        <div class="flex items-center">
                            <i class="fas fa-chart-line text-3xl text-blue-600 mr-4"></i>
                            <div>
                                <p class="text-sm text-gray-600">Revenue per 1K Views</p>
                                <p class="text-2xl font-bold text-gray-900">$3.20</p>
                                <p class="text-sm text-blue-600">Above average</p>
                            </div>
                        </div>
                    </div>
                    
                    <div class="stat-card card p-6">
                        <div class="flex items-center">
                            <i class="fas fa-target text-3xl text-purple-600 mr-4"></i>
                            <div>
                                <p class="text-sm text-gray-600">Optimization Score</p>
                                <p class="text-2xl font-bold text-gray-900">78%</p>
                                <p class="text-sm text-purple-600">Good performance</p>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="card p-6">
                    <h3 class="text-lg font-semibold text-gray-900 mb-4">Revenue Optimization Tips</h3>
                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div class="space-y-4">
                            <div class="flex items-start space-x-3">
                                <div class="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                    <i class="fas fa-check text-green-600"></i>
                                </div>
                                <div>
                                    <h4 class="font-medium text-gray-900">Enable Mid-Roll Ads</h4>
                                    <p class="text-sm text-gray-600">Videos over 8 minutes can have multiple ad breaks</p>
                                </div>
                            </div>
                            <div class="flex items-start space-x-3">
                                <div class="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                                    <i class="fas fa-exclamation text-yellow-600"></i>
                                </div>
                                <div>
                                    <h4 class="font-medium text-gray-900">Optimize Video Length</h4>
                                    <p class="text-sm text-gray-600">8-15 minute videos typically perform best for ad revenue</p>
                                </div>
                            </div>
                        </div>
                        <div class="space-y-4">
                            <div class="flex items-start space-x-3">
                                <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                    <i class="fas fa-lightbulb text-blue-600"></i>
                                </div>
                                <div>
                                    <h4 class="font-medium text-gray-900">Add Channel Memberships</h4>
                                    <p class="text-sm text-gray-600">Recurring revenue from dedicated subscribers</p>
                                </div>
                            </div>
                            <div class="flex items-start space-x-3">
                                <div class="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                                    <i class="fas fa-gift text-purple-600"></i>
                                </div>
                                <div>
                                    <h4 class="font-medium text-gray-900">Promote Merchandise</h4>
                                    <p class="text-sm text-gray-600">Showcase your products in video descriptions</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    getNotFoundHTML() {
        return `
            <div class="flex items-center justify-center h-96">
                <div class="text-center">
                    <i class="fas fa-exclamation-triangle text-6xl text-gray-400 mb-4"></i>
                    <h2 class="text-2xl font-bold text-gray-900 mb-2">Page Not Found</h2>
                    <p class="text-gray-600 mb-4">The requested page could not be found.</p>
                    <button class="btn-primary" onclick="window.Dashboard?.showPage('dashboard')">
                        Go to Dashboard
                    </button>
                </div>
            </div>
        `;
    }

    // Placeholder initialization methods
    initializeTrendingVideos() {
        Utils.showNotification('Trending videos loaded', 'success');
    }

    initializeTagSuggestions() {
        Utils.showNotification('Tag suggestions ready', 'success');
    }

    initializeSEOOptimizer() {
        Utils.showNotification('SEO optimizer loaded', 'success');
    }

    initializeThumbnailAnalyzer() {
        Utils.showNotification('Thumbnail analyzer ready', 'success');
    }

    initializeBestTimePost() {
        Utils.showNotification('Best time to post analytics loaded', 'success');
    }

    initializeMonetizationInsights() {
        Utils.showNotification('Monetization insights loaded', 'success');
    }
}

// Initialize the application
const app = new YTIQApp();

// Start the app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => app.init());
} else {
    app.init();
}

// Export for global access
window.YTIQApp = app;