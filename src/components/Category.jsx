export default function Category () {
    return (
        <div className="category d-flex border-dark bg-black justify-content-around w-100 border-bottom link-opacity-100-hover">
            <button className="fw-bold">For You</button>
            <button>Trending</button>
            <button>News</button>
            <button>Sports</button>
            <button>Entertaiment</button>
        </div>
    )
}