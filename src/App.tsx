import { useEffect, useRef, useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { Header, Footer } from './components'
import HomePage from './pages/Home'
import FeedsPage from './pages/Feeds'
import { ExportReminderDialog } from './components/ExportReminderDialog/ExportReminderDialog'
import { shouldShowExportReminder } from './services/exportReminderService'

type Page = 'home' | 'feeds'

const queryClient = new QueryClient()

export default function App() {
  const [page, setPage] = useState<Page>('home')
  const exportReminderRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    if (shouldShowExportReminder()) {
      exportReminderRef.current?.showModal()
    }
  }, [])

  return (
    <QueryClientProvider client={queryClient}>
      <Header onNavigate={(p) => setPage(p as Page)} />
      <main>
        {page === 'home' && <HomePage />}
        {page === 'feeds' && <FeedsPage />}
      </main>
      <Footer />
      <ReactQueryDevtools initialIsOpen={false} />
      <ExportReminderDialog ref={exportReminderRef} />
    </QueryClientProvider>
  )
}
