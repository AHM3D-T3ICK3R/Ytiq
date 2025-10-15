// YTIQ Analytics Engine

class AnalyticsEngine {
    constructor() {
        this.charts = {};
        this.currentTimeRange = '30d';
        this.currentChannel = null;
    }

    // Channel Audit functionality
    getChannelAuditHTML() {
        return `
            <div class="space-y-6">
                <div class="flex justify-between items-center">
                    <div>
                        <h1 class="text-3xl font-bold text-gray-900">Channel Audit</h1>
                        <p class="text-gray-600 mt-1">Comprehensive analysis of your YouTube channel performance</p>
                    </div>
                    <div class="flex space-x-3">
                        <select id="auditTimeRange" class="px-4 py-2 border border-gray-300 rounded-md">
                            <option value="7d">Last 7 days</option>
                            <option value="30d" selected>Last 30 days</option>
                            <option value="90d">Last 90 days</option>
                            <option value="1y">Last year</option>
                        </select>
                        <button class="btn-primary" id="generateReport">
                            <i class="fas fa-file-alt mr-2"></i>Generate Report
                        </button>
                    </div>
                </div>

                <!-- Channel Overview -->
                <div class="card p-6">
                    <h3 class="text-lg font-semibold text-gray-900 mb-4">Channel Overview</h3>
                    <div class="grid grid-cols-1 md:grid-cols-5 gap-4">
                        <div class="text-center">
                            <div class="w-16 h-16 mx-auto mb-2 rounded-full overflow-hidden">
                                <img src="https://ui-avatars.com/api/?name=Tech+Reviews&background=ef4444&color=fff" alt="Channel Avatar" class="w-full h-full object-cover">
                            </div>
                            <h4 class="font-semibold text-gray-900">Tech Reviews Pro</h4>
                            <p class="text-sm text-gray-500">@techreviewspro</p>
                        </div>
                        <div class="text-center">
                            <p class="text-2xl font-bold text-gray-900">125K</p>
                            <p class="text-sm text-gray-500">Subscribers</p>
                        </div>
                        <div class="text-center">
                            <p class="text-2xl font-bold text-gray-900">2.5M</p>
                            <p class="text-sm text-gray-500">Total Views</p>
                        </div>
                        <div class="text-center">
                            <p class="text-2xl font-bold text-gray-900">234</p>
                            <p class="text-sm text-gray-500">Videos</p>
                        </div>
                        <div class="text-center">
                            <p class="text-2xl font-bold text-gray-900">4.5%</p>
                            <p class="text-sm text-gray-500">Avg. Engagement</p>
                        </div>
                    </div>
                </div>

                <!-- Performance Metrics -->
                <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div class="lg:col-span-2">
                        <div class="card p-6">
                            <h3 class="text-lg font-semibold text-gray-900 mb-4">Channel Growth</h3>
                            <div style="height: 300px;">
                                <canvas id="channelGrowthChart"></canvas>
                            </div>
                        </div>
                    </div>
                    <div>
                        <div class="card p-6">
                            <h3 class="text-lg font-semibold text-gray-900 mb-4">Audience Demographics</h3>
                            <div style="height: 300px;">
                                <canvas id="demographicsChart"></canvas>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- SEO Score -->
                <div class="card p-6">
                    <h3 class="text-lg font-semibold text-gray-900 mb-4">Channel SEO Score</h3>
                    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div class="text-center">
                            <div class="relative w-20 h-20 mx-auto mb-2">
                                <svg class="w-20 h-20" viewBox="0 0 36 36">
                                    <path d="m18,2.0845 a 15.9155,15.9155 0 0,1 0,31.831 a 15.9155,15.9155 0 0,1 0,-31.831" fill="none" stroke="#eee" stroke-width="2"/>
                                    <path d="m18,2.0845 a 15.9155,15.9155 0 0,1 0,31.831 a 15.9155,15.9155 0 0,1 0,-31.831" fill="none" stroke="#10b981" stroke-width="2" stroke-dasharray="85,100" stroke-linecap="round"/>
                                </svg>
                                <div class="absolute inset-0 flex items-center justify-center">
                                    <span class="text-lg font-bold text-gray-900">85</span>
                                </div>
                            </div>
                            <p class="font-medium text-gray-900">Overall Score</p>
                            <p class="text-sm text-gray-500">Excellent</p>
                        </div>
                        <div class="space-y-2">
                            <div class="flex items-center justify-between">
                                <span class="text-sm text-gray-600">Channel Info</span>
                                <span class="text-sm font-medium text-green-600">95%</span>
                            </div>
                            <div class="flex items-center justify-between">
                                <span class="text-sm text-gray-600">Video Titles</span>
                                <span class="text-sm font-medium text-yellow-600">78%</span>
                            </div>
                            <div class="flex items-center justify-between">
                                <span class="text-sm text-gray-600">Descriptions</span>
                                <span class="text-sm font-medium text-green-600">92%</span>
                            </div>
                            <div class="flex items-center justify-between">
                                <span class="text-sm text-gray-600">Tags Usage</span>
                                <span class="text-sm font-medium text-red-600">65%</span>
                            </div>
                        </div>
                        <div class="space-y-2">
                            <div class="flex items-center justify-between">
                                <span class="text-sm text-gray-600">Thumbnails</span>
                                <span class="text-sm font-medium text-green-600">88%</span>
                            </div>
                            <div class="flex items-center justify-between">
                                <span class="text-sm text-gray-600">Upload Schedule</span>
                                <span class="text-sm font-medium text-yellow-600">72%</span>
                            </div>
                            <div class="flex items-center justify-between">
                                <span class="text-sm text-gray-600">Engagement</span>
                                <span class="text-sm font-medium text-green-600">91%</span>
                            </div>
                            <div class="flex items-center justify-between">
                                <span class="text-sm text-gray-600">Keywords</span>
                                <span class="text-sm font-medium text-yellow-600">76%</span>
                            </div>
                        </div>
                        <div class="space-y-3">
                            <h4 class="font-medium text-gray-900">Recommendations</h4>
                            <ul class="space-y-2 text-sm">
                                <li class="flex items-start">
                                    <i class="fas fa-exclamation-triangle text-yellow-500 mr-2 mt-0.5"></i>
                                    <span>Improve tag usage consistency</span>
                                </li>
                                <li class="flex items-start">
                                    <i class="fas fa-lightbulb text-blue-500 mr-2 mt-0.5"></i>
                                    <span>Maintain regular upload schedule</span>
                                </li>
                                <li class="flex items-start">
                                    <i class="fas fa-search text-green-500 mr-2 mt-0.5"></i>
                                    <span>Research trending keywords</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                <!-- Top Performing Videos -->
                <div class="card p-6">
                    <h3 class="text-lg font-semibold text-gray-900 mb-4">Top Performing Videos</h3>
                    <div class="overflow-x-auto">
                        <table class="data-table w-full">
                            <thead>
                                <tr>
                                    <th>Video</th>
                                    <th>Views</th>
                                    <th>Engagement Rate</th>
                                    <th>Watch Time</th>
                                    <th>Revenue</th>
                                    <th>SEO Score</th>
                                </tr>
                            </thead>
                            <tbody id="topVideos">
                                <!-- Will be populated by JS -->
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;
    }

    // Video Analytics functionality
    getVideoAnalyticsHTML() {
        return `
            <div class="space-y-6">
                <div class="flex justify-between items-center">
                    <div>
                        <h1 class="text-3xl font-bold text-gray-900">Video Analytics</h1>
                        <p class="text-gray-600 mt-1">Deep insights into individual video performance</p>
                    </div>
                    <div class="flex space-x-3">
                        <input type="text" id="videoUrlInput" placeholder="Enter YouTube video URL" class="px-4 py-2 border border-gray-300 rounded-md w-80">
                        <button class="btn-primary" id="analyzeVideo">
                            <i class="fas fa-analytics mr-2"></i>Analyze Video
                        </button>
                    </div>
                </div>

                <!-- Video Selection -->
                <div class="card p-6">
                    <h3 class="text-lg font-semibold text-gray-900 mb-4">Recent Videos</h3>
                    <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4" id="recentVideosList">
                        <!-- Will be populated by JS -->
                    </div>
                </div>

                <!-- Video Analysis Results -->
                <div id="videoAnalysisResults" class="hidden space-y-6">
                    <!-- Video Overview -->
                    <div class="card p-6">
                        <div class="flex items-start space-x-4">
                            <img id="videoThumbnail" src="" alt="Video Thumbnail" class="w-32 h-18 object-cover rounded">
                            <div class="flex-1">
                                <h3 id="videoTitle" class="text-xl font-semibold text-gray-900 mb-2"></h3>
                                <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <div>
                                        <p class="text-sm text-gray-500">Views</p>
                                        <p id="videoViews" class="text-lg font-semibold">-</p>
                                    </div>
                                    <div>
                                        <p class="text-sm text-gray-500">Likes</p>
                                        <p id="videoLikes" class="text-lg font-semibold">-</p>
                                    </div>
                                    <div>
                                        <p class="text-sm text-gray-500">Comments</p>
                                        <p id="videoComments" class="text-lg font-semibold">-</p>
                                    </div>
                                    <div>
                                        <p class="text-sm text-gray-500">Engagement Rate</p>
                                        <p id="videoEngagement" class="text-lg font-semibold">-</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Performance Charts -->
                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div class="card p-6">
                            <h3 class="text-lg font-semibold text-gray-900 mb-4">View Performance</h3>
                            <div style="height: 300px;">
                                <canvas id="videoPerformanceChart"></canvas>
                            </div>
                        </div>
                        <div class="card p-6">
                            <h3 class="text-lg font-semibold text-gray-900 mb-4">Audience Retention</h3>
                            <div style="height: 300px;">
                                <canvas id="retentionChart"></canvas>
                            </div>
                        </div>
                    </div>

                    <!-- SEO Analysis -->
                    <div class="card p-6">
                        <h3 class="text-lg font-semibold text-gray-900 mb-4">SEO Analysis</h3>
                        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <div>
                                <h4 class="font-medium text-gray-900 mb-3">Current Performance</h4>
                                <div class="space-y-3">
                                    <div class="flex items-center justify-between">
                                        <span class="text-sm text-gray-600">Title Optimization</span>
                                        <div class="flex items-center">
                                            <div class="progress-bar w-16 mr-2" style="height: 6px;">
                                                <div class="progress-fill" style="width: 85%"></div>
                                            </div>
                                            <span class="text-sm font-medium">85%</span>
                                        </div>
                                    </div>
                                    <div class="flex items-center justify-between">
                                        <span class="text-sm text-gray-600">Description Quality</span>
                                        <div class="flex items-center">
                                            <div class="progress-bar w-16 mr-2" style="height: 6px;">
                                                <div class="progress-fill" style="width: 72%"></div>
                                            </div>
                                            <span class="text-sm font-medium">72%</span>
                                        </div>
                                    </div>
                                    <div class="flex items-center justify-between">
                                        <span class="text-sm text-gray-600">Tag Relevance</span>
                                        <div class="flex items-center">
                                            <div class="progress-bar w-16 mr-2" style="height: 6px;">
                                                <div class="progress-fill" style="width: 68%"></div>
                                            </div>
                                            <span class="text-sm font-medium">68%</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <h4 class="font-medium text-gray-900 mb-3">Keyword Analysis</h4>
                                <div class="space-y-2" id="videoKeywords">
                                    <!-- Will be populated by JS -->
                                </div>
                            </div>
                            <div>
                                <h4 class="font-medium text-gray-900 mb-3">Recommendations</h4>
                                <div class="space-y-2" id="seoRecommendations">
                                    <!-- Will be populated by JS -->
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    // Competitor Analysis functionality
    getCompetitorAnalysisHTML() {
        return `
            <div class="space-y-6">
                <div class="flex justify-between items-center">
                    <div>
                        <h1 class="text-3xl font-bold text-gray-900">Competitor Analysis</h1>
                        <p class="text-gray-600 mt-1">Analyze and compare with competing YouTube channels</p>
                    </div>
                    <div class="flex space-x-3">
                        <input type="text" id="competitorInput" placeholder="Enter competitor channel URL" class="px-4 py-2 border border-gray-300 rounded-md w-80">
                        <button class="btn-primary" id="addCompetitor">
                            <i class="fas fa-plus mr-2"></i>Add Competitor
                        </button>
                    </div>
                </div>

                <!-- Competitor Overview -->
                <div class="card p-6">
                    <div class="flex items-center justify-between mb-4">
                        <h3 class="text-lg font-semibold text-gray-900">Tracked Competitors</h3>
                        <div class="flex space-x-2">
                            <select id="comparisonMetric" class="px-3 py-2 border border-gray-300 rounded-md text-sm">
                                <option value="subscribers">Subscribers</option>
                                <option value="views">Total Views</option>
                                <option value="engagement">Engagement Rate</option>
                                <option value="growth">Growth Rate</option>
                            </select>
                        </div>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4" id="competitorCards">
                        <!-- Will be populated by JS -->
                    </div>
                </div>

                <!-- Performance Comparison -->
                <div class="card p-6">
                    <h3 class="text-lg font-semibold text-gray-900 mb-4">Performance Comparison</h3>
                    <div style="height: 400px;">
                        <canvas id="competitorChart"></canvas>
                    </div>
                </div>

                <!-- Content Analysis -->
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div class="card p-6">
                        <h3 class="text-lg font-semibold text-gray-900 mb-4">Top Content Strategies</h3>
                        <div class="space-y-4" id="contentStrategies">
                            <!-- Will be populated by JS -->
                        </div>
                    </div>
                    <div class="card p-6">
                        <h3 class="text-lg font-semibold text-gray-900 mb-4">Trending Topics</h3>
                        <div class="space-y-3" id="trendingTopics">
                            <!-- Will be populated by JS -->
                        </div>
                    </div>
                </div>

                <!-- Detailed Comparison Table -->
                <div class="card p-6">
                    <h3 class="text-lg font-semibold text-gray-900 mb-4">Detailed Comparison</h3>
                    <div class="overflow-x-auto">
                        <table class="data-table w-full">
                            <thead>
                                <tr>
                                    <th>Channel</th>
                                    <th>Subscribers</th>
                                    <th>Avg. Views</th>
                                    <th>Upload Frequency</th>
                                    <th>Engagement Rate</th>
                                    <th>Top Keywords</th>
                                </tr>
                            </thead>
                            <tbody id="competitorTable">
                                <!-- Will be populated by JS -->
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;
    }

    // Subscriber Tracking functionality
    getSubscriberTrackingHTML() {
        return `
            <div class="space-y-6">
                <div class="flex justify-between items-center">
                    <div>
                        <h1 class="text-3xl font-bold text-gray-900">Subscriber Tracking</h1>
                        <p class="text-gray-600 mt-1">Real-time subscriber analytics and growth insights</p>
                    </div>
                    <div class="flex space-x-3">
                        <button class="btn-secondary" id="subscriberAlerts">
                            <i class="fas fa-bell mr-2"></i>Set Alerts
                        </button>
                        <button class="btn-primary" id="trackSubscribers">
                            <i class="fas fa-sync mr-2"></i>Update Now
                        </button>
                    </div>
                </div>

                <!-- Real-time Stats -->
                <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div class="stat-card card p-6">
                        <div class="flex items-center">
                            <i class="fas fa-users text-3xl text-blue-600 mr-4"></i>
                            <div>
                                <p class="text-sm text-gray-600">Current Subscribers</p>
                                <p class="text-2xl font-bold text-gray-900">125,437</p>
                                <p class="text-sm text-green-600">
                                    <i class="fas fa-arrow-up mr-1"></i>+234 today
                                </p>
                            </div>
                        </div>
                    </div>
                    
                    <div class="stat-card card p-6">
                        <div class="flex items-center">
                            <i class="fas fa-chart-line text-3xl text-green-600 mr-4"></i>
                            <div>
                                <p class="text-sm text-gray-600">Daily Growth</p>
                                <p class="text-2xl font-bold text-gray-900">+234</p>
                                <p class="text-sm text-green-600">
                                    <i class="fas fa-arrow-up mr-1"></i>+12.5% vs yesterday
                                </p>
                            </div>
                        </div>
                    </div>
                    
                    <div class="stat-card card p-6">
                        <div class="flex items-center">
                            <i class="fas fa-calendar text-3xl text-purple-600 mr-4"></i>
                            <div>
                                <p class="text-sm text-gray-600">Monthly Growth</p>
                                <p class="text-2xl font-bold text-gray-900">+5.2K</p>
                                <p class="text-sm text-green-600">
                                    <i class="fas fa-arrow-up mr-1"></i>+4.3% this month
                                </p>
                            </div>
                        </div>
                    </div>
                    
                    <div class="stat-card card p-6">
                        <div class="flex items-center">
                            <i class="fas fa-target text-3xl text-orange-600 mr-4"></i>
                            <div>
                                <p class="text-sm text-gray-600">Goal Progress</p>
                                <p class="text-2xl font-bold text-gray-900">83%</p>
                                <p class="text-sm text-gray-600">to 150K goal</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Growth Chart -->
                <div class="card p-6">
                    <div class="flex items-center justify-between mb-4">
                        <h3 class="text-lg font-semibold text-gray-900">Subscriber Growth Trend</h3>
                        <div class="flex space-x-2">
                            <button class="px-3 py-1 text-sm border border-gray-300 rounded" data-range="7d">7D</button>
                            <button class="px-3 py-1 text-sm bg-ytiq-600 text-white rounded" data-range="30d">30D</button>
                            <button class="px-3 py-1 text-sm border border-gray-300 rounded" data-range="90d">90D</button>
                            <button class="px-3 py-1 text-sm border border-gray-300 rounded" data-range="1y">1Y</button>
                        </div>
                    </div>
                    <div style="height: 400px;">
                        <canvas id="subscriberGrowthChart"></canvas>
                    </div>
                </div>

                <!-- Growth Milestones -->
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div class="card p-6">
                        <h3 class="text-lg font-semibold text-gray-900 mb-4">Recent Milestones</h3>
                        <div class="space-y-4">
                            <div class="flex items-center space-x-4 p-3 bg-green-50 rounded-lg">
                                <div class="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                                    <i class="fas fa-trophy text-green-600"></i>
                                </div>
                                <div>
                                    <p class="font-medium text-gray-900">125K Subscribers Reached!</p>
                                    <p class="text-sm text-gray-500">2 days ago</p>
                                </div>
                            </div>
                            <div class="flex items-center space-x-4 p-3 bg-blue-50 rounded-lg">
                                <div class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                    <i class="fas fa-star text-blue-600"></i>
                                </div>
                                <div>
                                    <p class="font-medium text-gray-900">Best Daily Growth: +512</p>
                                    <p class="text-sm text-gray-500">1 week ago</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="card p-6">
                        <h3 class="text-lg font-semibold text-gray-900 mb-4">Growth Predictions</h3>
                        <div class="space-y-4">
                            <div>
                                <div class="flex justify-between items-center mb-1">
                                    <span class="text-sm text-gray-600">To reach 150K</span>
                                    <span class="text-sm font-medium">~45 days</span>
                                </div>
                                <div class="progress-bar">
                                    <div class="progress-fill" style="width: 83%"></div>
                                </div>
                            </div>
                            <div>
                                <div class="flex justify-between items-center mb-1">
                                    <span class="text-sm text-gray-600">To reach 200K</span>
                                    <span class="text-sm font-medium">~4 months</span>
                                </div>
                                <div class="progress-bar">
                                    <div class="progress-fill" style="width: 63%"></div>
                                </div>
                            </div>
                            <div>
                                <div class="flex justify-between items-center mb-1">
                                    <span class="text-sm text-gray-600">To reach 1M</span>
                                    <span class="text-sm font-medium">~2.1 years</span>
                                </div>
                                <div class="progress-bar">
                                    <div class="progress-fill" style="width: 13%"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Subscriber Sources -->
                <div class="card p-6">
                    <h3 class="text-lg font-semibold text-gray-900 mb-4">Subscriber Sources (Last 30 Days)</h3>
                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div style="height: 300px;">
                            <canvas id="subscriberSourcesChart"></canvas>
                        </div>
                        <div class="space-y-3">
                            <div class="flex items-center justify-between p-3 bg-gray-50 rounded">
                                <div class="flex items-center">
                                    <div class="w-4 h-4 bg-red-500 rounded mr-3"></div>
                                    <span class="text-sm text-gray-700">YouTube Search</span>
                                </div>
                                <span class="text-sm font-medium">2,156 (41.2%)</span>
                            </div>
                            <div class="flex items-center justify-between p-3 bg-gray-50 rounded">
                                <div class="flex items-center">
                                    <div class="w-4 h-4 bg-blue-500 rounded mr-3"></div>
                                    <span class="text-sm text-gray-700">Suggested Videos</span>
                                </div>
                                <span class="text-sm font-medium">1,834 (35.1%)</span>
                            </div>
                            <div class="flex items-center justify-between p-3 bg-gray-50 rounded">
                                <div class="flex items-center">
                                    <div class="w-4 h-4 bg-green-500 rounded mr-3"></div>
                                    <span class="text-sm text-gray-700">External Sources</span>
                                </div>
                                <span class="text-sm font-medium">743 (14.2%)</span>
                            </div>
                            <div class="flex items-center justify-between p-3 bg-gray-50 rounded">
                                <div class="flex items-center">
                                    <div class="w-4 h-4 bg-yellow-500 rounded mr-3"></div>
                                    <span class="text-sm text-gray-700">Direct/Unknown</span>
                                    </div>
                                <span class="text-sm font-medium">498 (9.5%)</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    // Initialize Channel Audit
    initializeChannelAudit() {
        this.populateTopVideos();
        this.initializeChannelGrowthChart();
        this.initializeDemographicsChart();
        this.setupChannelAuditEventListeners();
    }

    // Initialize Video Analytics
    initializeVideoAnalytics() {
        this.populateRecentVideosList();
        this.setupVideoAnalyticsEventListeners();
    }

    // Initialize Competitor Analysis
    initializeCompetitorAnalysis() {
        this.populateCompetitorCards();
        this.initializeCompetitorChart();
        this.populateContentStrategies();
        this.populateTrendingTopics();
        this.populateCompetitorTable();
        this.setupCompetitorAnalysisEventListeners();
    }

    // Initialize Subscriber Tracking
    initializeSubscriberTracking() {
        this.initializeSubscriberGrowthChart();
        this.initializeSubscriberSourcesChart();
        this.setupSubscriberTrackingEventListeners();
    }

    // Helper methods for populating data and setting up charts
    populateTopVideos() {
        const tbody = document.getElementById('topVideos');
        if (!tbody) return;

        const videos = MockData.generateVideoData(5);
        tbody.innerHTML = videos.map(video => {
            const engagementRate = Utils.analytics.calculateEngagementRate(video.likes, video.views);
            const seoScore = Utils.seo.calculateScore({
                title: video.title,
                description: video.description,
                tags: video.tags
            });

            return `
                <tr>
                    <td>
                        <div class="flex items-center">
                            <img src="${video.thumbnail}" alt="${video.title}" class="w-16 h-9 object-cover rounded mr-3">
                            <div>
                                <p class="font-medium text-gray-900 max-w-xs truncate">${video.title}</p>
                                <p class="text-sm text-gray-500">${Utils.formatRelativeTime(video.publishedAt)}</p>
                            </div>
                        </div>
                    </td>
                    <td class="font-medium">${Utils.formatNumber(video.views)}</td>
                    <td class="font-medium">${engagementRate.toFixed(1)}%</td>
                    <td class="font-medium">${Utils.formatDuration(video.duration)}</td>
                    <td class="font-medium">${Utils.formatCurrency(video.views * 0.002)}</td>
                    <td>
                        <span class="px-2 py-1 text-xs rounded-full ${seoScore > 70 ? 'bg-green-100 text-green-800' : seoScore > 50 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}">
                            ${seoScore}%
                        </span>
                    </td>
                </tr>
            `;
        }).join('');
    }

    initializeChannelGrowthChart() {
        const ctx = document.getElementById('channelGrowthChart')?.getContext('2d');
        if (!ctx) return;

        const data = MockData.generateAnalyticsData(30);
        
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: data.map(d => Utils.formatDate(d.date)),
                datasets: [{
                    label: 'Subscribers',
                    data: data.map((d, i) => 125000 + data.slice(0, i + 1).reduce((sum, day) => sum + day.subscribers, 0)),
                    borderColor: '#dc2626',
                    backgroundColor: 'rgba(220, 38, 38, 0.1)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: false
                    }
                }
            }
        });
    }

    initializeDemographicsChart() {
        const ctx = document.getElementById('demographicsChart')?.getContext('2d');
        if (!ctx) return;

        new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['18-24', '25-34', '35-44', '45-54', '55+'],
                datasets: [{
                    data: [25, 35, 20, 15, 5],
                    backgroundColor: [
                        '#ef4444',
                        '#f97316',
                        '#eab308',
                        '#22c55e',
                        '#3b82f6'
                    ]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false
            }
        });
    }

    // Add more methods for other charts and functionality...
    
    setupChannelAuditEventListeners() {
        document.getElementById('generateReport')?.addEventListener('click', () => {
            Utils.showNotification('Generating comprehensive channel report...', 'info');
        });
    }

    setupVideoAnalyticsEventListeners() {
        document.getElementById('analyzeVideo')?.addEventListener('click', () => {
            const videoUrl = document.getElementById('videoUrlInput')?.value;
            if (videoUrl) {
                this.analyzeSpecificVideo(videoUrl);
            } else {
                Utils.showNotification('Please enter a video URL', 'warning');
            }
        });
    }

    setupCompetitorAnalysisEventListeners() {
        document.getElementById('addCompetitor')?.addEventListener('click', () => {
            const competitorUrl = document.getElementById('competitorInput')?.value;
            if (competitorUrl) {
                this.addCompetitorChannel(competitorUrl);
            } else {
                Utils.showNotification('Please enter a competitor channel URL', 'warning');
            }
        });
    }

    setupSubscriberTrackingEventListeners() {
        document.getElementById('trackSubscribers')?.addEventListener('click', () => {
            Utils.showNotification('Updating subscriber data...', 'info');
        });
    }

    // Placeholder methods for specific functionality
    populateRecentVideosList() {
        // Implementation for recent videos list
    }

    analyzeSpecificVideo(videoUrl) {
        Utils.showNotification(`Analyzing video: ${videoUrl}`, 'info');
    }

    populateCompetitorCards() {
        // Implementation for competitor cards
    }

    initializeCompetitorChart() {
        // Implementation for competitor comparison chart
    }

    populateContentStrategies() {
        // Implementation for content strategies
    }

    populateTrendingTopics() {
        // Implementation for trending topics
    }

    populateCompetitorTable() {
        // Implementation for competitor comparison table
    }

    addCompetitorChannel(channelUrl) {
        Utils.showNotification(`Adding competitor: ${channelUrl}`, 'info');
    }

    initializeSubscriberGrowthChart() {
        const ctx = document.getElementById('subscriberGrowthChart')?.getContext('2d');
        if (!ctx) return;

        const data = MockData.generateAnalyticsData(30);
        let cumulativeSubscribers = 120000;
        
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: data.map(d => Utils.formatDate(d.date)),
                datasets: [{
                    label: 'Subscribers',
                    data: data.map(d => {
                        cumulativeSubscribers += d.subscribers;
                        return cumulativeSubscribers;
                    }),
                    borderColor: '#dc2626',
                    backgroundColor: 'rgba(220, 38, 38, 0.1)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: false
                    }
                }
            }
        });
    }

    initializeSubscriberSourcesChart() {
        const ctx = document.getElementById('subscriberSourcesChart')?.getContext('2d');
        if (!ctx) return;

        new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['YouTube Search', 'Suggested Videos', 'External Sources', 'Direct/Unknown'],
                datasets: [{
                    data: [41.2, 35.1, 14.2, 9.5],
                    backgroundColor: ['#ef4444', '#3b82f6', '#10b981', '#f59e0b']
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false
            }
        });
    }
}

// Export the analytics engine
window.AnalyticsEngine = new AnalyticsEngine();