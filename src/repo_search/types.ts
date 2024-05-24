import { components } from '@octokit/openapi-types'

export enum SearchCriteria {
    CodeContains = 'code contains',
    NameOrDescription = 'name or description',
    Topics = 'topics',
    Language = 'language',
    Stars = 'stars',
    Forks = 'forks',
    UpdatedAfter = 'updated after',
    CreatedAfter = 'created after',
}

export type SearchElement = {
    criteria: SearchCriteria
    value: string
}
export type RepositorySearchResultItem =
    components['schemas']['repo-search-result-item']

export type CodeSearchResultItem =
    components['schemas']['code-search-result-item']

export type Repository = {
    id: number
    fullName: string
    description: string | null
    name: string
    htmlUrl: string
    url: string
}

export const enum GithubConstants {
    MAX_RESULTS_PER_PAGE = 100,
    REPO_SEARCH_PER_MINUTE_RATE_LIMIT = 30,
    CODE_SEARCH_PER_MINUTE_RATE_LIMIT = 10,
}
