import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  DocumentDuplicateIcon,
  StarIcon,
  TagIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';

const PromptTemplates = ({ onSelect, context }) => {
  const [templates, setTemplates] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState([]);

  // Template categories
  const categories = [
    { id: 'all', name: 'All Templates' },
    { id: 'writing', name: 'Writing & Content' },
    { id: 'technical', name: 'Technical & Code' },
    { id: 'business', name: 'Business & Professional' },
    { id: 'creative', name: 'Creative & Artistic' },
    { id: 'academic', name: 'Academic & Research' }
  ];

  // Example templates (in real app, fetch from API)
  useEffect(() => {
    const fetchTemplates = async () => {
      // Simulated API call
      const mockTemplates = [
        {
          id: 1,
          category: 'technical',
          title: 'Code Documentation',
          description: 'Generate comprehensive code documentation',
          template: 'Create detailed documentation for {codebase} including:\n- Purpose\n- Dependencies\n- Usage examples\n- API reference',
          tags: ['documentation', 'code', 'technical'],
          popularity: 4.8
        },
        {
          id: 2,
          category: 'writing',
          title: 'Blog Post Outline',
          description: 'Create a structured blog post outline',
          template: 'Generate a detailed outline for a blog post about {topic} including:\n- Introduction\n- Key points\n- Supporting details\n- Conclusion',
          tags: ['content', 'writing', 'blog'],
          popularity: 4.5
        },
        // Add more templates...
      ];

      setTemplates(mockTemplates);
    };

    fetchTemplates();
  }, []);

  // Filter templates based on search and category
  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  // Toggle favorite status
  const toggleFavorite = (templateId) => {
    setFavorites(prev =>
      prev.includes(templateId)
        ? prev.filter(id => id !== templateId)
        : [...prev, templateId]
    );
  };

  return (
    <div className="bg-gray-700 rounded-lg p-4 mt-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white flex items-center">
          <DocumentDuplicateIcon className="h-5 w-5 mr-2" />
          Prompt Templates
        </h3>
      </div>

      {/* Search and Category Filter */}
      <div className="mb-4 space-y-3">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search templates..."
          className="w-full bg-gray-600 text-white rounded-md border-gray-500 placeholder-gray-400"
        />

        <div className="flex overflow-x-auto space-x-2 py-2">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-3 py-1 rounded-full whitespace-nowrap ${
                selectedCategory === category.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredTemplates.map(template => (
          <motion.div
            key={template.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-600 rounded-lg p-4 hover:bg-gray-500 transition-colors"
          >
            <div className="flex items-start justify-between mb-2">
              <h4 className="text-white font-medium">{template.title}</h4>
              <button
                onClick={() => toggleFavorite(template.id)}
                className="text-gray-400 hover:text-yellow-400"
              >
                <StarIcon
                  className={`h-5 w-5 ${
                    favorites.includes(template.id) ? 'text-yellow-400 fill-current' : ''
                  }`}
                />
              </button>
            </div>

            <p className="text-sm text-gray-300 mb-3">{template.description}</p>

            <div className="flex flex-wrap gap-2 mb-3">
              {template.tags.map(tag => (
                <span
                  key={tag}
                  className="flex items-center px-2 py-1 rounded-full bg-gray-700 text-xs text-gray-300"
                >
                  <TagIcon className="h-3 w-3 mr-1" />
                  {tag}
                </span>
              ))}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center text-gray-400">
                <StarIcon className="h-4 w-4 mr-1" />
                <span className="text-sm">{template.popularity}</span>
              </div>
              <button
                onClick={() => onSelect(template.template)}
                className="flex items-center text-blue-400 hover:text-blue-300 text-sm"
              >
                Use Template
                <ChevronRightIcon className="h-4 w-4 ml-1" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredTemplates.length === 0 && (
        <div className="text-center py-8 text-gray-400">
          No templates found matching your criteria
        </div>
      )}
    </div>
  );
};

export default PromptTemplates;
