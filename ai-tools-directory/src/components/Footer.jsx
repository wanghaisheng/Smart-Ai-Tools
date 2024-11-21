import { Link } from 'react-router-dom'
import { FiGithub, FiTwitter, FiLinkedin, FiMail } from 'react-icons/fi'

const navigation = {
  main: [
    { name: 'Home', href: '/' },
    { name: 'Tools', href: '/tools' },
    { name: 'Categories', href: '/categories' },
    { name: 'About', href: '/about' },
  ],
  categories: [
    { name: 'Text Generation', href: '/categories/text-generation' },
    { name: 'Image Creation', href: '/categories/image-creation' },
    { name: 'Code Assistant', href: '/categories/code-assistant' },
    { name: 'Audio & Speech', href: '/categories/audio-speech' },
  ],
  company: [
    { name: 'About Us', href: '/about' },
    { name: 'Blog', href: '/blog' },
    { name: 'Contact', href: '/contact' },
    { name: 'Privacy Policy', href: '/privacy' },
  ],
  social: [
    {
      name: 'GitHub',
      href: 'https://github.com',
      icon: FiGithub,
    },
    {
      name: 'Twitter',
      href: 'https://twitter.com',
      icon: FiTwitter,
    },
    {
      name: 'LinkedIn',
      href: 'https://linkedin.com',
      icon: FiLinkedin,
    },
    {
      name: 'Email',
      href: 'mailto:contact@aitools.com',
      icon: FiMail,
    },
  ],
}

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-gray-900" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">
        Footer
      </h2>
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          <div className="space-y-8 xl:col-span-1">
            <Link
              to="/"
              className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-secondary-600 dark:from-primary-400 dark:to-secondary-400"
            >
              AI Tools
            </Link>
            <p className="text-base text-gray-600 dark:text-gray-400">
              Discover and explore the best AI tools to enhance your productivity and creativity.
            </p>
            <div className="flex space-x-6">
              {navigation.social.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="sr-only">{item.name}</span>
                  <item.icon className="h-6 w-6" aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>
          <div className="mt-12 grid grid-cols-2 gap-8 xl:mt-0 xl:col-span-2">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-300 tracking-wider uppercase">
                  Navigation
                </h3>
                <ul className="mt-4 space-y-4">
                  {navigation.main.map((item) => (
                    <li key={item.name}>
                      <Link
                        to={item.href}
                        className="text-base text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300"
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-12 md:mt-0">
                <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-300 tracking-wider uppercase">
                  Categories
                </h3>
                <ul className="mt-4 space-y-4">
                  {navigation.categories.map((item) => (
                    <li key={item.name}>
                      <Link
                        to={item.href}
                        className="text-base text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300"
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="md:grid md:grid-cols-1 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-300 tracking-wider uppercase">
                  Company
                </h3>
                <ul className="mt-4 space-y-4">
                  {navigation.company.map((item) => (
                    <li key={item.name}>
                      <Link
                        to={item.href}
                        className="text-base text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300"
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-12 border-t border-gray-200 dark:border-gray-800 pt-8">
          <p className="text-base text-gray-500 dark:text-gray-400 text-center">
            &copy; {new Date().getFullYear()} AI Tools. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
