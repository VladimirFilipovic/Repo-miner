//https://docs.github.com/en/rest/search/search?apiVersion=2022-11-28#constructing-a-search-query
// https://docs.github.com/en/rest/search/search?apiVersion=2022-11-28#search-code

import octokit from '@/lib/octokit'
import { useQuery } from 'react-query'
import {
    CodeSearchResultItem,
    GithubConstants,
    RepositorySearchResultItem,
    SearchElement,
} from '../types'
import { getSearchQueriesFromElements } from '../utils/getSearchQueriesFromElements'
import { mergeQueryResults } from '../utils/mergeQueryResults'

const USE_SEARCH_KEY = 'USE_SEARCH'

const useSearchRepositories = (searchElements: SearchElement[]) => {
    const { data, isLoading, error, refetch } = useQuery({
        queryKey: USE_SEARCH_KEY,
        queryFn: async () => {
            console.log('Searching repositories with elements:', searchElements)

            const { repositoriesQuery, codeQueries } =
                getSearchQueriesFromElements(searchElements)

            console.log({ repositoriesQuery, codeQueries })

            let totalSearchResults = 0

            const getSearchRepositoriesResults = async () => {
                const query = repositoriesQuery.concat(
                    ' archived:false fork:false'
                )
                try {
                    const data =
                        await octokit.paginate<RepositorySearchResultItem>({
                            method: 'GET',
                            url: '/search/repositories',
                            q: query,
                            per_page: GithubConstants.MAX_RESULTS_PER_PAGE,
                            headers: {
                                'X-GitHub-Api-Version': '2022-11-28',
                            },
                        })

                    totalSearchResults += data.length

                    return data
                } catch (error) {
                    console.error('Error fetching repositories:', error)
                    throw error
                }
            }

            const getSearchCodeResults = async () => {
                try {
                    const allCodeResults: CodeSearchResultItem[] = []

                    for (const codeQuery of codeQueries) {
                        const data =
                            await octokit.paginate<CodeSearchResultItem>({
                                method: 'GET',
                                url: '/search/code',
                                q: codeQuery,
                                per_page: GithubConstants.MAX_RESULTS_PER_PAGE,
                                headers: {
                                    'X-GitHub-Api-Version': '2022-11-28',
                                },
                            })

                        console.log(
                            `Code search results: ${data} for query: ${codeQuery}`
                        )

                        allCodeResults.push(...data)
                    }

                    totalSearchResults += allCodeResults.length

                    console.log({ allCodeResults })

                    return allCodeResults
                } catch (error) {
                    console.error('Error fetching code:', error)
                    throw error
                }
            }

            console.log({ totalSearchResults })

            return {
                repositories: mergeQueryResults({
                    repositoriesFromRepositoryQueryData:
                        repositoriesQuery?.length
                            ? await getSearchRepositoriesResults()
                            : [],
                    repositoriesFromCodeQueryData: codeQueries?.length
                        ? await getSearchCodeResults()
                        : [],
                }),
                totalSearchResults,
            }
        },
        enabled: false,
    })

    return {
        data,
        isLoading,
        error,
        refetch,
    }
}

export default useSearchRepositories
