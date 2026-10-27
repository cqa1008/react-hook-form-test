import { useState, useRef, useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import ImageCropper from './ImageCropper'
import ImagePreview from './ImagePreview'
import { validateImageFile } from '../../utils/imageValidators'
import { getCroppedFile, createImage } from '../../utils/cropImage'

export default function ImageUploadForm() {
  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    clearErrors,
    setError,
    reset,
    trigger,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      image: null,
      croppedImage: null,
    },
  })

  // State quản lý URL xem trước của ảnh gốc và ảnh sau crop
  const [rawImageUrl, setRawImageUrl] = useState(null)
  const [croppedPreviewUrl, setCroppedPreviewUrl] = useState(null)

  // State điều khiển react-easy-crop
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)
  const [isProcessingCrop, setIsProcessingCrop] = useState(false)

  // State hiệu ứng kéo thả file vào vùng upload
  const [isDragging, setIsDragging] = useState(false)

  // State lưu kết quả sau khi Submit thành công
  const [submittedResult, setSubmittedResult] = useState(null)

  // Ref tham chiếu input file và các Object URL mới nhất để cleanup
  const fileInputRef = useRef(null)
  const rawImageUrlRef = useRef(null)
  const croppedPreviewUrlRef = useRef(null)

  useEffect(() => {
    rawImageUrlRef.current = rawImageUrl
  }, [rawImageUrl])

  useEffect(() => {
    croppedPreviewUrlRef.current = croppedPreviewUrl
  }, [croppedPreviewUrl])

  // Cleanup toàn bộ Object URL khi component unmount
  useEffect(() => {
    return () => {
      if (rawImageUrlRef.current) {
        URL.revokeObjectURL(rawImageUrlRef.current)
      }
      if (croppedPreviewUrlRef.current) {
        URL.revokeObjectURL(croppedPreviewUrlRef.current)
      }
    }
  }, [])

  /**
   * Reset form về trạng thái ban đầu sạch sẽ khi bấm "Choose another image" hoặc nút "Reset"
   */
  const handleResetForm = () => {
    if (rawImageUrl) {
      URL.revokeObjectURL(rawImageUrl)
    }
    if (croppedPreviewUrl) {
      URL.revokeObjectURL(croppedPreviewUrl)
    }
    setRawImageUrl(null)
    setCroppedPreviewUrl(null)
    setSubmittedResult(null)
    setCrop({ x: 0, y: 0 })
    setZoom(1)
    setCroppedAreaPixels(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
    reset({ image: null, croppedImage: null })
    clearErrors()
  }

  /**
   * HÀM DÙNG CHUNG xử lý file cho cả 2 đường: Input file dialog và Kéo thả (Drag & Drop)
   * Đảm bảo hành vi 100% đồng nhất:
   * 1. Luôn gọi field.onChange(file) kể cả khi file không hợp lệ để validate báo đúng lỗi của file đó.
   * 2. Đặt croppedImage = null, reset crop/zoom/croppedAreaPixels và xóa preview cũ.
   * 3. Gọi trigger('image') để chạy rule validateImageFile.
   * 4. Chỉ tạo Object URL và hiện khung crop khi file ĐÃ qua validate thành công.
   */
  const handleFile = async (file, field) => {
    // Reset e.target.value / fileInputRef.current để chọn lại cùng một file vẫn kích hoạt onChange
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }

    // Luôn lưu file vào React Hook Form để rule validate kiểm tra trực tiếp trên đối tượng File
    field.onChange(file)

    // Xóa croppedImage cũ, reset khung crop và kết quả submit cũ
    setValue('croppedImage', null)
    setCrop({ x: 0, y: 0 })
    setZoom(1)
    setCroppedAreaPixels(null)
    setSubmittedResult(null)

    // Thu hồi các Object URL cũ để chống rò rỉ bộ nhớ
    if (croppedPreviewUrl) {
      URL.revokeObjectURL(croppedPreviewUrl)
      setCroppedPreviewUrl(null)
    }
    if (rawImageUrl) {
      URL.revokeObjectURL(rawImageUrl)
      setRawImageUrl(null)
    }

    // Trigger validation cho trường 'image'
    const isValid = await trigger('image')

    // Nếu không có file (người dùng chưa chọn/hủy) hoặc file không hợp lệ: dừng lại
    // Thông báo lỗi cụ thể (ví dụ "File size must not exceed 5MB", "Only JPG and PNG...") đã được RHF gán tự động
    if (!file || !isValid) {
      return
    }

    // File đã qua validate: Tạo Object URL tạm thời và kiểm tra khả năng giải mã ảnh (bắt fake.png, empty.jpg)
    const tempUrl = URL.createObjectURL(file)
    try {
      await createImage(tempUrl)
      // File hợp lệ hoàn toàn: gán URL để hiển thị khung crop
      setRawImageUrl(tempUrl)
    } catch {
      // File hỏng hoặc không giải mã được: giải phóng URL, gán lỗi và KHÔNG hiện khung crop
      URL.revokeObjectURL(tempUrl)
      setError('image', {
        type: 'manual',
        message: 'Unable to read this image file',
      })
    }
  }

  /**
   * Xử lý sự kiện kéo thả (Drag & Drop)
   */
  const handleDragOver = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragEnter = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setIsDragging(false)
    }
  }

  const handleDrop = (e, field) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
    // Lấy file đầu tiên từ dataTransfer (hỗ trợ cả trường hợp thả nhiều file cùng lúc)
    const droppedFile = e.dataTransfer?.files?.[0] || null
    handleFile(droppedFile, field)
  }

  /**
   * Xử lý khi người dùng bấm nút "Crop"
   */
  const handlePerformCrop = async () => {
    if (!rawImageUrl || !croppedAreaPixels) return

    try {
      setIsProcessingCrop(true)
      const currentImageFile = getValues('image')
      const fileName = currentImageFile ? currentImageFile.name : 'image.jpg'
      const mimeType = currentImageFile ? currentImageFile.type : 'image/jpeg'

      // Cắt ảnh bằng canvas, đảm bảo kích thước 400x400 px
      const croppedFile = await getCroppedFile(
        rawImageUrl,
        croppedAreaPixels,
        fileName,
        mimeType
      )

      // Giải phóng URL preview cũ nếu có
      if (croppedPreviewUrl) {
        URL.revokeObjectURL(croppedPreviewUrl)
      }

      const newPreviewUrl = URL.createObjectURL(croppedFile)
      setCroppedPreviewUrl(newPreviewUrl)

      // Cập nhật giá trị vào trường croppedImage của RHF và xóa lỗi chưa crop nếu có
      setValue('croppedImage', croppedFile, { shouldValidate: true })
      clearErrors('croppedImage')
    } catch (err) {
      setError('croppedImage', {
        type: 'manual',
        message: err.message || 'Failed to crop image',
      })
    } finally {
      setIsProcessingCrop(false)
    }
  }

  /**
   * Xử lý khi Submit form thành công
   */
  const onSubmit = (data) => {
    setSubmittedResult({
      file: data.croppedImage,
      previewUrl: croppedPreviewUrl,
    })
  }

  return (
    <div className="w-full max-w-xl">
      {/* Hiển thị kết quả sau khi Submit thành công */}
      {submittedResult ? (
        <div className="rounded-2xl bg-white p-4 sm:p-6 shadow-lg space-y-5 sm:space-y-6 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 mb-1">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-slate-800">Submitted Successfully!</h2>
          
          <ImagePreview
            previewUrl={submittedResult.previewUrl}
            file={submittedResult.file}
          />

          <button
            type="button"
            onClick={handleResetForm}
            className="w-full rounded-lg border border-slate-300 px-4 py-2.5 min-h-[44px] font-medium text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            Choose another image
          </button>
        </div>
      ) : (
        /* Form chính: noValidate tắt HTML5 validation mặc định của trình duyệt */
        <form
          noValidate
          onSubmit={handleSubmit(onSubmit)}
          className="rounded-2xl bg-white p-4 sm:p-6 shadow-lg space-y-5"
        >
          {/* Controller cho trường 'image' (File gốc) */}
          <Controller
            name="image"
            control={control}
            rules={{ validate: validateImageFile }}
            render={({ field }) => (
              <div className="space-y-2">
                <label
                  htmlFor="image-upload"
                  className="block text-sm font-semibold text-slate-700"
                >
                  Upload Image <span className="text-red-500">*</span>
                </label>

                {/* Vùng tải file: Hỗ trợ cả Click mở dialog và Kéo thả (Drag & Drop) */}
                <div
                  onDragOver={handleDragOver}
                  onDragEnter={handleDragEnter}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, field)}
                  className={`relative rounded-xl border-2 border-dashed p-4 sm:p-6 text-center transition-all cursor-pointer ${
                    isDragging
                      ? 'border-indigo-600 bg-indigo-50/70 ring-4 ring-indigo-100 scale-[1.01]'
                      : errors.image
                      ? 'border-red-500 bg-red-50/30'
                      : 'border-slate-300 hover:border-indigo-400 bg-slate-50/50'
                  }`}
                >
                  {/* Controller với input file: KHÔNG truyền prop value.
                      Input phủ toàn bộ khung với opacity-0 để bắt sự kiện click mở dialog */}
                  <input
                    ref={fileInputRef}
                    id="image-upload"
                    type="file"
                    accept="image/jpeg,image/png"
                    aria-invalid={errors.image ? 'true' : 'false'}
                    aria-describedby={errors.image ? 'image-error' : undefined}
                    onChange={(e) => {
                      const selectedFile = e.target.files?.[0] || null
                      handleFile(selectedFile, field)
                    }}
                    onDragOver={handleDragOver}
                    onDragEnter={handleDragEnter}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDrop(e, field)}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />

                  <svg
                    className={`mx-auto h-9 w-9 sm:h-10 sm:w-10 transition-colors pointer-events-none ${
                      isDragging ? 'text-indigo-600' : 'text-slate-400'
                    }`}
                    stroke="currentColor"
                    fill="none"
                    viewBox="0 0 48 48"
                    aria-hidden="true"
                  >
                    <path
                      d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <div className="mt-2.5 sm:mt-3 text-sm text-slate-600 pointer-events-none">
                    <span className="font-semibold text-indigo-600">
                      {isDragging ? 'Drop file here' : 'Click to upload'}
                    </span>
                    <span className="text-slate-500"> or drag and drop</span>
                  </div>
                  <p className="mt-1 text-xs text-slate-500 pointer-events-none">
                    PNG, JPG up to 5MB
                  </p>
                </div>

                {/* Thông báo lỗi cho trường image */}
                {errors.image && (
                  <p
                    id="image-error"
                    role="alert"
                    className="text-sm font-medium text-red-600"
                  >
                    {errors.image.message}
                  </p>
                )}
              </div>
            )}
          />

          {/* Khung Crop: chỉ hiển thị khi đã chọn ảnh hợp lệ và chưa submit */}
          {rawImageUrl && (
            <div className="space-y-4 pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-semibold text-slate-700">
                  Crop Image (400x400)
                </span>
                <button
                  type="button"
                  onClick={handlePerformCrop}
                  disabled={isProcessingCrop}
                  className="rounded-lg bg-indigo-600 px-3.5 py-1.5 sm:px-4 sm:py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50 transition-colors cursor-pointer shrink-0"
                >
                  {isProcessingCrop ? 'Cropping...' : 'Crop'}
                </button>
              </div>

              <ImageCropper
                imageSrc={rawImageUrl}
                crop={crop}
                zoom={zoom}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={(_croppedArea, areaPixels) => {
                  setCroppedAreaPixels(areaPixels)
                }}
              />
            </div>
          )}

          {/* Controller cho trường 'croppedImage' */}
          <Controller
            name="croppedImage"
            control={control}
            rules={{ required: 'Please crop the image before submitting' }}
            render={({ field }) => (
              <div className="space-y-2">
                {/* Hiển thị Preview khi đã có ảnh crop */}
                {croppedPreviewUrl && field.value && (
                  <ImagePreview
                    previewUrl={croppedPreviewUrl}
                    file={field.value}
                  />
                )}

                {/* Thông báo lỗi khi đã chọn ảnh mà chưa crop rồi bấm submit */}
                {errors.croppedImage && getValues('image') && (
                  <p role="alert" className="text-sm font-medium text-red-600">
                    {errors.croppedImage.message}
                  </p>
                )}
              </div>
            )}
          />

          {/* Các nút hành động cuối form */}
          <div className="flex gap-2.5 sm:gap-3 pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 rounded-lg bg-indigo-600 px-4 py-2.5 min-h-[44px] font-semibold text-white hover:bg-indigo-700 disabled:opacity-50 transition-colors cursor-pointer"
            >
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </button>

            {rawImageUrl && (
              <button
                type="button"
                onClick={handleResetForm}
                className="rounded-lg border border-slate-300 px-4 py-2.5 min-h-[44px] font-medium text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                Reset
              </button>
            )}
          </div>
        </form>
      )}
    </div>
  )
}
