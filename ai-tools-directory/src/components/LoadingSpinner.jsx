const sizes = {
  small: 'h-4 w-4',
  medium: 'h-6 w-6',
  large: 'h-8 w-8',
  xl: 'h-12 w-12'
}

export default function LoadingSpinner({ size = 'medium', className = '' }) {
  return (
    <div className="relative">
      <div className={`
        ${sizes[size]} 
        ${className}
        loading-spinner
        border-t-primary-600
        border-4
        border-gray-200
        rounded-full
        animate-spin
      `} />
      <div className="sr-only">Loading...</div>
    </div>
  )
}
