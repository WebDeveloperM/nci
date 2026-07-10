import { useEffect, useState } from 'react'
import JsonView from '../components/JsonView'
import NotFoundPage from './NotFoundPage'
import './ResultPage.css'

const TARGET_URL = import.meta.env.VITE_TARGET_URL
const AUTH_USER = import.meta.env.VITE_AUTH_USER
const AUTH_PASS = import.meta.env.VITE_AUTH_PASS

function ResultPage({ id }) {
  const [status, setStatus] = useState('loading')
  const [data, setData] = useState(null)

  useEffect(() => {
    const controller = new AbortController()

    async function fetchResult() {
      setStatus('loading')
      try {
        const response = await fetch(TARGET_URL, {
          method: 'POST',
          signal: controller.signal,
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Basic ${btoa(`${AUTH_USER}:${AUTH_PASS}`)}`,
          },
          body: JSON.stringify({ ID: id }),
        })
        console.log('Fetching result for ID:', id) // vaqtincha
        console.log(response) // vaqtincha
        if (!response.ok) {
          throw new Error(`Server xatosi: ${response.status}`)
        }

        const json = await response.json()
        console.log(json) // vaqtincha
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
