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
  const topTools = [...(tools || [])]
    .sort((a, b) => (b.rating?.average || 0) - (a.rating?.average || 0))
    .slice(0, 3)

  // Featured categories with modern AI focus
  const featuredCategories = [
    { name: 'Text Generation', icon: '✍️', count: 156, trend: '+12%' },
    { name: 'Image Creation', icon: '🎨', count: 98, trend: '+25%' },
    { name: 'Code Assistant', icon: '💻', count: 87, trend: '+18%' },
    { name: 'Audio & Speech', icon: '🎵', count: 64, trend: '+15%' }
  ]

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
            key="title"
            variants={fadeInUp}
            className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl md:text-6xl"
          >
            Discover the Best
            <span className="block text-primary-600 dark:text-primary-400">AI Tools</span>
          </motion.h1>
          <motion.p
            key="description"
            variants={fadeInUp}
            className="max-w-2xl mx-auto mt-6 text-lg text-gray-600 dark:text-gray-300"
          >
            Explore our curated collection of cutting-edge AI tools to enhance your productivity and creativity.
          </motion.p>
          
          {/* Search Bar */}
          <motion.div 
            key="search-bar"
            variants={fadeInUp}
            className="max-w-2xl mx-auto mt-8"
          >
            <div className="relative">
              <input
                type="text"
                placeholder="Search AI tools..."
                className="w-full px-4 py-3 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-800 dark:text-white dark:border-gray-700"
              />
              <button className="absolute right-2 top-2.5 p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                <FiSearch className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Featured Categories */}
      <section className="px-4 py-16 bg-white dark:bg-gray-800/50">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              Featured Categories
            </h2>
            <p className="max-w-2xl mx-auto mt-4 text-gray-600 dark:text-gray-300">
              Browse through our most popular AI tool categories
            </p>
          </div>

          <motion.div 
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="grid grid-cols-1 gap-6 mt-12 sm:grid-cols-2 lg:grid-cols-4"
          >
            {featuredCategories.map((category, index) => (
              <motion.div
                key={category.name}
                custom={index}
                variants={fadeInUp}
                whileHover={{ scale: 1.02 }}
                className="relative p-6 bg-white dark:bg-gray-800 rounded-xl shadow-soft hover:shadow-lg transition-shadow duration-300"
              >
                <div className="flex items-center justify-between">
                  <span className="text-4xl">{category.icon}</span>
                  <span className="px-2.5 py-1 text-sm font-medium text-green-700 bg-green-100 rounded-full dark:bg-green-900/30 dark:text-green-400">
                    {category.trend}
                  </span>
                </div>
                <h3 className="mt-4 text-xl font-semibold text-gray-900 dark:text-white">
                  {category.name}
                </h3>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  {category.count} tools available
                </p>
                <Link
                  to={`/categories/${category.name.toLowerCase().replace(/\s+/g, '-')}`}
                  className="absolute inset-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                  aria-label={`View ${category.name} category`}
                />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Top Rated Tools */}
      <section className="px-4 py-16 dark:bg-gray-900">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              Top Rated Tools
            </h2>
            <p className="max-w-2xl mx-auto mt-4 text-gray-600 dark:text-gray-300">
              Discover the most loved AI tools by our community
            </p>
          </div>

          <motion.div 
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="grid grid-cols-1 gap-8 mt-12 sm:grid-cols-2 lg:grid-cols-3"
          >
            {topTools.map((tool, index) => (
              <motion.div
                key={tool.id}
                custom={index}
                variants={fadeInUp}
                whileHover={{ y: -5 }}
                className="overflow-hidden bg-white dark:bg-gray-800 rounded-xl shadow-soft"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between">
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
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    {tool.description}
                  </p>
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center space-x-2">
                      {tool.tags?.slice(0, 2).map((tag) => (
                        <span
                          key={`${tool.id}-${tag}`}
                          className="px-2.5 py-0.5 text-xs font-medium text-primary-700 bg-primary-100 rounded-full dark:bg-primary-900/30 dark:text-primary-400"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <Link
                      to={`/tools/${tool.id}`}
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

          <div className="mt-12 text-center">
            <Link
              to="/tools"
              className="inline-flex items-center px-6 py-3 text-base font-medium text-white bg-primary-600 rounded-lg shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
            >
              View All Tools
              <FiArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="px-4 py-16 bg-primary-600 dark:bg-primary-900">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Stay Updated
            </h2>
            <p className="mt-4 text-lg text-primary-100">
              Get the latest AI tools and updates delivered to your inbox
            </p>
            <form className="mt-8 sm:flex sm:max-w-md sm:mx-auto">
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                type="email"
                name="email"
                id="email"
                required
                className="w-full px-5 py-3 text-base text-gray-900 placeholder-gray-500 bg-white border border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary-600"
                placeholder="Enter your email"
              />
              <div className="mt-3 sm:mt-0 sm:ml-3">
                <button
                  type="submit"
                  className="flex items-center justify-center w-full px-5 py-3 text-base font-medium text-primary-600 bg-white border border-transparent rounded-lg hover:bg-primary-50 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary-600"
                >
                  Subscribe
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  )
}
