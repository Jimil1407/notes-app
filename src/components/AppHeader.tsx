import React from 'react';

export default function AppHeader({
  selectedFolder,
  setSelectedFolder,
  categories,
  activeCategory,
  setActiveCategory,
  onAddNote
}: {
  selectedFolder: string;
  setSelectedFolder: (folder: string) => void;
  categories: string[];
  activeCategory: string;
  setActiveCategory: (cat: string) => void;
  onAddNote: () => void;
}) {
  return (
    <header className="w-full bg-white shadow-md rounded-b-3xl px-6 pt-6 pb-2 flex flex-col gap-2">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <span className="text-4xl font-extrabold text-gray-900 tracking-tight" style={{letterSpacing: '-2px'}}>Your Notes</span>
        </div>
        <div className="flex items-center gap-4">
          <input
            type="text"
            placeholder="Search notes... / नोट्स खोजें..."
            className="px-4 py-2 rounded-lg bg-gray-100 border border-gray-300 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition w-48 shadow-sm"
          />
          <button className="relative p-2 rounded-full bg-gray-100 hover:bg-yellow-200 transition border border-gray-200 shadow">
            <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V4a2 2 0 10-4 0v1.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
        </div>
      </div>
      <div className="flex items-center gap-4 mb-2">
        <select
          className="px-3 py-1 rounded-lg bg-gray-100 border border-gray-300 text-gray-900 font-semibold focus:outline-none focus:ring-2 focus:ring-yellow-400 transition shadow-sm"
          value={selectedFolder}
          onChange={e => setSelectedFolder(e.target.value)}
        >
          {categories.filter(cat => cat !== 'All').map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`px-4 py-1 rounded-full border font-semibold transition-all duration-200 text-sm
                ${activeCategory === cat ? 'bg-yellow-300 text-gray-900 border-yellow-400 shadow' : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-yellow-200 hover:text-gray-900'}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat === 'All' ? '#All' : `#${cat}`}
            </button>
          ))}
        </div>
        <div className="flex-1" />
        <button
          className="ml-auto p-3 rounded-full bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-bold shadow-lg border-2 border-white text-2xl flex items-center justify-center transition-all duration-200"
          style={{boxShadow: '0 4px 16px 0 rgba(0,0,0,0.10)'}}
          onClick={onAddNote}
          title="Add Note (नोट जोड़ें)"
        >
          +
        </button>
      </div>
    </header>
  );
}
