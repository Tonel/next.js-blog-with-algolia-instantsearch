import { connectSearchBox } from "react-instantsearch-dom"

function SearchBox({ refine }) {
    return (
        <input
            className="search-box"
            type="search"
            placeholder="Search..."
            onChange={(e) => refine(e.currentTarget.value)}
        />
    )
}

export default connectSearchBox(SearchBox)