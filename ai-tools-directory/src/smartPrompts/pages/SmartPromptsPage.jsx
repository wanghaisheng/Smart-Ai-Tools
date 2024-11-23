import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { PlusIcon, FunnelIcon } from '@heroicons/react/24/outline';
import PromptCard from '../components/PromptCard';
import PromptForm from '../components/PromptForm';
import { promptService } from '../services/promptService';

const ITEMS_PER_PAGE = 12;

const SmartPromptsPage = () => {
  const [prompts, setPrompts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingPrompt, setEditingPrompt] = useState(null);
  const [filters, setFilters] = useState({
    category: '',
    search: '',
    page: 1
  });
  const [totalPages, setTotalPages] = useState(1);

  // Get current user from your auth context
  const currentUser = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    fetchPrompts();
  }, [filters]);

  const fetchPrompts = async () => {
    try {
      setLoading(true);
      const response = await promptService.getPrompts({
        ...filters,
        limit: ITEMS_PER_PAGE
      });
      setPrompts(response.prompts);
      setTotalPages(response.totalPages);
    } catch (error) {
      toast.error('Failed to fetch prompts');
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePrompt = async (promptData) => {
    try {
      await promptService.createPrompt(promptData);
      toast.success('Prompt created successfully');
      setShowForm(false);
      fetchPrompts();
    } catch (error) {
      toast.error('Failed to create prompt');
    }
  };

  const handleUpdatePrompt = async (promptData) => {
    try {
      await promptService.updatePrompt(editingPrompt._id, promptData);
      toast.success('Prompt updated successfully');
      setShowForm(false);
      setEditingPrompt(null);
      fetchPrompts();
    } catch (error) {
      toast.error('Failed to update prompt');
    }
  };

  const handleDeletePrompt = async (promptId) => {
    if (window.confirm('Are you sure you want to delete this prompt?')) {
      try {
        await promptService.deletePrompt(promptId);
        toast.success('Prompt deleted successfully');
        fetchPrompts();
      } catch (error) {
        toast.error('Failed to delete prompt');
      }
    }
  };

  const handleRatePrompt = async (promptId, rating) => {
    try {
      await promptService.ratePrompt(promptId, rating);
      toast.success('Rating submitted successfully');
      fetchPrompts();
    } catch (error) {
      toast.error('Failed to submit rating');
    }
  };

  const handleShare = (promptId) => {
    const url = `${window.location.origin}/prompts/${promptId}`;
    navigator.clipboard.writeText(url);
    toast.success('Prompt link copied to clipboard');
  };

  const handleFilter = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value,
      page: 1 // Reset to first page when filters change
    }));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-100">Smart Prompts</h1>
        <button
          onClick={() => setShowForm(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Create Prompt
        </button>
      </div>

      {/* Filters */}
      <div className="mb-8 p-4 bg-gray-800 rounded-lg shadow border border-gray-700">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <input
              type="text"
              name="search"
              value={filters.search}
              onChange={handleFilter}
              placeholder="Search prompts..."
              className="block w-full rounded-md bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div className="w-48">
            <select
              name="category"
              value={filters.category}
              onChange={handleFilter}
              className="block w-full rounded-md bg-gray-700 border-gray-600 text-gray-100 focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">All Categories</option>
              <option value="Content Creation">Content Creation</option>
              <option value="Technical">Technical</option>
              <option value="Business">Business</option>
              <option value="Creative">Creative</option>
              <option value="Education">Education</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>
      </div>

      {/* Prompts Grid */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {prompts.map(prompt => (
              <PromptCard
                key={prompt._id}
                prompt={prompt}
                currentUser={currentUser}
                onRate={handleRatePrompt}
                onShare={handleShare}
                onEdit={(id) => {
                  setEditingPrompt(prompt);
                  setShowForm(true);
                }}
                onDelete={handleDeletePrompt}
              />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-8 flex justify-center">
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setFilters(prev => ({ ...prev, page: i + 1 }))}
                    className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                      filters.page === i + 1
                        ? 'z-10 bg-blue-900 border-blue-700 text-blue-100'
                        : 'bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </nav>
            </div>
          )}
        </>
      )}

      {/* Create/Edit Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="border-b border-gray-700 px-6 py-4">
              <h2 className="text-2xl font-bold text-gray-100">
                {editingPrompt ? 'Edit Prompt' : 'Create New Prompt'}
              </h2>
            </div>
            <div className="p-6">
              <PromptForm
                prompt={editingPrompt}
                onSubmit={editingPrompt ? handleUpdatePrompt : handleCreatePrompt}
                onCancel={() => {
                  setShowForm(false);
                  setEditingPrompt(null);
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SmartPromptsPage;
