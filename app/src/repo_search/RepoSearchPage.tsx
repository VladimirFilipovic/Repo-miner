import { FC, useState } from 'react'
import { Triangle } from 'react-loader-spinner'
import { SearchCode } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import CriteriaAlert from './components/CriteriaAlert'
import CriteariaDialog from './components/CriteriaDialog'
import RepositoryCard from './components/RepositoryCard'
import useSearchRepositories from './hooks/useSearchRepositories'
import { SearchCriteria, SearchElement } from './types'
import { getSearchElementsFromUrl } from './utils/getSearchElementsFromUrl'
import { addQueryParam, removeQueryParam } from '@/utils/searchParamsUtils'

interface RepoSearchPageProps {}

const RepoSearchPage: FC<RepoSearchPageProps> = () => {
    const [searchElements, setSearchElements] = useState<SearchElement[]>(
        getSearchElementsFromUrl(window.location.search)
    )

    const { data, isLoading, error, refetch } =
        useSearchRepositories(searchElements)

    if (isLoading) {
        return (
            <div className="flex  items-center  h-screen">
                <Triangle
                    visible={true}
                    height="120"
                    width="120"
                    color="#4fa94d"
                    ariaLabel="triangle-loading"
                    wrapperStyle={{}}
                    wrapperClass=""
                />
            </div>
        )
    }

    return (
        // Create a search page with a title and an input field
        <div className="flex flex-col items-center  h-screen">
            <h1>Repository search</h1>

            {data?.repositories?.length && (
                <>
                    <h2 className="mt-5">
                        Total results: {data?.totalSearchResults}
                    </h2>

                    <h3 className="mt-10">
                        Repositories {`(${data.repositories.length})`}:
                    </h3>
                    <ScrollArea className="h-[600px] w-[600px] rounded-md border p-6 flex items-center justify-center">
                        {data.repositories?.map((repository) => (
                            <RepositoryCard
                                key={repository.id}
                                repository={repository}
                            />
                        ))}
                    </ScrollArea>
                </>
            )}

            {/* Move this stuff to another component pls */}
            {!data?.repositories?.length && searchElements.length > 0 && (
                <>
                    {searchElements.map(({ criteria, value }) => (
                        <CriteriaAlert
                            key={criteria + value}
                            criteria={criteria}
                            value={value}
                            onRemove={() => {
                                setSearchElements(
                                    searchElements.filter(
                                        (element) => element.value !== value
                                    )
                                )
                                removeQueryParam(
                                    Object.keys(SearchCriteria).find(
                                        (key) =>
                                            key.toLocaleLowerCase() ===
                                            criteria
                                                .split(' ')
                                                .join('')
                                                .toLocaleLowerCase()
                                    )!,
                                    value
                                )
                            }}
                        />
                    ))}
                </>
            )}

            {!data?.repositories?.length && (
                <CriteariaDialog
                    onCriteriaSubmit={(criteria, criteriaValue) => {
                        setSearchElements(
                            searchElements.concat([
                                { criteria, value: criteriaValue },
                            ])
                        )
                        addQueryParam(
                            Object.keys(SearchCriteria).find(
                                (key) =>
                                    key.toLocaleLowerCase() ===
                                    criteria
                                        .split(' ')
                                        .join('')
                                        .toLocaleLowerCase()
                            )!,
                            criteriaValue
                        )
                    }}
                />
            )}

            {!data?.repositories?.length && searchElements.length > 0 && (
                <Button
                    onClick={() => {
                        refetch()
                    }}
                    className="mt-10"
                >
                    <SearchCode className="mr-2 h-5 w-5" />
                    Search for repositories
                </Button>
            )}
        </div>
    )
}

export default RepoSearchPage
