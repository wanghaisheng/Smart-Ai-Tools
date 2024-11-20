import { useState } from 'react'
import { PhotoIcon } from '@heroicons/react/24/solid'

const categories = [
  { id: 'text-generation', name: 'Text Generation' },
  { id: 'image-generation', name: 'Image Generation' },
  { id: 'code-generation', name: 'Code Generation' },
  { id: 'audio-speech', name: 'Audio & Speech' },
]

const pricingModels = [
  { id: 'free', name: 'Free' },
  { id: 'freemium', name: 'Freemium' },
  { id: 'paid', name: 'Paid' },
  { id: 'enterprise', name: 'Enterprise' },
]

export default function SubmitTool() {
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

  const handleSubmit = (e) => {
    e.preventDefault()
    // Here you would typically send the form data to your backend
    console.log('Form submitted:', formData)
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
    <div className="bg-white">
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-xl">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Submit a Tool</h1>
          <p className="mt-2 text-lg leading-8 text-gray-600">
            Share an AI tool with our community. Please provide accurate and detailed information.
          </p>

          <form onSubmit={handleSubmit} className="mt-10 space-y-8">
            {/* Basic Information */}
            <div className="space-y-6">
              <h2 className="text-base font-semibold leading-7 text-gray-900">Basic Information</h2>

              <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900">
                    Tool Name
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      name="name"
                      id="name"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="website" className="block text-sm font-medium leading-6 text-gray-900">
                    Website URL
                  </label>
                  <div className="mt-2">
                    <input
                      type="url"
                      name="website"
                      id="website"
                      required
                      value={formData.website}
                      onChange={handleInputChange}
                      className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="category" className="block text-sm font-medium leading-6 text-gray-900">
                    Category
                  </label>
                  <div className="mt-2">
                    <select
                      id="category"
                      name="category"
                      required
                      value={formData.category}
                      onChange={handleInputChange}
                      className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
                    >
                      <option value="">Select a category</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="pricingModel" className="block text-sm font-medium leading-6 text-gray-900">
                    Pricing Model
                  </label>
                  <div className="mt-2">
                    <select
                      id="pricingModel"
                      name="pricingModel"
                      required
                      value={formData.pricingModel}
                      onChange={handleInputChange}
                      className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
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
              </div>
            </div>

            {/* Description and Features */}
            <div className="space-y-6">
              <h2 className="text-base font-semibold leading-7 text-gray-900">Description and Features</h2>

              <div>
                <label htmlFor="description" className="block text-sm font-medium leading-6 text-gray-900">
                  Description
                </label>
                <div className="mt-2">
                  <textarea
                    id="description"
                    name="description"
                    rows={4}
                    required
                    value={formData.description}
                    onChange={handleInputChange}
                    className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
                  />
                </div>
                <p className="mt-2 text-sm text-gray-500">Write a clear description of what the tool does and its main benefits.</p>
              </div>

              <div>
                <label htmlFor="features" className="block text-sm font-medium leading-6 text-gray-900">
                  Key Features
                </label>
                <div className="mt-2">
                  <textarea
                    id="features"
                    name="features"
                    rows={4}
                    required
                    value={formData.features}
                    onChange={handleInputChange}
                    className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
                    placeholder="List the key features, one per line"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    id="apiAvailable"
                    name="apiAvailable"
                    type="checkbox"
                    checked={formData.apiAvailable}
                    onChange={handleInputChange}
                    className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-600"
                  />
                  <label htmlFor="apiAvailable" className="ml-3 text-sm font-medium leading-6 text-gray-900">
                    API Available
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    id="freeTrial"
                    name="freeTrial"
                    type="checkbox"
                    checked={formData.freeTrial}
                    onChange={handleInputChange}
                    className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-600"
                  />
                  <label htmlFor="freeTrial" className="ml-3 text-sm font-medium leading-6 text-gray-900">
                    Free Trial Available
                  </label>
                </div>
              </div>
            </div>

            {/* Media */}
            <div className="space-y-6">
              <h2 className="text-base font-semibold leading-7 text-gray-900">Media</h2>

              <div>
                <label htmlFor="logo" className="block text-sm font-medium leading-6 text-gray-900">
                  Logo
                </label>
                <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                  <div className="text-center">
                    <PhotoIcon className="mx-auto h-12 w-12 text-gray-300" aria-hidden="true" />
                    <div className="mt-4 flex text-sm leading-6 text-gray-600">
                      <label
                        htmlFor="logo"
                        className="relative cursor-pointer rounded-md bg-white font-semibold text-primary-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-primary-600 focus-within:ring-offset-2 hover:text-primary-500"
                      >
                        <span>Upload a logo</span>
                        <input
                          id="logo"
                          name="logo"
                          type="file"
                          accept="image/*"
                          onChange={handleInputChange}
                          className="sr-only"
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs leading-5 text-gray-600">PNG, JPG, GIF up to 10MB</p>
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="screenshots" className="block text-sm font-medium leading-6 text-gray-900">
                  Screenshots (optional)
                </label>
                <div className="mt-2">
                  <input
                    type="file"
                    id="screenshots"
                    name="screenshots"
                    multiple
                    accept="image/*"
                    onChange={handleScreenshotsChange}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-600 hover:file:bg-primary-100"
                  />
                </div>
                <p className="mt-2 text-xs text-gray-500">You can upload up to 5 screenshots</p>
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-6">
              <h2 className="text-base font-semibold leading-7 text-gray-900">Contact Information</h2>

              <div>
                <label htmlFor="contactEmail" className="block text-sm font-medium leading-6 text-gray-900">
                  Contact Email
                </label>
                <div className="mt-2">
                  <input
                    type="email"
                    name="contactEmail"
                    id="contactEmail"
                    required
                    value={formData.contactEmail}
                    onChange={handleInputChange}
                    className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
                  />
                </div>
                <p className="mt-2 text-sm text-gray-500">We'll use this email to contact you about your submission.</p>
              </div>
            </div>

            <div className="mt-10">
              <button
                type="submit"
                className="block w-full rounded-md bg-primary-600 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
              >
                Submit Tool
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
