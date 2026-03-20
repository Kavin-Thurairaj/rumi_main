import { useState } from 'react'
import imageApi from '../api/rumi_image_api'

export default function RoomUpload() {
  const [selectedFiles, setSelectedFiles] = useState([])
  const [previews, setPreviews] = useState([])
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [fetchImg, setFetchImg] = useState([])

  const handleChange = (e) => {
    const files = Array.from(e.target.files)
    const combined = [...selectedFiles, ...files]
    if (combined.length > 6) {
      setError('You can only upload up to 6 photos at a time.')
      return
    }
    setSelectedFiles(combined)
    setSuccess(false)
    setError('')
    const urls = combined.map(f => URL.createObjectURL(f))
    setPreviews(urls)
  }

  const removeFile = (index) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index)
    const newPreviews = previews.filter((_, i) => i !== index)
    setSelectedFiles(newFiles)
    setPreviews(newPreviews)
  }

  // ✅ Fix 1: changed `images` → `selectedFiles`
  const handleUpload = async () => {
    if (selectedFiles.length === 0) return
    setLoading(true)
    setSuccess(false)
    setError('')
    try {
      await imageApi.uploadImage(selectedFiles, 1)
      setSuccess(true)
      setSelectedFiles([])
      setPreviews([])
    } catch (err) {
      if (err.response) {
        const errorMsg = err.response.data?.error || "Unknown server error"
        setError(errorMsg)
      } else {
        setError("Upload failed: Network error")
      }
    } finally {
      setLoading(false)
    }
  }

  // ✅ Fix 2: fetch wrapped in a function, result stored in state
  const handleFetch = async () => {
    try {
      const result = await imageApi.getImage(1)
      setFetchImg(result)
    } catch (err) {
      setError("Failed to load gallery")
    }
  }

  const styles = {
    page: {
      minHeight: '100vh',
      background: '#f7f6f3',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: "'Segoe UI', sans-serif",
      padding: '2rem',
    },
    container: {
      width: '100%',
      maxWidth: '560px',
      background: '#ffffff',
      borderRadius: '20px',
      padding: '2.5rem',
      border: '0.5px solid #ebebeb',
    },
    badge: {
      display: 'inline-block',
      background: '#f0ede8',
      color: '#8a6f52',
      fontSize: '11px',
      fontWeight: '600',
      letterSpacing: '0.08em',
      textTransform: 'uppercase',
      padding: '4px 12px',
      borderRadius: '20px',
      marginBottom: '10px',
    },
    title: {
      fontSize: '22px',
      fontWeight: '600',
      color: '#1a1a1a',
      margin: '0 0 4px',
    },
    subtitle: {
      fontSize: '13px',
      color: '#aaa',
      margin: '0 0 1.8rem',
    },
    uploadZone: {
      border: previews.length > 0 ? '1.5px dashed #b07d54' : '1.5px dashed #d5cfc8',
      borderRadius: '14px',
      background: previews.length > 0 ? '#fdf8f4' : '#faf9f7',
      padding: '2.2rem 1.5rem',
      textAlign: 'center',
      cursor: 'pointer',
      marginBottom: '1.2rem',
      position: 'relative',
      transition: 'all 0.2s',
    },
    fileInput: {
      position: 'absolute',
      inset: 0,
      opacity: 0,
      cursor: 'pointer',
      width: '100%',
      height: '100%',
    },
    iconCircle: {
      width: '48px',
      height: '48px',
      background: '#fff',
      borderRadius: '50%',
      border: '0.5px solid #e5e0d8',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      margin: '0 auto 12px',
    },
    uploadTitle: {
      fontSize: '15px',
      fontWeight: '600',
      color: '#1a1a1a',
      marginBottom: '4px',
    },
    uploadHint: {
      fontSize: '13px',
      color: '#aaa',
      marginBottom: '14px',
    },
    formatRow: {
      display: 'flex',
      gap: '6px',
      justifyContent: 'center',
    },
    formatPill: {
      fontSize: '11px',
      background: '#fff',
      border: '0.5px solid #e0e0e0',
      color: '#aaa',
      padding: '3px 10px',
      borderRadius: '20px',
    },
    previewSection: {
      marginBottom: '1.2rem',
    },
    previewHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '10px',
    },
    previewLabel: {
      fontSize: '12px',
      fontWeight: '600',
      color: '#bbb',
      letterSpacing: '0.07em',
      textTransform: 'uppercase',
    },
    previewCount: {
      fontSize: '12px',
      color: '#b07d54',
      fontWeight: '500',
    },
    previewGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: '8px',
    },
    thumbWrapper: {
      position: 'relative',
      aspectRatio: '1',
      borderRadius: '10px',
      overflow: 'hidden',
      border: '0.5px solid #ebebeb',
    },
    thumbImg: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      display: 'block',
    },
    thumbRemove: {
      position: 'absolute',
      top: '4px',
      right: '4px',
      width: '20px',
      height: '20px',
      background: 'rgba(0,0,0,0.55)',
      border: 'none',
      borderRadius: '50%',
      color: '#fff',
      fontSize: '13px',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      lineHeight: '1',
      padding: '0',
    },
    divider: {
      height: '0.5px',
      background: '#f0f0f0',
      margin: '1.5rem 0',
    },
    submitBtn: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      width: '100%',
      padding: '13px',
      background: loading ? '#555' : selectedFiles.length === 0 ? '#d0d0d0' : '#1a1a1a',
      color: '#fff',
      border: 'none',
      borderRadius: '10px',
      fontSize: '14px',
      fontWeight: '500',
      cursor: loading || selectedFiles.length === 0 ? 'not-allowed' : 'pointer',
      marginBottom: '10px',
      transition: 'background 0.2s',
    },
    spinner: {
      width: '16px',
      height: '16px',
      border: '2px solid rgba(255,255,255,0.3)',
      borderTop: '2px solid #fff',
      borderRadius: '50%',
      animation: 'spin 0.7s linear infinite',
      flexShrink: '0',
    },
    fetchBtn: {
      display: 'block',
      width: '100%',
      padding: '13px',
      background: 'transparent',
      color: '#1a1a1a',
      border: '0.5px solid #e0e0e0',
      borderRadius: '10px',
      fontSize: '14px',
      fontWeight: '500',
      cursor: 'pointer',
    },
    successBanner: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      background: '#f0faf4',
      border: '0.5px solid #a8dbb8',
      borderRadius: '10px',
      padding: '12px 16px',
      marginBottom: '1rem',
    },
    successDot: {
      width: '28px',
      height: '28px',
      background: '#27ae60',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
    },
    successTitle: {
      fontSize: '14px',
      fontWeight: '500',
      color: '#1e7e45',
      margin: '0',
    },
    successSub: {
      fontSize: '12px',
      color: '#5fad7e',
      margin: '2px 0 0',
    },
    errorBanner: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      background: '#fdf0ef',
      border: '0.5px solid #f5c6c2',
      borderRadius: '10px',
      padding: '12px 16px',
      marginBottom: '1rem',
    },
    errorDot: {
      width: '28px',
      height: '28px',
      background: '#e74c3c',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
    },
    errorTitle: {
      fontSize: '14px',
      fontWeight: '500',
      color: '#c0392b',
      margin: '0',
    },
    gallerySection: {
      marginTop: '1.5rem',
    },
    galleryLabel: {
      fontSize: '12px',
      fontWeight: '600',
      color: '#bbb',
      letterSpacing: '0.07em',
      textTransform: 'uppercase',
      marginBottom: '10px',
    },
    imageGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '10px',
    },
    image: {
      width: '100%',
      height: '120px',
      objectFit: 'cover',
      borderRadius: '10px',
      border: '0.5px solid #ebebeb',
      display: 'block',
    },
  }

  return (
    <div style={styles.page}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

      <div style={styles.container}>

        <span style={styles.badge}>Room rental</span>
        <h1 style={styles.title}>Upload room photos</h1>
        <p style={styles.subtitle}>Add images to attract the right tenants</p>

        <div style={styles.uploadZone}>
          <input
            type='file'
            multiple
            name='file'
            accept="image/*"
            onChange={handleChange}
            style={styles.fileInput}
          />
          <div style={styles.iconCircle}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
              stroke="#b07d54" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="16 16 12 12 8 16"/>
              <line x1="12" y1="12" x2="12" y2="21"/>
              <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/>
            </svg>
          </div>
          <p style={styles.uploadTitle}>
            {previews.length > 0 ? 'Click to change files' : 'Drop your photos here'}
          </p>
          <p style={styles.uploadHint}>
            or click anywhere to browse · max 6 photos
          </p>
          <div style={styles.formatRow}>
            {['JPG', 'PNG', 'WEBP'].map(f => (
              <span key={f} style={styles.formatPill}>{f}</span>
            ))}
          </div>
        </div>

        {previews.length > 0 && (
          <div style={styles.previewSection}>
            <div style={styles.previewHeader}>
              <span style={styles.previewLabel}>Selected photos</span>
              <span style={styles.previewCount}>{previews.length} / 6 ready</span>
            </div>
            <div style={styles.previewGrid}>
              {previews.map((src, i) => (
                <div key={i} style={styles.thumbWrapper}>
                  <img src={src} alt={`preview-${i}`} style={styles.thumbImg} />
                  <button style={styles.thumbRemove} onClick={() => removeFile(i)}>×</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {success && (
          <div style={styles.successBanner}>
            <div style={styles.successDot}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            </div>
            <div>
              <p style={styles.successTitle}>Photos uploaded successfully!</p>
              <p style={styles.successSub}>Your images are now live in the gallery</p>
            </div>
          </div>
        )}

        {error && (
          <div style={styles.errorBanner}>
            <div style={styles.errorDot}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </div>
            <div>
              <p style={styles.errorTitle}>{error}</p>
            </div>
          </div>
        )}

        <div style={styles.divider} />

        <button onClick={handleUpload} style={styles.submitBtn} disabled={loading || selectedFiles.length === 0}>
          {loading && <span style={styles.spinner} />}
          {loading ? 'Uploading...' : selectedFiles.length > 0 ? `Upload ${selectedFiles.length} photo${selectedFiles.length > 1 ? 's' : ''}` : 'Upload photos'}
        </button>

        {/* ✅ Fix 2: onClick calls handleFetch function
        <button onClick={handleFetch} style={styles.fetchBtn}>
          View gallery
        </button> */}

        {fetchImg.length > 0 && (
          <div style={styles.gallerySection}>
            <p style={styles.galleryLabel}>Listing gallery</p>
            <div style={styles.imageGrid}>
              {fetchImg.map((img) => (
                <img
                  key={img.imageId}
                  src={img.imageUrl}
                  alt={img.imageId}
                  style={styles.image}
                />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  )
}