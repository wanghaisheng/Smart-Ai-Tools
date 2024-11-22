import { useState } from 'react';
import { FiChevronRight, FiCode } from 'react-icons/fi';
import { motion } from 'framer-motion';

const codeExamples = {
  curl: {
    title: 'cURL',
    code: `curl -X POST https://api.smartaitools.com/v1/analyze \\
  -H "X-API-Key: your_api_key_here" \\
  -H "Content-Type: application/json" \\
  -d '{
    "text": "Your text to analyze"
  }'`
  },
  javascript: {
    title: 'JavaScript',
    code: `const response = await fetch('https://api.smartaitools.com/v1/analyze', {
  method: 'POST',
  headers: {
    'X-API-Key': 'your_api_key_here',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    text: 'Your text to analyze'
  })
});

const data = await response.json();
console.log(data);`
  },
  python: {
    title: 'Python',
    code: `import requests

response = requests.post(
    'https://api.smartaitools.com/v1/analyze',
    headers={
        'X-API-Key': 'your_api_key_here',
        'Content-Type': 'application/json'
    },
    json={
        'text': 'Your text to analyze'
    }
)

data = response.json()
print(data)`
  }
};

export default function ApiKeyDocs() {
  const [selectedLanguage, setSelectedLanguage] = useState('curl');

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 space-y-6">
      <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">API Documentation</h3>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Learn how to use your API key to access Smart AI Tools services.
        </p>
      </div>

      <div className="space-y-4">
        <h4 className="text-md font-medium text-gray-900 dark:text-white">Authentication</h4>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Include your API key in the request headers using the <code className="text-sm bg-gray-100 dark:bg-gray-700 px-1 py-0.5 rounded">X-API-Key</code> header.
        </p>

        <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
          <div className="flex space-x-4 mb-4">
            {Object.entries(codeExamples).map(([key, { title }]) => (
              <button
                key={key}
                onClick={() => setSelectedLanguage(key)}
                className={`px-3 py-1 rounded-md text-sm font-medium ${
                  selectedLanguage === key
                    ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300'
                    : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
                }`}
              >
                {title}
              </button>
            ))}
          </div>
          <pre className="bg-gray-800 text-gray-100 p-4 rounded-lg overflow-x-auto">
            <code>{codeExamples[selectedLanguage].code}</code>
          </pre>
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="text-md font-medium text-gray-900 dark:text-white">Rate Limits</h4>
        <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
          <li className="flex items-center">
            <FiChevronRight className="mr-2 text-primary-500" />
            Free tier: 100 requests per day
          </li>
          <li className="flex items-center">
            <FiChevronRight className="mr-2 text-primary-500" />
            Pro tier: 10,000 requests per day
          </li>
          <li className="flex items-center">
            <FiChevronRight className="mr-2 text-primary-500" />
            Enterprise tier: Custom limits
          </li>
        </ul>
      </div>

      <div className="space-y-4">
        <h4 className="text-md font-medium text-gray-900 dark:text-white">Best Practices</h4>
        <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
          <li className="flex items-start">
            <FiChevronRight className="mr-2 mt-1 text-primary-500 flex-shrink-0" />
            <span>Never share your API key or commit it to version control</span>
          </li>
          <li className="flex items-start">
            <FiChevronRight className="mr-2 mt-1 text-primary-500 flex-shrink-0" />
            <span>Use environment variables to store your API key in applications</span>
          </li>
          <li className="flex items-start">
            <FiChevronRight className="mr-2 mt-1 text-primary-500 flex-shrink-0" />
            <span>Implement proper error handling for API responses</span>
          </li>
          <li className="flex items-start">
            <FiChevronRight className="mr-2 mt-1 text-primary-500 flex-shrink-0" />
            <span>Monitor your API usage and set up alerts for unusual activity</span>
          </li>
        </ul>
      </div>

      <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Need help? Check out our{' '}
          <a href="#" className="text-primary-600 hover:text-primary-500 dark:text-primary-400">
            full documentation
          </a>{' '}
          or{' '}
          <a href="#" className="text-primary-600 hover:text-primary-500 dark:text-primary-400">
            contact support
          </a>
          .
        </p>
      </div>
    </div>
  );
}
