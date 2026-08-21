import { useEffect, useState } from 'react'
import JsonView from '../components/JsonView'
import NotFoundPage from './NotFoundPage'
import './ResultPage.css'

function ResultPage({ id }) {
  const [status, setStatus] = useState('loading')
  const [data, setData] = useState(null)

  useEffect(() => {
    const controller = new AbortController()

    async function fetchResult() {
      setStatus('loading')
      try {
        const response = await fetch('/api/nci', {
          method: 'POST',
          signal: controller.signal,
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ ID: id }),
        })
        if (!response.ok) {
          throw new Error(`Server xatosi: ${response.status}`)
        }

        const json = await response.json()
        setData(json)
        setStatus('success')
      } catch (err) {
        if (err.name === 'AbortError') return
        setStatus('error')
      }
    }

    fetchResult()
    return () => controller.abort()
  }, [id])

  if (status === 'error') {
    return <NotFoundPage />
  }

  return (
    <section className="result-page">
      {status === 'loading' && (
        <p className="result-status">
          <span className="result-spinner" />
          Загружаются данные...
        </p>
      )}

      {status === 'success' && (
        <div className="result-success">
          <h1>НСИ продукта</h1>
          <div className="result-card">
            <JsonView data={data} />
          </div>
        </div>
      )}
    </section>
  )
}

export default ResultPage
