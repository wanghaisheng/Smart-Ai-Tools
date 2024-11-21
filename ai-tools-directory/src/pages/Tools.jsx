import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useTools } from '../contexts/ToolsContext'
import { FiSearch, FiFilter, FiStar, FiExternalLink } from 'react-icons/fi'
import { useSearchParams } from 'react-router-dom'
import ToolCard from '../components/ToolCard'

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

export default function Tools() {
  const { tools, loading, error, filters, pagination, setFilters, setCurrentPage } = useTools()
  const [searchParams, setSearchParams] = useSearchParams()
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '')
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '')
  const [sortBy, setSortBy] = useState('rating-desc')

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams(searchParams)
    if (searchTerm) {
      params.set('search', searchTerm)
    } else {
      params.delete('search')
    }
    if (selectedCategory && selectedCategory !== 'all') {
      params.set('category', selectedCategory)
    } else {
      params.delete('category')
    }
    if (sortBy !== 'rating-desc') {
      params.set('sort', sortBy)
    } else {
      params.delete('sort')
    }
    setSearchParams(params, { replace: true })
  }, [searchTerm, selectedCategory, sortBy])

  // Update filters when URL params change
  useEffect(() => {
    const search = searchParams.get('search') || ''
    const category = searchParams.get('category') || 'all'
    const sort = searchParams.get('sort') || 'rating-desc'

    if (search !== searchTerm) setSearchTerm(search)
    if (category !== selectedCategory) setSelectedCategory(category)
    if (sort !== sortBy) setSortBy(sort)

    setFilters(prev => ({
      ...prev,
      search,
      category,
      sort
    }))
  }, [searchParams])

  const handlePageChange = (page) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Tools</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Filters Section */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Search */}
                <div className="relative">
                  <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search tools..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Category Filter */}
                <div className="relative">
                  <FiFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
                  >
                    <option value="">All Categories</option>
                    {Array.from(new Set(tools.map(tool => tool.category))).sort().map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>

                {/* Sort */}
                <div className="relative">
                  <FiStar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
                  >
                    <option value="rating-desc" key="rating-desc">Highest Rated</option>
                    <option value="rating-asc" key="rating-asc">Lowest Rated</option>
                    <option value="name-asc" key="name-asc">Name (A-Z)</option>
                    <option value="name-desc" key="name-desc">Name (Z-A)</option>
                  </select>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Tools Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading ? (
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <>
            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {tools.map((tool) => (
                <motion.div
                  key={tool._id}
                  variants={fadeInUp}
                  className="h-full"
                >
                  <ToolCard tool={tool} />
                </motion.div>
              ))}
            </motion.div>

            {/* No Results */}
            {tools.length === 0 && (
              <motion.div
                initial="hidden"
                animate="visible"
                variants={fadeInUp}
                className="text-center py-12"
              >
                <h3 className="text-lg font-medium text-gray-900">No tools found</h3>
                <p className="mt-2 text-sm text-gray-500">
                  Try adjusting your search or filter criteria
                </p>
              </motion.div>
            )}

            {/* Pagination */}
            {tools.length > 0 && (
              <div className="mt-8 flex items-center justify-between">
                <div className="text-sm text-gray-700">
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
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-700 hover:bg-gray-50'
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
