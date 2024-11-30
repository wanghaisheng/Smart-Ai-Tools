// Constants
const SMART_PROMPTS_API = 'http://localhost:5000/api/smart-prompts';
const AUTH_API = 'http://localhost:5000/api/auth';

class SmartPromptsUI {
  constructor() {
    this.activeTab = 'public';
    this.searchQuery = '';
    this.prompts = [];
    this.container = null;
    this.initialized = false;
    this.isAuthenticated = false;
    this.authToken = null;
    this.currentPage = 1;
    this.totalPages = 1;
    this.isLoading = false;
    this.settings = {
      autoSync: true,
      darkMode: window.matchMedia('(prefers-color-scheme: dark)').matches,
      fontSize: 'medium',
      promptsPerPage: 12
    };
  }

  async initialize() {
    try {
      console.log('Initializing Smart Prompts UI...');
      
      // Check authentication status
      await this.checkAuthStatus();
      
      // Create root container that sits outside ChatGPT's React tree
      const rootContainer = document.createElement('div');
      rootContainer.id = 'smart-prompts-root';
      document.body.appendChild(rootContainer);
      
      // Create our extension container
      this.container = document.createElement('div');
      this.container.className = 'smart-prompts-extension-container';
      rootContainer.appendChild(this.container);
      
      // If not authenticated, show login form
      if (!this.isAuthenticated) {
        this.showAuthForm();
        return;
      }
      
      // Create the wrapper structure for authenticated users
      this.container.innerHTML = `
        <div class="smart-prompts-wrapper">
          <div class="smart-prompts-header">
            <h1>Smart Prompts</h1>
            <button class="action-button" id="logout-btn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
            </button>
          </div>
          
          <div class="smart-prompts-content">
            <input 
              type="text" 
              class="search-input" 
              placeholder="Search prompts..." 
              value="${this.searchQuery}"
            />
            
            <div class="tabs-container">
              <button class="tab-button ${this.activeTab === 'all' ? 'active' : ''}" data-tab="all">
                All Prompts
              </button>
              <button class="tab-button ${this.activeTab === 'my-prompts' ? 'active' : ''}" data-tab="my-prompts" ${!this.isAuthenticated ? 'disabled' : ''}>
                My Prompts
              </button>
              <button class="tab-button ${this.activeTab === 'public' ? 'active' : ''}" data-tab="public">
                Public Prompts
              </button>
              <button class="tab-button ${this.activeTab === 'favorites' ? 'active' : ''}" data-tab="favorites" ${!this.isAuthenticated ? 'disabled' : ''}>
                Favorites
              </button>
            </div>
            
            ${this.isLoading ? this.renderLoading() : this.renderPrompts()}
          </div>
        </div>
      `;
      
      // Add event listeners
      this.attachEventListeners();
      
      console.log('Initial render complete');
      
      // Load settings
      const savedSettings = await chrome.storage.local.get('smartPromptsSettings');
      if (savedSettings.smartPromptsSettings) {
        this.settings = { ...this.settings, ...savedSettings.smartPromptsSettings };
      }
      
      // Add resize observer to adjust layout
      this.setupResizeObserver();
      
      // Mark as initialized
      this.initialized = true;
      console.log('Smart Prompts UI initialized');
      
      // Load initial data
      await this.fetchPrompts();
    } catch (error) {
      console.error('Failed to initialize Smart Prompts:', error);
    }
  }

