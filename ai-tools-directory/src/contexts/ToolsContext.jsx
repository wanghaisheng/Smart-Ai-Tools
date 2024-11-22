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

  // Load categories from MongoDB
  const loadCategories = useCallback(async () => {
    try {
      const response = await api.get('/categories/all')
      setCategories(response.data.map(categoryData => ({
        name: categoryData.category,
        value: categoryData.category,
        count: categoryData.count
      })))
    } catch (err) {
      console.error('Error loading categories:', err)
      setError(err.message)
    }
  }, [])

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
      setPagination(prev => ({
        ...prev,
        totalPages: pages,
        totalTools: total
      }))
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [filters, pagination.currentPage])

  // Load tools and categories on mount
  useEffect(() => {
    loadCategories()
  }, [loadCategories])

  useEffect(() => {
    loadTools()
  }, [loadTools])

  const getTool = useCallback(async (id) => {
    try {
      setLoading(true)
      setError(null)
      const response = await api.get(`/tools/${id}`)
      setCurrentTool(response.data)
      return response.data
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const submitTool = useCallback(async (toolData) => {
    try {
      setLoading(true);
      setError(null);
      
      const formData = new FormData();
      Object.keys(toolData).forEach(key => {
        if (key === 'screenshots') {
          toolData[key].forEach(file => {
            formData.append('screenshots', file);
          });
        } else if (key === 'logo') {
          formData.append('logo', toolData[key]);
        } else {
          formData.append(key, toolData[key]);
        }
      });

      const response = await api.post('/tools', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Refresh the tools list
      loadTools();
      return response.data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [loadTools]);

  const value = useMemo(() => ({
    tools,
    loading,
    error,
    categories,
    currentTool,
    filters,
    pagination,
    setFilters,
    setPagination,
    getTool,
    loadTools,
    loadCategories,
    submitTool
  }), [tools, loading, error, categories, currentTool, filters, pagination, getTool, loadTools, loadCategories, submitTool])

  return (
    <ToolsContext.Provider value={value}>
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
