import { useState } from 'react'
import { Header, Footer } from './components'
import HomePage from './pages/Home'
import FeedsPage from './pages/Feeds'

type Page = 'home' | 'feeds'

export default function App() {
  const [page, setPage] = useState<Page>('home')

  return (
    <>
      <Header onNavigate={(p) => setPage(p as Page)} />
      <main>
        {page === 'home' && <HomePage />}
        {page === 'feeds' && <FeedsPage />}
      </main>
      <Footer />
    </>
  )
}
