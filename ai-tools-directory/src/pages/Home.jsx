import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Link } from 'react-router-dom'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Pagination, Navigation } from 'swiper/modules'
import { FiSearch, FiTrendingUp, FiStar } from 'react-icons/fi'
import { useTools } from '../contexts/ToolsContext'

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
}

const categories = [
  { name: 'Text Generation', icon: '✍️' },
  { name: 'Image Generation', icon: '🎨' },
  { name: 'Video Creation', icon: '🎥' },
  { name: 'Code Assistant', icon: '💻' },
  { name: 'Audio Generation', icon: '🎵' },
  { name: '3D Modeling', icon: '🎮' },
]

const features = [
  {
    title: 'Discover AI Tools',
    description: 'Explore the latest and most powerful AI tools across various categories',
    icon: FiSearch
  },
  {
    title: 'Compare & Choose',
    description: 'Make informed decisions with detailed comparisons and user reviews',
    icon: FiStar
  },
  {
    title: 'Stay Updated',
    description: 'Keep track of trending tools and new releases in the AI space',
    icon: FiTrendingUp
  }
]

export default function Home() {
  const { tools } = useTools()
  const [trendingTools, setTrendingTools] = useState([])
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  })

  useEffect(() => {
    // Get top 6 tools by rating
    const sorted = [...tools].sort((a, b) => b.rating - a.rating).slice(0, 6)
    setTrendingTools(sorted)
  }, [tools])

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative isolate overflow-hidden bg-gradient-to-b from-blue-100/20">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="mx-auto max-w-7xl px-6 pb-24 pt-10 sm:pb-32 lg:flex lg:px-8 lg:py-40"
        >
          <motion.div
            variants={fadeInUp}
            className="mx-auto max-w-2xl lg:mx-0 lg:max-w-xl lg:flex-shrink-0 lg:pt-8"
          >
            <div className="mt-24 sm:mt-32 lg:mt-16">
              <a href="#trending" className="inline-flex space-x-6">
                <span className="rounded-full bg-blue-600/10 px-3 py-1 text-sm font-semibold leading-6 text-blue-600 ring-1 ring-inset ring-blue-600/10">
                  What's new
                </span>
                <span className="inline-flex items-center space-x-2 text-sm font-medium leading-6 text-gray-600">
                  <span>Just shipped v1.0</span>
                </span>
              </a>
            </div>
            <motion.h1
              variants={fadeInUp}
              className="mt-10 text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl"
            >
              Discover the Best AI Tools
            </motion.h1>
            <motion.p
              variants={fadeInUp}
              className="mt-6 text-lg leading-8 text-gray-600"
            >
              Explore our curated collection of cutting-edge AI tools. Find the perfect solution for your needs, compare features, and stay ahead in the AI revolution.
            </motion.p>
            <motion.div
              variants={fadeInUp}
              className="mt-10 flex items-center gap-x-6"
            >
              <Link
                to="/tools"
                className="rounded-md bg-blue-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition-all duration-300"
              >
                Explore Tools
              </Link>
              <Link
                to="/categories"
                className="text-sm font-semibold leading-6 text-gray-900 hover:text-blue-600 transition-all duration-300"
              >
                View Categories <span aria-hidden="true">→</span>
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      {/* Categories Section */}
      <motion.div
        ref={ref}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        variants={staggerContainer}
        className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8"
      >
        <motion.h2
          variants={fadeInUp}
          className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl text-center mb-16"
        >
          Explore by Category
        </motion.h2>
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-6">
          {categories.map((category, index) => (
            <motion.div
              key={category.name}
              variants={fadeInUp}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative flex flex-col items-center justify-center p-6 rounded-xl bg-white shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group"
            >
              <span className="text-4xl mb-4 transform group-hover:scale-110 transition-transform duration-300">
                {category.icon}
              </span>
              <h3 className="text-sm font-semibold text-gray-900 text-center">
                {category.name}
              </h3>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Features Section */}
      <div className="bg-blue-50 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="mx-auto max-w-2xl text-center"
          >
            <motion.h2
              variants={fadeInUp}
              className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl"
            >
              Everything you need to find the perfect AI tool
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              className="mt-6 text-lg leading-8 text-gray-600"
            >
              Our platform helps you discover, compare, and choose the best AI tools for your needs.
            </motion.p>
          </motion.div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
              {features.map((feature) => (
                <motion.div
                  key={feature.title}
                  whileHover={{ y: -10 }}
                  className="flex flex-col bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <dt className="text-base font-semibold leading-7 text-gray-900">
                    <div className="mb-6 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600">
                      <feature.icon className="h-6 w-6 text-white" aria-hidden="true" />
                    </div>
                    {feature.title}
                  </dt>
                  <dd className="mt-1 flex flex-auto flex-col text-base leading-7 text-gray-600">
                    <p className="flex-auto">{feature.description}</p>
                  </dd>
                </motion.div>
              ))}
            </dl>
          </div>
        </div>
      </div>

      {/* Trending Tools Section */}
      <div id="trending" className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="text-center mb-16"
        >
          <motion.h2
            variants={fadeInUp}
            className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl"
          >
            Trending AI Tools
          </motion.h2>
          <motion.p
            variants={fadeInUp}
            className="mt-4 text-lg text-gray-600"
          >
            Discover the most popular AI tools right now
          </motion.p>
        </motion.div>

        <Swiper
          modules={[Autoplay, Pagination, Navigation]}
          spaceBetween={30}
          slidesPerView={1}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
          }}
          pagination={{ clickable: true }}
          navigation
          breakpoints={{
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          className="pb-12"
        >
          {trendingTools.map((tool) => (
            <SwiperSlide key={tool.id}>
              <motion.div
                whileHover={{ y: -10 }}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
              >
                <div className="aspect-w-16 aspect-h-9 bg-gray-100">
                  <img
                    src={tool.image}
                    alt={tool.name}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {tool.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {tool.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <FiStar className="text-yellow-400 w-5 h-5" />
                      <span className="ml-2 text-sm text-gray-600">
                        {tool.rating.toFixed(1)}
                      </span>
                    </div>
                    <Link
                      to={`/tools/${tool.id}`}
                      className="text-blue-600 hover:text-blue-500 text-sm font-medium"
                    >
                      Learn more →
                    </Link>
                  </div>
                </div>
              </motion.div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  )
}
