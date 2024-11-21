import { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react'
import api from '../utils/api'

const ToolsContext = createContext()

export const ToolsProvider = ({ children }) => {
  const [tools, setTools] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentTool, setCurrentTool] = useState(null)
  const [categories, setCategories] = useState([])
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

  // Extract unique categories from tools
  const extractCategories = useCallback((tools) => {
    const uniqueCategories = new Set();
    tools.forEach(tool => {
      if (tool.categories && Array.isArray(tool.categories)) {
        tool.categories.forEach(category => uniqueCategories.add(category));
      }
    });
    return Array.from(uniqueCategories).sort();
  }, []);

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
          limit: 28
        }
      })

      const { tools: fetchedTools, total, pages } = response.data
      setTools(fetchedTools)
      
      // Update categories whenever tools are loaded
      const extractedCategories = extractCategories(fetchedTools);
      setCategories(extractedCategories);
      
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
  }, [filters.category, filters.search, filters.sort, pagination.currentPage, extractCategories])

  const loadToolDetails = useCallback(async (id) => {
    if (!id) {
      console.error('No tool ID provided');
      return;
    }

    try {
      setLoading(true);
      const response = await api.get(`/tools/${id}`);
      setCurrentTool(response.data);
    } catch (err) {
      console.error('Error loading tool details:', err);
      setError(err.message);
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
    categories,
    currentTool,
    loadToolDetails,
    setFilters: (newFilters) => {
      setFilters(newFilters)
      setPagination(prev => ({ ...prev, currentPage: 1 }))
    },
    setCurrentPage: (page) => setPagination(prev => ({ ...prev, currentPage: page }))
  }), [tools, loading, error, filters, pagination, categories, currentTool, loadToolDetails])

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
