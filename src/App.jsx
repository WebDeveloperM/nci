import ResultPage from './pages/ResultPage'
import NotFoundPage from './pages/NotFoundPage'

function App() {
  const uniqueId = window.location.pathname.replace(/^\/+/, '')

  if (uniqueId) {
    return <ResultPage id={uniqueId} />
  }

  return <NotFoundPage />
}

export default App
