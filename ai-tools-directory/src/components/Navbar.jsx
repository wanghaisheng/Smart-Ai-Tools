import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from '../contexts/ThemeContext'
import { FiMenu, FiX, FiMoon, FiSun, FiUser } from 'react-icons/fi'
import { Transition } from '@headlessui/react'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const { isDarkMode, toggleDarkMode } = useTheme()
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Tools', href: '/tools' },
    { name: 'Categories', href: '/categories' },
    { name: 'About', href: '/about' },
  ]

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg shadow-sm'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex-shrink-0">
            <Link
              to="/"
              className="flex items-center space-x-2"
            >
              <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-secondary-600 dark:from-primary-400 dark:to-secondary-400">
                AI Tools
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`text-sm font-medium transition-colors duration-300 ${
                  location.pathname === item.href
                    ? 'text-primary-600 dark:text-primary-400'
                    : 'text-gray-700 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Desktop Right Section */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            <button
              onClick={toggleDarkMode}
              className="p-2 text-gray-700 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400 rounded-lg transition-colors duration-300"
              aria-label="Toggle dark mode"
            >
              {isDarkMode ? <FiSun className="w-5 h-5" /> : <FiMoon className="w-5 h-5" />}
            </button>
            <Link
              to="/login"
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
            >
              <FiUser className="w-4 h-4 mr-2" />
              Sign In
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center space-x-4 md:hidden">
            <button
              onClick={toggleDarkMode}
              className="p-2 text-gray-700 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400 rounded-lg transition-colors duration-300"
              aria-label="Toggle dark mode"
            >
              {isDarkMode ? <FiSun className="w-5 h-5" /> : <FiMoon className="w-5 h-5" />}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-gray-700 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400 rounded-lg transition-colors duration-300"
              aria-label="Toggle menu"
            >
              {isOpen ? <FiX className="w-5 h-5" /> : <FiMenu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <Transition
        show={isOpen}
        enter="transition duration-200 ease-out"
        enterFrom="opacity-0 scale-95"
        enterTo="opacity-100 scale-100"
        leave="transition duration-100 ease-in"
        leaveFrom="opacity-100 scale-100"
        leaveTo="opacity-0 scale-95"
      >
        <div className="absolute inset-x-0 top-full bg-white dark:bg-gray-900 shadow-lg md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setIsOpen(false)}
                className={`block px-3 py-2 rounded-lg text-base font-medium transition-colors duration-300 ${
                  location.pathname === item.href
                    ? 'text-primary-600 bg-primary-50 dark:text-primary-400 dark:bg-primary-900/50'
                    : 'text-gray-700 hover:text-primary-600 hover:bg-primary-50 dark:text-gray-300 dark:hover:text-primary-400 dark:hover:bg-primary-900/50'
                }`}
              >
                {item.name}
              </Link>
            ))}
            <Link
              to="/login"
              onClick={() => setIsOpen(false)}
              className="block px-3 py-2 text-base font-medium text-white bg-primary-600 rounded-lg shadow-sm hover:bg-primary-700"
            >
              Sign In
            </Link>
          </div>
        </div>
      </Transition>
    </nav>
  )
}
