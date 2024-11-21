import { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react'
import api from '../utils/api'

const ToolsContext = createContext()

export const ToolsProvider = ({ children }) => {
  const [tools, setTools] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentTool, setCurrentTool] = useState(null)
  const [filters, setFilters] = useState({
    search: '',
    category: 'all',
    pricing: 'all',
    sort: 'rating-desc'
  })
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalTools: 0
  })

  const loadTools = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await api.get('/tools', {
        params: {
          category: filters.category !== 'all' ? filters.category : '',
          search: filters.search || '',
          sort: filters.sort,
          page: pagination.currentPage,
          limit: 28 // 4 tools per row × 7 rows
        }
      })

      const { tools: fetchedTools, total, pages } = response.data
      setTools(fetchedTools)
      setPagination(prev => ({
        ...prev,
        totalPages: pages,
        totalTools: total
      }))
    } catch (err) {
      console.error('Error loading tools:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [filters.category, filters.search, filters.sort, pagination.currentPage])

  const loadToolDetails = useCallback(async (toolId) => {
    if (!toolId) {
      setError('Tool ID is required');
      return null;
    }

    try {
      setLoading(true);
      setError(null);
      
      const response = await api.get(`/tools/${toolId}`);
      setCurrentTool(response.data);
      return response.data;
    } catch (err) {
      console.error('Error loading tool details:', err);
      setError(err.response?.data?.message || err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, [])

  useEffect(() => {
    loadTools()
  }, [loadTools])

  const contextValue = useMemo(() => ({
    tools,
    loading,
    error,
    filters,
    pagination,
    currentTool,
    loadToolDetails,
    setFilters: (newFilters) => {
      setFilters(newFilters)
      setPagination(prev => ({ ...prev, currentPage: 1 })) // Reset to first page on filter change
    },
    setCurrentPage: (page) => setPagination(prev => ({ ...prev, currentPage: page }))
  }), [tools, loading, error, filters, pagination, currentTool, loadToolDetails])

  return (
    <ToolsContext.Provider value={contextValue}>
      {children}
    </ToolsContext.Provider>
  )
}

export const useTools = () => {
  const context = useContext(ToolsContext)
  if (!context) {
    throw new Error('useTools must be used within a ToolsProvider')
  }
  return context
}

export default ToolsContext
