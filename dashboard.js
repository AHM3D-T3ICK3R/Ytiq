// YTIQ Dashboard

class Dashboard {
    constructor() {
        this.currentPage = 'dashboard';
        this.charts = {};
        this.data = {};
    }

    init() {
        this.setupNavigation();
        this.loadDashboardData();
        this.showPage('dashboard');
    }

    setupNavigation() {
        // Navigation links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const page = link.getAttribute('data-page');
                if (page) {
                    this.showPage(page);
                    this.updateActiveNav(link);
                }
            });
        });

        // Global search
        const searchInput = document.getElementById('globalSearch');
        if (searchInput) {
            searchInput.addEventListener('input', Utils.debounce((e) => {
                this.handleGlobalSearch(e.target.value);
            }, 300));
        }

        // Notifications
        document.getElementById('notificationsBtn')?.addEventListener('click', () => {
            this.showNotifications();
        });
    }

    updateActiveNav(activeLink) {
        // Remove active class from all nav links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active', 'bg-ytiq-50', 'text-ytiq-700', 'border-r-2', 'border-ytiq-600');
            link.classList.add('text-gray-600', 'hover:bg-gray-50', 'hover:text-gray-900');
        });

        // Add active class to clicked link
        activeLink.classList.remove('text-gray-600', 'hover:bg-gray-50', 'hover:text-gray-900');
        activeLink.classList.add('active', 'bg-ytiq-50', 'text-ytiq-700', 'border-r-2', 'border-ytiq-600');
    }

    async showPage(pageName) {
        this.currentPage = pageName;
        const content = document.getElementById('content');

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
        await new Promise(resolve => setTimeout(resolve, 500));

        // Load page content
        switch (pageName) {
            case 'dashboard':
                content.innerHTML = this.getDashboardHTML();
                this.initializeDashboard();
                break;
            case 'keyword-research':
                content.innerHTML = this.getKeywordResearchHTML();
                this.initializeKeywordResearch();
                break;
            case 'channel-audit':
                content.innerHTML = this.getChannelAuditHTML();
                this.initializeChannelAudit();
                break;
            case 'video-analytics':
                content.innerHTML = this.getVideoAnalyticsHTML();
                this.initializeVideoAnalytics();
                break;
            case 'competitor-analysis':
                content.innerHTML = this.getCompetitorAnalysisHTML();
                this.initializeCompetitorAnalysis();
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
            case 'subscriber-tracking':
                content.innerHTML = this.getSubscriberTrackingHTML();
                this.initializeSubscriberTracking();
                break;
            case 'monetization-insights':
                content.innerHTML = this.getMonetizationInsightsHTML();
                this.initializeMonetizationInsights();
                break;
            default:
                content.innerHTML = this.getNotFoundHTML();
        }

        // Add fade-in animation
        content.classList.add('fade-in');
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

    getDashboardHTML() {
        return `
            <div class="space-y-6">
                <!-- Header -->
                <div class="flex justify-between items-center">
                    <div>
                        <h1 class="text-3xl font-bold text-gray-900">Dashboard</h1>
                        <p class="text-gray-600 mt-1">Welcome back! Here's your YouTube analytics overview.</p>
                    </div>
                    <div class="flex space-x-3">
                        <button class="btn-secondary" id="refreshData">
                            <i class="fas fa-sync-alt mr-2"></i>Refresh Data
                        </button>
                        <button class="btn-primary" id="connectChannel">
                            <i class="fas fa-plus mr-2"></i>Connect Channel
                        </button>
                    </div>
                </div>

                <!-- Quick Stats -->
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div class="stat-card card trending-up p-6">
                        <div class="flex items-center">
                            <div class="flex-shrink-0">
                                <i class="fas fa-eye text-2xl text-blue-600"></i>
                            </div>
                            <div class="ml-4">
                                <p class="text-sm font-medium text-gray-600">Total Views</p>
                                <div class="flex items-baseline">
                                    <p class="text-2xl font-bold text-gray-900" id="totalViews">-</p>
                                    <p class="ml-2 flex items-baseline text-sm font-semibold text-green-600">
                                        <i class="fas fa-arrow-up text-xs mr-1"></i>
                                        <span id="viewsChange">-</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="stat-card card trending-up p-6">
                        <div class="flex items-center">
                            <div class="flex-shrink-0">
                                <i class="fas fa-users text-2xl text-green-600"></i>
                            </div>
                            <div class="ml-4">
                                <p class="text-sm font-medium text-gray-600">Subscribers</p>
                                <div class="flex items-baseline">
                                    <p class="text-2xl font-bold text-gray-900" id="totalSubscribers">-</p>
                                    <p class="ml-2 flex items-baseline text-sm font-semibold text-green-600">
                                        <i class="fas fa-arrow-up text-xs mr-1"></i>
                                        <span id="subscribersChange">-</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="stat-card card trending-neutral p-6">
                        <div class="flex items-center">
                            <div class="flex-shrink-0">
                                <i class="fas fa-clock text-2xl text-purple-600"></i>
                            </div>
                            <div class="ml-4">
                                <p class="text-sm font-medium text-gray-600">Watch Time</p>
                                <div class="flex items-baseline">
                                    <p class="text-2xl font-bold text-gray-900" id="totalWatchTime">-</p>
                                    <p class="ml-2 flex items-baseline text-sm font-semibold text-gray-600">
                                        <i class="fas fa-minus text-xs mr-1"></i>
                                        <span id="watchTimeChange">-</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="stat-card card trending-up p-6">
                        <div class="flex items-center">
                            <div class="flex-shrink-0">
                                <i class="fas fa-dollar-sign text-2xl text-yellow-600"></i>
                            </div>
                            <div class="ml-4">
                                <p class="text-sm font-medium text-gray-600">Est. Revenue</p>
                                <div class="flex items-baseline">
                                    <p class="text-2xl font-bold text-gray-900" id="totalRevenue">-</p>
                                    <p class="ml-2 flex items-baseline text-sm font-semibold text-green-600">
                                        <i class="fas fa-arrow-up text-xs mr-1"></i>
                                        <span id="revenueChange">-</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Charts Row -->
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div class="chart-container">
                        <h3 class="text-lg font-semibold text-gray-900 mb-4">Views & Subscribers (Last 30 Days)</h3>
                        <canvas id="viewsChart"></canvas>
                    </div>
                    <div class="chart-container">
                        <h3 class="text-lg font-semibold text-gray-900 mb-4">Revenue Analytics</h3>
                        <canvas id="revenueChart"></canvas>
                    </div>
                </div>

                <!-- Recent Activity -->
                <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div class="lg:col-span-2">
                        <div class="card p-6">
                            <h3 class="text-lg font-semibold text-gray-900 mb-4">Recent Videos Performance</h3>
                            <div class="overflow-x-auto">
                                <table class="data-table w-full">
                                    <thead>
                                        <tr>
                                            <th>Video</th>
                                            <th>Views</th>
                                            <th>Likes</th>
                                            <th>Comments</th>
                                            <th>Performance</th>
                                        </tr>
                                    </thead>
                                    <tbody id="recentVideos">
                                        <!-- Will be populated by JS -->
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    
                    <div>
                        <div class="card p-6">
                            <h3 class="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                            <div class="space-y-3">
                                <button class="w-full btn-secondary text-left" data-page="keyword-research">
                                    <i class="fas fa-search mr-3"></i>Find Keywords
                                </button>
                                <button class="w-full btn-secondary text-left" data-page="seo-optimizer">
                                    <i class="fas fa-cog mr-3"></i>Optimize SEO
                                </button>
                                <button class="w-full btn-secondary text-left" data-page="trending-videos">
                                    <i class="fas fa-fire mr-3"></i>Find Trending
                                </button>
                                <button class="w-full btn-secondary text-left" data-page="competitor-analysis">
                                    <i class="fas fa-users mr-3"></i>Analyze Competitors
                                </button>
                            </div>
                        </div>
                        
                        <div class="card p-6 mt-6">
                            <h3 class="text-lg font-semibold text-gray-900 mb-4">Notifications</h3>
                            <div class="space-y-3" id="dashboardNotifications">
                                <!-- Will be populated by JS -->
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    async initializeDashboard() {
        // Load dashboard data
        await this.loadDashboardData();
        
        // Initialize charts
        this.initializeViewsChart();
        this.initializeRevenueChart();
        
        // Populate tables and lists
        this.populateRecentVideos();
        this.populateNotifications();
        
        // Setup event listeners
        this.setupDashboardEventListeners();
    }

    async loadDashboardData() {
        // Check cache first
        const cachedData = Utils.storage.get('ytiq_dashboard_data');
        const cacheTime = Utils.storage.get('ytiq_dashboard_cache_time');
        
        // Use cache if less than 5 minutes old
        if (cachedData && cacheTime && (Date.now() - cacheTime) < 300000) {
            this.data = cachedData;
            return;
        }

        try {
            // Generate mock data for demo
            const analyticsData = MockData.generateAnalyticsData(30);
            const videosData = MockData.generateVideoData(10);
            
            // Calculate totals
            const totalViews = analyticsData.reduce((sum, day) => sum + day.views, 0);
            const totalSubscribers = 125430 + analyticsData.reduce((sum, day) => sum + day.subscribers, 0);
            const totalWatchTime = analyticsData.reduce((sum, day) => sum + day.watchTime, 0);
            const totalRevenue = analyticsData.reduce((sum, day) => sum + day.revenue, 0);

            this.data = {
                stats: {
                    totalViews,
                    totalSubscribers,
                    totalWatchTime,
                    totalRevenue,
                    viewsChange: '+12.5%',
                    subscribersChange: '+5.2%',
                    watchTimeChange: '+0.8%',
                    revenueChange: '+18.3%'
                },
                analytics: analyticsData,
                videos: videosData
            };

            // Cache the data
            Utils.storage.set('ytiq_dashboard_data', this.data);
            Utils.storage.set('ytiq_dashboard_cache_time', Date.now());
            
        } catch (error) {
            console.error('Error loading dashboard data:', error);
            Utils.showNotification('Error loading dashboard data', 'error');
        }
    }

    updateDashboardStats() {
        if (!this.data.stats) return;

        const stats = this.data.stats;
        
        document.getElementById('totalViews').textContent = Utils.formatNumber(stats.totalViews);
        document.getElementById('totalSubscribers').textContent = Utils.formatNumber(stats.totalSubscribers);
        document.getElementById('totalWatchTime').textContent = Utils.formatNumber(stats.totalWatchTime) + 'h';
        document.getElementById('totalRevenue').textContent = Utils.formatCurrency(stats.totalRevenue);
        
        document.getElementById('viewsChange').textContent = stats.viewsChange;
        document.getElementById('subscribersChange').textContent = stats.subscribersChange;
        document.getElementById('watchTimeChange').textContent = stats.watchTimeChange;
        document.getElementById('revenueChange').textContent = stats.revenueChange;
    }

    initializeViewsChart() {
        const ctx = document.getElementById('viewsChart')?.getContext('2d');
        if (!ctx || !this.data.analytics) return;

        if (typeof Chart === 'undefined') {
            console.warn('Chart.js not loaded');
            return;
        }

        this.charts.views = new Chart(ctx, {
            type: 'line',
            data: {
                labels: this.data.analytics.map(d => Utils.formatDate(d.date)),
                datasets: [{
                    label: 'Views',
                    data: this.data.analytics.map(d => d.views),
                    borderColor: '#dc2626',
                    backgroundColor: 'rgba(220, 38, 38, 0.1)',
                    tension: 0.4,
                    yAxisID: 'y'
                }, {
                    label: 'Subscribers',
                    data: this.data.analytics.map(d => d.subscribers),
                    borderColor: '#10b981',
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    tension: 0.4,
                    yAxisID: 'y1'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                    mode: 'index',
                    intersect: false,
                },
                scales: {
                    x: {
                        display: true,
                        title: {
                            display: true,
                            text: 'Date'
                        }
                    },
                    y: {
                        type: 'linear',
                        display: true,
                        position: 'left',
                        title: {
                            display: true,
                            text: 'Views'
                        }
                    },
                    y1: {
                        type: 'linear',
                        display: true,
                        position: 'right',
                        title: {
                            display: true,
                            text: 'Subscribers'
                        },
                        grid: {
                            drawOnChartArea: false,
                        },
                    }
                }
            }
        });
    }

    initializeRevenueChart() {
        const ctx = document.getElementById('revenueChart')?.getContext('2d');
        if (!ctx || !this.data.analytics) return;

        if (typeof Chart === 'undefined') {
            console.warn('Chart.js not loaded');
            return;
        }

        this.charts.revenue = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: this.data.analytics.slice(-7).map(d => Utils.formatDate(d.date)),
                datasets: [{
                    label: 'Revenue',
                    data: this.data.analytics.slice(-7).map(d => d.revenue),
                    backgroundColor: 'rgba(220, 38, 38, 0.8)',
                    borderColor: '#dc2626',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Revenue ($)'
                        }
                    }
                }
            }
        });
    }

    populateRecentVideos() {
        const tbody = document.getElementById('recentVideos');
        if (!tbody || !this.data.videos) return;

        tbody.innerHTML = this.data.videos.slice(0, 5).map(video => {
            const performance = Utils.analytics.calculateEngagementRate(video.likes, video.views);
            const performanceClass = performance > 5 ? 'text-green-600' : performance > 2 ? 'text-yellow-600' : 'text-red-600';
            
            return `
                <tr class="hover:bg-gray-50">
                    <td>
                        <div class="flex items-center">
                            <img src="${video.thumbnail}" alt="${video.title}" class="w-16 h-9 object-cover rounded mr-3">
                            <div>
                                <p class="font-medium text-gray-900 truncate max-w-xs">${video.title}</p>
                                <p class="text-sm text-gray-500">${Utils.formatRelativeTime(video.publishedAt)}</p>
                            </div>
                        </div>
                    </td>
                    <td class="font-medium">${Utils.formatNumber(video.views)}</td>
                    <td class="font-medium">${Utils.formatNumber(video.likes)}</td>
                    <td class="font-medium">${Utils.formatNumber(video.comments)}</td>
                    <td>
                        <span class="text-sm font-medium ${performanceClass}">
                            ${performance.toFixed(1)}% ER
                        </span>
                    </td>
                </tr>
            `;
        }).join('');
    }

    populateNotifications() {
        const container = document.getElementById('dashboardNotifications');
        if (!container) return;

        const notifications = [
            {
                type: 'success',
                message: 'Your video "How to Grow on YouTube" is trending!',
                time: '2 hours ago',
                icon: 'fas fa-fire'
            },
            {
                type: 'info',
                message: 'New keyword opportunity detected: "YouTube SEO 2024"',
                time: '4 hours ago',
                icon: 'fas fa-lightbulb'
            },
            {
                type: 'warning',
                message: 'Competitor analysis shows new trending topics',
                time: '1 day ago',
                icon: 'fas fa-exclamation-triangle'
            }
        ];

        container.innerHTML = notifications.map(notif => `
            <div class="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                <i class="${notif.icon} text-${notif.type === 'success' ? 'green' : notif.type === 'warning' ? 'yellow' : 'blue'}-600 mt-1"></i>
                <div class="flex-1">
                    <p class="text-sm text-gray-900">${notif.message}</p>
                    <p class="text-xs text-gray-500 mt-1">${notif.time}</p>
                </div>
            </div>
        `).join('');
    }

    setupDashboardEventListeners() {
        // Update stats when dashboard loads
        this.updateDashboardStats();

        // Quick action buttons
        document.querySelectorAll('[data-page]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const page = btn.getAttribute('data-page');
                if (page) {
                    this.showPage(page);
                }
            });
        });

        // Refresh data button
        document.getElementById('refreshData')?.addEventListener('click', async () => {
            Utils.storage.remove('ytiq_dashboard_data');
            Utils.storage.remove('ytiq_dashboard_cache_time');
            await this.loadDashboardData();
            this.updateDashboardStats();
            Utils.showNotification('Dashboard data refreshed', 'success');
        });

        // Connect channel button
        document.getElementById('connectChannel')?.addEventListener('click', () => {
            this.showConnectChannelModal();
        });
    }

    showConnectChannelModal() {
        const channelUrl = prompt('Enter your YouTube channel URL:');
        if (channelUrl && window.Auth) {
            window.Auth.connectChannel(channelUrl);
        }
    }

    handleGlobalSearch(query) {
        if (!query.trim()) return;
        
        // Implement global search functionality
        console.log('Searching for:', query);
        Utils.showNotification(`Searching for "${query}"...`, 'info');
    }

    showNotifications() {
        Utils.showNotification('Notifications panel opened', 'info');
    }

    // Placeholder methods for other pages
    getKeywordResearchHTML() { return '<div class="p-8 text-center"><h2 class="text-2xl font-bold">Keyword Research Tool</h2><p class="text-gray-600 mt-2">Advanced keyword research functionality coming soon...</p></div>'; }
    getChannelAuditHTML() { return '<div class="p-8 text-center"><h2 class="text-2xl font-bold">Channel Audit</h2><p class="text-gray-600 mt-2">Comprehensive channel audit tools coming soon...</p></div>'; }
    getVideoAnalyticsHTML() { return '<div class="p-8 text-center"><h2 class="text-2xl font-bold">Video Analytics</h2><p class="text-gray-600 mt-2">Detailed video analytics coming soon...</p></div>'; }
    getCompetitorAnalysisHTML() { return '<div class="p-8 text-center"><h2 class="text-2xl font-bold">Competitor Analysis</h2><p class="text-gray-600 mt-2">Competitor analysis tools coming soon...</p></div>'; }
    getTrendingVideosHTML() { return '<div class="p-8 text-center"><h2 class="text-2xl font-bold">Trending Videos</h2><p class="text-gray-600 mt-2">Trending videos discovery coming soon...</p></div>'; }
    getTagSuggestionsHTML() { return '<div class="p-8 text-center"><h2 class="text-2xl font-bold">Tag Suggestions</h2><p class="text-gray-600 mt-2">Intelligent tag suggestions coming soon...</p></div>'; }
    getSEOOptimizerHTML() { return '<div class="p-8 text-center"><h2 class="text-2xl font-bold">SEO Optimizer</h2><p class="text-gray-600 mt-2">SEO optimization tools coming soon...</p></div>'; }
    getThumbnailAnalyzerHTML() { return '<div class="p-8 text-center"><h2 class="text-2xl font-bold">Thumbnail Analyzer</h2><p class="text-gray-600 mt-2">Thumbnail analysis tools coming soon...</p></div>'; }
    getBestTimePostHTML() { return '<div class="p-8 text-center"><h2 class="text-2xl font-bold">Best Time to Post</h2><p class="text-gray-600 mt-2">Optimal posting time analytics coming soon...</p></div>'; }
    getSubscriberTrackingHTML() { return '<div class="p-8 text-center"><h2 class="text-2xl font-bold">Subscriber Tracking</h2><p class="text-gray-600 mt-2">Real-time subscriber tracking coming soon...</p></div>'; }
    getMonetizationInsightsHTML() { return '<div class="p-8 text-center"><h2 class="text-2xl font-bold">Monetization Insights</h2><p class="text-gray-600 mt-2">Revenue optimization insights coming soon...</p></div>'; }
    getNotFoundHTML() { return '<div class="p-8 text-center"><h2 class="text-2xl font-bold">Page Not Found</h2><p class="text-gray-600 mt-2">The requested page could not be found.</p></div>'; }

    // Placeholder initialization methods
    initializeKeywordResearch() {}
    initializeChannelAudit() {}
    initializeVideoAnalytics() {}
    initializeCompetitorAnalysis() {}
    initializeTrendingVideos() {}
    initializeTagSuggestions() {}
    initializeSEOOptimizer() {}
    initializeThumbnailAnalyzer() {}
    initializeBestTimePost() {}
    initializeSubscriberTracking() {}
    initializeMonetizationInsights() {}
}

// Export Dashboard class
window.Dashboard = new Dashboard();