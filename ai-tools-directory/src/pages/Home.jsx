import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { FiSearch, FiGrid, FiTrendingUp, FiStar, FiArrowRight } from 'react-icons/fi'
import { useTools } from '../contexts/ToolsContext'

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

export default function Home() {
  const { tools } = useTools()

  // Get top rated tools
  const topTools = [...tools]
    .sort((a, b) => b.rating.average - a.rating.average)
    .slice(0, 3)

  // Get trending categories
  const trendingCategories = [
    { name: 'Text Generation', count: 156, trend: '+12%' },
    { name: 'Image Generation', count: 89, trend: '+28%' },
    { name: 'Code Assistant', count: 67, trend: '+15%' },
    { name: 'ChatBots', count: 45, trend: '+20%' }
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section with Search */}
      <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.h1
              variants={fadeInUp}
              className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600"
            >
              Discover the Best AI Tools
            </motion.h1>
            <motion.p
              variants={fadeInUp}
              className="text-xl text-gray-600 mb-8"
            >
              Your gateway to 1000+ AI tools across 50+ categories
            </motion.p>

            {/* Search Bar */}
            <motion.div
              variants={fadeInUp}
              className="flex items-center max-w-2xl mx-auto bg-white rounded-full shadow-lg p-2 mb-8"
            >
              <div className="flex-1 flex items-center">
                <FiSearch className="ml-4 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search AI tools..."
                  className="w-full px-4 py-2 focus:outline-none text-gray-700"
                />
              </div>
              <Link
                to="/tools"
                className="px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors duration-300"
              >
                Search
              </Link>
            </motion.div>

            {/* Quick Stats */}
            <motion.div
              variants={fadeInUp}
              className="grid grid-cols-3 gap-8 max-w-3xl mx-auto"
            >
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">1000+</div>
                <div className="text-sm text-gray-600">AI Tools</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">50+</div>
                <div className="text-sm text-gray-600">Categories</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">24/7</div>
                <div className="text-sm text-gray-600">Updates</div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Featured Tools Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Top Rated Tools</h2>
          <Link
            to="/tools"
            className="flex items-center text-blue-600 hover:text-blue-700 transition-colors duration-300"
          >
            View All
            <FiArrowRight className="ml-2" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {topTools.map((tool) => (
            <motion.div
              key={tool.id}
              whileHover={{ y: -5 }}
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
            >
              <div className="aspect-w-16 aspect-h-9 bg-gray-100">
                <img
                  src={tool.image || 'https://via.placeholder.com/400x225?text=AI+Tool'}
                  alt={tool.name}
                  className="object-cover w-full h-full"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">{tool.name}</h3>
                  <div className="flex items-center">
                    <FiStar className="text-yellow-400 w-5 h-5" />
                    <span className="ml-1 text-sm text-gray-600">{tool.rating.average.toFixed(1)}</span>
                  </div>
                </div>
                <p className="text-sm text-gray-600 line-clamp-2 mb-4">{tool.description}</p>
                <Link
                  to={`/tools/${tool.id}`}
                  className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors duration-300"
                >
                  Learn More
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Trending Categories */}
      <div className="bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Trending Categories</h2>
            <Link
              to="/categories"
              className="flex items-center text-blue-600 hover:text-blue-700 transition-colors duration-300"
            >
              All Categories
              <FiArrowRight className="ml-2" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {trendingCategories.map((category) => (
              <motion.div
                key={category.name}
                whileHover={{ y: -5 }}
                className="bg-white rounded-2xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-lg bg-blue-100 text-blue-600">
                    <FiGrid className="w-6 h-6" />
                  </div>
                  <div className="flex items-center text-green-600">
                    <FiTrendingUp className="w-4 h-4 mr-1" />
                    {category.trend}
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{category.name}</h3>
                <p className="text-sm text-gray-600">{category.count} tools</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-xl p-8 text-white text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Explore?</h2>
          <p className="text-lg mb-8 opacity-90">
            Start discovering the perfect AI tools for your needs
          </p>
          <Link
            to="/tools"
            className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors duration-300"
          >
            Browse All Tools
          </Link>
        </div>
      </div>
    </div>
  )
}
