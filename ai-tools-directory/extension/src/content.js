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
          <div class="smart-prompts-sidebar">
            <div class="smart-prompts-header flex justify-between items-center">
              <div class="flex items-center gap-2">
                <span class="text-token-text-primary">Smart Prompts</span>
              </div>
              <div class="flex items-center gap-2">
                <button class="logout-btn h-8 w-8 flex items-center justify-center rounded-lg hover:bg-token-sidebar-surface-secondary">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="icon-md">
                    <path d="M16 17L21 12M21 12L16 7M21 12H9M9 3H7.8C6.11984 3 5.27976 3 4.63803 3.32698C4.07354 3.6146 3.6146 4.07354 3.32698 4.63803C3 5.27976 3 6.11984 3 7.8V16.2C3 17.8802 3 18.7202 3.32698 19.362C3.6146 19.9265 4.07354 20.3854 4.63803 20.673C5.27976 21 6.11984 21 7.8 21H9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </button>
              </div>
            </div>
            <div class="smart-prompts-content">
              ${this.isLoading ? this.renderLoading() : this.renderContent()}
            </div>
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
        <div class="smart-prompts-sidebar">
          <div class="smart-prompts-header flex justify-between items-center">
            <div class="flex items-center gap-2">
              <span class="text-token-text-primary">Smart Prompts</span>
            </div>
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
    // Add logout button listener
    const logoutBtn = this.container.querySelector('.logout-btn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', async () => {
        try {
          // Clear auth data
          await chrome.storage.local.remove('smartPromptsAuth');
          this.authToken = null;
          this.isAuthenticated = false;
          // Show login form
          this.showAuthForm();
        } catch (error) {
          console.error('Logout error:', error);
        }
      });
    }

    // Handle tab clicks
    const tabs = this.container.querySelectorAll('.smart-prompts-tab');
    tabs.forEach(tab => {
      tab.addEventListener('click', (e) => {
        e.preventDefault();
        const tabId = tab.getAttribute('data-tab-id');
        if (tabId) this.handleTabClick(tabId);
      });
    });

    // Handle prompt clicks
    const prompts = this.container.querySelectorAll('.smart-prompt-item');
    prompts.forEach(prompt => {
      prompt.addEventListener('click', (e) => {
        e.preventDefault();
        const content = prompt.getAttribute('data-content');
        if (content) this.handlePromptClick(content);
      });
    });

    // Handle pagination clicks
    const paginationButtons = this.container.querySelectorAll('.pagination-btn');
    paginationButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const page = parseInt(btn.getAttribute('data-page'));
        if (!isNaN(page)) this.handlePageChange(page);
      });
    });

    // Handle search input
    const searchInput = this.container.querySelector('.smart-prompts-search input');
    if (searchInput) {
      // Remove existing listener if any
      const oldInput = searchInput.cloneNode(true);
      searchInput.parentNode.replaceChild(oldInput, searchInput);
      
      // Add debounced search handler
      let searchTimeout;
      oldInput.addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
          this.handleSearch(e);
        }, 300);
      });
    }

    // Handle settings changes
    const settingsInputs = this.container.querySelectorAll('.settings-group input, .settings-group select');
    settingsInputs.forEach(input => {
      input.addEventListener('change', (e) => {
        const setting = input.getAttribute('data-setting');
        const value = input.type === 'checkbox' ? input.checked : input.value;
        if (setting) this.handleSettingChange(setting, value);
      });
    });
  }

  render() {
    if (!this.container) {
      console.error('Container not found');
      return;
    }

    console.log('Rendering UI...');
    
    const contentHtml = `
      <div class="smart-prompts-wrapper">
        <div class="smart-prompts-sidebar">
          <div class="smart-prompts-header flex justify-between items-center">
            <div class="flex items-center gap-2">
              <span class="text-token-text-primary">Smart Prompts</span>
            </div>
            <div class="flex items-center gap-2">
              <button class="logout-btn h-8 w-8 flex items-center justify-center rounded-lg hover:bg-token-sidebar-surface-secondary">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="icon-md">
                  <path d="M16 17L21 12M21 12L16 7M21 12H9M9 3H7.8C6.11984 3 5.27976 3 4.63803 3.32698C4.07354 3.6146 3.6146 4.07354 3.32698 4.63803C3 5.27976 3 6.11984 3 7.8V16.2C3 17.8802 3 18.7202 3.32698 19.362C3.6146 19.9265 4.07354 20.3854 4.63803 20.673C5.27976 21 6.11984 21 7.8 21H9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </button>
            </div>
          </div>
          <div class="smart-prompts-content">
            ${this.isLoading ? this.renderLoading() : this.renderContent()}
          </div>
        </div>
      </div>
    `;

    // Update container content
    this.container.innerHTML = contentHtml;
    
    // Attach event listeners
    this.attachEventListeners();
    
    console.log('Render complete');
  }

  renderLoading() {
    return `
      <div class="smart-prompts-loading">
        <div class="loading-spinner"></div>
      </div>
    `;
  }

  renderContent() {
    return `
      ${this.renderTabs()}
      ${this.activeTab === 'settings' ? this.renderSettings() : `
        ${this.renderSearch()}
        ${this.renderPrompts()}
      `}
    `;
  }

  handlePromptClick(content) {
    const textarea = document.querySelector('#prompt-textarea') || 
                    document.querySelector('textarea[placeholder*="Send a message"]');
    
    if (textarea) {
      textarea.value = content;
      textarea.dispatchEvent(new Event('input', { bubbles: true }));
      textarea.focus();
    }
  }

  async handleTabClick(tabId) {
    // Check authentication for protected tabs
    if (!this.isAuthenticated && ['my-prompts', 'favorites', 'shared'].includes(tabId)) {
      this.showAuthForm();
      return;
    }
    
    this.activeTab = tabId;
    this.currentPage = 1; // Reset to first page when changing tabs
    await this.fetchPrompts();
  }

  async handlePageChange(page) {
    this.currentPage = page;
    await this.fetchPrompts();
  }

  async handleSearch(event) {
    this.searchQuery = event.target.value;
    this.currentPage = 1; // Reset to first page when searching
    await this.fetchPrompts();
  }

  handleSettingChange(setting, value) {
    this.settings[setting] = value;
    chrome.storage.local.set({ 
      smartPromptsSettings: this.settings 
    }).catch(console.error);
    this.render();
  }

  async fetchPrompts() {
    if (!this.isAuthenticated) return;
    
    try {
      this.isLoading = true;
      this.render();

      let params = new URLSearchParams({
        page: this.currentPage,
        limit: this.settings.promptsPerPage,
        tab: this.activeTab
      });

      if (this.searchQuery) {
        params.append('search', this.searchQuery);
      }

      const data = await this.sendRequest(SMART_PROMPTS_API + '?' + params, {
        headers: {
          'Authorization': `Bearer ${this.authToken}`
        }
      });

      this.prompts = data.prompts || [];
      this.totalPages = data.totalPages || 1;
      this.render();
    } catch (error) {
      console.error('Error fetching prompts:', error);
      if (error.message.includes('401')) {
        this.isAuthenticated = false;
        this.showAuthForm();
      }
    } finally {
      this.isLoading = false;
      this.render();
    }
  }

  useMockData() {
    // Provide mock data for development and testing
    this.prompts = [
      {
        id: '1',
        title: 'Example Prompt 1',
        content: 'This is an example prompt for testing purposes.',
        category: 'General',
        visibility: 'public',
        author: 'System',
        createdAt: new Date().toISOString()
      },
      {
        id: '2',
        title: 'Example Prompt 2',
        content: 'Another example prompt for testing the UI.',
        category: 'Coding',
        visibility: 'public',
        author: 'System',
        createdAt: new Date().toISOString()
      }
    ];
    this.currentPage = 1;
    this.totalPages = 1;
  }

  showAuthModal() {
    // Implementation of authentication modal
    const modal = document.createElement('div');
    modal.className = 'smart-prompts-auth-modal';
    modal.innerHTML = `
      <div class="modal-content">
        <h2>Authentication Required</h2>
        <p>Please log in to access this feature.</p>
        <button onclick="window.smartPromptsUI.handleAuthClick()">Log In</button>
      </div>
    `;
    document.body.appendChild(modal);
  }

  handleAuthClick() {
    // Implement authentication logic here
    // For now, we'll just simulate authentication
    this.isAuthenticated = true;
    document.querySelector('.smart-prompts-auth-modal')?.remove();
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

  renderTabs() {
    const tabs = [
      { id: 'public', label: 'Public Prompts', icon: 'globe' },
      { id: 'my-prompts', label: 'My Prompts', icon: 'user', protected: true },
      { id: 'favorites', label: 'Favorites', icon: 'star', protected: true },
      { id: 'shared', label: 'Shared', icon: 'share', protected: true },
      { id: 'ai-gen', label: 'AI Generator', icon: 'robot' },
      { id: 'settings', label: 'Settings', icon: 'cog' }
    ];

    return `
      <div class="smart-prompts-tabs">
        ${tabs.map(tab => `
          <button 
            class="smart-prompts-tab${this.activeTab === tab.id ? ' active' : ''}${tab.protected && !this.isAuthenticated ? ' protected' : ''}"
            data-tab-id="${tab.id}"
          >
            <span>${tab.label}</span>
          </button>
        `).join('')}
      </div>
    `;
  }

  renderSearch() {
    return `
      <div class="smart-prompts-search">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
        <input 
          type="text" 
          placeholder="Search prompts..." 
          value="${this.searchQuery}"
        />
      </div>
    `;
  }

  renderPrompts() {
    if (!Array.isArray(this.prompts) || this.prompts.length === 0) {
      return `
        <div class="smart-prompts-empty">
          <p>No prompts found${this.searchQuery ? ' for your search' : ''}</p>
        </div>
      `;
    }

    return `
      <div class="smart-prompts-list">
        ${this.prompts.map(prompt => {
          // Ensure prompt object has all required properties
          const safePrompt = {
            title: prompt?.title || 'Untitled Prompt',
            content: prompt?.content || '',
            category: prompt?.category || 'Uncategorized',
            author: prompt?.author || 'Anonymous',
            createdAt: prompt?.createdAt || new Date().toISOString()
          };

          return `
            <div class="smart-prompt-item" data-content="${this.escapeHtml(safePrompt.content)}">
              <div class="prompt-header">
                <h3>${this.escapeHtml(safePrompt.title)}</h3>
                <span class="prompt-category">${this.escapeHtml(safePrompt.category)}</span>
              </div>
              <p class="prompt-content">${this.escapeHtml(safePrompt.content)}</p>
              <div class="prompt-footer">
                <span class="prompt-author">By ${this.escapeHtml(safePrompt.author)}</span>
                <span class="prompt-date">${new Date(safePrompt.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          `;
        }).join('')}
      </div>
      ${this.renderPagination()}
    `;
  }

  renderPagination() {
    if (this.totalPages <= 1) return '';

    const pages = [];
    const maxPages = 5;
    let start = Math.max(1, this.currentPage - Math.floor(maxPages / 2));
    let end = Math.min(this.totalPages, start + maxPages - 1);

    if (end - start + 1 < maxPages) {
      start = Math.max(1, end - maxPages + 1);
    }

    return `
      <div class="smart-prompts-pagination">
        <button class="pagination-btn" 
                onclick="window.smartPromptsUI.handlePageChange(1)"
                ${this.currentPage === 1 ? 'disabled' : ''}>
          «
        </button>
        ${Array.from({ length: end - start + 1 }, (_, i) => start + i)
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

  renderSettings() {
    return `
      <div class="smart-prompts-settings">
        <div class="settings-group">
          <h3>Display Settings</h3>
          <div class="setting-item">
            <label>Dark Mode</label>
            <label class="switch">
              <input type="checkbox" 
                ${this.settings.darkMode ? 'checked' : ''} 
                onchange="window.smartPromptsUI.handleSettingChange('darkMode', this.checked)"
              >
              <span class="slider"></span>
            </label>
          </div>
          <div class="setting-item">
            <label>Font Size</label>
            <select onchange="window.smartPromptsUI.handleSettingChange('fontSize', this.value)" 
                    value="${this.settings.fontSize}">
              <option value="small">Small</option>
              <option value="medium">Medium</option>
              <option value="large">Large</option>
            </select>
          </div>
          <div class="setting-item">
            <label>Prompts Per Page</label>
            <select onchange="window.smartPromptsUI.handleSettingChange('promptsPerPage', parseInt(this.value))" 
                    value="${this.settings.promptsPerPage}">
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="12">12</option>
              <option value="20">20</option>
              <option value="50">50</option>
            </select>
          </div>
        </div>
        <div class="settings-group">
          <h3>Sync Settings</h3>
          <div class="setting-item">
            <label>Auto Sync</label>
            <label class="switch">
              <input type="checkbox" 
                ${this.settings.autoSync ? 'checked' : ''} 
                onchange="window.smartPromptsUI.handleSettingChange('autoSync', this.checked)"
              >
              <span class="slider"></span>
            </label>
          </div>
        </div>
      </div>
    `;
  }

  escapeHtml(unsafe) {
    if (unsafe == null) return '';
    return String(unsafe)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
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
