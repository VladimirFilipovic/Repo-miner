import { SearchCriteria } from '@/repo_search/types'

export function addQueryParam(key: string, value: string) {
    // Get the current URL
    const url = new URL(window.location.toString())

    // Add the query parameter
    url.searchParams.append(key, value)

    // Update the browser's address bar
    window.history.pushState({}, '', url)
}

export function updateQueryParam(key: string, value: string) {
    // Get the current URL
    const url = new URL(window.location.toString())

    // Update the query parameter
    url.searchParams.set(key, value)

    // Update the browser's address bar
    window.history.pushState({}, '', url)
}

export function removeQueryParam(key: string, value: string) {
    // Get the current URL
    const url = new URL(window.location.toString())

    // Remove the query parameter
    url.searchParams.delete(key, value)

    // Update the browser's address bar
    window.history.pushState({}, '', url)
}
