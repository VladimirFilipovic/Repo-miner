import {
    RepositorySearchResultItem,
    CodeSearchResultItem,
    Repository,
} from '../types'

export const mergeQueryResults = ({
    repositoriesFromRepositoryQueryData,
    repositoriesFromCodeQueryData,
}: {
    repositoriesFromRepositoryQueryData: RepositorySearchResultItem[]
    repositoriesFromCodeQueryData: CodeSearchResultItem[]
}): Repository[] => {
    console.log({
        repositoriesFromRepositoryQueryData,
        repositoriesFromCodeQueryData,
    })

    const repositoriesFromRepositorySearch =
        repositoriesFromRepositoryQueryData.map(
            ({ id, full_name, name, html_url, url, description }) => ({
                id,
                fullName: full_name,
                name,
                description,
                htmlUrl: html_url,
                url,
            })
        )

    const repositoriesFromCodeSearch = repositoriesFromCodeQueryData.map(
        ({ repository }) => ({
            id: repository.id,
            fullName: repository.full_name,
            description: repository.description,
            name: repository.name,
            htmlUrl: repository.html_url,
            url: repository.url,
        })
    )

    const uniqueRepositoriesFromRepositorySearch = Array.from(
        new Set(repositoriesFromRepositorySearch.map((repo) => repo.id))
    ).map(
        (id) => repositoriesFromRepositorySearch.find((repo) => repo.id === id)!
    )

    const uniqueRepositoriesFromCodeSearch = Array.from(
        new Set(repositoriesFromCodeSearch.map((repo) => repo.id))
    ).map((id) => repositoriesFromCodeSearch.find((repo) => repo.id === id)!)

    if (!uniqueRepositoriesFromRepositorySearch.length) {
        return uniqueRepositoriesFromCodeSearch
    }

    if (!uniqueRepositoriesFromCodeSearch.length) {
        return uniqueRepositoriesFromRepositorySearch
    }

    const stricterSearchCriteria =
        uniqueRepositoriesFromRepositorySearch.length >
        uniqueRepositoriesFromCodeSearch.length
            ? uniqueRepositoriesFromRepositorySearch
            : uniqueRepositoriesFromCodeSearch

    const lessStrictSearchCriteria =
        uniqueRepositoriesFromRepositorySearch.length <
        uniqueRepositoriesFromCodeSearch.length
            ? uniqueRepositoriesFromRepositorySearch
            : uniqueRepositoriesFromCodeSearch

    const repositoriesByBothCriterias = stricterSearchCriteria.filter((repo) =>
        lessStrictSearchCriteria.some(
            (lessStrictRepo) => lessStrictRepo.id === repo.id
        )
    )

    return repositoriesByBothCriterias
}
