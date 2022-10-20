import { connectStateResults } from "react-instantsearch-dom"
import Link from "next/link";

function SearchHits({ searchState, searchResults }) {
    // checking if the query length is >= 3
    // (since 3 is the minimum Algolia query length)
    const validQuery = searchState.query?.length >= 3

    return (
        searchState.query && validQuery ?
            <div className={"search-hits"}>
                {
                    searchResults?.hits.length === 0 && (
                        <div>No results found!</div>
                    )
                }

                {
                    searchResults?.hits.length > 0
                    && searchResults.hits.map((hit) => (
                        <div key={hit.objectID} className="text-2xl mb-3 leading-snug">
                            <Link href={`/posts/${hit.slug}`}>
                                <a className="hover:underline">{hit.title}</a>
                            </Link>
                        </div>
                    ))
                }
            </div> : null
    )
}

export default connectStateResults(SearchHits)