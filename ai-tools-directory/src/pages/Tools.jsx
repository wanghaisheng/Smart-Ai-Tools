import { useState, useMemo } from 'react'
import { useTools } from '../contexts/ToolsContext'
import ToolsFilter from '../components/ToolsFilter'
import ToolCard from '../components/ToolCard'
import LoadingSpinner from '../components/LoadingSpinner'

export default function Tools() {
  const { tools, isLoading, error } = useTools()
  const [filters, setFilters] = useState({
    search: '',
    category: 'all',
    pricing: 'all',
    sort: 'rating-desc',
  })

  const filteredTools = useMemo(() => {
    return tools
      .filter((tool) => {
        const matchesSearch =
          filters.search === '' ||
          tool.name.toLowerCase().includes(filters.search.toLowerCase()) ||
          tool.description.toLowerCase().includes(filters.search.toLowerCase())

        const matchesCategory =
          filters.category === 'all' || 
          tool.category.toLowerCase() === filters.category.toLowerCase()

        const matchesPricing =
          filters.pricing === 'all' || 
          tool.pricing.toLowerCase() === filters.pricing.toLowerCase()

        return matchesSearch && matchesCategory && matchesPricing
      })
      .sort((a, b) => {
        switch (filters.sort) {
          case 'rating-desc':
            return b.rating - a.rating
          case 'rating-asc':
            return a.rating - b.rating
          case 'reviews-desc':
            return b.reviewCount - a.reviewCount
          case 'name-asc':
            return a.name.localeCompare(b.name)
          case 'name-desc':
            return b.name.localeCompare(a.name)
          default:
            return 0
        }
      })
  }, [tools, filters])

  if (isLoading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <LoadingSpinner size="large" />
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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
          AI Tools Directory
        </h1>
        <p className="mt-6 text-lg leading-8 text-gray-600">
          Discover and compare the best AI tools to enhance your workflow and boost productivity.
        </p>
      </div>

      <ToolsFilter onFilterChange={setFilters} />

      <div className="mb-6 text-sm text-gray-500">
        {filteredTools.length} tools found
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredTools.map((tool) => (
          <ToolCard key={tool.id} tool={tool} />
        ))}
      </div>

      {filteredTools.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-lg font-semibold text-gray-900">No tools found</h3>
          <p className="mt-2 text-gray-500">
            Try adjusting your filters or search term to find what you're looking for.
          </p>
        </div>
      )}
    </div>
  )
}
