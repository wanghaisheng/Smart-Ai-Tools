import { useState } from 'react'

const tools = [
  {
    id: 1,
    name: 'ChatGPT',
    description: 'Advanced language model for natural conversations and content generation',
    category: 'Text Generation',
    pricing: 'Freemium',
    rating: 4.8,
    imageUrl: 'https://placeholder.com/400x300',
    url: 'https://chat.openai.com',
  },
  {
    id: 2,
    name: 'DALL-E',
    description: 'AI system that creates realistic images and art from natural language descriptions',
    category: 'Image Generation',
    pricing: 'Pay per use',
    rating: 4.7,
    imageUrl: 'https://placeholder.com/400x300',
    url: 'https://labs.openai.com',
  },
  // Add more tools here
]

const filters = {
  categories: [
    { value: 'text-generation', label: 'Text Generation' },
    { value: 'image-generation', label: 'Image Generation' },
    { value: 'code-generation', label: 'Code Generation' },
    { value: 'audio-speech', label: 'Audio & Speech' },
  ],
  pricing: [
    { value: 'free', label: 'Free' },
    { value: 'freemium', label: 'Freemium' },
    { value: 'paid', label: 'Paid' },
  ],
}

export default function Tools() {
  const [selectedCategories, setSelectedCategories] = useState([])
  const [selectedPricing, setSelectedPricing] = useState([])
  const [searchQuery, setSearchQuery] = useState('')

  const filteredTools = tools.filter((tool) => {
    const matchesSearch = tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesCategory = selectedCategories.length === 0 ||
      selectedCategories.includes(tool.category.toLowerCase().replace(' ', '-'))
    
    const matchesPricing = selectedPricing.length === 0 ||
      selectedPricing.includes(tool.pricing.toLowerCase())
    
    return matchesSearch && matchesCategory && matchesPricing
  })

  return (
    <div className="bg-white">
      <div>
        {/* Search and filters */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-x-8 gap-y-10 lg:flex-row">
            {/* Filters */}
            <div className="w-full max-w-xs">
              <h2 className="text-lg font-medium text-gray-900">Filters</h2>
              
              {/* Categories */}
              <div className="mt-4 border-t border-gray-200 pt-4">
                <h3 className="text-sm font-medium text-gray-900">Categories</h3>
                <div className="space-y-4 pt-4">
                  {filters.categories.map((category) => (
                    <div key={category.value} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(category.value)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedCategories([...selectedCategories, category.value])
                          } else {
                            setSelectedCategories(selectedCategories.filter((c) => c !== category.value))
                          }
                        }}
                        className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                      <label className="ml-3 text-sm text-gray-600">{category.label}</label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pricing */}
              <div className="mt-4 border-t border-gray-200 pt-4">
                <h3 className="text-sm font-medium text-gray-900">Pricing</h3>
                <div className="space-y-4 pt-4">
                  {filters.pricing.map((price) => (
                    <div key={price.value} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedPricing.includes(price.value)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedPricing([...selectedPricing, price.value])
                          } else {
                            setSelectedPricing(selectedPricing.filter((p) => p !== price.value))
                          }
                        }}
                        className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                      <label className="ml-3 text-sm text-gray-600">{price.label}</label>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Tool grid */}
            <div className="w-full">
              {/* Search */}
              <div className="mb-8">
                <input
                  type="text"
                  placeholder="Search tools..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                />
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredTools.map((tool) => (
                  <div
                    key={tool.id}
                    className="group relative flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white"
                  >
                    <div className="aspect-h-3 aspect-w-4 bg-gray-200 sm:aspect-none sm:h-48">
                      <img
                        src={tool.imageUrl}
                        alt={tool.name}
                        className="h-full w-full object-cover object-center sm:h-full sm:w-full"
                      />
                    </div>
                    <div className="flex flex-1 flex-col space-y-2 p-4">
                      <h3 className="text-sm font-medium text-gray-900">
                        <a href={tool.url} target="_blank" rel="noopener noreferrer">
                          <span aria-hidden="true" className="absolute inset-0" />
                          {tool.name}
                        </a>
                      </h3>
                      <p className="text-sm text-gray-500">{tool.description}</p>
                      <div className="flex flex-1 flex-col justify-end">
                        <p className="text-sm italic text-gray-500">{tool.category}</p>
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-gray-900">{tool.pricing}</p>
                          <div className="flex items-center">
                            <svg
                              className="h-5 w-5 text-yellow-400"
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401z"
                                clipRule="evenodd"
                              />
                            </svg>
                            <p className="ml-1 text-sm text-gray-500">{tool.rating}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
