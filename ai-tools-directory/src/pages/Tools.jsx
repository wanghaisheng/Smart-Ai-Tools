import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useTools } from '../contexts/ToolsContext'
import { FiSearch, FiFilter, FiStar, FiExternalLink, FiArrowRight, FiX } from 'react-icons/fi'
import { useSearchParams } from 'react-router-dom'
import { Disclosure, Transition } from '@headlessui/react'

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const categories = [
  { name: 'All Categories', value: '' },
  { name: 'Text & Writing', value: 'text-writing', description: 'Content generation, copywriting, editing' },
  { name: 'Image & Art', value: 'image-art', description: 'Image generation, editing, art creation' },
  { name: 'Code & Development', value: 'code-development', description: 'Code generation, debugging, optimization' },
  { name: 'Audio & Music', value: 'audio-music', description: 'Audio generation, music creation, voice synthesis' },
  { name: 'Video & Animation', value: 'video-animation', description: 'Video creation, editing, animation' },
  { name: 'Data & Analytics', value: 'data-analytics', description: 'Data analysis, visualization, insights' },
  { name: 'Business & Marketing', value: 'business-marketing', description: 'Marketing copy, analytics, strategy' },
  { name: 'Research & Learning', value: 'research-learning', description: 'Research assistance, learning tools' },
  { name: 'Productivity', value: 'productivity', description: 'Task automation, workflow optimization' },
  { name: '3D & Design', value: '3d-design', description: '3D modeling, design assistance' },
  { name: 'Chat & Conversation', value: 'chat-conversation', description: 'Chatbots, conversational AI' },
  { name: 'Translation & Language', value: 'translation-language', description: 'Language translation, learning' },
  { name: 'Healthcare & Medical', value: 'healthcare-medical', description: 'Medical analysis, healthcare AI' },
  { name: 'Finance & Trading', value: 'finance-trading', description: 'Financial analysis, trading bots' },
  { name: 'Gaming & Entertainment', value: 'gaming-entertainment', description: 'Game development, entertainment AI' },
  { name: 'Security & Privacy', value: 'security-privacy', description: 'Security analysis, privacy tools' },
  { name: 'IoT & Robotics', value: 'iot-robotics', description: 'IoT automation, robotics control' }
]

const sortOptions = [
  { name: 'Most Popular', value: 'rating-desc' },
  { name: 'Newest First', value: '-createdAt' },
  { name: 'Alphabetical (A-Z)', value: 'name-asc' },
  { name: 'Alphabetical (Z-A)', value: 'name-desc' },
  { name: 'Rating (Low to High)', value: 'rating-asc' }
]

export default function Tools() {
  const { tools, loading, error, filters, pagination, setFilters, setCurrentPage } = useTools()
  const [searchParams, setSearchParams] = useSearchParams()
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '')
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '')
  const [sortBy, setSortBy] = useState('rating-desc')

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams()
    if (searchTerm) params.set('search', searchTerm)
    if (selectedCategory) params.set('category', selectedCategory)
    if (sortBy !== 'rating-desc') params.set('sort', sortBy)
    setSearchParams(params)

    // Update filters in context
    setFilters(prev => ({
      ...prev,
      search: searchTerm,
      category: selectedCategory,
      sort: sortBy
    }))
  }, [searchTerm, selectedCategory, sortBy, setSearchParams, setFilters])

  // Handle pagination
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header Section */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl md:text-6xl"
            >
              Explore AI Tools
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mt-4 max-w-2xl mx-auto text-xl text-gray-500 dark:text-gray-400"
            >
              Discover and compare the best AI tools to enhance your workflow
            </motion.p>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mt-4 text-gray-500 dark:text-gray-400"
            >
              {pagination?.totalTools} tools available
            </motion.div>
          </div>
        </div>
      </div>

      {/* Filters Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Search Bar */}
          <div className="flex-1 max-w-lg">
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search AI tools..."
                className="w-full px-4 py-3 pl-10 text-gray-900 placeholder-gray-500 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-800 dark:text-white dark:border-gray-700 dark:placeholder-gray-400"
              />
              <FiSearch className="absolute left-3 top-3.5 text-gray-400 h-5 w-5" />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <FiX className="h-5 w-5" />
                </button>
              )}
            </div>
          </div>

          {/* Filter Buttons */}
          <div className="flex flex-wrap gap-4">
            {/* Category Filter */}
            <div className="relative">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="appearance-none px-4 py-2.5 text-gray-900 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-800 dark:text-white dark:border-gray-700"
              >
                <option value="">All Categories</option>
                {Array.from(new Set(tools?.map(tool => tool.category))).sort().map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
              <FiFilter className="absolute right-3 top-3 text-gray-400 h-5 w-5 pointer-events-none" />
            </div>

            {/* Sort Filter */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none px-4 py-2.5 text-gray-900 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-800 dark:text-white dark:border-gray-700"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.name}
                  </option>
                ))}
              </select>
              <FiArrowRight className="absolute right-3 top-3 text-gray-400 h-5 w-5 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {/* Tools Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent"></div>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-500 dark:text-red-400">{error}</p>
          </div>
        ) : tools?.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">No tools found matching your criteria</p>
          </div>
        ) : (
          <>
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3"
            >
              {tools?.map((tool) => (
                <motion.div
                  key={tool._id}
                  variants={fadeInUp}
                  whileHover={{ y: -5 }}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-soft hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="aspect-w-16 aspect-h-9">
                    <img
                      src={tool.image}
                      alt={tool.name}
                      className="object-cover rounded-t-xl"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                        {tool.name}
                      </h3>
                      <div className="flex items-center">
                        <FiStar className="w-5 h-5 text-yellow-400" />
                        <span className="ml-1 text-sm font-medium text-gray-900 dark:text-white">
                          {tool.rating?.average?.toFixed(1) || "N/A"}
                        </span>
                      </div>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                      {tool.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex flex-wrap gap-2">
                        <span className="px-2.5 py-0.5 text-xs font-medium text-primary-700 bg-primary-100 rounded-full dark:bg-primary-900/30 dark:text-primary-400">
                          {tool.category}
                        </span>
                        <span className="px-2.5 py-0.5 text-xs font-medium text-gray-600 bg-gray-100 rounded-full dark:bg-gray-700 dark:text-gray-300">
                          {tool.pricing}
                        </span>
                      </div>
                      <Link
                        to={`/tools/${tool._id}`}
                        className="inline-flex items-center text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
                      >
                        Learn more
                        <FiArrowRight className="w-4 h-4 ml-1" />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <div className="mt-8 flex items-center justify-between">
                <div className="text-sm text-gray-700 dark:text-gray-400">
                  Showing{' '}
                  <span className="font-medium">
                    {(pagination.currentPage - 1) * 28 + 1}
                  </span>{' '}
                  to{' '}
                  <span className="font-medium">
                    {Math.min(pagination.currentPage * 28, pagination.totalTools)}
                  </span>{' '}
                  of <span className="font-medium">{pagination.totalTools}</span> tools
                </div>

                <nav className="flex items-center space-x-2">
                  {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-4 py-2 text-sm font-medium rounded-md ${
                        page === pagination.currentPage
                          ? 'bg-primary-600 text-white dark:bg-primary-500'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </nav>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
