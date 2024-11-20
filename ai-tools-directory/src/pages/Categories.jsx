import { useTools } from '../contexts/ToolsContext'
import { Link } from 'react-router-dom'
import { ArrowTopRightOnSquareIcon } from '@heroicons/react/20/solid'

export default function Categories() {
  const { categories, categoryStats, loading } = useTools()

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
          <p className="mt-4 text-sm text-gray-500">Loading categories...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="fade-in">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-2xl font-semibold text-gray-900">Categories</h1>
            <p className="mt-2 text-sm text-gray-700">
              Browse {categories.length} categories of AI tools
            </p>
          </div>
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <div
              key={category}
              className="relative flex items-center space-x-3 rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm hover:border-primary-400 hover:ring-1 hover:ring-primary-500"
            >
              <div className="min-w-0 flex-1">
                <Link
                  to={`/tools?category=${encodeURIComponent(category)}`}
                  className="focus:outline-none"
                >
                  <span className="absolute inset-0" aria-hidden="true" />
                  <p className="text-sm font-medium text-gray-900">{category}</p>
                  <p className="truncate text-sm text-gray-500">
                    {categoryStats[category]} tools
                  </p>
                </Link>
              </div>
              <ArrowTopRightOnSquareIcon
                className="h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
