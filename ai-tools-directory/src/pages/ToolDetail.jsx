import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { StarIcon } from '@heroicons/react/20/solid'
import { HeartIcon, ShareIcon } from '@heroicons/react/24/outline'
import { useTools } from '../contexts/ToolsContext'
import LoadingSpinner from '../components/LoadingSpinner'

const reviews = [
  {
    id: 1,
    rating: 5,
    content: "This tool has completely transformed my workflow. The AI capabilities are impressive and the interface is intuitive.",
    author: "Sarah Chen",
    date: "2 months ago",
  },
  {
    id: 2,
    rating: 4,
    content: "Great tool with lots of features. Could use some improvements in processing speed but overall very satisfied.",
    author: "Michael Roberts",
    date: "1 month ago",
  },
]

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function ToolDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [isBookmarked, setIsBookmarked] = useState(false)
  const { tools, isLoading, error } = useTools()

  // Find tool by string ID
  const tool = tools.find((t) => t.id === id)

  if (isLoading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Error</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    )
  }

  if (!tool) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Tool Not Found</h2>
          <p className="text-gray-600 mb-8">The tool you're looking for doesn't exist or has been removed.</p>
          <button
            onClick={() => navigate('/tools')}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Back to Tools
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        {/* Tool header */}
        <div className="lg:grid lg:grid-cols-2 lg:gap-x-8 lg:items-start">
          {/* Image gallery */}
          <div className="flex flex-col-reverse">
            <div className="aspect-w-16 aspect-h-9 rounded-lg bg-gray-100 overflow-hidden">
              <img
                src={tool.image}
                alt={tool.name}
                className="object-cover object-center w-full h-full"
              />
            </div>
          </div>

          {/* Tool info */}
          <div className="mt-10 px-4 sm:px-0 sm:mt-16 lg:mt-0">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold tracking-tight text-gray-900">{tool.name}</h1>
              <div className="flex items-center space-x-6">
                <button
                  onClick={() => setIsBookmarked(!isBookmarked)}
                  className={classNames(
                    isBookmarked ? 'text-blue-600' : 'text-gray-400',
                    'p-2 hover:text-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 rounded-full'
                  )}
                >
                  <HeartIcon className="h-6 w-6" />
                </button>
                <button
                  className="p-2 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 rounded-full"
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href)
                  }}
                >
                  <ShareIcon className="h-6 w-6" />
                </button>
              </div>
            </div>

            {/* Rating */}
            <div className="mt-4">
              <div className="flex items-center">
                <div className="flex items-center">
                  {[0, 1, 2, 3, 4].map((rating) => (
                    <StarIcon
                      key={rating}
                      className={classNames(
                        tool.rating > rating ? 'text-yellow-400' : 'text-gray-300',
                        'h-5 w-5 flex-shrink-0'
                      )}
                    />
                  ))}
                </div>
                <p className="ml-3 text-sm text-gray-700">
                  {tool.rating} ({tool.reviewCount} reviews)
                </p>
              </div>
            </div>

            {/* Categories */}
            <div className="mt-6">
              <div className="flex flex-wrap gap-2">
                {tool.categories.map((category) => (
                  <span
                    key={category}
                    className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                  >
                    {category}
                  </span>
                ))}
              </div>
            </div>

            {/* Pricing */}
            <div className="mt-6">
              <h3 className="text-sm font-medium text-gray-900">Pricing</h3>
              <p className="mt-2 text-sm text-gray-500">{tool.pricing}</p>
            </div>

            {/* Description */}
            <div className="mt-6">
              <h3 className="text-sm font-medium text-gray-900">Description</h3>
              <div className="mt-2 text-sm text-gray-500 space-y-4">
                <p>{tool.description}</p>
              </div>
            </div>

            {/* Visit button */}
            <div className="mt-8">
              <a
                href={tool.url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Visit Website
              </a>
            </div>
          </div>
        </div>

        {/* Reviews */}
        <div className="mt-16 lg:mt-24">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">Recent Reviews</h2>
          <div className="mt-6 space-y-10">
            {reviews.map((review) => (
              <div key={review.id} className="flex flex-col sm:flex-row">
                <div className="order-2 sm:order-1 sm:ml-16">
                  <h3 className="font-medium text-gray-900">{review.author}</h3>
                  <p className="mt-1 text-sm text-gray-500">{review.date}</p>
                  <div className="mt-3 space-y-6 text-sm text-gray-500">
                    {review.content}
                  </div>
                </div>
                <div className="order-1 sm:order-2 sm:ml-4">
                  <div className="flex items-center">
                    {[0, 1, 2, 3, 4].map((rating) => (
                      <StarIcon
                        key={rating}
                        className={classNames(
                          review.rating > rating ? 'text-yellow-400' : 'text-gray-300',
                          'h-5 w-5 flex-shrink-0'
                        )}
                      />
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
