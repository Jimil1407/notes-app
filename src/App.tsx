import './App.css'
import ShowNotes from './components/shownotes'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import AuthPage from './components/authPage'
import { useState } from 'react'

function App() {
  const [selectedFolder, setSelectedFolder] = useState('Personal');
  const [categories] = useState(['All', 'work', 'Personal', 'Fitness']);
  const [activeCategory, setActiveCategory] = useState('All');
  const [showAddModal, setShowAddModal] = useState(false);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={
          <ShowNotes 
            selectedFolder={selectedFolder}
            setSelectedFolder={setSelectedFolder}
            categories={categories}
            activeCategory={activeCategory}
            setActiveCategory={setActiveCategory}
            showAddModal={showAddModal}
            setShowAddModal={setShowAddModal}
          />
        } />
        <Route path="/auth" element={<AuthPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App