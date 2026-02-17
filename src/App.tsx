import { useState } from 'react'
import { Header, Footer } from './components'
import HomePage from './pages/Home'
import FeedsPage from './pages/Feeds'
import Styles from './styles/index.module.css'

type Tab = 'home' | 'feeds'

export default function App() {
  const [route, setRoute] = useState<Tab>('home')

  return (
    <div className={Styles.container}>
      <Header onTabChange={setRoute} currentTab={route} />
      <main className={Styles.main}>
        {route === 'home' && <HomePage />}
        {route === 'feeds' && <FeedsPage />}
      </main>
      <Footer />
    </div>
  )
}
