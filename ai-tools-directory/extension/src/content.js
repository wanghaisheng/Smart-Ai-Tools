// Constants
const SMART_PROMPTS_API = 'http://localhost:5000/api/smart-prompts';

class SmartPromptsUI {
  constructor() {
    this.activeTab = 'public';
    this.searchQuery = '';
    this.prompts = [];
    this.container = null;
    this.initialized = false;
    this.isAuthenticated = false;
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
      
      // Create root container that sits outside ChatGPT's React tree
      const rootContainer = document.createElement('div');
      rootContainer.id = 'smart-prompts-root';
      document.body.appendChild(rootContainer);
      
      // Create our extension container
      this.container = document.createElement('div');
      this.container.className = 'smart-prompts-extension-container';
      rootContainer.appendChild(this.container);
      
      // Create the wrapper structure
      this.container.innerHTML = `
        <div class="smart-prompts-wrapper">
          <div class="smart-prompts-sidebar">
            <div class="smart-prompts-header flex justify-between items-center">
              <div class="flex items-center gap-2">
                <span class="text-token-text-primary">Smart Prompts</span>
              </div>
              <div class="flex items-center gap-2">
                <button class="h-8 w-8 flex items-center justify-center rounded-lg hover:bg-token-sidebar-surface-secondary">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="icon-md">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M3 12C3 10.8954 3.89543 10 5 10C6.10457 10 7 10.8954 7 12C7 13.1046 6.10457 14 5 14C3.89543 14 3 13.1046 3 12Z" fill="currentColor"></path>
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M10 12C10 10.8954 10.8954 10 12 10C13.1046 10 14 10.8954 14 12C14 13.1046 13.1046 14 12 14C10.8954 14 10 13.1046 10 12Z" fill="currentColor"></path>
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M17 12C17 10.8954 17.8954 10 19 10C20.1046 10 21 10.8954 21 12C21 13.1046 20.1046 14 19 14C17.8954 14 17 13.1046 17 12Z" fill="currentColor"></path>
                  </svg>
                </button>
              </div>
            </div>
            <div class="smart-prompts-content">
              <div class="mb-7 text-center">
                <div class="relative inline-flex justify-center text-center text-2xl font-semibold leading-9">
                  <h1 class="text-token-text-primary">What can I help with?</h1>
                  <h1 class="result-streaming absolute left-full transition-opacity text-token-text-primary" style="opacity: 0;">
                    <span></span>
                  </h1>
                </div>
              </div>
              ${this.isLoading ? this.renderLoading() : this.renderContent()}
            </div>
          </div>
        </div>
      `;
      
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
              <button class="h-8 w-8 flex items-center justify-center rounded-lg hover:bg-token-sidebar-surface-secondary">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="icon-md">
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M3 12C3 10.8954 3.89543 10 5 10C6.10457 10 7 10.8954 7 12C7 13.1046 6.10457 14 5 14C3.89543 14 3 13.1046 3 12Z" fill="currentColor"></path>
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M10 12C10 10.8954 10.8954 10 12 10C13.1046 10 14 10.8954 14 12C14 13.1046 13.1046 14 12 14C10.8954 14 10 13.1046 10 12Z" fill="currentColor"></path>
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M17 12C17 10.8954 17.8954 10 19 10C20.1046 10 21 10.8954 21 12C21 13.1046 20.1046 14 19 14C17.8954 14 17 13.1046 17 12Z" fill="currentColor"></path>
                </svg>
              </button>
            </div>
          </div>
          <div class="smart-prompts-content">
            <div class="mb-7 text-center">
              <div class="relative inline-flex justify-center text-center text-2xl font-semibold leading-9">
                <h1 class="text-token-text-primary">What can I help with?</h1>
                <h1 class="result-streaming absolute left-full transition-opacity text-token-text-primary" style="opacity: 0;">
                  <span></span>
                </h1>
              </div>
            </div>
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
      this.showAuthModal();
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
    try {
      this.isLoading = true;
      this.render();

      let params = new URLSearchParams({
        page: this.currentPage,
        limit: this.settings.promptsPerPage,
        search: this.searchQuery
      });

      // Add tab-specific parameters
      switch (this.activeTab) {
        case 'my-prompts':
          params.append('userId', 'current');
          break;
        case 'public':
          params.append('visibility', 'public');
          break;
        case 'favorites':
          params.append('favorites', 'current');
          break;
        case 'shared':
          params.append('sharedWith', 'current');
          break;
        case 'ai-gen':
          params.append('category', 'ai-generated');
          break;
      }

      try {
        const response = await chrome.runtime.sendMessage({
          type: 'API_REQUEST',
          url: `${SMART_PROMPTS_API}?${params}`,
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Origin': window.location.origin
          },
          credentials: 'include'
        });

        if (!response?.success) {
          throw new Error(response?.error || 'Failed to fetch prompts');
        }

        const data = response.data;
        
        if (data?.status === 401) {
          this.isAuthenticated = false;
          throw new Error('Authentication required');
        }

        this.prompts = Array.isArray(data?.prompts) ? data.prompts : [];
        this.currentPage = Number(data?.currentPage) || 1;
        this.totalPages = Number(data?.totalPages) || 1;
      } catch (error) {
        console.error('API request failed:', error);
        // Use mock data when API is not available
        this.useMockData();
      }
    } catch (error) {
      console.error('Error in fetchPrompts:', error);
      this.prompts = [];
      this.currentPage = 1;
      this.totalPages = 1;
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

  attachEventListeners() {
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
