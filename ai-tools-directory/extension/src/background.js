// Handle API requests from content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'API_REQUEST') {
    const fetchOptions = {
      method: request.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...request.headers
      },
      credentials: request.credentials || 'include'
    };

    // Add body if present
    if (request.body) {
      fetchOptions.body = JSON.stringify(request.body);
    }

    fetch(request.url, fetchOptions)
      .then(async response => {
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || `HTTP error! status: ${response.status}`);
        }
        return data;
      })
      .then(data => sendResponse({ success: true, data }))
      .catch(error => {
        console.error('Background fetch error:', error);
        sendResponse({ 
          success: false, 
          error: error.message || 'Failed to complete request'
        });
      });
    
    return true; // Required for async response
  }
});
