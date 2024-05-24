import { QueryClient, QueryClientProvider } from 'react-query'

import './App.css'
import { toast } from './components/ui/use-toast'
import RepoSearchPage from './repo_search/RepoSearchPage'

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            onError: (error) => {
                console.error(error)
                toast({
                    variant: 'destructive',
                    title: 'Uh oh! Something went wrong.',
                    description:
                        error instanceof Error ? error.message : String(error),
                })
            },
        },
        mutations: {
            onError: (error) => {
                console.error(error)
                toast({
                    variant: 'destructive',
                    title: 'Uh oh! Something went wrong.',
                    description:
                        error instanceof Error ? error.message : String(error),
                })
            },
        },
    },
})

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <RepoSearchPage />
        </QueryClientProvider>
    )
}

export default App
