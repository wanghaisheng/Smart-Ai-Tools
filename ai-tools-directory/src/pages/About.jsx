import { motion } from 'framer-motion'
import { FiUsers, FiTarget, FiHeart, FiGlobe } from 'react-icons/fi'

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
    name: 'Curated Collection',
    description: 'We carefully select and verify each AI tool to ensure quality and reliability.',
    icon: FiTarget,
  },
  {
    name: 'Community Driven',
    description: 'Our platform thrives on user reviews, ratings, and contributions from the AI community.',
    icon: FiUsers,
  },
  {
    name: 'Always Up-to-Date',
    description: 'We continuously update our directory with the latest AI tools and technologies.',
    icon: FiGlobe,
  },
  {
    name: 'User-Focused',
    description: 'Our platform is designed with users in mind, making it easy to find the right AI tools.',
    icon: FiHeart,
  },
]

const teamMembers = [
  {
    name: 'Sarah Johnson',
    role: 'Founder & CEO',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
  {
    name: 'Michael Chen',
    role: 'CTO',
    image: 'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
  {
    name: 'Emily Rodriguez',
    role: 'Head of Content',
    image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
]

export default function About() {
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
            About AI Tools Directory
          </motion.h1>
          <motion.p
            variants={fadeInUp}
            className="max-w-2xl mx-auto mt-6 text-lg text-gray-600 dark:text-gray-300"
          >
            Discover the story behind our mission to make AI tools accessible to everyone. We're building the most comprehensive and user-friendly directory of AI tools.
          </motion.p>
        </motion.div>
      </section>

      {/* Mission Section */}
      <section className="py-16 bg-white dark:bg-gray-800/50">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8"
        >
          <motion.div variants={fadeInUp} className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">Our Mission</h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
              We believe in democratizing access to artificial intelligence. Our mission is to help people discover, compare, and implement AI tools that can transform their work and creativity.
            </p>
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8"
        >
          <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <motion.div
                key={feature.name}
                variants={fadeInUp}
                className="relative p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-soft"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 mb-4 text-primary-600 dark:text-primary-400 bg-primary-100 dark:bg-primary-900/30 rounded-xl">
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{feature.name}</h3>
                <p className="mt-2 text-gray-600 dark:text-gray-300">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-white dark:bg-gray-800/50">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8"
        >
          <div className="max-w-3xl mx-auto text-center">
            <motion.h2
              variants={fadeInUp}
              className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl"
            >
              Meet Our Team
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              className="mt-4 text-lg text-gray-600 dark:text-gray-300"
            >
              We're a passionate team dedicated to bringing you the best AI tools and resources.
            </motion.p>
          </div>

          <motion.div
            variants={staggerContainer}
            className="grid grid-cols-1 gap-12 mt-12 sm:grid-cols-2 lg:grid-cols-3"
          >
            {teamMembers.map((member) => (
              <motion.div
                key={member.name}
                variants={fadeInUp}
                className="flex flex-col items-center p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-soft"
              >
                <img
                  className="w-32 h-32 rounded-full object-cover mb-4"
                  src={member.image}
                  alt={member.name}
                />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{member.name}</h3>
                <p className="text-gray-600 dark:text-gray-300">{member.role}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* Contact Section */}
      <section className="py-16">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8"
        >
          <motion.div variants={fadeInUp} className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">Get in Touch</h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
              Have questions or suggestions? We'd love to hear from you.
            </p>
            <a
              href="mailto:contact@aitools.directory"
              className="inline-flex items-center px-6 py-3 mt-8 text-base font-medium text-white bg-primary-600 rounded-lg shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
            >
              Contact Us
            </a>
          </motion.div>
        </motion.div>
      </section>
    </div>
  )
}
