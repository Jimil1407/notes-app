import axios from "axios";
import { useEffect, useState, useRef } from "react";
import { useRecoilState } from "recoil";
import { notesAtom } from "./recoil/atom";
import AddNotes from "./addnotes";
import { Search, Bell, Grid3X3, Menu } from "lucide-react";

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
  setShowAddModal
}: ShowNotesProps) {
  const [notesState, setNotesState] = useRecoilState(notesAtom);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [updateError, setUpdateError] = useState<{ [id: string]: string }>({});
  const [deletingIds, setDeletingIds] = useState<string[]>([]);
  const noteRefs = useRef<{ [id: string]: HTMLDivElement | null }>({});

  // Pastel color palette for sticky notes
  const pastelColors = [
    "bg-blue-100", "bg-green-100", "bg-pink-100", "bg-purple-100", "bg-indigo-100", "bg-teal-100", "bg-red-100", "bg-orange-100"
  ];

  // Assign a random color to each note (by id for consistency)
  const getNoteColor = (noteId: string) => {
    // Simple hash for deterministic color assignment
    let hash = 0;
    for (let i = 0; i < noteId.length; i++) {
      hash = noteId.charCodeAt(i) + ((hash << 5) - hash);
    }
    return pastelColors[Math.abs(hash) % pastelColors.length];
  };

  useEffect(() => {
    fetchNotes();
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
      setNotesState((prevNotes) => prevNotes.filter((note) => note.id !== id));
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

  const handleUpdateNote = async (id: string, title: string, description: string) => {
    const token = localStorage.getItem("token");
    try {
      await axios.put(
        `http://localhost:3001/update/${id}`,
        { title, description },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNotesState(
        notesState.map((note) =>
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

  // Filter notes by category
  const filteredNotes = activeCategory === 'All' 
    ? notesState 
    : notesState.filter(note => note.category === activeCategory);

  // Group notes by category for display
  const groupedNotes = filteredNotes.reduce((acc, note) => {
    if (!acc[note.category]) acc[note.category] = [];
    acc[note.category].push(note);
    return acc;
  }, {} as Record<string, typeof notesState>);

  // Card color and emoji/icon by category
  const cardStyles: Record<string, { color: string; emoji: string }> = {
    Personal: { color: "bg-yellow-100", emoji: "😊" },
    work: { color: "bg-blue-100", emoji: "💼" },
    Fitness: { color: "bg-green-100", emoji: "💪" },
    Other: { color: "bg-purple-100", emoji: "✨" },
  };

  const getRotation = (idx: number) => {
    const rotations = ["-rotate-2", "rotate-1", "rotate-2", "-rotate-1", "rotate-3", "-rotate-3", ""];
    return rotations[idx % rotations.length];
  };

  // Add a helper for ripple effect
  function createRipple(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    const target = e.currentTarget;
    const circle = document.createElement("span");
    const diameter = Math.max(target.clientWidth, target.clientHeight);
    const radius = diameter / 2;
    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${e.clientX - target.getBoundingClientRect().left - radius}px`;
    circle.style.top = `${e.clientY - target.getBoundingClientRect().top - radius}px`;
    circle.classList.add("ripple");
    const ripple = target.getElementsByClassName("ripple")[0];
    if (ripple) ripple.remove();
    target.appendChild(circle);
  }

  return (
    <div className="min-h-screen w-full bg-white flex flex-col items-center">
      {/* Minimalist Navbar/Header */}
      <nav className="w-full flex items-center justify-between py-6 px-4 md:px-10 bg-white shadow-md rounded-b-3xl mb-8 sticky top-0 z-40 animate-fade-in">
        {/* Left: Logo/App Name */}
        <div className="flex items-center gap-4">
          <span className="text-3xl font-extrabold text-blue-600 tracking-tight select-none">Likho</span>
          <span className="text-lg font-semibold text-gray-700 hidden sm:inline">(लिखो)</span>
        </div>
        {/* Right: Actions */}
        <div className="flex items-center gap-6">
          <Search className="w-7 h-7 text-gray-500 hover:text-blue-500 cursor-pointer transition" />
          <div className="relative">
            <Bell className="w-7 h-7 text-gray-500 hover:text-blue-500 cursor-pointer transition" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-400 rounded-full"></div>
          </div>
          <button
            className="bg-blue-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-blue-700 transition hidden md:block shadow"
            onClick={() => { localStorage.removeItem('token'); window.location.href = '/auth'; }}
          >
            Logout
          </button>
          <div className="flex items-center gap-2 ml-4">
            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
              <span className="text-lg">👤</span>
            </div>
            <span className="text-gray-700 text-base font-medium hidden lg:inline">Welcome back <strong>Chad</strong></span>
          </div>
        </div>
      </nav>
      {/* Main content below navbar */}
      <div className="w-full max-w-7xl bg-white px-8 py-10 rounded-3xl shadow-2xl flex flex-col gap-8 animate-fade-in">
        {/* Your Notes title and add button */}
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-5xl font-bold text-gray-900 tracking-tight font-poppins">Your Notes</h1>
          <button
            onClick={() => setShowAddModal(true)}
            className="w-16 h-16 border-2 border-gray-200 bg-white rounded-2xl flex items-center justify-center text-4xl text-blue-600 hover:bg-blue-50 shadow-lg transition-all duration-200"
          >
            +
          </button>
        </div>
        {/* Folder selector and view toggle */}
        <div className="flex items-center justify-between mb-4">
          <select
            value={selectedFolder}
            onChange={(e) => setSelectedFolder(e.target.value)}
            className="bg-white px-6 py-3 rounded-lg text-base font-medium border-2 border-gray-200 outline-none shadow focus:ring-2 focus:ring-blue-400 transition"
          >
            <option value="Personal">Personal</option>
            <option value="work">work</option>
            <option value="Fitness">Fitness</option>
          </select>
          <div className="flex items-center gap-4">
            <Grid3X3 className="w-6 h-6 text-blue-500" />
            <Menu className="w-6 h-6 text-gray-300" />
          </div>
        </div>
        {/* Category filters with animated underline */}
        <div className="flex gap-3 flex-wrap justify-start md:justify-center relative">
          {categories.map((cat, i) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`relative px-6 py-2 rounded-full text-base font-medium border-2 transition-colors duration-150 shadow-sm font-poppins bg-white ${
                activeCategory === cat
                  ? 'text-blue-900 border-blue-400' : 'text-gray-700 border-gray-200 hover:bg-blue-50'
              }`}
              style={{ zIndex: 1 }}
            >
              #{cat}
              {activeCategory === cat && (
                <span className="absolute left-1/2 -translate-x-1/2 bottom-0 w-2/3 h-1 bg-blue-400 rounded-full animate-slide-underline" style={{zIndex: 2}}></span>
              )}
            </button>
          ))}
        </div>
        {/* Loading and success messages */}
        {loading && (
          <div className="flex justify-center items-center my-12 animate-fade-in">
            <svg className="animate-spin h-10 w-10 text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
            <span className="ml-4 text-blue-400 font-semibold text-lg">Loading notes...</span>
          </div>
        )}
        {successMsg && (
          <div className="mb-6 w-full text-center bg-blue-50 text-blue-700 border border-blue-200 rounded p-3 font-semibold animate-fade-in text-lg">
            {successMsg}
          </div>
        )}
        {/* Notes Content */}
        <div className="py-10">
          {Object.entries(groupedNotes).length === 0 || Object.values(groupedNotes).every(arr => arr.length === 0) ? (
            <div className="flex flex-col items-center justify-center py-24 animate-fade-in">
              <svg width="120" height="120" fill="none" viewBox="0 0 120 120" className="mb-6 animate-bounce-slow">
                <rect x="20" y="40" width="80" height="60" rx="12" fill="#e0e7ef" />
                <rect x="35" y="55" width="50" height="10" rx="3" fill="#b6c6e3" />
                <rect x="35" y="70" width="30" height="8" rx="3" fill="#cfd8e3" />
              </svg>
              <div className="text-xl text-gray-400 font-semibold">No notes here yet! Add your first note ✨</div>
            </div>
          ) : (
            Object.entries(groupedNotes).map(([category, notes]) => (
              <div key={category} className="mb-12">
                <div className="flex items-center mb-6">
                  <h2 className="text-2xl font-semibold text-gray-700 font-poppins">#{category}</h2>
                  <div className="flex-1 h-px bg-gray-200 ml-6"></div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                  {notes.map((note, idx) => (
                    <div
                      key={note.id}
                      ref={el => { noteRefs.current[note.id] = el; }}
                      onClick={createRipple}
                      className={`${getNoteColor(note.id)} p-6 rounded-3xl shadow-lg relative transform transition-transform duration-300 cursor-pointer group hover:scale-105 hover:-rotate-1 hover:shadow-2xl active:scale-95 sticky-note ${deletingIds.includes(note.id) ? 'animate-note-out' : 'animate-note-in'}`}
                      style={{ minHeight: '220px', fontFamily: 'Poppins, Nunito, Inter, sans-serif', overflow: 'hidden' }}
                    >
                      {/* Tape effect */}
                      <div className="absolute left-1/2 -translate-x-1/2 -top-5 w-20 h-5 bg-gray-200 rounded opacity-80 z-10 border-b-2 border-gray-300 animate-tape-wiggle group-hover:animate-tape-peel" style={{boxShadow: '0 2px 6px 0 rgba(0,0,0,0.10)'}}></div>
                      {/* Ripple span (for effect) */}
                      {/* Emoji/Icon */}
                      <div className="absolute top-6 right-8 text-3xl select-none opacity-80">
                        📝
                      </div>
                      {editingId === note.id ? (
                        <div className="space-y-3">
                          {updateError[note.id] && (
                            <div className="mb-2 w-full text-center bg-red-100 text-red-700 border border-red-300 rounded p-2 font-semibold animate-fade-in">
                              {updateError[note.id]}
                            </div>
                          )}
                          <input
                            value={note.title}
                            onChange={(e) => {
                              setNotesState(prevNotes =>
                                prevNotes.map(n =>
                                  n.id === note.id ? { ...n, title: e.target.value } : n
                                )
                              );
                              if (updateError[note.id]) setUpdateError((prev) => ({ ...prev, [note.id]: '' }));
                            }}
                            className="w-full p-3 text-base font-semibold bg-white rounded border-2 border-gray-200 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition focus:shadow-lg"
                          />
                          <textarea
                            value={note.description}
                            onChange={(e) => {
                              setNotesState(prevNotes =>
                                prevNotes.map(n =>
                                  n.id === note.id ? { ...n, description: e.target.value } : n
                                )
                              );
                              if (updateError[note.id]) setUpdateError((prev) => ({ ...prev, [note.id]: '' }));
                            }}
                            className="w-full p-3 text-base bg-white rounded border-2 border-gray-200 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition resize-none focus:shadow-lg"
                            rows={4}
                          />
                          <div className="flex gap-3">
                            <button
                              onClick={() => {
                                if (note.title && note.description) {
                                  setUpdateError((prev) => ({ ...prev, [note.id]: '' }));
                                  handleUpdateNote(note.id, note.title, note.description);
                                  setEditingId(null);
                                } else {
                                  setUpdateError((prev) => ({ ...prev, [note.id]: 'Title and description are required' }));
                                }
                              }}
                              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-base rounded shadow transition focus:ring-2 focus:ring-blue-400 focus:shadow-lg"
                            >
                              Save
                            </button>
                            <button
                              onClick={() => setEditingId(null)}
                              className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 text-base rounded shadow transition focus:ring-2 focus:ring-blue-400 focus:shadow-lg"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <h3 className="font-semibold text-lg mb-3 text-gray-900 leading-tight font-poppins">
                            {note.title}
                          </h3>
                          <p className="text-base text-gray-700 mb-4 leading-relaxed font-nunito">
                            {note.description}
                          </p>
                          <div className="absolute bottom-4 left-6 right-6">
                            <p className="text-sm text-gray-500 mb-2 font-nunito">{new Date((note as any).date || Date.now()).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                            <div className="flex justify-between items-center">
                              <div className="w-7 h-7 bg-gray-100 rounded-full flex items-center justify-center">
                                <span className="text-base">⚙️</span>
                              </div>
                              {/* Quick actions: fade/slide in on hover */}
                              <div className="flex gap-2 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 translate-y-2 transition-all duration-200">
                                <button
                                  onClick={e => { e.stopPropagation(); setEditingId(note.id); }}
                                  className="w-7 h-7 bg-gray-200 rounded-full flex items-center justify-center text-base hover:bg-blue-100 transition focus:ring-2 focus:ring-blue-400 focus:shadow-lg"
                                >
                                  ✏️
                                </button>
                                <button
                                  onClick={e => { e.stopPropagation(); handleDeleteNote(note.id); }}
                                  className="w-7 h-7 bg-gray-200 rounded-full flex items-center justify-center text-base hover:bg-blue-100 transition focus:ring-2 focus:ring-blue-400 focus:shadow-lg"
                                >
                                  🗑️
                                </button>
                              </div>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
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
            <AddNotes onClose={() => setShowAddModal(false)} categories={categories} />
          </div>
        </div>
      )}
    </div>
  );
}

// Tailwind custom animations (add to your global CSS if not present):
// .animate-note-in { animation: noteIn 0.4s cubic-bezier(.4,2,.6,1) both; }
// .animate-note-out { animation: noteOut 0.3s cubic-bezier(.4,2,.6,1) both; }
// .animate-slide-underline { animation: slideUnderline 0.3s cubic-bezier(.4,2,.6,1) both; }
// .animate-tape-wiggle { animation: tapeWiggle 2s infinite alternate; }
// .animate-tape-peel { animation: tapePeel 0.5s both; }
// .ripple { position: absolute; border-radius: 50%; background: rgba(0,0,0,0.08); animation: ripple 0.5s linear; pointer-events: none; z-index: 10; }
// @keyframes noteIn { 0% { opacity: 0; transform: scale(0.8) translateY(40px);} 100% { opacity: 1; transform: scale(1) translateY(0);} }
// @keyframes noteOut { 0% { opacity: 1; transform: scale(1);} 100% { opacity: 0; transform: scale(0.7) translateY(40px);} }
// @keyframes slideUnderline { 0% { width: 0; opacity: 0;} 100% { width: 66%; opacity: 1;} }
// @keyframes tapeWiggle { 0% { transform: rotate(-2deg);} 100% { transform: rotate(2deg);} }
// @keyframes tapePeel { 0% { transform: rotate(0);} 100% { transform: rotate(-12deg) scaleY(0.8);} }
// @keyframes ripple { to { opacity: 0; transform: scale(2); } }