
export default function SortDropdown() {
  return (
    <select className="border rounded-xl p-2">
      <option value="recent">Most Recent</option>
      <option value="price-low">Price: Low to High</option>
      <option value="price-high">Price: High to Low</option>
      <option value="rating">Top Rated</option>
    </select>
  )
}
