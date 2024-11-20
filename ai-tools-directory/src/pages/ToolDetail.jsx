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

  const tool = tools.find((t) => t.id === Number(id))

  if (isLoading) {
    return <LoadingSpinner />
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
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Back to Tools
          </button>
        </div>
      </div>
    )
  }

  const features = [
    { name: 'Category', value: tool.category },
    { name: 'Pricing', value: tool.pricing },
    { name: 'Features', value: tool.features.join(', ') },
    { name: 'Tags', value: tool.tags.join(', ') },
  ]

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-8">
          {/* Image */}
          <div className="aspect-h-2 aspect-w-3 overflow-hidden rounded-lg bg-gray-100">
            <img
              src={tool.image}
              alt={tool.name}
              className="object-cover object-center"
            />
          </div>

          {/* Tool info */}
          <div className="mt-10 px-4 sm:mt-16 sm:px-0 lg:mt-0">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">{tool.name}</h1>

            <div className="mt-3">
              <h2 className="sr-only">Tool information</h2>
              <p className="text-lg text-gray-900">{tool.description}</p>
            </div>

            {/* Reviews */}
            <div className="mt-3">
              <h3 className="sr-only">Reviews</h3>
              <div className="flex items-center">
                <div className="flex items-center">
                  {[0, 1, 2, 3, 4].map((rating) => (
                    <StarIcon
                      key={rating}
                      className={classNames(
                        tool.rating > rating ? 'text-yellow-400' : 'text-gray-300',
                        'h-5 w-5 flex-shrink-0'
                      )}
                      aria-hidden="true"
                    />
                  ))}
                </div>
                <p className="ml-3 text-sm text-gray-500">
                  {tool.reviewCount} reviews
                </p>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="sr-only">Features</h3>

              <div className="space-y-6">
                <p className="text-base text-gray-500">{tool.description}</p>

                <div className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
                  {features.map((feature) => (
                    <div key={feature.name} className="border-t border-gray-200 pt-4">
                      <dt className="font-medium text-gray-900">{feature.name}</dt>
                      <dd className="mt-2 text-sm text-gray-500">{feature.value}</dd>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-10 flex space-x-4">
              <button
                type="button"
                onClick={() => setIsBookmarked(!isBookmarked)}
                className={classNames(
                  'flex items-center justify-center rounded-md px-3 py-3 text-gray-400 hover:bg-gray-100 hover:text-gray-500',
                  isBookmarked ? 'text-primary-600' : ''
                )}
              >
                <HeartIcon
                  className={classNames(
                    'h-6 w-6 flex-shrink-0',
                    isBookmarked ? 'fill-primary-600' : ''
                  )}
                  aria-hidden="true"
                />
                <span className="sr-only">Add to favorites</span>
              </button>

              <button
                type="button"
                className="flex items-center justify-center rounded-md px-3 py-3 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
              >
                <ShareIcon className="h-6 w-6 flex-shrink-0" aria-hidden="true" />
                <span className="sr-only">Share</span>
              </button>
            </div>
          </div>
        </div>

        {/* Reviews */}
        <div className="mt-16 lg:col-span-2 lg:mt-0">
          <h2 className="text-xl font-bold text-gray-900">Recent Reviews</h2>
          <div className="mt-6 space-y-10 divide-y divide-gray-200 border-b border-t border-gray-200 pb-10">
            {reviews.map((review) => (
              <div key={review.id} className="pt-10 lg:grid lg:grid-cols-12 lg:gap-x-8">
                <div className="lg:col-span-8 lg:col-start-5 xl:col-span-9 xl:col-start-4 xl:grid xl:grid-cols-3 xl:items-start xl:gap-x-8">
                  <div className="flex items-center xl:col-span-1">
                    <div className="flex items-center">
                      {[0, 1, 2, 3, 4].map((rating) => (
                        <StarIcon
                          key={rating}
                          className={classNames(
                            review.rating > rating ? 'text-yellow-400' : 'text-gray-300',
                            'h-5 w-5 flex-shrink-0'
                          )}
                          aria-hidden="true"
                        />
                      ))}
                    </div>
                    <p className="ml-3 text-sm text-gray-500">
                      {review.rating}
                      <span className="sr-only"> out of 5 stars</span>
                    </p>
                  </div>

                  <div className="mt-4 lg:mt-6 xl:col-span-2 xl:mt-0">
                    <h3 className="text-sm font-medium text-gray-900">{review.author}</h3>
                    <div className="mt-3 space-y-6 text-sm text-gray-500">
                      <p>{review.content}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex items-center text-sm lg:col-span-4 lg:col-start-1 lg:row-start-1 lg:mt-0 lg:flex-col lg:items-start xl:col-span-3">
                  <p className="font-medium text-gray-900">{review.author}</p>
                  <time
                    dateTime={review.datetime}
                    className="ml-4 border-l border-gray-200 pl-4 text-gray-500 lg:ml-0 lg:mt-2 lg:border-0 lg:pl-0"
                  >
                    {review.date}
                  </time>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
