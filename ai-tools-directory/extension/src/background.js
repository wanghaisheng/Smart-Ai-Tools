// Handle API requests from content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'API_REQUEST') {
    fetch(request.url, {
      method: request.method || 'GET',
      headers: request.headers || {},
      body: request.body ? JSON.stringify(request.body) : undefined,
      credentials: request.credentials || 'include'
    })
    .then(response => response.json())
    .then(data => sendResponse({ success: true, data }))
    .catch(error => sendResponse({ success: false, error: error.message }));
    
    return true; // Required for async response
  }
});
