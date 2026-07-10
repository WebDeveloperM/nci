import ResultPage from './pages/ResultPage'
import ScannerPage from './pages/ScannerPage'

function App() {
  const uniqueId = window.location.pathname.replace(/^\/+/, '')

  if (uniqueId) {
    return <ResultPage id={uniqueId} />
  }

  return <ScannerPage />
}

export default App
