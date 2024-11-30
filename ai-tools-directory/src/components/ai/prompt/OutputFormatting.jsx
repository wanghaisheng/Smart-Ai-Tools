import { useState } from 'react';
import { DocumentTextIcon, CodeBracketIcon, TableCellsIcon } from '@heroicons/react/24/outline';

const OutputFormatting = ({ config, onChange }) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const formats = [
    { id: 'markdown', name: 'Markdown', icon: DocumentTextIcon },
    { id: 'plain', name: 'Plain Text', icon: DocumentTextIcon },
    { id: 'html', name: 'HTML', icon: CodeBracketIcon },
    { id: 'json', name: 'JSON', icon: CodeBracketIcon },
    { id: 'latex', name: 'LaTeX', icon: TableCellsIcon },
    { id: 'custom', name: 'Custom Template', icon: DocumentTextIcon }
  ];

  const metadataOptions = [
    { id: 'reasoning', label: 'Include Reasoning', description: 'Add step-by-step reasoning process' },
    { id: 'alternatives', label: 'Include Alternatives', description: 'Suggest alternative approaches' },
    { id: 'sources', label: 'Include Sources', description: 'Add reference sources when applicable' },
    { id: 'examples', label: 'Include Examples', description: 'Add relevant examples' }
  ];

  return (
    <div className="bg-gray-700 rounded-lg p-4 mt-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white flex items-center">
          <DocumentTextIcon className="h-5 w-5 mr-2" />
          Output Formatting
        </h3>
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="text-sm text-blue-400 hover:text-blue-300"
        >
          {showAdvanced ? 'Simple' : 'Advanced'} Options
        </button>
      </div>

      {/* Format Selection */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        {formats.map(({ id, name, icon: Icon }) => (
          <button
            key={id}
            onClick={() => onChange({ format: id })}
            className={`p-2 rounded-lg flex items-center justify-center ${
              config.format === id
                ? 'bg-blue-600 text-white'
                : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
            }`}
          >
            <Icon className="h-4 w-4 mr-2" />
            <span className="text-sm">{name}</span>
          </button>
        ))}
      </div>

      {/* Advanced Options */}
      {showAdvanced && (
        <div className="space-y-4">
          {/* Metadata Options */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-300">Include Metadata</h4>
            {metadataOptions.map(({ id, label, description }) => (
              <label key={id} className="flex items-start space-x-2 text-gray-300">
                <input
                  type="checkbox"
                  checked={config[id]}
                  onChange={(e) => onChange({ [id]: e.target.checked })}
                  className="mt-1 rounded bg-gray-600 border-gray-500"
                />
                <div>
                  <span className="text-sm">{label}</span>
                  <p className="text-xs text-gray-400">{description}</p>
                </div>
              </label>
            ))}
          </div>

          {/* Custom Template */}
          {config.format === 'custom' && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Custom Template
              </label>
              <textarea
                value={config.customTemplate || ''}
                onChange={(e) => onChange({ customTemplate: e.target.value })}
                placeholder="Enter your custom template with {variables}"
                className="w-full h-32 bg-gray-600 text-white rounded-md border-gray-500 placeholder-gray-400"
              />
              <p className="text-xs text-gray-400 mt-1">
                Use {'{variable}'} syntax for dynamic content
              </p>
            </div>
          )}

          {/* Style Options */}
          <div>
            <h4 className="text-sm font-medium text-gray-300 mb-2">Style Options</h4>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => onChange({ style: 'concise' })}
                className={`p-2 rounded text-sm ${
                  config.style === 'concise'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
                }`}
              >
                Concise
              </button>
              <button
                onClick={() => onChange({ style: 'detailed' })}
                className={`p-2 rounded text-sm ${
                  config.style === 'detailed'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
                }`}
              >
                Detailed
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Preview */}
      <div className="mt-4 p-3 bg-gray-600 rounded-lg">
        <h4 className="text-sm font-medium text-white mb-2">Output Preview</h4>
        <div className="text-sm text-gray-400">
          <div>Format: {formats.find(f => f.id === config.format)?.name}</div>
          <div>Style: {config.style || 'Default'}</div>
          <div>
            Includes:{' '}
            {metadataOptions
              .filter(({ id }) => config[id])
              .map(({ label }) => label)
              .join(', ') || 'Basic content only'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OutputFormatting;
