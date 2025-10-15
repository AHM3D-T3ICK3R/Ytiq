// YTIQ Keyword Research Tool

class KeywordResearch {
    constructor() {
        this.keywords = [];
        this.searchHistory = Utils.storage.get('ytiq_keyword_history', []);
        this.currentKeyword = null;
    }

    getHTML() {
        return `
            <div class="space-y-6">
                <!-- Header -->
                <div class="flex justify-between items-center">
                    <div>
                        <h1 class="text-3xl font-bold text-gray-900">Keyword Research</h1>
                        <p class="text-gray-600 mt-1">Discover high-performing keywords for your YouTube content</p>
                    </div>
                    <div class="flex space-x-3">
                        <button class="btn-secondary" id="exportKeywords">
                            <i class="fas fa-download mr-2"></i>Export Data
                        </button>
                        <button class="btn-primary" id="saveKeywords">
                            <i class="fas fa-save mr-2"></i>Save Keywords
                        </button>
                    </div>
                </div>

                <!-- Search Section -->
                <div class="card p-6">
                    <div class="flex flex-col lg:flex-row gap-4">
                        <div class="flex-1">
                            <div class="relative">
                                <input 
                                    type="text" 
                                    id="keywordInput" 
                                    placeholder="Enter a keyword or phrase (e.g., 'how to make youtube videos')"
                                    class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ytiq-500 text-lg"
                                >
                                <div class="absolute inset-y-0 left-0 pl-3 flex items-center">
                                    <i class="fas fa-search text-gray-400"></i>
                                </div>
                            </div>
                        </div>
                        <div class="flex space-x-2">
                            <select id="searchLocation" class="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ytiq-500">
                                <option value="global">Global</option>
                                <option value="US">United States</option>
                                <option value="UK">United Kingdom</option>
                                <option value="CA">Canada</option>
                                <option value="AU">Australia</option>
                                <option value="IN">India</option>
                            </select>
                            <select id="searchLanguage" class="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ytiq-500">
                                <option value="en">English</option>
                                <option value="es">Spanish</option>
                                <option value="fr">French</option>
                                <option value="de">German</option>
                                <option value="pt">Portuguese</option>
                            </select>
                            <button id="searchKeywords" class="btn-primary px-6">
                                <i class="fas fa-search mr-2"></i>Search
                            </button>
                        </div>
                    </div>
                    
                    <!-- Quick Suggestions -->
                    <div class="mt-4">
                        <p class="text-sm text-gray-600 mb-2">Popular categories:</p>
                        <div class="flex flex-wrap gap-2">
                            <button class="tag quick-suggestion" data-keyword="youtube tutorial">YouTube Tutorial</button>
                            <button class="tag quick-suggestion" data-keyword="how to make">How To Make</button>
                            <button class="tag quick-suggestion" data-keyword="best practices">Best Practices</button>
                            <button class="tag quick-suggestion" data-keyword="tips and tricks">Tips and Tricks</button>
                            <button class="tag quick-suggestion" data-keyword="beginner guide">Beginner Guide</button>
                            <button class="tag quick-suggestion" data-keyword="advanced techniques">Advanced Techniques</button>
                        </div>
                    </div>
                </div>

                <!-- Search History -->
                <div class="card p-6" id="searchHistorySection" style="display: none;">
                    <h3 class="text-lg font-semibold text-gray-900 mb-4">Recent Searches</h3>
                    <div class="flex flex-wrap gap-2" id="searchHistoryList">
                        <!-- Will be populated by JS -->
                    </div>
                </div>

                <!-- Loading State -->
                <div id="keywordLoadingState" class="hidden">
                    <div class="card p-8 text-center">
                        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-ytiq-600 mx-auto mb-4"></div>
                        <h3 class="text-lg font-semibold text-gray-900">Analyzing Keywords...</h3>
                        <p class="text-gray-600">This may take a few moments</p>
                    </div>
                </div>

                <!-- Results Section -->
                <div id="keywordResults" class="hidden space-y-6">
                    <!-- Main Keyword Analysis -->
                    <div class="card p-6">
                        <div class="flex items-center justify-between mb-4">
                            <h3 class="text-lg font-semibold text-gray-900">Keyword Analysis</h3>
                            <div class="flex items-center space-x-4">
                                <div class="text-sm text-gray-500">
                                    Last updated: <span id="lastUpdated">-</span>
                                </div>
                            </div>
                        </div>
                        
                        <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                            <div class="stat-card p-4">
                                <div class="flex items-center">
                                    <i class="fas fa-search text-blue-600 text-xl mr-3"></i>
                                    <div>
                                        <p class="text-sm text-gray-600">Search Volume</p>
                                        <p class="text-xl font-bold text-gray-900" id="searchVolume">-</p>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="stat-card p-4">
                                <div class="flex items-center">
                                    <i class="fas fa-chart-line text-green-600 text-xl mr-3"></i>
                                    <div>
                                        <p class="text-sm text-gray-600">Competition</p>
                                        <div class="flex items-center">
                                            <p class="text-xl font-bold text-gray-900 mr-2" id="competitionScore">-</p>
                                            <span class="text-xs px-2 py-1 rounded-full" id="competitionLevel">-</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="stat-card p-4">
                                <div class="flex items-center">
                                    <i class="fas fa-trending-up text-purple-600 text-xl mr-3"></i>
                                    <div>
                                        <p class="text-sm text-gray-600">Trend</p>
                                        <div class="flex items-center">
                                            <p class="text-xl font-bold text-gray-900 mr-2" id="trendDirection">-</p>
                                            <i id="trendIcon" class="text-sm"></i>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="stat-card p-4">
                                <div class="flex items-center">
                                    <i class="fas fa-dollar-sign text-yellow-600 text-xl mr-3"></i>
                                    <div>
                                        <p class="text-sm text-gray-600">Est. CPC</p>
                                        <p class="text-xl font-bold text-gray-900" id="estimatedCPC">-</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Keyword Difficulty Meter -->
                        <div class="mb-4">
                            <div class="flex items-center justify-between mb-2">
                                <span class="text-sm font-medium text-gray-700">Keyword Difficulty</span>
                                <span class="text-sm text-gray-500" id="difficultyScore">-/100</span>
                            </div>
                            <div class="progress-bar">
                                <div class="progress-fill" id="difficultyBar" style="width: 0%"></div>
                            </div>
                        </div>
                    </div>

                    <!-- Related Keywords -->
                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div class="card p-6">
                            <h3 class="text-lg font-semibold text-gray-900 mb-4">Related Keywords</h3>
                            <div class="space-y-3" id="relatedKeywords">
                                <!-- Will be populated by JS -->
                            </div>
                        </div>

                        <div class="card p-6">
                            <h3 class="text-lg font-semibold text-gray-900 mb-4">Long-tail Suggestions</h3>
                            <div class="space-y-3" id="longtailKeywords">
                                <!-- Will be populated by JS -->
                            </div>
                        </div>
                    </div>

                    <!-- Search Volume Trends -->
                    <div class="card p-6">
                        <h3 class="text-lg font-semibold text-gray-900 mb-4">Search Volume Trend (12 Months)</h3>
                        <div style="height: 300px;">
                            <canvas id="trendChart"></canvas>
                        </div>
                    </div>

                    <!-- Keyword Ideas Table -->
                    <div class="card p-6">
                        <div class="flex items-center justify-between mb-4">
                            <h3 class="text-lg font-semibold text-gray-900">Keyword Opportunities</h3>
                            <div class="flex space-x-2">
                                <select id="sortKeywords" class="px-3 py-2 border border-gray-300 rounded-md text-sm">
                                    <option value="volume">Sort by Volume</option>
                                    <option value="competition">Sort by Competition</option>
                                    <option value="difficulty">Sort by Difficulty</option>
                                    <option value="cpc">Sort by CPC</option>
                                </select>
                                <button class="btn-secondary text-sm" id="filterKeywords">
                                    <i class="fas fa-filter mr-1"></i>Filters
                                </button>
                            </div>
                        </div>
                        
                        <div class="overflow-x-auto">
                            <table class="data-table w-full">
                                <thead>
                                    <tr>
                                        <th>Keyword</th>
                                        <th>Volume</th>
                                        <th>Competition</th>
                                        <th>Difficulty</th>
                                        <th>CPC</th>
                                        <th>Opportunity</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody id="keywordTable">
                                    <!-- Will be populated by JS -->
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    initialize() {
        this.setupEventListeners();
        this.updateSearchHistory();
    }

    setupEventListeners() {
        // Search functionality
        const searchBtn = document.getElementById('searchKeywords');
        const keywordInput = document.getElementById('keywordInput');

        searchBtn?.addEventListener('click', () => this.performSearch());
        keywordInput?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.performSearch();
            }
        });

        // Quick suggestions
        document.querySelectorAll('.quick-suggestion').forEach(btn => {
            btn.addEventListener('click', () => {
                const keyword = btn.getAttribute('data-keyword');
                document.getElementById('keywordInput').value = keyword;
                this.performSearch();
            });
        });

        // Export and save buttons
        document.getElementById('exportKeywords')?.addEventListener('click', () => {
            this.exportKeywordData();
        });

        document.getElementById('saveKeywords')?.addEventListener('click', () => {
            this.saveKeywordList();
        });

        // Sort and filter
        document.getElementById('sortKeywords')?.addEventListener('change', (e) => {
            this.sortKeywords(e.target.value);
        });

        document.getElementById('filterKeywords')?.addEventListener('click', () => {
            this.showFilterModal();
        });
    }

    updateSearchHistory() {
        const historySection = document.getElementById('searchHistorySection');
        const historyList = document.getElementById('searchHistoryList');
        
        if (this.searchHistory.length > 0) {
            historySection.style.display = 'block';
            historyList.innerHTML = this.searchHistory.slice(-10).reverse().map(keyword => 
                `<button class="tag hover:bg-gray-200 cursor-pointer" onclick="document.getElementById('keywordInput').value='${keyword}'">${keyword}</button>`
            ).join('');
        }
    }

    async performSearch() {
        const keyword = document.getElementById('keywordInput').value.trim();
        if (!keyword) {
            Utils.showNotification('Please enter a keyword to search', 'warning');
            return;
        }

        this.currentKeyword = keyword;
        
        // Add to search history
        if (!this.searchHistory.includes(keyword)) {
            this.searchHistory.push(keyword);
            Utils.storage.set('ytiq_keyword_history', this.searchHistory);
            this.updateSearchHistory();
        }

        // Show loading state
        document.getElementById('keywordResults').classList.add('hidden');
        document.getElementById('keywordLoadingState').classList.remove('hidden');

        try {
            // Simulate API call with delay
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Generate mock data for the keyword
            const keywordData = MockData.generateKeywordData(keyword);
            
            // Generate related keywords
            const relatedKeywords = this.generateRelatedKeywords(keyword);
            const longtailKeywords = this.generateLongtailKeywords(keyword);
            const keywordOpportunities = this.generateKeywordOpportunities(keyword);

            // Update UI with results
            this.displayKeywordResults(keywordData, relatedKeywords, longtailKeywords, keywordOpportunities);

        } catch (error) {
            Utils.showNotification('Error performing keyword search', 'error');
            console.error('Keyword search error:', error);
        } finally {
            document.getElementById('keywordLoadingState').classList.add('hidden');
            document.getElementById('keywordResults').classList.remove('hidden');
        }
    }

    displayKeywordResults(keywordData, relatedKeywords, longtailKeywords, keywordOpportunities) {
        // Update main keyword stats
        document.getElementById('searchVolume').textContent = Utils.formatNumber(keywordData.searchVolume);
        document.getElementById('competitionScore').textContent = Math.round(keywordData.competition * 100);
        document.getElementById('estimatedCPC').textContent = Utils.formatCurrency(keywordData.cpc);
        document.getElementById('lastUpdated').textContent = new Date().toLocaleString();

        // Competition level
        const competitionLevel = document.getElementById('competitionLevel');
        const competition = keywordData.competition;
        if (competition < 0.3) {
            competitionLevel.textContent = 'Low';
            competitionLevel.className = 'text-xs px-2 py-1 rounded-full bg-green-100 text-green-800';
        } else if (competition < 0.7) {
            competitionLevel.textContent = 'Medium';
            competitionLevel.className = 'text-xs px-2 py-1 rounded-full bg-yellow-100 text-yellow-800';
        } else {
            competitionLevel.textContent = 'High';
            competitionLevel.className = 'text-xs px-2 py-1 rounded-full bg-red-100 text-red-800';
        }

        // Trend direction
        const trendDirection = document.getElementById('trendDirection');
        const trendIcon = document.getElementById('trendIcon');
        if (keywordData.trend === 'up') {
            trendDirection.textContent = 'Rising';
            trendIcon.className = 'fas fa-arrow-up text-green-600';
        } else {
            trendDirection.textContent = 'Stable';
            trendIcon.className = 'fas fa-minus text-gray-600';
        }

        // Difficulty score
        document.getElementById('difficultyScore').textContent = `${keywordData.difficulty}/100`;
        document.getElementById('difficultyBar').style.width = `${keywordData.difficulty}%`;

        // Related keywords
        this.displayKeywordList('relatedKeywords', relatedKeywords);
        this.displayKeywordList('longtailKeywords', longtailKeywords);

        // Keyword opportunities table
        this.displayKeywordTable(keywordOpportunities);

        // Trend chart
        this.displayTrendChart(keywordData.monthlySearches);
    }

    displayKeywordList(containerId, keywords) {
        const container = document.getElementById(containerId);
        if (!container) return;

        container.innerHTML = keywords.map(keyword => `
            <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer"
                 onclick="document.getElementById('keywordInput').value='${keyword.keyword}'; window.Dashboard.showPage('keyword-research');">
                <div class="flex-1">
                    <p class="font-medium text-gray-900">${keyword.keyword}</p>
                    <p class="text-sm text-gray-500">${Utils.formatNumber(keyword.volume)} searches/month</p>
                </div>
                <div class="text-right">
                    <span class="text-sm font-medium text-gray-700">${Math.round(keyword.competition * 100)}% comp</span>
                </div>
            </div>
        `).join('');
    }

    displayKeywordTable(keywords) {
        const tbody = document.getElementById('keywordTable');
        if (!tbody) return;

        tbody.innerHTML = keywords.map(keyword => {
            const opportunityScore = this.calculateOpportunityScore(keyword);
            const opportunityClass = opportunityScore > 70 ? 'text-green-600' : opportunityScore > 40 ? 'text-yellow-600' : 'text-red-600';
            
            return `
                <tr class="hover:bg-gray-50">
                    <td>
                        <div>
                            <p class="font-medium text-gray-900">${keyword.keyword}</p>
                            <div class="flex flex-wrap gap-1 mt-1">
                                ${keyword.tags ? keyword.tags.map(tag => `<span class="tag text-xs">${tag}</span>`).join('') : ''}
                            </div>
                        </div>
                    </td>
                    <td class="font-medium">${Utils.formatNumber(keyword.volume)}</td>
                    <td>
                        <div class="flex items-center">
                            <div class="progress-bar w-16 mr-2" style="height: 6px;">
                                <div class="progress-fill" style="width: ${keyword.competition * 100}%"></div>
                            </div>
                            <span class="text-sm">${Math.round(keyword.competition * 100)}%</span>
                        </div>
                    </td>
                    <td class="font-medium">${keyword.difficulty}/100</td>
                    <td class="font-medium">${Utils.formatCurrency(keyword.cpc)}</td>
                    <td>
                        <span class="font-medium ${opportunityClass}">${opportunityScore}%</span>
                    </td>
                    <td>
                        <div class="flex space-x-2">
                            <button class="text-blue-600 hover:text-blue-800 text-sm" onclick="navigator.clipboard.writeText('${keyword.keyword}')">
                                <i class="fas fa-copy"></i>
                            </button>
                            <button class="text-green-600 hover:text-green-800 text-sm" onclick="this.saveKeyword('${keyword.keyword}')">
                                <i class="fas fa-save"></i>
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        }).join('');
    }

    displayTrendChart(monthlySearches) {
        const ctx = document.getElementById('trendChart')?.getContext('2d');
        if (!ctx) return;

        if (this.trendChart) {
            this.trendChart.destroy();
        }

        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        
        this.trendChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: months,
                datasets: [{
                    label: 'Search Volume',
                    data: monthlySearches,
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
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Search Volume'
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });
    }

    generateRelatedKeywords(baseKeyword) {
        const variations = [
            `${baseKeyword} tutorial`,
            `best ${baseKeyword}`,
            `${baseKeyword} guide`,
            `${baseKeyword} tips`,
            `how to ${baseKeyword}`,
            `${baseKeyword} for beginners`,
            `${baseKeyword} 2024`,
            `${baseKeyword} step by step`
        ];

        return variations.map(keyword => ({
            keyword,
            volume: Math.floor(Math.random() * 50000) + 1000,
            competition: Math.random()
        }));
    }

    generateLongtailKeywords(baseKeyword) {
        const longtails = [
            `how to get better at ${baseKeyword}`,
            `${baseKeyword} for small channels`,
            `${baseKeyword} without experience`,
            `complete ${baseKeyword} course`,
            `${baseKeyword} mistakes to avoid`,
            `advanced ${baseKeyword} strategies`,
            `${baseKeyword} tools and software`,
            `${baseKeyword} case study analysis`
        ];

        return longtails.map(keyword => ({
            keyword,
            volume: Math.floor(Math.random() * 10000) + 500,
            competition: Math.random() * 0.5 // Generally lower competition for long-tail
        }));
    }

    generateKeywordOpportunities(baseKeyword) {
        const opportunities = [];
        const baseVolume = Math.floor(Math.random() * 100000) + 5000;
        
        for (let i = 0; i < 20; i++) {
            const variations = [
                `${baseKeyword} ${['tutorial', 'guide', 'tips', 'tricks', 'hacks', 'secrets', 'strategy', 'method'][Math.floor(Math.random() * 8)]}`,
                `${'how to,best,top,ultimate,complete,easy,quick,simple'.split(',')[Math.floor(Math.random() * 8)]} ${baseKeyword}`,
                `${baseKeyword} ${'2024,for beginners,step by step,without,with,using,advanced,pro'.split(',')[Math.floor(Math.random() * 8)]}`,
            ];
            
            const keyword = variations[Math.floor(Math.random() * variations.length)];
            
            opportunities.push({
                keyword,
                volume: Math.floor(baseVolume * (Math.random() * 0.8 + 0.2)),
                competition: Math.random(),
                difficulty: Math.floor(Math.random() * 100),
                cpc: Math.random() * 5 + 0.1,
                tags: ['high-volume', 'low-competition', 'trending'].filter(() => Math.random() > 0.6)
            });
        }

        return opportunities.sort((a, b) => b.volume - a.volume);
    }

    calculateOpportunityScore(keyword) {
        // Simple opportunity scoring algorithm
        const volumeScore = Math.min(keyword.volume / 10000, 1) * 40;
        const competitionScore = (1 - keyword.competition) * 30;
        const difficultyScore = (1 - (keyword.difficulty / 100)) * 20;
        const cpcScore = Math.min(keyword.cpc / 2, 1) * 10;
        
        return Math.round(volumeScore + competitionScore + difficultyScore + cpcScore);
    }

    sortKeywords(sortBy) {
        // Implementation for sorting keywords
        Utils.showNotification(`Sorting keywords by ${sortBy}`, 'info');
    }

    showFilterModal() {
        Utils.showNotification('Filter options coming soon', 'info');
    }

    exportKeywordData() {
        if (!this.currentKeyword) {
            Utils.showNotification('No keyword data to export', 'warning');
            return;
        }

        const data = {
            keyword: this.currentKeyword,
            exportedAt: new Date().toISOString(),
            keywords: this.keywords
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `ytiq-keywords-${this.currentKeyword.replace(/\s+/g, '-')}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        Utils.showNotification('Keyword data exported successfully', 'success');
    }

    saveKeywordList() {
        if (!this.currentKeyword) {
            Utils.showNotification('No keywords to save', 'warning');
            return;
        }

        const savedKeywords = Utils.storage.get('ytiq_saved_keywords', []);
        savedKeywords.push({
            keyword: this.currentKeyword,
            savedAt: new Date().toISOString(),
            data: this.keywords
        });

        Utils.storage.set('ytiq_saved_keywords', savedKeywords);
        Utils.showNotification('Keywords saved to your account', 'success');
    }

    saveKeyword(keyword) {
        const savedKeywords = Utils.storage.get('ytiq_individual_keywords', []);
        if (!savedKeywords.includes(keyword)) {
            savedKeywords.push(keyword);
            Utils.storage.set('ytiq_individual_keywords', savedKeywords);
            Utils.showNotification(`"${keyword}" saved`, 'success');
        } else {
            Utils.showNotification(`"${keyword}" already saved`, 'info');
        }
    }
}

// Export the class
window.KeywordResearch = new KeywordResearch();