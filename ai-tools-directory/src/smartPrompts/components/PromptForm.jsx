import React, { useState, useEffect } from 'react';
import { XMarkIcon, PlusIcon } from '@heroicons/react/24/outline';

const CATEGORIES = [
  'Content Creation',
  'Technical',
  'Business',
  'Creative',
  'Education',
  'Other'
];

const AI_MODELS = [
  'GPT-3',
  'GPT-4',
  'Claude',
  'DALL-E',
  'Midjourney',
  'Other'
];

const PromptForm = ({ prompt = null, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    description: '',
    category: '',
    tags: [],
    variables: [],
    visibility: 'private',
    aiModels: [],
    ...(prompt || {})
  });

  const [newTag, setNewTag] = useState('');
  const [newVariable, setNewVariable] = useState({
    name: '',
    description: '',
    defaultValue: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTagKeyPress = (e) => {
    if (e.key === 'Enter' && newTag.trim()) {
      e.preventDefault();
      if (!formData.tags.includes(newTag.trim())) {
        setFormData(prev => ({
          ...prev,
          tags: [...prev.tags, newTag.trim()]
        }));
      }
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const addVariable = () => {
    if (newVariable.name && newVariable.description) {
      setFormData(prev => ({
        ...prev,
        variables: [...prev.variables, { ...newVariable }]
      }));
      setNewVariable({ name: '', description: '', defaultValue: '' });
    }
  };

  const removeVariable = (index) => {
    setFormData(prev => ({
      ...prev,
      variables: prev.variables.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-800 text-gray-100 p-6 rounded-lg shadow-xl">
      <div className="grid grid-cols-12 gap-6">
        {/* Left Column */}
        <div className="col-span-7 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300">Content</label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              rows={8}
              className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
        </div>

        {/* Right Column */}
        <div className="col-span-5 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white focus:border-blue-500 focus:ring-blue-500"
              required
            >
              <option value="">Select a category</option>
              {CATEGORIES.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300">Tags</label>
            <div className="mt-1 flex flex-wrap gap-2 bg-gray-700 p-2 rounded-md">
              {formData.tags.map(tag => (
                <span
                  key={tag}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-900 text-blue-200"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="ml-1 inline-flex items-center text-blue-200 hover:text-blue-100"
                  >
                    <XMarkIcon className="h-3 w-3" />
                  </button>
                </span>
              ))}
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={handleTagKeyPress}
                placeholder="Type and press Enter"
                className="flex-1 min-w-[100px] bg-transparent border-none focus:ring-0 text-white placeholder-gray-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300">Variables</label>
            <div className="mt-1 space-y-2 bg-gray-700 p-2 rounded-md">
              {formData.variables.map((variable, index) => (
                <div key={index} className="flex items-center gap-2 p-2 bg-gray-600 rounded">
                  <div className="flex-1">
                    <p className="font-medium text-sm">{variable.name}</p>
                    <p className="text-xs text-gray-400">{variable.description}</p>
                    {variable.defaultValue && (
                      <p className="text-xs text-gray-400">Default: {variable.defaultValue}</p>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => removeVariable(index)}
                    className="text-red-400 hover:text-red-300"
                  >
                    <XMarkIcon className="h-4 w-4" />
                  </button>
                </div>
              ))}
              
              <div className="grid grid-cols-3 gap-2">
                <input
                  type="text"
                  value={newVariable.name}
                  onChange={(e) => setNewVariable(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Name"
                  className="rounded-md bg-gray-600 border-gray-500 text-white placeholder-gray-400"
                />
                <input
                  type="text"
                  value={newVariable.description}
                  onChange={(e) => setNewVariable(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Description"
                  className="rounded-md bg-gray-600 border-gray-500 text-white placeholder-gray-400"
                />
                <button
                  type="button"
                  onClick={addVariable}
                  className="inline-flex items-center justify-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-blue-200 bg-blue-900 hover:bg-blue-800"
                >
                  <PlusIcon className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300">Visibility</label>
            <select
              name="visibility"
              value={formData.visibility}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="private">Private</option>
              <option value="public">Public</option>
              <option value="shared">Shared</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300">AI Models</label>
            <div className="mt-1 grid grid-cols-2 gap-2">
              {AI_MODELS.map(model => (
                <label key={model} className="inline-flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.aiModels.includes(model)}
                    onChange={(e) => {
                      const updatedModels = e.target.checked
                        ? [...formData.aiModels, model]
                        : formData.aiModels.filter(m => m !== model);
                      setFormData(prev => ({ ...prev, aiModels: updatedModels }));
                    }}
                    className="rounded border-gray-600 bg-gray-700 text-blue-500 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-300">{model}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-700">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-300 bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-blue-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-blue-500"
        >
          {prompt && prompt._id ? 'Update Prompt' : 'Create Prompt'}
        </button>
      </div>
    </form>
  );
};

export default PromptForm;
