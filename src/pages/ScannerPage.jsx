import { useEffect, useRef, useState } from 'react'
import QrScanner from 'qr-scanner'
import './ScannerPage.css'

function goToScannedId(text) {
  if (/^https?:\/\//i.test(text)) {
    window.location.href = text
    return
  }
  window.location.href = `${window.location.origin}/${text.replace(/^\/+/, '')}`
}

function ScannerPage() {
  const videoRef = useRef(null)
  const scannerRef = useRef(null)
  const [scanning, setScanning] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    return () => {
      scannerRef.current?.destroy()
    }
  }, [])

  async function startScanning() {
    setError(null)
    setScanning(true)

    if (!window.isSecureContext) {
      setError('Камера доступна только через HTTPS-соединение')
      setScanning(false)
      return
    }

    try {
      scannerRef.current = new QrScanner(videoRef.current, (result) => {
        scannerRef.current?.stop()
        goToScannedId(result.data)
      }, {
        preferredCamera: 'environment',
        highlightScanRegion: true,
        highlightCodeOutline: true,
      })
      await scannerRef.current.start()
    } catch (err) {
      console.error(err)
      const message = err?.name === 'NotAllowedError'
        ? 'Доступ к камере запрещён. Разрешите доступ в настройках браузера'
        : err?.name === 'NotFoundError'
          ? 'Камера не найдена на этом устройстве'
          : 'Не удалось получить доступ к камере'
      setError(message)
      setScanning(false)
    }
  }

  return (
    <section className="scanner-page">
      <div className="scanner-card">
        <h1>НСИ продукта</h1>
        <p>Отсканируйте QR-код для просмотра информации</p>

        <video ref={videoRef} className={`scanner-video${scanning ? ' active' : ''}`} />

        {!scanning && (
          <button type="button" className="scanner-button" onClick={startScanning}>
            Открыть камеру
          </button>
        )}

        {error && <p className="scanner-error">{error}</p>}
      </div>
    </section>
  )
}

export default ScannerPage
