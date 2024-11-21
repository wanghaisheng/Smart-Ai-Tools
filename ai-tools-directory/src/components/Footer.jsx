import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaGithub, FaTwitter, FaLinkedin } from 'react-icons/fa';

const Footer = () => {
  const footerLinks = [
    { title: 'Product', links: [
      { name: 'Features', href: '/features' },
      { name: 'Tools', href: '/tools' },
      { name: 'Categories', href: '/categories' },
      { name: 'Submit Tool', href: '/submit-tool' },
    ]},
    { title: 'Company', links: [
      { name: 'About', href: '/about' },
      { name: 'Blog', href: '/blog' },
      { name: 'Careers', href: '/careers' },
      { name: 'Contact', href: '/contact' },
    ]},
    { title: 'Resources', links: [
      { name: 'Documentation', href: '/docs' },
      { name: 'Help Center', href: '/help' },
      { name: 'Privacy', href: '/privacy' },
      { name: 'Terms', href: '/terms' },
    ]},
  ];

  const socialLinks = [
    { icon: FaGithub, href: 'https://github.com' },
    { icon: FaTwitter, href: 'https://twitter.com' },
    { icon: FaLinkedin, href: 'https://linkedin.com' },
  ];

  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-8 xl:col-span-1"
          >
            <Link to="/" className="flex items-center">
              <span className="font-display text-2xl text-primary-600 dark:text-primary-400">
                Smart AI Tools
              </span>
            </Link>
            <p className="text-gray-500 dark:text-gray-400 text-base">
              Discover and explore the best AI tools to enhance your workflow and boost productivity.
            </p>
            <div className="flex space-x-6">
              {socialLinks.map((item, index) => {
                const Icon = item.icon;
                return (
                  <motion.a
                    key={index}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-primary-500 dark:hover:text-primary-400 transition-colors"
                  >
                    <Icon className="h-6 w-6" />
                  </motion.a>
                );
              })}
            </div>
          </motion.div>
          
          <div className="mt-12 grid grid-cols-2 gap-8 xl:mt-0 xl:col-span-2">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              {footerLinks.slice(0, 2).map((section, index) => (
                <motion.div
                  key={section.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className={index === 0 ? '' : 'mt-12 md:mt-0'}
                >
                  <h3 className="text-sm font-semibold text-gray-400 dark:text-gray-300 tracking-wider uppercase">
                    {section.title}
                  </h3>
                  <ul className="mt-4 space-y-4">
                    {section.links.map((item, linkIndex) => (
                      <li key={item.name}>
                        <Link
                          to={item.href}
                          className="text-base text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                        >
                          {item.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
            <div className="md:grid md:grid-cols-1 md:gap-8">
              {footerLinks.slice(2).map((section, index) => (
                <motion.div
                  key={section.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: (index + 2) * 0.1 }}
                  className="mt-12 md:mt-0"
                >
                  <h3 className="text-sm font-semibold text-gray-400 dark:text-gray-300 tracking-wider uppercase">
                    {section.title}
                  </h3>
                  <ul className="mt-4 space-y-4">
                    {section.links.map((item, linkIndex) => (
                      <li key={item.name}>
                        <Link
                          to={item.href}
                          className="text-base text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                        >
                          {item.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800">
          <p className="text-base text-gray-400 dark:text-gray-500 text-center">
            &copy; {new Date().getFullYear()} Smart AI Tools. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
