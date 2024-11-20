import { createContext, useContext, useState, useCallback, useMemo } from 'react'
import toolsData from '../data/tools.json'

const ToolsContext = createContext()

export function ToolsProvider({ children }) {
  const [tools, setTools] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filters, setFilters] = useState({
    search: '',
    category: 'all',
    pricing: 'all',
    sort: 'rating-desc'
  })

  const loadTools = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800))
      setTools(toolsData)
    } catch (err) {
      setError('Failed to load tools. Please try again.')
      console.error('Error loading tools:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  const getFilteredTools = useCallback(() => {
    return tools
      .filter((tool) => {
        const matchesSearch =
          filters.search === '' ||
          tool.name.toLowerCase().includes(filters.search.toLowerCase()) ||
          tool.description.toLowerCase().includes(filters.search.toLowerCase())

        const matchesCategory =
          filters.category === 'all' ||
          (tool.categories && tool.categories.some(cat => 
            cat.toLowerCase() === filters.category.toLowerCase()
          ))

        const matchesPricing =
          filters.pricing === 'all' ||
          (tool.pricing && tool.pricing.toLowerCase() === filters.pricing.toLowerCase())

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

  // Get unique categories from tools
  const categories = useMemo(() => {
    const uniqueCategories = new Set()
    tools.forEach(tool => {
      if (tool.categories) {
        tool.categories.forEach(category => uniqueCategories.add(category))
      }
    })
    return Array.from(uniqueCategories).sort()
  }, [tools])

  // Get unique pricing options from tools
  const pricingOptions = useMemo(() => {
    const uniquePricing = new Set()
    tools.forEach(tool => {
      if (tool.pricing) {
        uniquePricing.add(tool.pricing)
      }
    })
    return Array.from(uniquePricing).sort()
  }, [tools])

  const value = {
    tools,
    loading,
    error,
    filters,
    setFilters,
    loadTools,
    getFilteredTools,
    categories,
    pricingOptions
  }

  return (
    <ToolsContext.Provider value={value}>
      {children}
    </ToolsContext.Provider>
  )
}

export function useTools() {
  const context = useContext(ToolsContext)
  if (!context) {
    throw new Error('useTools must be used within a ToolsProvider')
  }
  return context
}
