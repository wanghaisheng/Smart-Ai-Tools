import React, { useReducer, useMemo, useEffect, useCallback } from 'react';
import { InformationCircleIcon } from '@heroicons/react/24/outline';

const INPUT_TYPES = {
  text: {
    component: 'input',
    type: 'text',
    validate: (value) => value.length > 0,
    error: 'Text is required'
  }
};

const VariableInput = ({ 
  name,
  description,
  value = '', 
  onChange,
  error 
}) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label htmlFor={name} className="text-sm font-medium text-gray-300">
          {name}
        </label>
        {description && (
          <div className="group relative">
            <InformationCircleIcon className="w-5 h-5 text-gray-400 hover:text-gray-300" />
            <div className="absolute bottom-full mb-2 hidden group-hover:block w-48 p-2 bg-gray-700 rounded-lg text-xs text-gray-300">
              {description}
            </div>
          </div>
        )}
      </div>
      
      <input
        id={name}
        name={name}
        type="text"
        value={value}
        onChange={(e) => onChange(name, e.target.value)}
        className={`w-full px-4 py-2 bg-gray-700 border ${
          error ? 'border-red-500' : 'border-gray-600'
        } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-200`}
        placeholder={description || `Enter ${name}`}
      />
      
      {error && (
        <p className="text-xs text-red-400">{error}</p>
      )}
    </div>
  );
};

const PromptVariableManager = ({ 
  content, 
  onVariablesChange,
  savedVariables = {},
  className 
}) => {
  // Parse variables from content using regex - memoized
  const parsedVariables = useMemo(() => {
    if (!content) return {};
    
    const regex = /{([^{}]+)}/g;
    const vars = {};
    let match;

    while ((match = regex.exec(content)) !== null) {
      const name = match[1].trim();
      vars[name] = {
        description: `Enter value for ${name}`
      };
    }

    return vars;
  }, [content]);

  // Manage variables state with reducer
  const [state, dispatch] = useReducer(
    (state, action) => {
      switch (action.type) {
        case 'SET_VARIABLE':
          return {
            ...state,
            variables: {
              ...state.variables,
              [action.name]: action.value
            },
            errors: {
              ...state.errors,
              [action.name]: null
            }
          };
        case 'RESET_VARIABLES':
          return {
            variables: action.variables,
            errors: {}
          };
        default:
          return state;
      }
    },
    {
      variables: savedVariables,
      errors: {}
    }
  );

  // Update preview when variables change
  const processedContent = useMemo(() => {
    if (!content) return '';
    
    let result = content;
    Object.entries(state.variables).forEach(([name, value]) => {
      const regex = new RegExp(`{${name}}`, 'g');
      result = result.replace(regex, value || '');
    });
    return result;
  }, [content, state.variables]);

  // Notify parent of changes
  useEffect(() => {
    onVariablesChange?.(state.variables, processedContent);
  }, [state.variables, processedContent, onVariablesChange]);

  // Initialize variables with saved values
  useEffect(() => {
    if (Object.keys(savedVariables).length > 0) {
      dispatch({ type: 'RESET_VARIABLES', variables: savedVariables });
    }
  }, [savedVariables]);

  const handleVariableChange = useCallback((name, value) => {
    dispatch({ type: 'SET_VARIABLE', name, value });
  }, []);

  return (
    <div className={className}>
      <div className="grid gap-4">
        {Object.entries(parsedVariables).map(([name, info]) => (
          <VariableInput
            key={name}
            name={name}
            description={info.description}
            value={state.variables[name] || ''}
            onChange={handleVariableChange}
            error={state.errors[name]}
          />
        ))}
      </div>
    </div>
  );
};

export default PromptVariableManager;
