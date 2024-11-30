// Configuration
const SMART_PROMPTS_API = 'http://localhost:5173/api/smart-prompts';

// Main initialization
async function initialize() {
    console.log('Smart Prompts Extension: Initializing...');
    
    try {
        // First try to find the main chat container
        const mainContainer = await waitForElement('main');
        console.log('Smart Prompts Extension: Found main container:', mainContainer);

        // Then wait for the textarea to appear
        const textarea = await waitForElement('#prompt-textarea, textarea[placeholder*="Send a message"]');
        console.log('Smart Prompts Extension: Found textarea:', textarea);
        
        // Inject our UI
        injectSmartPromptsInterface();
        
        // Load prompts
        loadSmartPrompts();

        // Set up mutation observer to handle navigation
        observeUrlChanges();
    } catch (error) {
        console.error('Smart Prompts Extension: Initialization failed:', error);
    }
}

// Observe URL changes for SPA navigation
function observeUrlChanges() {
    let lastUrl = location.href;
    new MutationObserver(() => {
        const url = location.href;
        if (url !== lastUrl) {
            lastUrl = url;
            console.log('Smart Prompts Extension: URL changed, reinitializing...');
            initialize();
        }
    }).observe(document, { subtree: true, childList: true });
}

// Wait for an element to be present in the DOM
function waitForElement(selector, timeout = 10000) {
    console.log('Smart Prompts Extension: Waiting for element:', selector);
    return new Promise((resolve, reject) => {
        const startTime = Date.now();

        if (document.querySelector(selector)) {
            console.log('Smart Prompts Extension: Element found immediately');
            return resolve(document.querySelector(selector));
        }

        const observer = new MutationObserver(() => {
            const element = document.querySelector(selector);
            if (element) {
                console.log('Smart Prompts Extension: Element found after mutation');
                observer.disconnect();
                resolve(element);
            } else if (Date.now() - startTime > timeout) {
                observer.disconnect();
                console.error('Smart Prompts Extension: Element not found within timeout');
                reject(new Error(`Element ${selector} not found within ${timeout}ms`));
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}

// Inject our interface into ChatGPT
function injectSmartPromptsInterface() {
    console.log('Smart Prompts Extension: Injecting interface...');
    
    // Find the main chat form
    const textarea = document.querySelector('#prompt-textarea, textarea[placeholder*="Send a message"]');
    if (!textarea) {
        console.error('Smart Prompts Extension: Textarea not found for injection');
        return;
    }

    // Find the closest form or main container
    const targetElement = textarea.closest('form') || textarea.closest('main');
    if (!targetElement) {
        console.error('Smart Prompts Extension: Target element not found');
        return;
    }

    // Remove any existing container
    const existingContainer = document.querySelector('.smart-prompts-container');
    if (existingContainer) {
        existingContainer.remove();
    }

    // Create container for our prompts
    const container = document.createElement('div');
    container.className = 'smart-prompts-container';
    container.innerHTML = `
        <div class="smart-prompts-header">
            <span>Smart Prompts</span>
            <div class="smart-prompts-actions">
                <button id="refreshPrompts" title="Refresh prompts">↻</button>
            </div>
        </div>
        <div class="smart-prompts-list"></div>
    `;

    // Insert container before the target element
    targetElement.parentElement.insertBefore(container, targetElement);
    console.log('Smart Prompts Extension: Interface injected');

    // Add event listeners
    document.getElementById('refreshPrompts').addEventListener('click', loadSmartPrompts);
}

// Load prompts from the API
async function loadSmartPrompts() {
    console.log('Smart Prompts Extension: Loading prompts...');
    try {
        const response = await fetch(SMART_PROMPTS_API);
        const data = await response.json();
        console.log('Smart Prompts Extension: Prompts loaded:', data);
        
        if (data && Array.isArray(data.prompts)) {
            displayPrompts(data.prompts);
        } else {
            throw new Error('Invalid prompts data structure');
        }
    } catch (error) {
        console.error('Smart Prompts Extension: Failed to load prompts:', error);
        showError('Failed to load prompts. Please check if the Smart Prompts server is running.');
    }
}

// Display prompts in the interface
function displayPrompts(prompts) {
    console.log('Smart Prompts Extension: Displaying prompts...');
    const container = document.querySelector('.smart-prompts-list');
    if (!container) {
        console.error('Smart Prompts Extension: Prompts container not found');
        return;
    }

    container.innerHTML = prompts.map(prompt => `
        <div class="smart-prompt-item" data-prompt="${encodeURIComponent(prompt.content || prompt.text || '')}">
            <div class="prompt-title">${prompt.title || 'Untitled Prompt'}</div>
            <div class="prompt-description">${prompt.description || ''}</div>
        </div>
    `).join('');

    // Add click handlers for prompts
    container.querySelectorAll('.smart-prompt-item').forEach(item => {
        item.addEventListener('click', () => {
            const promptContent = decodeURIComponent(item.dataset.prompt);
            injectPrompt(promptContent);
        });
    });
    console.log('Smart Prompts Extension: Prompts displayed successfully');
}

// Inject prompt into ChatGPT textarea
function injectPrompt(promptText) {
    console.log('Smart Prompts Extension: Injecting prompt:', promptText);
    const textarea = document.querySelector('#prompt-textarea, textarea[placeholder*="Send a message"]');
    if (!textarea) {
        console.error('Smart Prompts Extension: Textarea not found for prompt injection');
        return;
    }

    // Handle both contenteditable div and regular textarea
    if (textarea.tagName.toLowerCase() === 'div' && textarea.getAttribute('contenteditable') === 'true') {
        textarea.textContent = promptText;
    } else {
        textarea.value = promptText;
    }

    // Trigger input event
    textarea.dispatchEvent(new Event('input', { bubbles: true }));
    
    // Focus the textarea
    textarea.focus();
    console.log('Smart Prompts Extension: Prompt injected successfully');
}

// Show error message
function showError(message) {
    console.log('Smart Prompts Extension: Showing error:', message);
    const container = document.querySelector('.smart-prompts-list');
    if (!container) {
        console.error('Smart Prompts Extension: Error container not found');
        return;
    }

    container.innerHTML = `
        <div class="smart-prompts-error">
            ${message}
        </div>
    `;
}

// Start the extension
console.log('Smart Prompts Extension: Starting...');
// Wait a bit for the page to settle
setTimeout(initialize, 1000);
