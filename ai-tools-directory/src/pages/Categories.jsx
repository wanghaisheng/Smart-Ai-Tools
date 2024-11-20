const categories = [
  {
    name: 'Text Generation',
    description:
      'Discover AI tools that help you create, edit, and enhance text content. From chatbots to content generators, find the perfect tool for your writing needs.',
    href: '/categories/text-generation',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12" />
      </svg>
    ),
    featured: [
      {
        name: 'ChatGPT',
        description: 'Advanced language model for natural conversations',
        href: '#',
      },
      {
        name: 'Copy.ai',
        description: 'AI-powered copywriting assistant',
        href: '#',
      },
      {
        name: 'Jasper',
        description: 'Content creation platform for marketing',
        href: '#',
      },
    ],
  },
  {
    name: 'Image Generation',
    description:
      'Explore AI-powered tools that can create, edit, and enhance images. From art generation to photo editing, these tools help bring your visual ideas to life.',
    href: '/categories/image-generation',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
      </svg>
    ),
    featured: [
      {
        name: 'DALL-E',
        description: 'Create images from textual descriptions',
        href: '#',
      },
      {
        name: 'Midjourney',
        description: 'Generate artistic images with AI',
        href: '#',
      },
      {
        name: 'Stable Diffusion',
        description: 'Open-source image generation model',
        href: '#',
      },
    ],
  },
  {
    name: 'Code Generation',
    description:
      'Find AI tools that help you write, review, and optimize code. These tools can help increase your productivity and code quality.',
    href: '/categories/code-generation',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
      </svg>
    ),
    featured: [
      {
        name: 'GitHub Copilot',
        description: 'AI pair programmer',
        href: '#',
      },
      {
        name: 'Tabnine',
        description: 'AI code completion assistant',
        href: '#',
      },
      {
        name: 'CodeWhisperer',
        description: 'Amazon\'s AI coding companion',
        href: '#',
      },
    ],
  },
  {
    name: 'Audio & Speech',
    description:
      'Discover AI tools for audio processing, speech recognition, and voice synthesis. Transform your audio content with these cutting-edge tools.',
    href: '/categories/audio-speech',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
      </svg>
    ),
    featured: [
      {
        name: 'Whisper',
        description: 'OpenAI\'s speech recognition system',
        href: '#',
      },
      {
        name: 'Murf',
        description: 'AI voice generator',
        href: '#',
      },
      {
        name: 'Descript',
        description: 'All-in-one audio/video editor',
        href: '#',
      },
    ],
  },
]

export default function Categories() {
  return (
    <div className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-primary-600">Categories</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Browse AI Tools by Category
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Explore our comprehensive collection of AI tools organized by category. Find the perfect solution for your specific needs.
          </p>
        </div>

        <div className="mx-auto mt-16 max-w-7xl">
          <div className="space-y-16">
            {categories.map((category) => (
              <div key={category.name} className="flex flex-col lg:flex-row lg:items-center lg:gap-x-8">
                <div className="lg:w-1/2 lg:flex-shrink-0">
                  <div className="flex items-center">
                    <div className="h-12 w-12 flex items-center justify-center rounded-lg bg-primary-600 text-white">
                      {category.icon}
                    </div>
                    <h3 className="ml-4 text-2xl font-bold text-gray-900">{category.name}</h3>
                  </div>
                  <p className="mt-4 text-lg text-gray-600">{category.description}</p>
                  <div className="mt-8">
                    <a
                      href={category.href}
                      className="inline-flex items-center rounded-md bg-primary-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
                    >
                      View all tools
                      <svg className="ml-2 -mr-0.5 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
                      </svg>
                    </a>
                  </div>
                </div>
                <div className="mt-8 lg:mt-0 lg:w-1/2">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {category.featured.map((item) => (
                      <div
                        key={item.name}
                        className="relative flex items-center space-x-3 rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm hover:border-primary-600"
                      >
                        <div className="min-w-0 flex-1">
                          <a href={item.href} className="focus:outline-none">
                            <span className="absolute inset-0" aria-hidden="true" />
                            <p className="text-sm font-medium text-gray-900">{item.name}</p>
                            <p className="truncate text-sm text-gray-500">{item.description}</p>
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
