import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useTools } from '../contexts/ToolsContext'
import { FiSearch, FiFilter, FiStar, FiExternalLink, FiArrowRight, FiX, FiChevronLeft, FiChevronRight } from 'react-icons/fi'
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
                        to={`/tool/${tool._id}`}
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
              <div className="mt-12 flex flex-col items-center space-y-4">
                {/* Page Info */}
                <div className="text-sm text-gray-700 dark:text-gray-400">
                  <span className="font-medium text-gray-900 dark:text-white">{(pagination.currentPage - 1) * 28 + 1}</span>
                  {' '}-{' '}
                  <span className="font-medium text-gray-900 dark:text-white">{Math.min(pagination.currentPage * 28, pagination.totalTools)}</span>
                  {' '}of{' '}
                  <span className="font-medium text-gray-900 dark:text-white">{pagination.totalTools}</span> tools
                </div>

                {/* Navigation */}
                <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                  {/* Previous Page */}
                  <button
                    onClick={() => handlePageChange(pagination.currentPage - 1)}
                    disabled={pagination.currentPage === 1}
                    className={`relative inline-flex items-center rounded-l-md px-3 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 dark:ring-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 focus:z-20 focus:outline-offset-0 ${
                      pagination.currentPage === 1 
                        ? 'opacity-50 cursor-not-allowed'
                        : 'hover:text-gray-700 dark:hover:text-gray-200'
                    }`}
                  >
                    <span className="sr-only">Previous</span>
                    <FiChevronLeft className="h-5 w-5" aria-hidden="true" />
                  </button>

                  {/* Page Numbers */}
                  {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => {
                    // Show first page, last page, current page, and pages around current page
                    if (
                      page === 1 ||
                      page === pagination.totalPages ||
                      (page >= pagination.currentPage - 2 && page <= pagination.currentPage + 2)
                    ) {
                      return (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                            page === pagination.currentPage
                              ? 'z-10 bg-primary-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600'
                              : 'text-gray-900 dark:text-gray-300 ring-1 ring-inset ring-gray-300 dark:ring-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 focus:z-20 focus:outline-offset-0'
                          }`}
                        >
                          {page}
                        </button>
                      );
                    }

                    // Show ellipsis for skipped pages
                    if (
                      page === pagination.currentPage - 3 ||
                      page === pagination.currentPage + 3
                    ) {
                      return (
                        <span
                          key={page}
                          className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 dark:text-gray-400 ring-1 ring-inset ring-gray-300 dark:ring-gray-700"
                        >
                          ...
                        </span>
                      );
                    }

                    return null;
                  })}

                  {/* Next Page */}
                  <button
                    onClick={() => handlePageChange(pagination.currentPage + 1)}
                    disabled={pagination.currentPage === pagination.totalPages}
                    className={`relative inline-flex items-center rounded-r-md px-3 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 dark:ring-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 focus:z-20 focus:outline-offset-0 ${
                      pagination.currentPage === pagination.totalPages
                        ? 'opacity-50 cursor-not-allowed'
                        : 'hover:text-gray-700 dark:hover:text-gray-200'
                    }`}
                  >
                    <span className="sr-only">Next</span>
                    <FiChevronRight className="h-5 w-5" aria-hidden="true" />
                  </button>
                </nav>

                {/* Jump to Page (for many pages) */}
                {pagination.totalPages > 10 && (
                  <div className="flex items-center space-x-4">
                    <label htmlFor="page-number" className="text-sm text-gray-700 dark:text-gray-400">
                      Jump to page:
                    </label>
                    <input
                      type="number"
                      id="page-number"
                      min="1"
                      max={pagination.totalPages}
                      value={pagination.currentPage}
                      onChange={(e) => {
                        const page = parseInt(e.target.value);
                        if (page >= 1 && page <= pagination.totalPages) {
                          handlePageChange(page);
                        }
                      }}
                      className="block w-16 rounded-md border-0 py-1.5 text-center text-gray-900 dark:text-white dark:bg-gray-800 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-700 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-400">
                      of {pagination.totalPages}
                    </span>
                  </div>
                )}
              </div>
            )}

          </>
        )}
      </div>
    </div>
  )
}
