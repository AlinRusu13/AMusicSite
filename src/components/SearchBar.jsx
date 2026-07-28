import { Search } from 'lucide-react'

function SearchBar({ value, onChange }) {
  return (
    <div className="relative mb-8 max-w-md">
      <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-taupe" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search tracks, artists, albums..."
        className="w-full metal-panel-raised rounded-full pl-9 pr-4 py-2.5 text-sm placeholder:text-taupe focus:outline-none focus:ring-1 focus:ring-phosphor/50"
      />
    </div>
  )
}

export default SearchBar