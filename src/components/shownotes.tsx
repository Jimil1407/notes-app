import axios from "axios";
import { useEffect, useState, useRef } from "react";
import { useRecoilState, useRecoilValue } from "recoil"; // Import useRecoilValue
import { notesAtom, searchQueryAtom, isSearchVisibleAtom } from "./recoil/atom"; // Import new atoms
import AddNotes from "./addnotes";
import NoteCard from "./NoteCard"; // Assuming NoteCard is in the same directory
import SearchComponent from "./searchnotes"; // Import the separate SearchComponent
import { Bell, Grid3X3, Menu } from "lucide-react";


interface ShowNotesProps {
  selectedFolder: string;
  setSelectedFolder: (folder: string) => void;
  categories: string[];
  activeCategory: string;
  setActiveCategory: (cat: string) => void;
  showAddModal: boolean;
  setShowAddModal: (show: boolean) => void;
}

export default function ShowNotes({
  selectedFolder,
  setSelectedFolder,
  categories,
  activeCategory,
  setActiveCategory,
  showAddModal,
  setShowAddModal,
}: ShowNotesProps) {
  const [notesState, setNotesState] = useRecoilState(notesAtom);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [updateError, setUpdateError] = useState<{ [id: string]: string }>({});
  const [deletingIds, setDeletingIds] = useState<string[]>([]);
  const [user, setUser] = useState<any>(null);

  // Recoil states for search
  const searchQuery = useRecoilValue(searchQueryAtom); // Read the search query
  const isSearchVisible = useRecoilValue(isSearchVisibleAtom); // Read search visibility

  const pastelColors = [
    "bg-blue-100",
    "bg-green-100",
    "bg-pink-100",
    "bg-purple-100",
    "bg-indigo-100",
    "bg-teal-100",
    "bg-red-100",
    "bg-orange-100",
  ];

  const getNoteColor = (noteId: string) => {
    let hash = 0;
    for (let i = 0; i < noteId.length; i++) {
      hash = noteId.charCodeAt(i) + ((hash << 5) - hash);
    }
    return pastelColors[Math.abs(hash) % pastelColors.length];
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get("http://localhost:3001/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(response.data);
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };
    fetchUser();
  }, []);

  const fetchNotes = async () => {
    const token = localStorage.getItem("token");
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:3001/showNotes", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotesState(response.data);
    } catch (error) {
      console.error("Error fetching notes:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteNote = async (id: string) => {
    const token = localStorage.getItem("token");
    const previousNotes = notesState;
    setDeletingIds((prev) => [...prev, id]);
    setTimeout(() => {
      setNotesState((prevNotes) => prevNotes.filter((note: any) => note.id !== id));
    }, 350);
    try {
      await axios.delete(`http://localhost:3001/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccessMsg("Note deleted successfully!");
      setTimeout(() => setSuccessMsg(""), 2000);
    } catch (error) {
      setNotesState(previousNotes);
      alert("Failed to delete note. Please try again.");
    } finally {
      setTimeout(() => {
        setDeletingIds((prev) => prev.filter((delId) => delId !== id));
      }, 400);
    }
  };

  const handleUpdateNote = async (
    id: string,
    title: string,
    description: string
  ) => {
    const token = localStorage.getItem("token");
    try {
      await axios.put(
        `http://localhost:3001/update/${id}`,
        { title, description },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNotesState(
        notesState.map((note: any) =>
          note.id === id ? { ...note, title, description } : note
        )
      );
      setUpdateError((prev) => ({ ...prev, [id]: "" }));
      setSuccessMsg("Note updated successfully!");
      setTimeout(() => setSuccessMsg(""), 2000);
    } catch (error: any) {
      let message = "Error updating note.";
      if (error.response && error.response.data && error.response.data.error) {
        message = error.response.data.error;
      }
      setUpdateError((prev) => ({ ...prev, [id]: message }));
      setTimeout(() => setUpdateError((prev) => ({ ...prev, [id]: "" })), 3000);
    }
  };

  // Determine which notes to display based on search and category
  const notesToConsider =
    isSearchVisible && searchQuery.length > 0
      ? notesState.filter(
          (note) =>
            note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            note.description.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : notesState;

  const filteredNotes =
    activeCategory === "All"
      ? notesToConsider
      : notesToConsider.filter((note: any) => note.category === activeCategory);

  const groupedNotes = filteredNotes.reduce((acc: any, note: any) => {
    if (!acc[note.category]) acc[note.category] = [];
    acc[note.category].push(note);
    return acc;
  }, {} as Record<string, typeof notesState>);

  return (
    <div className="min-h-screen w-full bg-white flex flex-col items-center">
      {/* Navigation Bar */}
      <nav className="w-full flex items-center justify-between py-6 px-4 md:px-10 bg-white shadow-md rounded-b-3xl mb-8 sticky top-0 z-40 animate-fade-in">
        {/* Logo */}
        <div className="flex items-center gap-4">
          <span className="text-3xl font-extrabold text-blue-600 tracking-tight select-none">
            Likho
          </span>
          <span className="text-lg font-semibold text-gray-700 hidden sm:inline">
            (लिखो)
          </span>
        </div>

        {/* Icons and User Info */}
        <div className="flex items-center gap-6">
          {/* Search Component */}
          <SearchComponent />

          <div className="relative">
            <Bell className="w-7 h-7 text-gray-500 hover:text-blue-500 cursor-pointer transition" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-400 rounded-full"></div>
          </div>
          <button
            className="bg-blue-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-blue-700 transition hidden md:block shadow"
            onClick={() => {
              localStorage.removeItem("token");
              window.location.href = "/auth";
            }}
          >
            Logout
          </button>
          <div className="flex items-center gap-2 ml-4">
            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
              <span className="text-lg">👤</span>
            </div>
            <span className="text-gray-700 text-base font-medium hidden lg:inline">
              Welcome back <strong>{user?.username}</strong>
            </span>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <div className="w-full max-w-7xl bg-white px-8 py-10 rounded-3xl shadow-2xl flex flex-col gap-8 animate-fade-in">
        {/* Header and Add Note Button */}
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-5xl font-bold text-gray-900 tracking-tight font-poppins">
            Your Notes
          </h1>
          <button
            onClick={() => setShowAddModal(true)}
            className="w-16 h-16 border-2 border-gray-200 bg-white rounded-2xl flex items-center justify-center text-4xl text-blue-600 hover:bg-blue-50 shadow-lg transition-all duration-200"
          >
            +
          </button>
        </div>

        {/* Folder Select and View Options */}
        <div className="flex items-center justify-between mb-4">
          <select
            value={selectedFolder}
            onChange={(e) => setSelectedFolder(e.target.value)}
            className="bg-white px-6 py-3 rounded-lg text-base font-medium border-2 border-gray-200 outline-none shadow focus:ring-2 focus:ring-blue-400 transition"
          >
            <option value="Personal">Personal</option>
            <option value="work">work</option>
            <option value="Fitness">Fitness</option>
            <option value="All">All Categories</option>
          </select>
          <div className="flex items-center gap-4">
            <Grid3X3 className="w-6 h-6 text-blue-500" />
            <Menu className="w-6 h-6 text-gray-300" />
          </div>
        </div>        

        {/* Category Filters */}
        <div className="flex gap-3 flex-wrap justify-start md:justify-center relative">
          {categories.map((cat, i) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`relative px-6 py-2 rounded-full text-base font-medium border-2 transition-colors duration-150 shadow-sm font-poppins bg-white ${
                activeCategory === cat
                  ? "text-blue-900 border-blue-400"
                  : "text-gray-700 border-gray-200 hover:bg-blue-50"
              }`}
              style={{ zIndex: 1 }}
            >
              #{cat}
              {activeCategory === cat && (
                <span
                  className="absolute left-1/2 -translate-x-1/2 bottom-0 w-2/3 h-1 bg-blue-400 rounded-full animate-slide-underline"
                  style={{ zIndex: 2 }}
                ></span>
              )}
            </button>
          ))}
        </div>

        {/* Loading and Success Messages */}
        {loading && (
          <div className="flex justify-center items-center my-12 animate-fade-in">
            <svg
              className="animate-spin h-10 w-10 text-blue-400"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8z"
              />
            </svg>
            <span className="ml-4 text-blue-400 font-semibold text-lg">
              Loading notes...
            </span>
          </div>
        )}
        {successMsg && (
          <div className="mb-6 w-full text-center bg-blue-50 text-blue-700 border border-blue-200 rounded p-3 font-semibold animate-fade-in text-lg">
            {successMsg}
          </div>
        )}

        {/* Notes Display Area */}
        <div className="py-10">
          {Object.entries(groupedNotes).length === 0 ||
          Object.values(groupedNotes).every((arr) => (arr as any[]).length === 0) ? (
            <div className="flex flex-col items-center justify-center py-24 animate-fade-in">
              <svg
                width="120"
                height="120"
                fill="none"
                viewBox="0 0 120 120"
                className="mb-6 animate-bounce-slow"
              >
                <rect
                  x="20"
                  y="40"
                  width="80"
                  height="60"
                  rx="12"
                  fill="#e0e7ef"
                />
                <rect
                  x="35"
                  y="55"
                  width="50"
                  height="10"
                  rx="3"
                  fill="#b6c6e3"
                />
                <rect
                  x="35"
                  y="70"
                  width="30"
                  height="8"
                  rx="3"
                  fill="#cfd8e3"
                />
              </svg>
              <div className="text-xl text-gray-400 font-semibold">
                {searchQuery && isSearchVisible
                  ? `No notes matching "${searchQuery}" in this category.`
                  : "No notes here yet! Add your first note ✨"}
              </div>
            </div>
          ) : (
            Object.entries(groupedNotes).map(([category, notes]) => (
              <div key={category} className="mb-12">
                <div className="flex items-center mb-6">
                  <h2 className="text-2xl font-semibold text-gray-700 font-poppins">
                    #{category}
                  </h2>
                  <div className="flex-1 h-px bg-gray-200 ml-6"></div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                  {(notes as any[]).map((note: any) => (
                    <NoteCard
                      key={note.id}
                      note={note}
                      getNoteColor={getNoteColor}
                      handleUpdateNote={handleUpdateNote}
                      handleDeleteNote={handleDeleteNote}
                      deletingIds={deletingIds}
                      updateError={updateError}
                      setUpdateError={setUpdateError}
                      setNotesState={setNotesState}
                    />
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Add Note Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-gray-200 bg-opacity-60 flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-3xl p-10 w-full max-w-lg md:max-w-2xl shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-700">Add Note</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-blue-500 hover:text-blue-700 text-2xl font-bold transition"
              >
                ×
              </button>
            </div>
            <AddNotes
              onClose={() => setShowAddModal(false)}
              categories={categories}
            />
          </div>
        </div>
      )}
    </div>
  );
}