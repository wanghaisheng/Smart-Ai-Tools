import { motion } from 'framer-motion'
import { FiDatabase, FiSearch, FiFilter, FiStar, FiUsers, FiTrendingUp } from 'react-icons/fi'

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

const features = [
  {
    name: 'Comprehensive Database',
    description: 'Access our extensive collection of AI tools, carefully curated and regularly updated.',
    icon: FiDatabase,
    color: 'blue'
  },
  {
    name: 'Advanced Search',
    description: 'Find the perfect AI tool with our powerful search and filtering system.',
    icon: FiSearch,
    color: 'purple'
  },
  {
    name: 'Detailed Categories',
    description: 'Browse tools by categories to discover solutions for specific needs.',
    icon: FiFilter,
    color: 'pink'
  },
  {
    name: 'User Reviews',
    description: 'Make informed decisions with ratings and reviews from the community.',
    icon: FiStar,
    color: 'yellow'
  },
  {
    name: 'Community Driven',
    description: 'Join a growing community of AI enthusiasts and professionals.',
    icon: FiUsers,
    color: 'green'
  },
  {
    name: 'Trending Tools',
    description: 'Stay updated with the latest and most popular AI tools.',
    icon: FiTrendingUp,
    color: 'red'
  }
]

const colorClasses = {
  blue: 'bg-blue-100 text-blue-600',
  purple: 'bg-purple-100 text-purple-600',
  pink: 'bg-pink-100 text-pink-600',
  yellow: 'bg-yellow-100 text-yellow-600',
  green: 'bg-green-100 text-green-600',
  red: 'bg-red-100 text-red-600'
}

export default function About() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="text-center"
          >
            <motion.h1
              variants={fadeInUp}
              className="text-4xl font-bold text-gray-900 sm:text-5xl mb-6"
            >
              About AI Tools Directory
            </motion.h1>
            <motion.p
              variants={fadeInUp}
              className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto"
            >
              Your comprehensive guide to discovering and comparing the latest AI tools and technologies.
              We help you navigate the rapidly evolving landscape of artificial intelligence solutions.
            </motion.p>
          </motion.div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {features.map((feature) => (
            <motion.div
              key={feature.name}
              variants={fadeInUp}
              whileHover={{ y: -5 }}
              className="bg-white rounded-2xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl"
            >
              <div className={`p-3 rounded-lg ${colorClasses[feature.color]} w-fit`}>
                <feature.icon className="w-6 h-6" />
              </div>
              <h3 className="mt-4 text-xl font-semibold text-gray-900">
                {feature.name}
              </h3>
              <p className="mt-2 text-gray-600">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Mission Statement */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-16 text-center max-w-4xl mx-auto"
        >
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
              Our Mission
            </h2>
            <p className="text-gray-600 mb-6">
              We believe in making artificial intelligence accessible to everyone. Our platform is designed
              to help individuals and businesses discover the right AI tools for their needs, compare
              different solutions, and stay updated with the latest developments in AI technology.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <div className="p-4">
                <div className="text-3xl font-bold text-blue-600 mb-2">1000+</div>
                <div className="text-gray-600">AI Tools Listed</div>
              </div>
              <div className="p-4">
                <div className="text-3xl font-bold text-purple-600 mb-2">50+</div>
                <div className="text-gray-600">Categories</div>
              </div>
              <div className="p-4">
                <div className="text-3xl font-bold text-green-600 mb-2">24/7</div>
                <div className="text-gray-600">Updates</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Contact Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-16 text-center"
        >
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl shadow-lg p-8 text-white">
            <h2 className="text-2xl font-semibold mb-4">
              Get Involved
            </h2>
            <p className="mb-6">
              Have a suggestion or want to contribute? We'd love to hear from you!
            </p>
            <a
              href="mailto:contact@aitoolsdirectory.com"
              className="inline-block bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors duration-300"
            >
              Contact Us
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
