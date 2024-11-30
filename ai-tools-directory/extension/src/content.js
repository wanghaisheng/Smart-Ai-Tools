// Configuration
const SMART_PROMPTS_API = 'http://localhost:5000/api/smart-prompts';

class SmartPromptsUI {
  constructor() {
    this.activeTab = 'public';
    this.searchQuery = '';
    this.prompts = [];
    this.filteredPrompts = [];
    this.container = null;
    this.initialized = false;
    this.searchInput = null;
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

    // Bind methods
    this.handleTabClick = this.handleTabClick.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.handlePromptClick = this.handlePromptClick.bind(this);
    this.handleSettingChange = this.handleSettingChange.bind(this);
    this.handleAuthClick = this.handleAuthClick.bind(this);
    this.handlePageChange = this.handlePageChange.bind(this);
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
    localStorage.setItem('smartPromptsSettings', JSON.stringify(this.settings));
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
          params.append('userId', 'current'); // Server will resolve this to actual user ID
          break;
        case 'public':
          params.append('visibility', 'public');
          break;
        case 'favorites':
          params.append('favorites', 'current'); // Server will resolve this
          break;
        case 'shared':
          params.append('sharedWith', 'current'); // Server will resolve this
          break;
        case 'ai-gen':
          params.append('category', 'ai-generated');
          break;
      }

      const response = await fetch(`${SMART_PROMPTS_API}?${params}`, {
        method: 'GET',
        mode: 'cors',
        credentials: 'include',
        headers: {
          'Accept': 'application/json'
        }
      });
      
      if (response.status === 401) {
        this.isAuthenticated = false;
        throw new Error('Authentication required');
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      this.prompts = data.prompts;
      this.currentPage = data.currentPage;
      this.totalPages = data.totalPages;
      this.render();
    } catch (error) {
      console.error('Error fetching prompts:', error);
      if (error.message === 'Authentication required') {
        this.showAuthModal();
      } else {
        this.renderError(`Failed to load prompts. Please make sure the Smart Prompts server is running at ${SMART_PROMPTS_API}`);
      }
    } finally {
      this.isLoading = false;
      this.render();
    }
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

