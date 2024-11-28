import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { PlusIcon, FunnelIcon, Cog6ToothIcon, ArrowUpTrayIcon } from '@heroicons/react/24/outline';
import PromptCard from '../components/PromptCard';
import PromptForm from '../components/PromptForm';
import AiPromptGenerator from '../components/AiPromptGenerator';
import ApiKeyManager from '../components/settings/ApiKeyManager';
import BulkImportModal from '../components/BulkImportModal';
import { promptService } from '../services/promptService';
import { useAuth } from '../../contexts/AuthContext';

const ITEMS_PER_PAGE = 12;

const TABS = [
  { id: 'all', name: 'All Prompts' },
  { id: 'my-prompts', name: 'My Prompts' },
  { id: 'public', name: 'Public Prompts' },
  { id: 'favorites', name: 'Favorites' },
  { id: 'shared', name: 'Shared with Me' },
  { id: 'ai-gen', name: 'AI Prompt Gen' },
  { id: 'settings', name: 'Settings' }
];

const SmartPromptsPage = () => {
  const { user, loading: authLoading } = useAuth();
  const isAuthenticated = !!user;

  const [prompts, setPrompts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingPrompt, setEditingPrompt] = useState(null);
  const [activeTab, setActiveTab] = useState('public'); // Default to public tab
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [filters, setFilters] = useState({
    category: '',
    search: '',
    page: 1,
    view: 'my-prompts' // Changed default view to my-prompts
  });
  const [totalPages, setTotalPages] = useState(1);
  const [showBulkImport, setShowBulkImport] = useState(false);

  useEffect(() => {
    // If not logged in and trying to access protected tabs, show auth modal
    if (!isAuthenticated && ['my-prompts', 'favorites', 'shared'].includes(activeTab)) {
      setShowAuthModal(true);
      setActiveTab('public'); // Reset to public tab
      return;
    }
    
    fetchPrompts();
  }, [filters, activeTab, isAuthenticated]);

  const fetchPrompts = async () => {
    try {
      console.log('Fetching prompts with filters:', {
        ...filters,
        view: activeTab,
        userId: user?._id // Make sure we're using _id
      });
      setLoading(true);
      const response = await promptService.getPrompts({
        ...filters,
        view: activeTab,
        userId: user?._id // Make sure we're using _id
      });
      console.log('Fetched prompts:', response);
      setPrompts(response.prompts || []);
      setTotalPages(response.totalPages || 1);
    } catch (error) {
      console.error('Error fetching prompts:', error);
      toast.error('Failed to fetch prompts');
      setPrompts([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (tabId) => {
    if (!isAuthenticated && ['my-prompts', 'favorites', 'shared'].includes(tabId)) {
      setShowAuthModal(true);
      return;
    }
    setActiveTab(tabId);
    setFilters(prev => ({ ...prev, page: 1, view: tabId })); // This is correct
  };

  const handleFilter = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value,
      page: 1
    }));
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

  const handlePromptUpdate = async (promptId) => {
    console.log('Handling prompt update for:', promptId);
    await fetchPrompts(); // Refresh all prompts to get latest data
  };

  const handleBulkImportSuccess = () => {
    fetchPrompts();
  };

  const renderEmptyState = () => {
    const emptyStateMessages = {
      'all': 'No prompts found. Try adjusting your search filters.',
      'my-prompts': 'You haven\'t created any prompts yet. Click "Create Prompt" to get started!',
      'public': 'No public prompts found. Be the first to share a prompt with the community!',
      'favorites': 'You haven\'t favorited any prompts yet. Browse prompts and click the star icon to add them here.',
      'shared': 'No prompts have been shared with you yet.',
      'ai-gen': 'Start generating AI-powered prompts by clicking the "Generate" button!'
    };

    return (
      <div className="text-center py-12">
        <div className="rounded-full bg-gray-800/50 p-4 mx-auto w-16 h-16 flex items-center justify-center mb-4">
          <FunnelIcon className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-300 mb-2">No Prompts Found</h3>
        <p className="text-gray-400 max-w-md mx-auto">
          {emptyStateMessages[activeTab]}
        </p>
      </div>
    );
  };

  const renderSettingsContent = () => (
    <div className="max-w-6xl mx-auto">
      {/* Settings Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-100 flex items-center gap-3">
          <Cog6ToothIcon className="h-7 w-7 text-gray-400" />
          Settings
        </h1>
        <p className="mt-2 text-gray-400">
          Configure your AI services and manage your Smart Prompts preferences
        </p>
      </div>

      {/* Settings Grid */}
      <div className="grid gap-6">
        {/* AI Services Section */}
        <section className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50">
          <ApiKeyManager />
        </section>

        {/* Additional Settings Sections */}
        <section className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50">
          <div className="flex items-center gap-2 mb-4">
            <FunnelIcon className="h-5 w-5 text-gray-400" />
            <h2 className="text-lg font-medium text-gray-200">Preferences</h2>
          </div>
          
          <div className="grid gap-4">
            {/* Default Model Selection */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">
                Default AI Model
              </label>
              <select className="w-full bg-gray-700 border-gray-600 rounded-lg text-gray-200 focus:ring-blue-500 focus:border-blue-500">
                <option value="gpt-4">GPT-4</option>
                <option value="gpt-3.5">GPT-3.5 Turbo</option>
                <option value="claude-2">Claude 2</option>
              </select>
            </div>

            {/* Default Temperature */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">
                Default Temperature
              </label>
              <input 
                type="range" 
                min="0" 
                max="100" 
                className="w-full accent-blue-500"
              />
              <div className="flex justify-between text-xs text-gray-400">
                <span>Conservative</span>
                <span>Balanced</span>
                <span>Creative</span>
              </div>
            </div>

            {/* Other preferences */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">
                Default Prompt Length
              </label>
              <div className="flex gap-3">
                <button className="px-3 py-1.5 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600">
                  Short
                </button>
                <button className="px-3 py-1.5 bg-blue-600 text-white rounded-lg">
                  Medium
                </button>
                <button className="px-3 py-1.5 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600">
                  Long
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-100">Smart Prompts</h1>
        {isAuthenticated && (
          <div className="flex gap-4">
            <button
              onClick={() => setShowBulkImport(true)}
              className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors flex items-center gap-2"
            >
              <ArrowUpTrayIcon className="w-5 h-5" />
              Import Prompts
            </button>
            <button
              onClick={() => setShowForm(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors flex items-center gap-2"
            >
              <PlusIcon className="w-5 h-5" />
              Create Prompt
            </button>
          </div>
        )}
      </div>

      {/* Filters */}
      <div className="mb-6 p-4 bg-gray-800 rounded-lg shadow border border-gray-700">
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

      {/* Tabs */}
      <div className="mb-6">
        <nav className="flex space-x-4" aria-label="Tabs">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200
                ${!isAuthenticated && ['my-prompts', 'favorites', 'shared'].includes(tab.id)
                  ? 'opacity-50 cursor-not-allowed'
                  : ''
                }
                ${activeTab === tab.id
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:text-white hover:bg-gray-700'
                }
              `}
            >
              {tab.name}
              {!isAuthenticated && ['my-prompts', 'favorites', 'shared'].includes(tab.id) && (
                <span className="ml-1 text-xs">🔒</span>
              )}
              {activeTab === tab.id && (
                <motion.div
                  layoutId="tab-indicator"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500"
                  initial={false}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content Description */}
      <div className="mb-6">
        <div className="bg-gray-800/50 rounded-md p-4 border border-gray-700/50">
          {activeTab === 'all' && (
            <p className="text-gray-300">Browse all available prompts from the community.</p>
          )}
          {activeTab === 'my-prompts' && (
            <p className="text-gray-300">View and manage prompts you've created.</p>
          )}
          {activeTab === 'public' && (
            <p className="text-gray-300">Explore public prompts shared by the community.</p>
          )}
          {activeTab === 'favorites' && (
            <p className="text-gray-300">Access your favorite and most used prompts.</p>
          )}
          {activeTab === 'shared' && (
            <p className="text-gray-300">View prompts that others have shared with you.</p>
          )}
          {activeTab === 'ai-gen' && (
            <p className="text-gray-300">Generate AI-powered prompts with our advanced tools.</p>
          )}
          {activeTab === 'settings' && (
            <p className="text-gray-300">Configure your Smart Prompts settings.</p>
          )}
        </div>
      </div>

      {/* Prompts Grid */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : activeTab === 'settings' ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
        >
          {renderSettingsContent()}
        </motion.div>
      ) : activeTab === 'ai-gen' ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
        >
          <AiPromptGenerator onSavePrompt={handleCreatePrompt} />
        </motion.div>
      ) : prompts.length === 0 ? (
        renderEmptyState()
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {prompts.map((prompt) => (
            <PromptCard
              key={prompt._id}
              prompt={prompt}
              currentUser={user}
              onRate={handleRatePrompt}
              onShare={handleShare}
              onEdit={() => {
                setEditingPrompt(prompt);
                setShowForm(true);
              }}
              onDelete={handleDeletePrompt}
              onUpdate={handlePromptUpdate}
              showActions={activeTab === 'my-prompts' || 
                          (prompt.userId === user?.id) ||
                          (activeTab === 'shared' && prompt.sharedWith?.includes(user?.id))}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-8 flex justify-center">
          <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setFilters(prev => ({ ...prev, page: i + 1 }))} // This is correct
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

      {/* Auth Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-semibold text-gray-100 mb-4">Authentication Required</h3>
            <p className="text-gray-300 mb-6">
              Please sign in to access this feature. Create an account to save your prompts,
              favorite others' prompts, and participate in the community.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowAuthModal(false)}
                className="px-4 py-2 text-gray-300 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  // Navigate to login page or show login modal
                  window.location.href = '/login';
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Sign In
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Import Modal */}
      <BulkImportModal 
        isOpen={showBulkImport}
        onClose={() => setShowBulkImport(false)}
        onSuccess={handleBulkImportSuccess}
      />

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
