import { motion } from 'framer-motion'
import { useTools } from '../contexts/ToolsContext'
import { Link } from 'react-router-dom'
import { FiGrid, FiArrowRight, FiSearch } from 'react-icons/fi'
import { useState } from 'react'

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

export default function Categories() {
  const { categories, tools, loading, error } = useTools()
  const [searchTerm, setSearchTerm] = useState('')

  // Filter categories based on search
  const filteredCategories = categories?.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.description?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="animate-pulse">
              <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded max-w-md mx-auto mb-4"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded max-w-sm mx-auto"></div>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="animate-pulse">
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                    <div className="w-24 h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  </div>
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-red-600 dark:text-red-400">Error Loading Categories</h2>
          <p className="mt-4 text-lg text-gray-500 dark:text-gray-400">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-8 inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <section className="px-4 pt-20 pb-16 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="text-center"
        >
          <motion.h1 
            variants={fadeInUp}
            className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl md:text-6xl"
          >
            Browse AI Tools by
            <span className="block text-primary-600 dark:text-primary-400">Category</span>
          </motion.h1>
          <motion.p
            variants={fadeInUp}
            className="max-w-2xl mx-auto mt-6 text-lg text-gray-600 dark:text-gray-300"
          >
            Discover and explore our comprehensive collection of AI tools organized by category
          </motion.p>
          
          {/* Search Bar */}
          <motion.div 
            variants={fadeInUp}
            className="max-w-2xl mx-auto mt-8"
          >
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search categories..."
                className="w-full px-4 py-3 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-800 dark:text-white dark:border-gray-700 dark:placeholder-gray-400"
              />
              <button className="absolute right-2 top-2.5 p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                <FiSearch className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Categories Grid */}
      <section className="px-4 py-16 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {filteredCategories?.map((category) => (
            <motion.div
              key={category._id}
              variants={fadeInUp}
              whileHover={{ y: -5 }}
              className="relative group"
            >
              <Link
                to={`/tools?category=${encodeURIComponent(category.name)}`}
                className="block h-full"
              >
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-soft hover:shadow-lg transition-all duration-300 p-6 h-full border border-gray-100 dark:border-gray-700">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 rounded-lg bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400">
                      {category.icon || <FiGrid className="w-6 h-6" />}
                    </div>
                    <div className="flex items-center text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-300">
                      <span className="mr-2 text-sm font-medium">View Tools</span>
                      <FiArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    {category.name}
                  </h3>
                  
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    {category.toolCount} tools available
                  </p>

                  <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                    {category.description}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-16"
        >
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-soft p-8 border border-gray-100 dark:border-gray-700">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6 text-center">
              Directory Statistics
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-4 text-center">
                <div className="text-3xl font-bold text-primary-600 dark:text-primary-400 mb-2">
                  {categories?.length || 0}
                </div>
                <div className="text-gray-600 dark:text-gray-400">Categories</div>
              </div>
              <div className="p-4 text-center">
                <div className="text-3xl font-bold text-primary-600 dark:text-primary-400 mb-2">
                  {tools?.length || 0}
                </div>
                <div className="text-gray-600 dark:text-gray-400">Total Tools</div>
              </div>
              <div className="p-4 text-center">
                <div className="text-3xl font-bold text-primary-600 dark:text-primary-400 mb-2">
                  {tools?.length ? (tools.reduce((sum, tool) => sum + (tool.rating?.average || 0), 0) / tools.length).toFixed(1) : '0.0'}
                </div>
                <div className="text-gray-600 dark:text-gray-400">Average Rating</div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  )
}
