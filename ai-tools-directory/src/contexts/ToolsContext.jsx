import { createContext, useContext, useReducer } from 'react'

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

const toolsReducer = (state, action) => {
  switch (action.type) {
    case 'SET_TOOLS':
      return { ...state, tools: action.payload }
    case 'ADD_TOOL':
      return { ...state, tools: [...state.tools, action.payload] }
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
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload }
    case 'SET_ERROR':
      return { ...state, error: action.payload }
    default:
      return state
  }
}

export function ToolsProvider({ children }) {
  const [state, dispatch] = useReducer(toolsReducer, {
    tools: initialTools,
    isLoading: false,
    error: null,
  })

  const addTool = (tool) => {
    dispatch({ type: 'ADD_TOOL', payload: { ...tool, id: Date.now() } })
  }

  const updateTool = (tool) => {
    dispatch({ type: 'UPDATE_TOOL', payload: tool })
  }

  const deleteTool = (id) => {
    dispatch({ type: 'DELETE_TOOL', payload: id })
  }

  const setLoading = (isLoading) => {
    dispatch({ type: 'SET_LOADING', payload: isLoading })
  }

  const setError = (error) => {
    dispatch({ type: 'SET_ERROR', payload: error })
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
        setLoading,
        setError,
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
