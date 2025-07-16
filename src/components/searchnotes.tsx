import { Search, XCircle } from "lucide-react";
import { useRecoilState } from "recoil";
import { searchQueryAtom, isSearchVisibleAtom } from "./recoil/atom"; // Import the new atoms

export default function SearchComponent() {
  const [searchQuery, setSearchQuery] = useRecoilState(searchQueryAtom);
  const [isSearchVisible, setIsSearchVisible] = useRecoilState(isSearchVisibleAtom);

  const handleToggleSearch = () => {
    setIsSearchVisible((prev) => !prev);
    if (isSearchVisible) {
      setSearchQuery(""); // Clear search query when closing
    }
  };

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    
    // You might want to trigger the search immediately here or on Enter key
    // For now, let's just update the query in Recoil
  };

  const handleSearchKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      // If you want to trigger a backend search here, you'd call a function
      // that dispatches an action or performs the axios call.
      // For now, we're relying on ShowNotes to filter based on searchQueryAtom.
      e.currentTarget.blur(); // Optional: unfocus the input after Enter
    }
  };


  return (
    <div className="relative">
      <button
        onClick={handleToggleSearch}
        className="p-1 rounded-full hover:bg-gray-100 transition"
        aria-label="Toggle search"
      >
        {isSearchVisible ? (
          <XCircle className="w-7 h-7 text-gray-500 hover:text-red-500 cursor-pointer transition" />
        ) : (
          <Search className="w-7 h-7 text-gray-500 hover:text-blue-500 cursor-pointer transition" />
        )}
      </button>

      {isSearchVisible && (
        <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-xl p-4 z-50 animate-scale-in">
          <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
            <input
              type="text"
              placeholder="Search notes by title or description..."
              value={searchQuery}
              onChange={handleSearchInputChange}
              onKeyPress={handleSearchKeyPress} // Use onKeyPress or onKeyDown
              className="flex-1 p-2 outline-none text-base"
            />
            {/* The search button here would ideally trigger a fetch in a parent or ShowNotes */}
            {/* For now, the filtering happens reactively in ShowNotes based on searchQueryAtom */}
            <button
              // onClick={handleSearch} // No direct onClick here, filtering is reactive
              className="bg-blue-500 text-white p-2 hover:bg-blue-600 transition"
              aria-label="Perform search"
            >
              <Search className="w-5 h-5" />
            </button>
          </div>
          {/* We won't show search results directly here, as ShowNotes will handle rendering */}
          {/* You could add a small indicator like "Type to search..." */}
        </div>
      )}
    </div>
  );
}