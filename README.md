# Notes App

A modern full-stack notes application built with React, TypeScript, and Vite on the frontend, and Express with Bun runtime and PostgreSQL on the backend.

> **Note**: This project is actively maintained and contributions are welcome!

## ✨ Features

- 🔐 **JWT Authentication** - Secure user authentication with JSON Web Tokens
- 📝 **CRUD Operations** - Create, read, update, and delete notes
- 🏷️ **Category Management** - Organize notes with custom categories
- 🔍 **Fast Search** - ILIKE-based search functionality for quick note retrieval
- 📱 **Responsive Design** - Works seamlessly across all devices
- ⚡ **Fast Performance** - Built with Vite and Bun for optimal speed
- 🎨 **Modern UI** - Clean interface designed with Tailwind CSS
- 🔄 **State Management** - Efficient state management with Recoil

## 🛠️ Tech Stack

### Frontend
- **React** - UI library
- **TypeScript** - Type safety and better developer experience
- **Vite** - Fast build tool and dev server
- **Recoil** - State management
- **Tailwind CSS** - Utility-first CSS framework

### Backend
- **Express.js** - Web framework
- **Bun** - JavaScript runtime (faster than Node.js)
- **PostgreSQL** - Relational database
- **JWT** - Authentication

## 🚀 Quick Start

### Prerequisites
- [Bun](https://bun.sh/) (latest version)
- [PostgreSQL](https://www.postgresql.org/) (v12 or higher)
- [Git](https://git-scm.com/)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Jimil1407/notes-app.git
   cd notes-app
   ```

2. **Install dependencies**
   ```bash
   # Install frontend dependencies
   bun install
   
   # Install backend dependencies
   cd backend
   bun install
   ```

3. **Environment Setup**
   
   Create a `.env` file in the backend directory:
   ```env
   # Database Configuration
   DATABASE_URL=postgresql://username:password@localhost:5432/notes_app
