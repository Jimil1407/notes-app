import axios from "axios"
import { notesAtom } from "./recoil/atom"
import { useState } from "react"
import { useRecoilState } from "recoil"

interface AddNotesProps {
  onClose: () => void;
  categories?: string[];
}

const DEFAULT_CATEGORIES = ["Personal", "Work", "Fitness", "Other"];

export default function AddNotes({ onClose, categories = DEFAULT_CATEGORIES }: AddNotesProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [notesState, setNotesState] = useRecoilState(notesAtom);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [category, setCategory] = useState(categories[0] || 'Personal');
  const [loading, setLoading] = useState(false);

  // Ripple effect for button
  function createRipple(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
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

  // Handlers
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
    if (errorMsg) setErrorMsg('');
  };
  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(e.target.value);
    if (errorMsg) setErrorMsg('');
  };
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCategory(e.target.value);
  };

  const handleAddNote = async () => {
    if (!title.trim() || !description.trim()) {
      setErrorMsg('Title and description are required');
      return;
    }
    setLoading(true);
    const token = localStorage.getItem('token');
    try {
      await axios.post('http://localhost:3001/submit', { title, description, category }, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const fetchResponse = await axios.get('http://localhost:3001/showNotes', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setNotesState(fetchResponse.data);
      setTitle('');
      setDescription('');
      setCategory(categories[0] || 'Personal');
      setErrorMsg('');
      setSuccessMsg('Note added successfully!');
      setTimeout(() => setSuccessMsg(''), 2000);
      setTimeout(() => onClose(), 1200);
    } catch (error: any) {
      let message = 'Error adding note.';
      if (error.response && error.response.data && error.response.data.error) {
        message = error.response.data.error;
      }
      setErrorMsg(message);
      setTimeout(() => setErrorMsg(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      className="w-full max-w-2xl mx-auto bg-white border-2 border-gray-200 rounded-3xl shadow-2xl p-6 md:p-10 flex flex-col gap-6 animate-fade-in"
      onSubmit={e => { e.preventDefault(); handleAddNote(); }}
    >
      <h2 className="text-2xl font-bold text-blue-700 mb-2 font-poppins">Add a Note</h2>
      {errorMsg && (
        <div className="w-full text-center bg-red-100 text-red-700 border border-red-300 rounded p-2 font-semibold animate-fade-in">
          {errorMsg}
        </div>
      )}
      {successMsg && (
        <div className="w-full text-center bg-blue-50 text-blue-700 border border-blue-200 rounded p-2 font-semibold animate-fade-in">
          {successMsg}
        </div>
      )}
      {/* Form fields: two-column on md+ screens */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Category */}
        <div className="flex flex-col gap-2">
          <label htmlFor="add-category" className="text-sm font-medium text-gray-700">Category</label>
          <select
            id="add-category"
            value={category}
            onChange={handleCategoryChange}
            className="px-4 py-3 rounded-lg bg-white border-2 border-gray-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400 transition font-poppins"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
        {/* Title */}
        <div className="flex flex-col gap-2">
          <label htmlFor="add-title" className="text-sm font-medium text-gray-700">Title</label>
          <input
            id="add-title"
            type="text"
            placeholder="Enter note title"
            value={title}
            onChange={handleTitleChange}
            className="px-4 py-3 rounded-lg bg-white border-2 border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 transition font-poppins focus:shadow-lg"
          />
        </div>
        {/* Description (spans both columns on desktop) */}
        <div className="flex flex-col gap-2 md:col-span-2">
          <label htmlFor="add-description" className="text-sm font-medium text-gray-700">Description</label>
          <textarea
            id="add-description"
            placeholder="Enter note description"
            value={description}
            onChange={handleDescriptionChange}
            rows={4}
            className="px-4 py-3 rounded-lg bg-white border-2 border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 transition resize-none font-nunito focus:shadow-lg"
          />
        </div>
      </div>
      {/* Add Note Button */}
      <div className="flex flex-col md:flex-row md:justify-end gap-4 mt-2">
        <button
          type="submit"
          disabled={loading}
          onClick={createRipple}
          className="w-full md:w-auto px-8 py-3 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-bold shadow transition text-lg disabled:opacity-60 disabled:cursor-not-allowed border-2 border-blue-500 font-poppins relative overflow-hidden"
        >
          {loading ? 'Adding...' : 'Add Note'}
        </button>
      </div>
    </form>
  );
}

// Add this to your global CSS for ripple effect:
// .ripple { position: absolute; border-radius: 50%; background: rgba(0,0,0,0.08); animation: ripple 0.5s linear; pointer-events: none; z-index: 10; }
// @keyframes ripple { to { opacity: 0; transform: scale(2); } }