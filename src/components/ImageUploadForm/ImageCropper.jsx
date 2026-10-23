import Cropper from 'react-easy-crop'

/**
 * Component bọc react-easy-crop với tỉ lệ 1:1 và thanh trượt điều chỉnh zoom.
 * @param {Object} props
 * @param {string} props.imageSrc - URL của ảnh cần crop
 * @param {{ x: number, y: number }} props.crop - Tọa độ crop { x, y }
 * @param {number} props.zoom - Hệ số zoom
 * @param {Function} props.onCropChange - Callback cập nhật tọa độ crop
 * @param {Function} props.onZoomChange - Callback cập nhật hệ số zoom
 * @param {Function} props.onCropComplete - Callback nhận croppedAreaPixels (tọa độ pixel thực tế trên ảnh gốc)
 */
export default function ImageCropper({
  imageSrc,
  crop,
  zoom,
  onCropChange,
  onZoomChange,
  onCropComplete,
}) {
  return (
    <div className="space-y-4">
      {/* Khung chứa Cropper với tỉ lệ 1:1, cố định chiều cao và bo góc */}
      <div className="relative h-80 w-full overflow-hidden rounded-xl bg-slate-900">
        <Cropper
          image={imageSrc}
          crop={crop}
          zoom={zoom}
          aspect={1}
          onCropChange={onCropChange}
          onZoomChange={onZoomChange}
          onCropComplete={onCropComplete}
        />
      </div>

      {/* Thanh trượt Zoom */}
      <div className="flex items-center gap-3">
        <label htmlFor="zoom-range" className="text-sm font-medium text-slate-700 whitespace-nowrap">
          Zoom: {zoom.toFixed(1)}x
        </label>
        <input
          id="zoom-range"
          type="range"
          min={1}
          max={3}
          step={0.1}
          value={zoom}
          onChange={(e) => onZoomChange(Number(e.target.value))}
          className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
          aria-label="Zoom level"
        />
      </div>
    </div>
  )
}
