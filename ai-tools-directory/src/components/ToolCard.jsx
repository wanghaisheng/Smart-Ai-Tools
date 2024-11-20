import { Link } from 'react-router-dom'
import { StarIcon } from '@heroicons/react/20/solid'

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function ToolCard({ tool }) {
  const {
    id,
    name,
    description,
    category,
    pricing,
    rating,
    reviews,
    image,
  } = tool

  return (
    <Link
      to={`/tools/${id}`}
      className="tool-card bg-white rounded-lg shadow overflow-hidden hover:shadow-lg transition-all duration-300"
    >
      <div className="aspect-w-16 aspect-h-9 bg-gray-200">
        <img
          src={image || 'https://via.placeholder.com/400x225'}
          alt={name}
          className="object-cover w-full h-full"
        />
      </div>
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{name}</h3>
            <p className="mt-1 text-sm text-gray-500">{category}</p>
          </div>
          <span className={classNames(
            pricing === 'free' ? 'bg-green-100 text-green-800' :
            pricing === 'freemium' ? 'bg-blue-100 text-blue-800' :
            pricing === 'paid' ? 'bg-purple-100 text-purple-800' :
            'bg-gray-100 text-gray-800',
            'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium'
          )}>
            {pricing.charAt(0).toUpperCase() + pricing.slice(1)}
          </span>
        </div>
        
        <p className="mt-4 text-sm text-gray-600 line-clamp-2">{description}</p>
        
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center">
            <div className="flex items-center">
              {[0, 1, 2, 3, 4].map((star) => (
                <StarIcon
                  key={star}
                  className={classNames(
                    rating > star ? 'text-yellow-400' : 'text-gray-200',
                    'h-4 w-4 flex-shrink-0'
                  )}
                  aria-hidden="true"
                />
              ))}
            </div>
            <p className="ml-2 text-sm text-gray-500">
              {reviews} {reviews === 1 ? 'review' : 'reviews'}
            </p>
          </div>
          <div className="text-sm font-medium text-primary-600 hover:text-primary-500">
            View details →
          </div>
        </div>
      </div>
    </Link>
  )
}
