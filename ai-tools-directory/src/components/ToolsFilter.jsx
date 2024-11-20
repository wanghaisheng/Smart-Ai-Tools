import { useState } from 'react'
import { MagnifyingGlassIcon } from '@heroicons/react/20/solid'

const categories = [
  { id: 'all', name: 'All Categories' },
  { id: 'text-generation', name: 'Text Generation' },
  { id: 'image-generation', name: 'Image Generation' },
  { id: 'code-generation', name: 'Code Generation' },
  { id: 'audio-speech', name: 'Audio & Speech' },
]

const pricing = [
  { id: 'all', name: 'All Pricing' },
  { id: 'free', name: 'Free' },
  { id: 'freemium', name: 'Freemium' },
  { id: 'paid', name: 'Paid' },
  { id: 'enterprise', name: 'Enterprise' },
]

const sortOptions = [
  { id: 'rating-desc', name: 'Highest Rated' },
  { id: 'rating-asc', name: 'Lowest Rated' },
  { id: 'reviews-desc', name: 'Most Reviews' },
  { id: 'name-asc', name: 'Name (A-Z)' },
  { id: 'name-desc', name: 'Name (Z-A)' },
]

export default function ToolsFilter({ onFilterChange }) {
  const [filters, setFilters] = useState({
    search: '',
    category: 'all',
    pricing: 'all',
    sort: 'rating-desc',
  })

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    onFilterChange(newFilters)
  }

  return (
    <div className="bg-white shadow rounded-lg p-6 mb-8 slide-in">
      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search AI tools..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            className="form-input pl-10"
          />
          <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* Categories */}
        <div>
          <label htmlFor="category" className="form-label">
            Category
          </label>
          <select
            id="category"
            value={filters.category}
            onChange={(e) => handleFilterChange('category', e.target.value)}
            className="form-input mt-2"
          >
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        {/* Pricing */}
        <div>
          <label htmlFor="pricing" className="form-label">
            Pricing
          </label>
          <select
            id="pricing"
            value={filters.pricing}
            onChange={(e) => handleFilterChange('pricing', e.target.value)}
            className="form-input mt-2"
          >
            {pricing.map((price) => (
              <option key={price.id} value={price.id}>
                {price.name}
              </option>
            ))}
          </select>
        </div>

        {/* Sort */}
        <div>
          <label htmlFor="sort" className="form-label">
            Sort By
          </label>
          <select
            id="sort"
            value={filters.sort}
            onChange={(e) => handleFilterChange('sort', e.target.value)}
            className="form-input mt-2"
          >
            {sortOptions.map((option) => (
              <option key={option.id} value={option.id}>
                {option.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Active Filters */}
      <div className="mt-4 flex flex-wrap gap-2">
        {filters.category !== 'all' && (
          <span className="inline-flex items-center rounded-full bg-primary-50 px-3 py-1 text-sm font-medium text-primary-700">
            {categories.find((c) => c.id === filters.category)?.name}
            <button
              type="button"
              onClick={() => handleFilterChange('category', 'all')}
              className="ml-1 inline-flex rounded-full p-0.5 hover:bg-primary-100"
            >
              <span className="sr-only">Remove filter</span>
              <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
              </svg>
            </button>
          </span>
        )}
        {filters.pricing !== 'all' && (
          <span className="inline-flex items-center rounded-full bg-primary-50 px-3 py-1 text-sm font-medium text-primary-700">
            {pricing.find((p) => p.id === filters.pricing)?.name}
            <button
              type="button"
              onClick={() => handleFilterChange('pricing', 'all')}
              className="ml-1 inline-flex rounded-full p-0.5 hover:bg-primary-100"
            >
              <span className="sr-only">Remove filter</span>
              <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
              </svg>
            </button>
          </span>
        )}
      </div>
    </div>
  )
}
