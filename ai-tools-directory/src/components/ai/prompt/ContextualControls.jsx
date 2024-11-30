import { useState } from 'react';
import { GlobeAltIcon, UserGroupIcon, BeakerIcon } from '@heroicons/react/24/outline';

const ContextualControls = ({ config, onChange }) => {
  const [activeTab, setActiveTab] = useState('domain');

  const domains = [
    { id: 'general', name: 'General Purpose' },
    { id: 'technical', name: 'Technical Documentation' },
    { id: 'creative', name: 'Creative Writing' },
    { id: 'academic', name: 'Academic Research' },
    { id: 'business', name: 'Business Communication' },
    { id: 'scientific', name: 'Scientific Research' }
  ];

  const industries = [
    { id: 'tech', name: 'Technology' },
    { id: 'healthcare', name: 'Healthcare' },
    { id: 'finance', name: 'Finance' },
    { id: 'education', name: 'Education' },
    { id: 'retail', name: 'Retail' },
    { id: 'manufacturing', name: 'Manufacturing' }
  ];

  const audiences = [
    { id: 'beginner', name: 'Beginner' },
    { id: 'intermediate', name: 'Intermediate' },
    { id: 'expert', name: 'Expert' },
    { id: 'technical', name: 'Technical' },
    { id: 'non-technical', name: 'Non-Technical' },
    { id: 'mixed', name: 'Mixed Audience' }
  ];

  const locales = [
    { id: 'en-US', name: 'English (US)' },
    { id: 'en-UK', name: 'English (UK)' },
    { id: 'en-AU', name: 'English (Australia)' },
    { id: 'en-CA', name: 'English (Canada)' },
    { id: 'en-IN', name: 'English (India)' },
    { id: 'en-Global', name: 'English (Global)' }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'domain':
        return (
          <div className="grid grid-cols-2 gap-2">
            {domains.map((domain) => (
              <button
                key={domain.id}
                onClick={() => onChange({ domain: domain.id })}
                className={`p-2 rounded text-sm ${
                  config.domain === domain.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
                }`}
              >
                {domain.name}
              </button>
            ))}
          </div>
        );
      case 'audience':
        return (
          <div className="space-y-3">
            {audiences.map((audience) => (
              <label
                key={audience.id}
                className="flex items-center space-x-3 text-gray-300"
              >
                <input
                  type="radio"
                  checked={config.audience === audience.id}
                  onChange={() => onChange({ audience: audience.id })}
                  className="text-blue-600 bg-gray-600 border-gray-500"
                />
                <span>{audience.name}</span>
              </label>
            ))}
          </div>
        );
      case 'locale':
        return (
          <div>
            <select
              value={config.locale}
              onChange={(e) => onChange({ locale: e.target.value })}
              className="w-full bg-gray-600 text-white rounded-md border-gray-500"
            >
              {locales.map((locale) => (
                <option key={locale.id} value={locale.id}>
                  {locale.name}
                </option>
              ))}
            </select>
            <div className="mt-3 text-sm text-gray-400">
              Adapts language, terminology, and cultural references based on locale
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-gray-700 rounded-lg p-4">
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
        <BeakerIcon className="h-5 w-5 mr-2" />
        Contextual Controls
      </h3>

      {/* Tab Navigation */}
      <div className="flex space-x-2 mb-4">
        <button
          onClick={() => setActiveTab('domain')}
          className={`flex items-center px-3 py-1 rounded-md text-sm ${
            activeTab === 'domain'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
          }`}
        >
          <GlobeAltIcon className="h-4 w-4 mr-1" />
          Domain
        </button>
        <button
          onClick={() => setActiveTab('audience')}
          className={`flex items-center px-3 py-1 rounded-md text-sm ${
            activeTab === 'audience'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
          }`}
        >
          <UserGroupIcon className="h-4 w-4 mr-1" />
          Audience
        </button>
        <button
          onClick={() => setActiveTab('locale')}
          className={`flex items-center px-3 py-1 rounded-md text-sm ${
            activeTab === 'locale'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
          }`}
        >
          <GlobeAltIcon className="h-4 w-4 mr-1" />
          Locale
        </button>
      </div>

      {/* Tab Content */}
      <div className="mt-4">{renderTabContent()}</div>

      {/* Context Preview */}
      <div className="mt-4 p-3 bg-gray-600 rounded-lg">
        <h4 className="text-sm font-medium text-white mb-2">Active Context</h4>
        <div className="text-sm text-gray-400">
          <div>Domain: {domains.find(d => d.id === config.domain)?.name}</div>
          <div>Audience: {audiences.find(a => a.id === config.audience)?.name}</div>
          <div>Locale: {locales.find(l => l.id === config.locale)?.name}</div>
        </div>
      </div>
    </div>
  );
};

export default ContextualControls;
