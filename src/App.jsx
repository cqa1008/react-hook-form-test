import ImageUploadForm from './components/ImageUploadForm/ImageUploadForm'

export default function App() {
  return (
    <main className="min-h-screen bg-slate-50 flex flex-col items-center justify-start py-6 px-4 sm:py-10 sm:px-6">
      <div className="w-full max-w-xl text-center mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">
          Image Upload & Crop
        </h1>
        <p className="text-slate-600 mt-1 text-sm">
          React Hook Form test: upload, crop 400x400 & preview
        </p>
      </div>
      <ImageUploadForm />
    </main>
  )
}
