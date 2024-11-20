export default function About() {
  return (
    <div className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            About AI Tools Directory
          </h1>
          <p className="mt-6 text-xl leading-8 text-gray-700">
            Welcome to AI Tools Directory, your comprehensive resource for discovering and comparing the latest artificial intelligence tools and technologies.
          </p>
          
          <div className="mt-10 space-y-8 text-gray-600">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-gray-900">Our Mission</h2>
              <p className="mt-4">
                Our mission is to help individuals and businesses navigate the rapidly evolving landscape of AI tools. 
                We strive to provide accurate, up-to-date information about various AI solutions, making it easier for you 
                to find the perfect tools for your specific needs.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold tracking-tight text-gray-900">What We Offer</h2>
              <ul className="mt-4 list-disc pl-6 space-y-3">
                <li>Comprehensive database of AI tools across various categories</li>
                <li>Detailed reviews and comparisons</li>
                <li>Regular updates on new tools and features</li>
                <li>User ratings and feedback</li>
                <li>Educational resources about AI technology</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold tracking-tight text-gray-900">Join Our Community</h2>
              <p className="mt-4">
                We believe in the power of community. Share your experiences, submit new tools, and help others 
                find the right AI solutions for their needs. Together, we can build a valuable resource for everyone 
                interested in AI technology.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold tracking-tight text-gray-900">Contact Us</h2>
              <p className="mt-4">
                Have questions, suggestions, or want to contribute? We'd love to hear from you! 
                Reach out to us at <a href="mailto:contact@aitoolsdirectory.com" className="text-primary-600 hover:text-primary-500">
                contact@aitoolsdirectory.com</a>
              </p>
            </div>
          </div>

          <div className="mt-16">
            <a
              href="/tools"
              className="inline-flex items-center rounded-md bg-primary-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
            >
              Start Exploring
              <svg className="ml-2 -mr-0.5 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