  async checkAuthStatus() {
    try {
      // Check if we have a token in storage
      const auth = await chrome.storage.local.get('smartPromptsAuth');
      if (auth.smartPromptsAuth?.token) {
        this.authToken = auth.smartPromptsAuth.token;
        this.isAuthenticated = true;
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
      this.isAuthenticated = false;
    }
  }

  showAuthForm() {
    this.container.innerHTML = `
      <div class="smart-prompts-wrapper">
        <div class="smart-prompts-header">
          <h1>Smart Prompts</h1>
        </div>
        
        <div class="smart-prompts-content">
          <div class="auth-form p-4">
            <h2 class="text-xl font-semibold mb-4 text-center">Login or Register</h2>
            <form id="authForm" class="space-y-4">
              <div class="mb-4">
                <input type="email" id="email" placeholder="Email" required
                  class="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:border-blue-500 focus:outline-none">
              </div>
              <div class="mb-4">
                <input type="password" id="password" placeholder="Password" required
                  class="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:border-blue-500 focus:outline-none">
              </div>
              <div class="mb-4" id="registerFields" style="display: none;">
                <input type="text" id="username" placeholder="Username"
                  class="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:border-blue-500 focus:outline-none">
              </div>
              <div class="flex justify-between mb-4">
                <button type="button" id="toggleAuth" class="text-blue-500 hover:text-blue-400">
                  Create Account
                </button>
              </div>
              <button type="submit" id="submitAuth" 
                class="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition-colors">
                Login
              </button>
            </form>
            <div id="authError" class="mt-4 text-red-500 text-center hidden"></div>
          </div>
        </div>
      </div>
    `;

    // Add auth form event listeners
    this.attachAuthEventListeners();
  }

  attachAuthEventListeners() {
    const form = document.getElementById('authForm');
    const toggleBtn = document.getElementById('toggleAuth');
    const submitBtn = document.getElementById('submitAuth');
    const registerFields = document.getElementById('registerFields');
    let isLoginMode = true;

    toggleBtn.addEventListener('click', () => {
      isLoginMode = !isLoginMode;
      registerFields.style.display = isLoginMode ? 'none' : 'block';
      toggleBtn.textContent = isLoginMode ? 'Create Account' : 'Back to Login';
      submitBtn.textContent = isLoginMode ? 'Login' : 'Register';
    });

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      const username = document.getElementById('username')?.value;
      const errorDiv = document.getElementById('authError');

      try {
        const endpoint = isLoginMode ? '/login' : '/register';
        const data = await this.sendRequest(AUTH_API + endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: isLoginMode ? { email, password } : { email, password, username }
        });

        // Store auth token
        await chrome.storage.local.set({
          smartPromptsAuth: {
            token: data.token,
            user: data.user
          }
        });

        this.authToken = data.token;
        this.isAuthenticated = true;

        // Reinitialize the UI
        this.initialize();
      } catch (error) {
        console.error('Auth error:', error);
        errorDiv.textContent = error.message;
        errorDiv.classList.remove('hidden');
      }
    });
  }

  async sendRequest(url, options = {}) {
    try {
      const response = await chrome.runtime.sendMessage({
        type: 'API_REQUEST',
        url,
        ...options
      });

      if (!response.success) {
        throw new Error(response.error || 'Request failed');
      }

      return response.data;
    } catch (error) {
      console.error('Request error:', error);
      throw error;
    }
  }

  attachEventListeners() {
    // Delegate event handling to the container
    this.container.addEventListener('click', async (e) => {
      const target = e.target.closest('[data-tab], [data-action], [data-page], #logout-btn');
      if (!target) return;

      // Handle tab switching
      const tabId = target.dataset.tab;
      if (tabId) {
        if (tabId === this.activeTab) return;
        
        if (['my-prompts', 'favorites'].includes(tabId) && !this.isAuthenticated) {
          this.showAuthForm();
          return;
        }

        this.activeTab = tabId;
        this.currentPage = 1;
        await this.fetchPrompts();
        return;
      }

      // Handle actions (favorite, copy)
      const action = target.dataset.action;
      if (action) {
        const promptCard = target.closest('.prompt-card');
        if (!promptCard) return;
        
        const promptId = promptCard.dataset.promptId;
        
        if (action === 'favorite') {
          if (!this.isAuthenticated) {
            this.showAuthForm();
            return;
          }
          await this.toggleFavorite(promptId);
        } else if (action === 'copy') {
          await this.copyPrompt(promptId);
        }
        return;
      }

      // Handle pagination
      const page = target.dataset.page;
      if (page) {
        const pageNum = parseInt(page);
        if (pageNum !== this.currentPage) {
          this.currentPage = pageNum;
          await this.fetchPrompts();
        }
        return;
      }

      // Handle logout
      if (target.id === 'logout-btn') {
        await this.handleLogout();
      }
    });

    // Handle search input
    this.container.addEventListener('input', this.debounce(async (e) => {
      if (!e.target.matches('.search-input')) return;
      
      this.searchQuery = e.target.value;
      this.currentPage = 1;
      await this.fetchPrompts();
    }, 300));
  }

  renderLoading() {
    return '<div class="loading-spinner"></div>';
  }

  renderPrompts() {
    if (this.prompts.length === 0) {
      return this.renderEmptyState();
    }

    return `
      <div class="prompts-grid">
        ${this.prompts.map(prompt => `
          <div class="prompt-card" data-prompt-id="${prompt._id}">
            <div class="prompt-card-header">
              <div>
                <h3 class="prompt-title">${this.escapeHtml(prompt.title)}</h3>
                <p class="prompt-author">By ${this.escapeHtml(prompt.author?.username || 'Anonymous')}</p>
              </div>
              <div class="prompt-actions">
                ${this.isAuthenticated ? `
                  <button class="action-button favorite ${prompt.favorites?.includes(this.userId) ? 'active' : ''}" data-action="favorite">
                    <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                    </svg>
                  </button>
                ` : ''}
                <button class="action-button" data-action="copy">
                  <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M8 3H5a2 2 0 00-2 2v9m0 0h3m-3 0v-9m0 9h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M5 7h14M5 12h14M5 17h7"/>
                  </svg>
                </button>
              </div>
            </div>
            
            <p class="prompt-description">${this.escapeHtml(prompt.description)}</p>
            
            ${prompt.tags?.length ? `
              <div class="prompt-tags">
                ${prompt.tags.map(tag => `
                  <span class="prompt-tag">${this.escapeHtml(tag)}</span>
                `).join('')}
              </div>
            ` : ''}
            
            <div class="prompt-footer">
              <span>${this.formatDate(prompt.createdAt)}</span>
              <div>
                <span>${prompt.likes?.length || 0} likes</span>
                <span class="mx-2">•</span>
                <span>${prompt.saves?.length || 0} saves</span>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
      ${this.renderPagination()}
    `;
  }

  renderEmptyState() {
    const messages = {
      'all': 'No prompts found. Try adjusting your search filters.',
      'my-prompts': 'You haven\'t created any prompts yet.',
      'public': 'No public prompts found.',
      'favorites': 'You haven\'t favorited any prompts yet.'
    };

    return `
      <div class="empty-state">
        <div class="empty-state-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
          </svg>
        </div>
        <p>${messages[this.activeTab] || messages['all']}</p>
      </div>
    `;
  }

  renderPagination() {
    if (this.totalPages <= 1) return '';

    return `
      <div class="pagination">
        <button class="pagination-btn" 
                onclick="window.smartPromptsUI.handlePageChange(1)"
                ${this.currentPage === 1 ? 'disabled' : ''}>
          «
        </button>
        ${Array.from({ length: this.totalPages }, (_, i) => i + 1)
          .map(page => `
            <button class="pagination-btn ${page === this.currentPage ? 'active' : ''}"
                    onclick="window.smartPromptsUI.handlePageChange(${page})">
              ${page}
            </button>
          `).join('')}
        <button class="pagination-btn"
                onclick="window.smartPromptsUI.handlePageChange(${this.totalPages})"
                ${this.currentPage === this.totalPages ? 'disabled' : ''}>
          »
        </button>
      </div>
    `;
  }

  escapeHtml(unsafe) {
    return unsafe
      ? unsafe
          .replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;")
          .replace(/"/g, "&quot;")
          .replace(/'/g, "&#039;")
      : '';
  }

  formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  }

  async fetchPrompts() {
    try {
      this.isLoading = true;
      this.updateUI();

      const queryParams = new URLSearchParams({
        page: this.currentPage,
        limit: this.settings.promptsPerPage,
        search: this.searchQuery,
        view: this.activeTab
      });

      const response = await fetch(`${SMART_PROMPTS_API}?${queryParams}`, {
        headers: this.authToken ? {
          'Authorization': `Bearer ${this.authToken}`
        } : {}
      });

      if (!response.ok) throw new Error('Failed to fetch prompts');

      const data = await response.json();
      this.prompts = data.prompts;
      this.totalPages = data.totalPages;
      
    } catch (error) {
      console.error('Error fetching prompts:', error);
      this.prompts = [];
      this.totalPages = 1;
    } finally {
      this.isLoading = false;
      this.updateUI();
    }
  }

  async toggleFavorite(promptId) {
    if (!this.isAuthenticated) {
      this.showAuthForm();
      return;
    }

    try {
      const response = await fetch(`${SMART_PROMPTS_API}/${promptId}/favorite`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.authToken}`
        }
      });

      if (!response.ok) throw new Error('Failed to toggle favorite');

      await this.fetchPrompts();
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  }

  async copyPrompt(promptId) {
    try {
      const prompt = this.prompts.find(p => p._id === promptId);
      if (!prompt) return;

      await navigator.clipboard.writeText(prompt.content);
      this.showToast('Prompt copied to clipboard!');
    } catch (error) {
      console.error('Error copying prompt:', error);
      this.showToast('Failed to copy prompt', 'error');
    }
  }

  showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => {
      toast.remove();
    }, 3000);
  }

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
  }

  async handleLogout() {
    try {
      await chrome.storage.local.remove('smartPromptsAuth');
      this.authToken = null;
      this.isAuthenticated = false;
      this.showAuthForm();
    } catch (error) {
      console.error('Error logging out:', error);
    }
  }

  setupResizeObserver() {
    // Observe main content to adjust our sidebar
    const mainContent = document.querySelector('main');
    if (mainContent) {
      const resizeObserver = new ResizeObserver(entries => {
        for (const entry of entries) {
          const mainWidth = entry.contentRect.width;
          const mainRight = window.innerWidth - (entry.target.getBoundingClientRect().left + entry.contentRect.width);
          
          // Adjust our container position if needed
          if (this.container) {
            // Remove any left positioning
            this.container.style.left = '';
            // Add right positioning with no gap
            this.container.style.right = '0px';
            // Adjust main content padding to make space for our sidebar
            entry.target.style.paddingLeft = '';
            entry.target.style.paddingRight = '326px'; // Increased to match new width (286px) plus some spacing
          }
        }
      });
      
      resizeObserver.observe(mainContent);
    }
  }

  updateUI() {
    this.render();
  }

  waitForElement(selector, timeout = 10000) {
    console.log(`Waiting for element: ${selector}`);
    return new Promise((resolve) => {
      if (document.querySelector(selector)) {
        console.log('Element found immediately');
        resolve(document.querySelector(selector));
        return;
      }

      const observer = new MutationObserver(() => {
        const element = document.querySelector(selector);
        if (element) {
          console.log('Element found after waiting');
          observer.disconnect();
          resolve(element);
        }
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true
      });

      setTimeout(() => {
        console.log('Element wait timeout');
        observer.disconnect();
        resolve(null);
      }, timeout);
    });
  }
}

// Initialize the UI
console.log('Starting Smart Prompts initialization');
const smartPrompts = new SmartPromptsUI();
smartPrompts.initialize().catch(console.error);
