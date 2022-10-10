const anilistApiConfig = {
    baseUrl: 'https://graphql.anilist.co',
    noSearchQuery: `
        query ($id: Int, $page: Int, $perPage: Int) { # Define which variables will be used in the query (id)
            Page (page: $page, perPage: $perPage) {
                pageInfo {
                    total
                    currentPage
                    lastPage
                    hasNextPage
                    perPage
                }
                media (id: $id, sort: [POPULARITY_DESC], type: ANIME, `,
    trendingQuery: `
        query ($id: Int, $page: Int, $perPage: Int) { # Define which variables will be used in the query (id)
            Page (page: $page, perPage: $perPage) {
                pageInfo {
                    total
                    currentPage
                    lastPage
                    hasNextPage
                    perPage
                }
                media (id: $id, sort: [TRENDING_DESC], type: ANIME, `,
    searchQuery: `
        query ($id: Int, $page: Int, $perPage: Int, $search: String) { # Define which variables will be used in the query (id)
            Page (page: $page, perPage: $perPage) {
                pageInfo {
                    total
                    currentPage
                    lastPage
                    hasNextPage
                    perPage
                }
                media (id: $id, sort: [POPULARITY_DESC], type: ANIME, search: $search, `,
    detailsQuery: `
        query ($id: Int) { # Define which variables will be used in the query (id)
            Media (id: $id, type: ANIME) { # Insert our variables into the query arguments (id) (type: ANIME is hard-coded in the query)
                id
                title {
                romaji
                english
                native
                }
                bannerImage
                coverImage {
                    extraLarge
                    large
                    medium
                }
                genres
                description
                trailer {
                    id
                    site
                    thumbnail
                }
                characters (sort: [RELEVANCE], page: 1, perPage: 5) {
                    nodes {
                        id
                        name {
                            full
                        }
                        image {
                            large
                        }
                        gender
                        age
                    }
                }
            }
        }
        `,
    genreNoSearchQuery: `
        query ($id: Int, $page: Int, $perPage: Int, $genre: [String!]!) { # Define which variables will be used in the query (id)
            Page (page: $page, perPage: $perPage) {
                pageInfo {
                    total
                    currentPage
                    lastPage
                    hasNextPage
                    perPage
                }
                media (id: $id, sort: [POPULARITY_DESC], type: ANIME, genre_in: $genre, `,
    query2: `
        )   { # Insert our variables into the query arguments (id) (type: ANIME is hard-coded in the query)
                id
                title {
                    romaji
                    english
                    native
                }
                bannerImage
                description
                coverImage {
                    extraLarge
                }
            }
        }
    }`,
}

export default anilistApiConfig