export default function LoadingSpinner({ size = 'default' }) {
  const sizeClasses = {
    small: 'h-6 w-6',
    default: 'h-10 w-10',
    large: 'h-16 w-16',
  }

  return (
    <div className="flex justify-center items-center p-4">
      <div className={`loading-spinner ${sizeClasses[size]}`} />
    </div>
  )
}
