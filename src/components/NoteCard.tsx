import React, { useState } from "react";
import { Circle, Edit, Trash2 } from "lucide-react"; // Using lucide-react for icons

interface NoteCardProps {
  note: {
    id: string;
    title: string;
    description: string;
    category: string;
    date: string;
  };
  getNoteColor: (noteId: string) => string;
  handleUpdateNote: (
    id: string,
    title: string,
    description: string
  ) => Promise<void>;
  handleDeleteNote: (id: string) => Promise<void>;
  deletingIds: string[];
  updateError: { [id: string]: string };
  setUpdateError: React.Dispatch<
    React.SetStateAction<{ [id: string]: string }>
  >;
  setNotesState: any; // You might want to define a more specific type for notesState
}

export default function NoteCard({
  note,
  getNoteColor,
  handleUpdateNote,
  handleDeleteNote,
  deletingIds,
  updateError,
  setUpdateError,
  setNotesState,
}: NoteCardProps) {
  const [editingId, setEditingId] = useState<string | null>(null);

  function createRipple(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    const target = e.currentTarget;
    const circle = document.createElement("span");
    const diameter = Math.max(target.clientWidth, target.clientHeight);
    const radius = diameter / 2;
    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${
      e.clientX - target.getBoundingClientRect().left - radius
    }px`;
    circle.style.top = `${
      e.clientY - target.getBoundingClientRect().top - radius
    }px`;
    circle.classList.add("ripple");
    const ripple = target.getElementsByClassName("ripple")[0];
    if (ripple) ripple.remove();
    target.appendChild(circle);
  }

  return (
    <div
      key={note.id}
      onClick={createRipple}
      className={`${getNoteColor(
        note.id
      )} p-6 rounded-3xl shadow-lg relative transform transition-transform duration-300 cursor-pointer group hover:scale-105 hover:-rotate-1 hover:shadow-2xl active:scale-95 sticky-note ${
        deletingIds.includes(note.id) ? "animate-note-out" : "animate-note-in"
      }`}
      style={{
        minHeight: "220px",
        fontFamily: "Poppins, Nunito, Inter, sans-serif",
        overflow: "hidden",
      }}
    >
      {/* Tape-like element */}
      <div
        className="absolute left-1/2 -translate-x-1/2 -top-5 w-20 h-5 bg-gray-200 rounded opacity-80 z-10 border-b-2 border-gray-300 animate-tape-wiggle group-hover:animate-tape-peel"
        style={{ boxShadow: "0 2px 6px 0 rgba(0,0,0,0.10)" }}
      ></div>

      {/* Note icon */}
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
              setNotesState((prevNotes: any[]) =>
                prevNotes.map((n) =>
                  n.id === note.id ? { ...n, title: e.target.value } : n
                )
              );
              if (updateError[note.id])
                setUpdateError((prev) => ({
                  ...prev,
                  [note.id]: "",
                }));
            }}
            className="w-full p-3 text-base font-semibold bg-white rounded border-2 border-gray-200 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition focus:shadow-lg"
          />
          <textarea
            value={note.description}
            onChange={(e) => {
              setNotesState((prevNotes: any[]) =>
                prevNotes.map((n) =>
                  n.id === note.id
                    ? { ...n, description: e.target.value }
                    : n
                )
              );
              if (updateError[note.id])
                setUpdateError((prev) => ({
                  ...prev,
                  [note.id]: "",
                }));
            }}
            className="w-full p-3 text-base bg-white rounded border-2 border-gray-200 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition resize-none focus:shadow-lg"
            rows={4}
          />
          <div className="flex gap-3">
            <button
              onClick={() => {
                if (note.title && note.description) {
                  setUpdateError((prev) => ({
                    ...prev,
                    [note.id]: "",
                  }));
                  handleUpdateNote(note.id, note.title, note.description);
                  // setEditingId(null); // This was commented out, uncomment if you want to exit edit mode on save
                } else {
                  setUpdateError((prev) => ({
                    ...prev,
                    [note.id]: "Title and description are required",
                  }));
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
            <p className="text-sm text-gray-500 mb-2 font-nunito">
              {new Date((note as any).date || Date.now()).toLocaleDateString(
                "en-IN",
                {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                }
              )}
            </p>
            <div className="flex justify-between items-center">
              <div className="w-7 h-7 bg-gray-100 rounded-full flex items-center justify-center">
                <Circle size={16} className="text-gray-400" />
              </div>

              <div className="flex gap-2 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 translate-y-2 transition-all duration-200">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditingId(note.id);
                  }}
                  className="w-7 h-7 bg-gray-200 rounded-full flex items-center justify-center text-base hover:bg-blue-100 transition focus:ring-2 focus:ring-blue-400 focus:shadow-lg"
                >
                  <Edit size={16} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteNote(note.id);
                  }}
                  className="w-7 h-7 bg-gray-200 rounded-full flex items-center justify-center text-base hover:bg-blue-100 transition focus:ring-2 focus:ring-blue-400 focus:shadow-lg"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}