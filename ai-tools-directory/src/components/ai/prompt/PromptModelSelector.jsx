import { useState } from 'react';
import { ChipIcon, AcademicCapIcon } from '@heroicons/react/24/outline';

const PromptModelSelector = ({ config, onChange }) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const models = [
    { id: 'gpt-4', name: 'GPT-4', provider: 'OpenAI', tier: 'advanced' },
    { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo', provider: 'OpenAI', tier: 'standard' },
    { id: 'claude-2', name: 'Claude 2', provider: 'Anthropic', tier: 'advanced' },
    { id: 'palm-2', name: 'PaLM 2', provider: 'Google', tier: 'advanced' },
    { id: 'llama-2', name: 'LLaMA 2', provider: 'Meta', tier: 'standard' },
    { id: 'codex', name: 'Codex', provider: 'OpenAI', tier: 'specialized' }
  ];

  return (
    <div className="bg-gray-700 rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white flex items-center">
          <ChipIcon className="h-5 w-5 mr-2" />
          AI Model Selection
        </h3>
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="text-sm text-blue-400 hover:text-blue-300"
        >
          {showAdvanced ? 'Simple' : 'Advanced'} View
        </button>
      </div>

      <div className="space-y-4">
        {/* Primary Model Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Primary Model
          </label>
          <select
            value={config.primary}
            onChange={(e) => onChange({ primary: e.target.value })}
            className="w-full bg-gray-600 text-white rounded-md border-gray-500"
          >
            {models.map((model) => (
              <option key={model.id} value={model.id}>
                {model.name} ({model.provider})
              </option>
            ))}
          </select>
        </div>

        {/* Advanced Options */}
        {showAdvanced && (
          <>
            {/* Model Chaining */}
            <div>
              <label className="flex items-center space-x-2 text-gray-300">
                <input
                  type="checkbox"
                  checked={config.chainModels}
                  onChange={(e) => onChange({ chainModels: e.target.checked })}
                  className="rounded bg-gray-600 border-gray-500"
                />
                <span>Enable Model Chaining</span>
              </label>
              <p className="text-sm text-gray-400 mt-1">
                Chain multiple models for enhanced results
              </p>
            </div>

            {/* Secondary Models */}
            {config.chainModels && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Secondary Models
                </label>
                <div className="space-y-2">
                  {models
                    .filter((model) => model.id !== config.primary)
                    .map((model) => (
                      <label
                        key={model.id}
                        className="flex items-center space-x-2 text-gray-300"
                      >
                        <input
                          type="checkbox"
                          checked={config.secondary.includes(model.id)}
                          onChange={(e) => {
                            const secondary = e.target.checked
                              ? [...config.secondary, model.id]
                              : config.secondary.filter((id) => id !== model.id);
                            onChange({ secondary });
                          }}
                          className="rounded bg-gray-600 border-gray-500"
                        />
                        <span>{model.name}</span>
                      </label>
                    ))}
                </div>
              </div>
            )}

            {/* Model Expertise Indicator */}
            <div className="mt-4 p-3 bg-gray-600 rounded-lg">
              <div className="flex items-center mb-2">
                <AcademicCapIcon className="h-5 w-5 text-blue-400 mr-2" />
                <span className="text-sm font-medium text-white">Model Expertise</span>
              </div>
              <div className="text-sm text-gray-300">
                {models.find((m) => m.id === config.primary)?.name} specializes in:
                <ul className="list-disc list-inside mt-1 text-gray-400">
                  <li>Natural language understanding</li>
                  <li>Context-aware responses</li>
                  <li>Complex reasoning tasks</li>
                </ul>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PromptModelSelector;
