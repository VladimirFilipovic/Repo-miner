import { SearchCriteria, SearchElement } from '../types'

export const getSearchElementsFromUrl = (url: string) => {
    const urlSearchParams = new URLSearchParams(url)
    const searchElements: SearchElement[] = []

    for (const [key, value] of urlSearchParams) {
        const criteria = Object.keys(SearchCriteria).find(
            (searchKriteriaKey) =>
                searchKriteriaKey.toLowerCase() === key.toLowerCase()
        )

        if (!criteria) {
            continue
        }

        searchElements.push({
            criteria: SearchCriteria[criteria as keyof typeof SearchCriteria],
            value,
        })
    }

    return searchElements
}
