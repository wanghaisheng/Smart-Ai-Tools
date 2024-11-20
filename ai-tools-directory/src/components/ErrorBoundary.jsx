import { Component } from 'react'
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error,
      errorInfo
    })
    // You can also log the error to an error reporting service here
    console.error('Error caught by ErrorBoundary:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[60vh] flex items-center justify-center px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-6">
              <ExclamationTriangleIcon className="h-8 w-8 text-red-600" aria-hidden="true" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Something went wrong
            </h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              We're sorry for the inconvenience. Please try refreshing the page or contact support if the problem persists.
            </p>
            <div className="space-x-4">
              <button
                onClick={() => window.location.reload()}
                className="btn btn-primary"
              >
                Refresh Page
              </button>
              <button
                onClick={() => window.history.back()}
                className="btn btn-secondary"
              >
                Go Back
              </button>
            </div>
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div className="mt-8 p-4 bg-gray-50 rounded-lg text-left">
                <p className="text-sm font-medium text-gray-900 mb-2">Error Details:</p>
                <pre className="text-xs text-gray-600 overflow-auto max-h-40">
                  {this.state.error.toString()}
                  {this.state.errorInfo?.componentStack}
                </pre>
              </div>
            )}
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
