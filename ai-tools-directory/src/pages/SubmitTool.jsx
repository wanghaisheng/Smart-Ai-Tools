import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PhotoIcon } from '@heroicons/react/24/solid'
import { useTools } from '../contexts/ToolsContext'
import { toast } from 'react-hot-toast'

const categories = [
  { id: 'text-generation', name: 'Text Generation' },
  { id: 'image-generation', name: 'Image Generation' },
  { id: 'code-generation', name: 'Code Generation' },
  { id: 'audio-speech', name: 'Audio & Speech' },
  { id: 'video-generation', name: 'Video Generation' },
  { id: 'chatbots', name: 'Chatbots & Assistants' },
  { id: 'data-analytics', name: 'Data Analytics' },
  { id: 'productivity', name: 'Productivity' },
  { id: 'other', name: 'Other' }
]

const pricingModels = [
  { id: 'free', name: 'Free' },
  { id: 'freemium', name: 'Freemium' },
  { id: 'paid', name: 'Paid' },
  { id: 'enterprise', name: 'Enterprise' },
]

export default function SubmitTool() {
  const navigate = useNavigate()
  const { submitTool, loading } = useTools()
  const [formData, setFormData] = useState({
    name: '',
    website: '',
    category: '',
    pricingModel: '',
    description: '',
    features: '',
    apiAvailable: false,
    freeTrial: false,
    logo: null,
    screenshots: [],
    contactEmail: '',
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await submitTool(formData)
      toast.success('Tool submitted successfully!')
      navigate('/tools')
    } catch (error) {
      toast.error(error.message || 'Failed to submit tool')
    }
  }

  const handleInputChange = (e) => {
    const { name, value, type, checked, files } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : type === 'file' ? files[0] : value,
    }))
  }

  const handleScreenshotsChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      screenshots: Array.from(e.target.files),
    }))
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
          <div className="max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Submit a New AI Tool</h1>
            
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Basic Information */}
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Basic Information</h2>
                
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Tool Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="website" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Website URL *
                  </label>
                  <input
                    type="url"
                    name="website"
                    id="website"
                    required
                    value={formData.website}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Category *
                  </label>
                  <select
                    name="category"
                    id="category"
                    required
                    value={formData.category}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
                  >
                    <option value="">Select a category</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="pricingModel" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Pricing Model *
                  </label>
                  <select
                    name="pricingModel"
                    id="pricingModel"
                    required
                    value={formData.pricingModel}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
                  >
                    <option value="">Select pricing model</option>
                    {pricingModels.map((model) => (
                      <option key={model.id} value={model.id}>
                        {model.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Description and Features */}
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Description and Features</h2>
                
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Description *
                  </label>
                  <textarea
                    name="description"
                    id="description"
                    required
                    rows={4}
                    value={formData.description}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="features" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Key Features *
                  </label>
                  <textarea
                    name="features"
                    id="features"
                    required
                    rows={4}
                    value={formData.features}
                    onChange={handleInputChange}
                    placeholder="List the main features, one per line"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
                  />
                </div>
              </div>

              {/* Additional Information */}
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Additional Information</h2>
                
                <div className="flex items-center space-x-6">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="apiAvailable"
                      id="apiAvailable"
                      checked={formData.apiAvailable}
                      onChange={handleInputChange}
                      className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500 dark:border-gray-600"
                    />
                    <label htmlFor="apiAvailable" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                      API Available
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="freeTrial"
                      id="freeTrial"
                      checked={formData.freeTrial}
                      onChange={handleInputChange}
                      className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500 dark:border-gray-600"
                    />
                    <label htmlFor="freeTrial" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                      Free Trial Available
                    </label>
                  </div>
                </div>
              </div>

              {/* Media */}
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Media</h2>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Logo *</label>
                  <div className="mt-1 flex items-center">
                    <input
                      type="file"
                      name="logo"
                      accept="image/*"
                      required
                      onChange={handleInputChange}
                      className="block w-full text-sm text-gray-500 dark:text-gray-400
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-md file:border-0
                        file:text-sm file:font-medium
                        file:bg-primary-50 file:text-primary-700
                        dark:file:bg-primary-900/30 dark:file:text-primary-400
                        hover:file:bg-primary-100 dark:hover:file:bg-primary-900/40"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Screenshots</label>
                  <div className="mt-1">
                    <input
                      type="file"
                      name="screenshots"
                      accept="image/*"
                      multiple
                      onChange={handleScreenshotsChange}
                      className="block w-full text-sm text-gray-500 dark:text-gray-400
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-md file:border-0
                        file:text-sm file:font-medium
                        file:bg-primary-50 file:text-primary-700
                        dark:file:bg-primary-900/30 dark:file:text-primary-400
                        hover:file:bg-primary-100 dark:hover:file:bg-primary-900/40"
                    />
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div>
                <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Contact Email *
                </label>
                <input
                  type="email"
                  name="contactEmail"
                  id="contactEmail"
                  required
                  value={formData.contactEmail}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
                />
              </div>

              {/* Submit Button */}
              <div className="pt-6">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:bg-primary-500 dark:hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Submitting...' : 'Submit Tool'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
