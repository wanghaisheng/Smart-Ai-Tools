import { useState, useEffect } from 'react'
import { useTools } from '../contexts/ToolsContext'
import { Disclosure } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'

const sortOptions = [
  { id: 'rating-desc', name: 'Highest Rated' },
  { id: 'rating-asc', name: 'Lowest Rated' },
  { id: 'reviews-desc', name: 'Most Reviews' },
  { id: 'name-asc', name: 'Name (A-Z)' },
  { id: 'name-desc', name: 'Name (Z-A)' }
]

export default function ToolsFilter({ onFilterChange }) {
  const { filters, categories, pricingOptions } = useTools()
  const [localFilters, setLocalFilters] = useState(filters)

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      onFilterChange(localFilters)
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [localFilters, onFilterChange])

  const handleFilterChange = (key, value) => {
    setLocalFilters(prev => ({ ...prev, [key]: value }))
  }

  return (
    <div className="bg-white shadow rounded-lg">
      <Disclosure>
        {({ open }) => (
          <>
            <Disclosure.Button className="flex w-full justify-between rounded-lg bg-white px-4 py-3 text-left text-sm font-medium text-gray-900 hover:bg-gray-50 focus:outline-none focus-visible:ring focus-visible:ring-primary-500 focus-visible:ring-opacity-75">
              <span>Filters & Sort</span>
              <ChevronDownIcon
                className={`${
                  open ? 'rotate-180 transform' : ''
                } h-5 w-5 text-gray-500`}
              />
            </Disclosure.Button>
            <Disclosure.Panel className="px-4 pb-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {/* Search */}
                <div>
                  <label htmlFor="search" className="block text-sm font-medium text-gray-700">
                    Search
                  </label>
                  <input
                    type="text"
                    id="search"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                    placeholder="Search tools..."
                    value={localFilters.search}
                    onChange={(e) => handleFilterChange('search', e.target.value)}
                  />
                </div>

                {/* Category */}
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                    Category
                  </label>
                  <select
                    id="category"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                    value={localFilters.category}
                    onChange={(e) => handleFilterChange('category', e.target.value)}
                  >
                    <option value="all">All Categories</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Pricing */}
                <div>
                  <label htmlFor="pricing" className="block text-sm font-medium text-gray-700">
                    Pricing
                  </label>
                  <select
                    id="pricing"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                    value={localFilters.pricing}
                    onChange={(e) => handleFilterChange('pricing', e.target.value)}
                  >
                    <option value="all">All Pricing</option>
                    {pricingOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Sort */}
                <div>
                  <label htmlFor="sort" className="block text-sm font-medium text-gray-700">
                    Sort By
                  </label>
                  <select
                    id="sort"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                    value={localFilters.sort}
                    onChange={(e) => handleFilterChange('sort', e.target.value)}
                  >
                    {sortOptions.map((option) => (
                      <option key={option.id} value={option.id}>
                        {option.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>
    </div>
  )
}
