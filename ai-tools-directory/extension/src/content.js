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
      
      // Initial render
      await this.updateUI();
      
      // Attach event listeners
      this.attachEventListeners();
      
      // Add resize observer
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
    console.log('Sending request to:', url, 'with options:', options);
    
    return new Promise((resolve, reject) => {
      chrome.runtime.sendMessage({
        type: 'API_REQUEST',
        url,
        ...options
      }, response => {
        if (chrome.runtime.lastError) {
          console.error('Chrome runtime error:', chrome.runtime.lastError);
          reject(new Error(chrome.runtime.lastError.message));
          return;
        }
        
        console.log('Received response:', response);
        
        if (!response || !response.success) {
          console.error('Request failed:', response?.error || 'Unknown error');
          reject(new Error(response?.error || 'Request failed'));
          return;
        }
        
        resolve(response.data);
      });
    });
  }

  async fetchPrompts() {
    try {
      console.log('Fetching prompts for tab:', this.activeTab);
      this.isLoading = true;
      this.updateUI();

      const queryParams = new URLSearchParams({
        page: this.currentPage,
        limit: this.settings.promptsPerPage,
        search: this.searchQuery,
        view: this.activeTab
      });

      console.log('Query params:', queryParams.toString());

      const headers = {};
      if (this.authToken) {
        headers['Authorization'] = `Bearer ${this.authToken}`;
      }

      const data = await this.sendRequest(`${SMART_PROMPTS_API}?${queryParams}`, {
        method: 'GET',
        headers,
        credentials: 'include'
      });

      console.log('Received prompts:', data);

      this.prompts = data.prompts || [];
      this.totalPages = data.totalPages || 1;
      
    } catch (error) {
      console.error('Error fetching prompts:', error);
      this.prompts = [];
      this.totalPages = 1;
      
      // Show user-friendly error message
      this.showToast(
        'Failed to fetch prompts. Please try again later.',
        'error'
      );
    } finally {
      this.isLoading = false;
      this.updateUI();
    }
  }

  attachEventListeners() {
    console.log('Attaching event listeners...');
    
    // Event delegation for tab switching
    const tabsContainer = this.container.querySelector('.tabs-container');
    if (tabsContainer) {
      tabsContainer.addEventListener('click', async (e) => {
        const tabButton = e.target.closest('.tab-button');
        if (!tabButton) return;
        
        console.log('Tab clicked:', tabButton.dataset.tab);
        
        // Don't process disabled tabs
        if (tabButton.hasAttribute('disabled')) {
          this.showToast('Please login to access this feature', 'warning');
          return;
        }
        
        const newTab = tabButton.dataset.tab;
        if (newTab && newTab !== this.activeTab) {
          this.activeTab = newTab;
          // Update active tab UI
          tabsContainer.querySelectorAll('.tab-button').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.tab === newTab);
          });
          await this.fetchPrompts();
        }
      });
    }

    // Search input handling with debouncing
    const searchInput = this.container.querySelector('.search-input');
    if (searchInput) {
      const debouncedSearch = this.debounce(async () => {
        console.log('Search query:', searchInput.value);
        this.searchQuery = searchInput.value;
        await this.fetchPrompts();
      }, 500);

      searchInput.addEventListener('input', () => {
        debouncedSearch();
      });
    }

    // Logout button
    const logoutBtn = this.container.querySelector('#logout-btn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => {
        console.log('Logout clicked');
        this.handleLogout();
      });
    }

    // Prompt view button
    const viewButtons = this.container.querySelectorAll('.view-button');
    viewButtons.forEach(button => {
      button.addEventListener('click', async () => {
        const promptId = button.dataset.promptId;
        const prompt = this.prompts.find(p => p._id === promptId);
        if (prompt) {
          this.renderPromptModal(prompt);
        }
      });
    });

    console.log('Event listeners attached');
  }

  renderLoading() {
    return '<div class="loading-spinner"></div>';
  }

  renderPromptModal(prompt) {
    // Create modal container
    const modalContainer = document.createElement('div');
    modalContainer.className = 'smart-prompts-modal';
    
    modalContainer.innerHTML = `
      <div class="modal-overlay"></div>
      <div class="modal-content">
        <div class="modal-header">
          <h2>${this.escapeHtml(prompt.title)}</h2>
          <button class="close-modal">&times;</button>
        </div>
        <div class="modal-body">
          <div class="prompt-meta">
            <p>By ${this.escapeHtml(prompt.author?.username || 'Anonymous')}</p>
            <p>Created on ${this.formatDate(prompt.createdAt)}</p>
          </div>
          
          <p class="prompt-description">${this.escapeHtml(prompt.description)}</p>
          
          ${prompt.tags?.length ? `
            <div class="prompt-tags">
              ${prompt.tags.map(tag => `
                <span class="prompt-tag">${this.escapeHtml(tag)}</span>
              `).join('')}
            </div>
          ` : ''}
          
          <div class="prompt-content">${this.escapeHtml(prompt.content)}</div>
        </div>
        <div class="modal-footer">
          <button class="modal-btn secondary favorite-btn">
            <svg width="16" height="16" viewBox="0 0 20 20" fill="${prompt.favorites?.includes(this.userId) ? 'currentColor' : 'none'}" stroke="currentColor">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
            </svg>
            Favorite
          </button>
          <button class="modal-btn secondary share-btn">
            <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor">
              <path d="M15 8a3 3 0 100-6 3 3 0 000 6zM5 12a3 3 0 100-6 3 3 0 000 6zM15 16a3 3 0 100-6 3 3 0 000 6z"/>
              <path d="M7.5 10.5l5-3M7.5 13.5l5 3"/>
            </svg>
            Share
          </button>
          <button class="modal-btn primary copy-btn">
            <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor">
              <path d="M8 3H5a2 2 0 00-2 2v9m0 0h3m-3 0v-9m0 9h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1"/>
            </svg>
            Copy Prompt
          </button>
        </div>
      </div>
    `;

    // Add to body
    document.body.appendChild(modalContainer);

    // Add event listeners
    const closeBtn = modalContainer.querySelector('.close-modal');
    const overlay = modalContainer.querySelector('.modal-overlay');
    const copyBtn = modalContainer.querySelector('.copy-btn');
    const favoriteBtn = modalContainer.querySelector('.favorite-btn');
    const shareBtn = modalContainer.querySelector('.share-btn');

    const closeModal = () => modalContainer.remove();

    closeBtn.addEventListener('click', closeModal);
    overlay.addEventListener('click', closeModal);

    copyBtn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(prompt.content);
        this.showToast('Prompt copied to clipboard!', 'success');
      } catch (error) {
        this.showToast('Failed to copy prompt', 'error');
      }
    });

    favoriteBtn.addEventListener('click', async () => {
      if (!this.isAuthenticated) {
        this.showToast('Please login to favorite prompts', 'warning');
        return;
      }
      await this.toggleFavorite(prompt._id);
      const isFavorited = prompt.favorites?.includes(this.userId);
      favoriteBtn.querySelector('svg').setAttribute('fill', isFavorited ? 'none' : 'currentColor');
    });

    shareBtn.addEventListener('click', async () => {
      try {
        const shareUrl = `${window.location.origin}/prompt/${prompt._id}`;
        await navigator.clipboard.writeText(shareUrl);
        this.showToast('Share link copied to clipboard!', 'success');
      } catch (error) {
        this.showToast('Failed to copy share link', 'error');
      }
    });

    // Close on escape key
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        closeModal();
        document.removeEventListener('keydown', handleEscape);
      }
    };
    document.addEventListener('keydown', handleEscape);
  }

  renderPrompts() {
    if (this.isLoading) {
      return this.renderLoading();
    }

    if (!this.prompts.length) {
      return this.renderEmptyState();
    }

    return `
      <div class="prompts-grid">
        ${this.prompts.map(prompt => `
          <div class="prompt-card">
            <div class="prompt-card-header">
              <div>
                <h3 class="prompt-title">${this.escapeHtml(prompt.title)}</h3>
                <p class="prompt-author">By ${this.escapeHtml(prompt.author?.username || 'Anonymous')}</p>
              </div>
              <div class="prompt-actions">
                <button class="action-button favorite ${prompt.favorites?.includes(this.userId) ? 'active' : ''}" 
                        data-prompt-id="${prompt._id}">
                  <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
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
              <button class="view-button" data-prompt-id="${prompt._id}">View Details</button>
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

  async toggleFavorite(promptId) {
    if (!this.isAuthenticated) {
      this.showAuthForm();
      return;
    }

    try {
      await this.sendRequest(`${SMART_PROMPTS_API}/${promptId}/favorite`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.authToken}`
        }
      });

      await this.fetchPrompts();
      this.showToast('Prompt favorite status updated!');
    } catch (error) {
      console.error('Error toggling favorite:', error);
      this.showToast('Failed to update favorite status', 'error');
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
    if (!this.container) return;
    
    // Update the entire container content
    this.container.innerHTML = `
      <div class="smart-prompts-wrapper">
        <div class="smart-prompts-header">
          <h1>Smart Prompts</h1>
          ${this.isAuthenticated ? `
            <button class="action-button" id="logout-btn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
            </button>
          ` : ''}
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
            <button class="tab-button ${this.activeTab === 'my-prompts' ? 'active' : ''}" 
                    data-tab="my-prompts" 
                    ${!this.isAuthenticated ? 'disabled' : ''}>
              My Prompts
            </button>
            <button class="tab-button ${this.activeTab === 'public' ? 'active' : ''}" data-tab="public">
              Public Prompts
            </button>
            <button class="tab-button ${this.activeTab === 'favorites' ? 'active' : ''}" 
                    data-tab="favorites"
                    ${!this.isAuthenticated ? 'disabled' : ''}>
              Favorites
            </button>
          </div>
          
          <div class="prompts-section">
            ${this.isLoading ? this.renderLoading() : this.renderPrompts()}
          </div>
        </div>
      </div>
    `;
    
    // Re-attach event listeners after updating UI
    this.attachEventListeners();
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

// Debug log to verify script injection
console.log('Smart Prompts content script loaded on chatgpt.com');

// Wait for the chat interface to be ready
function waitForChatInterface() {
  // ChatGPT interface selectors
  const mainContent = document.querySelector('[class*="react-scroll"]') || 
                     document.querySelector('[class*="conversation-container"]') ||
                     document.querySelector('main');
                     
  if (mainContent) {
    console.log('Chat interface found, initializing Smart Prompts...');
    const smartPrompts = new SmartPromptsUI();
    smartPrompts.initialize().catch(error => {
      console.error('Failed to initialize Smart Prompts:', error);
    });
  } else {
    console.log('Chat interface not found, retrying in 1s...');
    setTimeout(waitForChatInterface, 1000);
  }
}

// Start the initialization process when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', waitForChatInterface);
} else {
  waitForChatInterface();
}
