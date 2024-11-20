import { Link } from 'react-router-dom'
import { StarIcon } from '@heroicons/react/20/solid'

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function ToolCard({ tool }) {
  return (
    <Link to={`/tools/${tool.id}`} className="tool-card">
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {/* Image */}
        <div className="aspect-w-16 aspect-h-9">
          <img
            src={tool.image}
            alt={tool.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{tool.name}</h3>
              <p className="mt-1 text-sm text-gray-500 line-clamp-2">
                {tool.description}
              </p>
            </div>
          </div>

          {/* Rating */}
          <div className="mt-4 flex items-center">
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
            <p className="ml-2 text-sm text-gray-500">
              {tool.reviewCount} reviews
            </p>
          </div>

          {/* Features */}
          <div className="mt-4">
            <div className="flex flex-wrap gap-2">
              {tool.features.slice(0, 3).map((feature) => (
                <span
                  key={feature}
                  className="inline-flex items-center rounded-full bg-primary-50 px-2.5 py-0.5 text-xs font-medium text-primary-700"
                >
                  {feature}
                </span>
              ))}
              {tool.features.length > 3 && (
                <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600">
                  +{tool.features.length - 3} more
                </span>
              )}
            </div>
          </div>

          {/* Tags and Pricing */}
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {tool.tags.slice(0, 2).map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600"
                >
                  {tag}
                </span>
              ))}
            </div>
            <span
              className={classNames(
                'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
                tool.pricing === 'free'
                  ? 'bg-green-100 text-green-800'
                  : tool.pricing === 'freemium'
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-gray-100 text-gray-800'
              )}
            >
              {tool.pricing.charAt(0).toUpperCase() + tool.pricing.slice(1)}
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}
