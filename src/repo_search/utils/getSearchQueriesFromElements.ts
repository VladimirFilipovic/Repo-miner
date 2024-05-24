import { SearchCriteria, SearchElement } from '../types'

// https://docs.github.com/en/search-github/searching-on-github/searching-for-repositories#search-by-number-of-stars
export const getSearchQueriesFromElements = (elements: SearchElement[]) => {
    let repositoriesQuery = ''
    let codeQueries = []

    for (const element of elements) {
        switch (element.criteria) {
            case SearchCriteria.NameOrDescription:
                repositoriesQuery = repositoriesQuery.concat(
                    ` "${element.value}" in:name,description`
                )
                break
            case SearchCriteria.Topics:
                repositoriesQuery = repositoriesQuery.concat(
                    ` topic:${element.value}`
                )
                break
            case SearchCriteria.Language:
                repositoriesQuery = repositoriesQuery.concat(
                    ` language:${element.value}`
                )
                break
            case SearchCriteria.Stars:
                repositoriesQuery = repositoriesQuery.concat(
                    ` stars:>=${element.value}`
                )
                break
            case SearchCriteria.Forks:
                repositoriesQuery = repositoriesQuery.concat(
                    ` forks:>=${element.value}`
                )
                break
            case SearchCriteria.UpdatedAfter:
                repositoriesQuery = repositoriesQuery.concat(
                    ` pushed:>=${element.value}`
                )
                break
            case SearchCriteria.CreatedAfter:
                repositoriesQuery = repositoriesQuery.concat(
                    ` created:>=${element.value}`
                )
                break
            case SearchCriteria.CodeContains:
                codeQueries.push(`${element.value} in:file`)
                break
        }
    }

    return { repositoriesQuery, codeQueries }
}
