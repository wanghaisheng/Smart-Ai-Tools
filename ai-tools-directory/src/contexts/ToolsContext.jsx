import { createContext, useContext, useReducer, useEffect } from 'react'

const ToolsContext = createContext()

// Sample initial data
const initialTools = [
  {
    id: 1,
    name: 'ChatGPT',
    description: 'Advanced language model for natural conversations and content generation',
    category: 'text-generation',
    pricing: 'freemium',
    rating: 4.8,
    reviewCount: 1250,
    image: 'https://example.com/chatgpt.png',
    features: ['Natural language processing', 'Content generation', 'Code assistance'],
    tags: ['AI', 'Language Model', 'Chatbot'],
  },
  {
    id: 2,
    name: 'DALL-E',
    description: 'AI system that creates realistic images and art from natural language descriptions',
    category: 'image-generation',
    pricing: 'paid',
    rating: 4.7,
    reviewCount: 890,
    image: 'https://example.com/dalle.png',
    features: ['Image generation', 'Art creation', 'Design assistance'],
    tags: ['AI', 'Image Generation', 'Art'],
  },
  {
    id: 3,
    name: 'GitHub Copilot',
    description: 'AI-powered code completion and suggestion tool',
    category: 'code-generation',
    pricing: 'paid',
    rating: 4.6,
    reviewCount: 750,
    image: 'https://example.com/copilot.png',
    features: ['Code completion', 'Smart suggestions', 'Multiple language support'],
    tags: ['AI', 'Coding', 'Development'],
  },
]

const initialState = {
  tools: [],
  isLoading: true,
  error: null,
}

const toolsReducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_TOOLS_START':
      return {
        ...state,
        isLoading: true,
        error: null,
      }
    case 'FETCH_TOOLS_SUCCESS':
      return {
        ...state,
        tools: action.payload,
        isLoading: false,
        error: null,
      }
    case 'FETCH_TOOLS_ERROR':
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      }
    case 'ADD_TOOL':
      return {
        ...state,
        tools: [...state.tools, action.payload],
      }
    case 'UPDATE_TOOL':
      return {
        ...state,
        tools: state.tools.map((tool) =>
          tool.id === action.payload.id ? action.payload : tool
        ),
      }
    case 'DELETE_TOOL':
      return {
        ...state,
        tools: state.tools.filter((tool) => tool.id !== action.payload),
      }
    default:
      return state
  }
}

export function ToolsProvider({ children }) {
  const [state, dispatch] = useReducer(toolsReducer, initialState)

  // Simulate fetching tools from an API
  useEffect(() => {
    const fetchTools = async () => {
      dispatch({ type: 'FETCH_TOOLS_START' })
      try {
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 1000))
        dispatch({ type: 'FETCH_TOOLS_SUCCESS', payload: initialTools })
      } catch (error) {
        dispatch({
          type: 'FETCH_TOOLS_ERROR',
          payload: 'Failed to fetch tools. Please try again later.',
        })
      }
    }

    fetchTools()
  }, [])

  const addTool = (tool) => {
    dispatch({ type: 'ADD_TOOL', payload: { ...tool, id: Date.now() } })
  }

  const updateTool = (tool) => {
    dispatch({ type: 'UPDATE_TOOL', payload: tool })
  }

  const deleteTool = (id) => {
    dispatch({ type: 'DELETE_TOOL', payload: id })
  }

  return (
    <ToolsContext.Provider
      value={{
        tools: state.tools,
        isLoading: state.isLoading,
        error: state.error,
        addTool,
        updateTool,
        deleteTool,
      }}
    >
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
