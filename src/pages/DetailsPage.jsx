import { useState } from 'react'
import JsonView from '../components/JsonView'
import './DetailsPage.css'

const TARGET_URL = import.meta.env.VITE_TARGET_URL

function DetailsPage({ id }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [status, setStatus] = useState('form')
  const [error, setError] = useState(null)
  const [data, setData] = useState(null)

  async function handleSubmit(event) {
    event.preventDefault()
    setStatus('loading')
    setError(null)

    try {
      const response = await fetch(TARGET_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${btoa(`${username}:${password}`)}`,
        },
        body: JSON.stringify({ ID: id }),
      })

      if (response.status === 401) {
        throw new Error('Неверный логин или пароль')
      }
      if (!response.ok) {
        throw new Error(`Ошибка сервера: ${response.status}`)
      }

      const json = await response.json()
      setData(json)
      setStatus('success')
    } catch (err) {
      setError(err.message)
      setStatus('form')
    }
  }

  if (status === 'success') {
    return (
      <section className="result-page">
        <div className="result-success">
          <h1>Подробная информация</h1>
          <div className="result-card">
            <JsonView data={data} />
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="details-page">
      <form className="details-card" onSubmit={handleSubmit}>
        <h1>Вход</h1>
        <p>Введите логин и пароль для просмотра подробной информации</p>

        <label className="details-field">
          <span>Логин</span>
          <input
            type="text"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            autoComplete="username"
            required
          />
        </label>

        <label className="details-field">
          <span>Пароль</span>
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="current-password"
            required
          />
        </label>

        {error && <p className="details-error">{error}</p>}

        <button type="submit" className="details-submit" disabled={status === 'loading'}>
          {status === 'loading' ? 'Проверка...' : 'Войти'}
        </button>
      </form>
    </section>
  )
}

export default DetailsPage