  async initialize() {
    if (this.initialized) return;
    
    // Load saved settings
    const savedSettings = localStorage.getItem('smartPromptsSettings');
    if (savedSettings) {
      this.settings = { ...this.settings, ...JSON.parse(savedSettings) };
    }
    
    // Create and inject container
    this.container = document.createElement('div');
    this.container.className = `smart-prompts-container ${this.settings.darkMode ? 'dark' : ''}`;
    
    // Find the target element to inject our UI
    const targetElement = document.querySelector('#prompt-textarea') || 
                         document.querySelector('textarea[placeholder*="Send a message"]');
    
    if (!targetElement) {
      console.error('Could not find target element to inject Smart Prompts UI');
      return;
    }

    // Insert our container before the textarea
    const parentElement = targetElement.parentElement;
    parentElement.insertBefore(this.container, targetElement);
    
    // Add event listeners using event delegation
    this.container.addEventListener('click', (e) => {
      // Handle tab clicks
      if (e.target.closest('.smart-prompts-tab')) {
        const tab = e.target.closest('.smart-prompts-tab');
        const tabId = tab.dataset.tabId;
        if (tabId) {
          this.handleTabClick(tabId);
        }
      }

      // Handle prompt clicks
      if (e.target.closest('.smart-prompt-item')) {
        const promptItem = e.target.closest('.smart-prompt-item');
        const promptContent = promptItem.dataset.content;
        if (promptContent) {
          this.handlePromptClick(promptContent);
        }
      }

      // Handle pagination clicks
      if (e.target.closest('.pagination-btn')) {
        const btn = e.target.closest('.pagination-btn');
        const page = parseInt(btn.dataset.page);
        if (!isNaN(page)) {
          this.handlePageChange(page);
        }
      }
    });

    // Add search input listener
    this.searchInput = this.container.querySelector('.smart-prompts-search input');
    if (this.searchInput) {
      this.searchInput.addEventListener('input', this.handleSearch);
    }

    // Initial render
    this.render();
    this.initialized = true;
    
    // Fetch initial prompts
    await this.fetchPrompts();

    // Watch for dark mode changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      this.settings.darkMode = e.matches;
      this.container.classList.toggle('dark', e.matches);
      localStorage.setItem('smartPromptsSettings', JSON.stringify(this.settings));
    });
  }

  renderTabs() {
    const tabs = [
      { id: 'public', label: 'Public Prompts', icon: 'globe' },
      { id: 'my-prompts', label: 'My Prompts', icon: 'user', protected: true },
      { id: 'favorites', label: 'Favorites', icon: 'star', protected: true },
      { id: 'shared', label: 'Shared with Me', icon: 'share', protected: true },
      { id: 'ai-gen', label: 'AI Prompt Gen', icon: 'cpu' },
      { id: 'settings', label: 'Settings', icon: 'settings' }
    ];

    return `
      <div class="smart-prompts-tabs">
        ${tabs.map(tab => `
          <button class="smart-prompts-tab ${this.activeTab === tab.id ? 'active' : ''} 
                       ${tab.protected && !this.isAuthenticated ? 'protected' : ''}" 
                 data-tab-id="${tab.id}">
            <svg class="tab-icon" data-feather="${tab.icon}"></svg>
            ${tab.label}
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
    if (!this.prompts || this.prompts.length === 0) {
      return '<div class="smart-prompts-empty">No prompts found</div>';
    }

    return `
      <div class="smart-prompts-list">
        ${this.prompts.map(prompt => `
          <div class="smart-prompt-item" data-content="${encodeURIComponent(prompt.content)}">
            <div class="prompt-header">
              <div class="prompt-title">${prompt.title}</div>
              ${prompt.creator ? `<div class="prompt-creator">by ${prompt.creator.username}</div>` : ''}
            </div>
            <div class="prompt-description">${prompt.description}</div>
            <div class="prompt-footer">
              ${prompt.category ? `<span class="prompt-category">${prompt.category}</span>` : ''}
              <div class="prompt-stats">
                <span title="Likes"><i class="bi bi-heart"></i> ${prompt.likes?.length || 0}</span>
                <span title="Rating"><i class="bi bi-star"></i> ${prompt.averageRating || 0}</span>
              </div>
            </div>
          </div>
        `).join('')}
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

  renderError(message) {
    this.container.innerHTML = `
      <div class="smart-prompts-error">
        ${message}
      </div>
    `;
  }

  render() {
    if (!this.container) return;

    this.container.innerHTML = `
      <div class="smart-prompts-header">
        <span>Smart Prompts</span>
      </div>
      ${this.renderTabs()}
      ${this.activeTab === 'settings' ? this.renderSettings() : `
        ${this.renderSearch()}
        ${this.isLoading 
          ? `<div class="smart-prompts-loading">
               <div class="loading-spinner"></div>
             </div>`
          : this.renderPrompts()
        }
      `}
    `;

    // Reattach search input listener after render
    this.searchInput = this.container.querySelector('.smart-prompts-search input');
    if (this.searchInput) {
      this.searchInput.value = this.searchQuery;
      this.searchInput.addEventListener('input', this.handleSearch);
    }
  }
}

// Initialize and expose the UI instance
window.smartPromptsUI = new SmartPromptsUI();

// Function to initialize the UI when the page is ready
async function initialize() {
  try {
    // Wait for the target element to be available
    const targetElement = await waitForElement('#prompt-textarea, textarea[placeholder*="Send a message"]');
    if (targetElement) {
      await window.smartPromptsUI.initialize();
    }
  } catch (error) {
    console.error('Failed to initialize Smart Prompts:', error);
  }
}

// Helper function to wait for an element
function waitForElement(selector, timeout = 5000) {
  return new Promise((resolve, reject) => {
    const element = document.querySelector(selector);
    if (element) {
      resolve(element);
      return;
    }

    const observer = new MutationObserver((mutations, obs) => {
      const element = document.querySelector(selector);
      if (element) {
        obs.disconnect();
        resolve(element);
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    // Timeout after specified duration
    setTimeout(() => {
      observer.disconnect();
      reject(new Error(`Timeout waiting for element: ${selector}`));
    }, timeout);
  });
}

// Start the initialization
initialize();
