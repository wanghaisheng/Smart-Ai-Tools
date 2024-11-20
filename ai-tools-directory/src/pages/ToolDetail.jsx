import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { StarIcon } from '@heroicons/react/20/solid'
import { HeartIcon, ShareIcon } from '@heroicons/react/24/outline'

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

const features = [
  { name: 'Category', value: 'Text Generation' },
  { name: 'Pricing', value: 'Freemium' },
  { name: 'API Available', value: 'Yes' },
  { name: 'Free Trial', value: 'Yes' },
  { name: 'Support', value: '24/7 Email Support' },
  { name: 'Integration', value: 'REST API, SDK' },
]

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function ToolDetail() {
  const { id } = useParams()
  const [isBookmarked, setIsBookmarked] = useState(false)

  // In a real app, you would fetch the tool data based on the ID
  const tool = {
    name: 'ChatGPT',
    description: 'ChatGPT is an advanced language model that can engage in natural conversations, assist with writing, answer questions, and help with various text-based tasks.',
    rating: 4.8,
    reviewCount: 1200,
    imageUrl: 'https://placeholder.com/800x400',
    longDescription: `
      ChatGPT is a state-of-the-art language model developed by OpenAI. It uses advanced machine learning techniques to understand and generate human-like text responses. The model can assist with:

      • Writing and editing content
      • Answering questions and providing explanations
      • Helping with code and technical tasks
      • Brainstorming ideas and creative writing
      • Language translation and learning

      The tool is constantly learning and improving, making it a valuable asset for various personal and professional applications.
    `,
    pricingPlans: [
      {
        name: 'Free',
        price: '$0',
        features: [
          'Basic conversation capabilities',
          'General knowledge access',
          'Standard response speed',
        ],
      },
      {
        name: 'Plus',
        price: '$20/month',
        features: [
          'Priority access',
          'Faster response times',
          'Access to GPT-4',
          'Advanced features',
        ],
      },
    ],
  }

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Tool header */}
        <div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-8">
          {/* Image */}
          <div className="aspect-h-2 aspect-w-3 overflow-hidden rounded-lg">
            <img
              src={tool.imageUrl}
              alt={tool.name}
              className="h-full w-full object-cover object-center"
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
                  {tool.rating} out of 5 stars ({tool.reviewCount} reviews)
                </p>
              </div>
            </div>

            <div className="mt-6">
              <div className="flex items-center space-x-4">
                <a
                  href="#"
                  className="flex-1 rounded-md bg-primary-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
                >
                  Visit Website
                </a>
                <button
                  type="button"
                  onClick={() => setIsBookmarked(!isBookmarked)}
                  className="flex items-center justify-center rounded-md px-3 py-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
                >
                  <HeartIcon
                    className={classNames(
                      isBookmarked ? 'text-primary-600' : 'text-gray-400',
                      'h-6 w-6 flex-shrink-0'
                    )}
                    aria-hidden="true"
                  />
                  <span className="sr-only">Add to favorites</span>
                </button>
                <button
                  type="button"
                  className="flex items-center justify-center rounded-md px-3 py-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
                >
                  <ShareIcon className="h-6 w-6 flex-shrink-0" aria-hidden="true" />
                  <span className="sr-only">Share</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Tool details */}
        <div className="mt-16 lg:grid lg:grid-cols-3 lg:gap-x-8">
          {/* Features */}
          <div>
            <h2 className="text-lg font-medium text-gray-900">Features</h2>
            <dl className="mt-4 space-y-4">
              {features.map((feature) => (
                <div key={feature.name} className="border-t border-gray-200 pt-4">
                  <dt className="font-medium text-gray-900">{feature.name}</dt>
                  <dd className="mt-2 text-sm text-gray-500">{feature.value}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Description */}
          <div className="mt-10 lg:col-span-2 lg:mt-0">
            <h2 className="text-lg font-medium text-gray-900">Description</h2>
            <div className="mt-4 space-y-6">
              <p className="text-sm text-gray-600 whitespace-pre-line">{tool.longDescription}</p>
            </div>

            {/* Pricing */}
            <div className="mt-10">
              <h2 className="text-lg font-medium text-gray-900">Pricing Plans</h2>
              <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2">
                {tool.pricingPlans.map((plan) => (
                  <div
                    key={plan.name}
                    className="rounded-lg border border-gray-200 p-6 text-center"
                  >
                    <h3 className="text-lg font-medium text-gray-900">{plan.name}</h3>
                    <p className="mt-2 text-2xl font-semibold text-gray-900">{plan.price}</p>
                    <ul className="mt-4 space-y-3">
                      {plan.features.map((feature) => (
                        <li key={feature} className="text-sm text-gray-500">
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* Reviews */}
            <div className="mt-10">
              <h2 className="text-lg font-medium text-gray-900">Recent Reviews</h2>
              <div className="mt-4 space-y-6">
                {reviews.map((review) => (
                  <div key={review.id} className="border-t border-gray-200 pt-4">
                    <div className="flex items-center">
                      <div className="flex items-center">
                        {[0, 1, 2, 3, 4].map((rating) => (
                          <StarIcon
                            key={rating}
                            className={classNames(
                              review.rating > rating ? 'text-yellow-400' : 'text-gray-300',
                              'h-4 w-4 flex-shrink-0'
                            )}
                            aria-hidden="true"
                          />
                        ))}
                      </div>
                      <p className="ml-3 text-sm text-gray-500">
                        {review.author} • {review.date}
                      </p>
                    </div>
                    <p className="mt-2 text-sm text-gray-500">{review.content}</p>
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
