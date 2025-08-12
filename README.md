# Notes App

A modern full-stack notes application built with React, TypeScript, and Vite on the frontend, and Express with Bun runtime and PostgreSQL on the backend.

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
   
   # JWT Configuration
   JWT_SECRET=your-super-secret-jwt-key-here
   JWT_EXPIRES_IN=7d
   
   # Server Configuration
   PORT=5000
   NODE_ENV=development
   ```

4. **Database Setup**
   ```bash
   # Create PostgreSQL database
   createdb notes_app
   
   # Run database migrations (if you have them)
   # cd backend && bun run migrate
   ```

5. **Start the Development Servers**
   
   **Backend (Terminal 1):**
   ```bash
   cd backend
   bun run dev
   ```
   
   **Frontend (Terminal 2):**
   ```bash
   bun run dev
   ```

6. **Access the Application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000

## 🐳 Docker Setup

For easy deployment, you can use Docker Compose:

```bash
# Clone and navigate to project
git clone https://github.com/Jimil1407/notes-app.git
cd notes-app

# Start with Docker Compose
docker-compose up -d

# Access the app at http://localhost:3000
```

### docker-compose.yml
```yaml
version: '3.8'

services:
  frontend:
    build: .
    ports:
      - "3000:3000"
    depends_on:
      - backend
    environment:
      - VITE_API_URL=http://localhost:5000
  
  backend:
    build: ./backend
    ports:
      - "5000:5000"
    depends_on:
      - postgres
    environment:
      - DATABASE_URL=postgresql://notes_user:notes_password@postgres:5432/notes_app
      - JWT_SECRET=your-jwt-secret
      - PORT=5000
  
  postgres:
    image: postgres:15
    environment:
      - POSTGRES_DB=notes_app
      - POSTGRES_USER=notes_user
      - POSTGRES_PASSWORD=notes_password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

volumes:
  postgres_data:
```

## 📖 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user

### Notes Endpoints
- `GET /api/notes` - Get all notes for authenticated user
- `GET /api/notes/:id` - Get specific note
- `POST /api/notes` - Create new note
- `PUT /api/notes/:id` - Update note
- `DELETE /api/notes/:id` - Delete note
- `GET /api/notes/search?q=query` - Search notes

### Categories Endpoints
- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create new category
- `PUT /api/categories/:id` - Update category
- `DELETE /api/categories/:id` - Delete category

## 🏗️ Project Structure

```
notes-app/
├── src/                    # Frontend source code
│   ├── components/         # Reusable React components
│   ├── pages/             # Page components
│   ├── hooks/             # Custom React hooks
│   ├── store/             # Recoil state management
│   ├── utils/             # Utility functions
│   ├── types/             # TypeScript type definitions
│   └── styles/            # Global styles
├── backend/               # Backend source code
│   ├── src/
│   │   ├── controllers/   # Route controllers
│   │   ├── models/        # Database models
│   │   ├── routes/        # API routes
│   │   ├── middleware/    # Custom middleware
│   │   └── utils/         # Backend utilities
│   └── package.json
├── public/                # Static assets
├── docker-compose.yml     # Docker configuration
└── README.md
```

## 🧪 Testing

```bash
# Run frontend tests
bun run test

# Run backend tests
cd backend && bun run test

# Run e2e tests
bun run test:e2e
```

## 🚀 Deployment

### Production Build

```bash
# Build frontend
bun run build

# Build backend
cd backend && bun run build
```

### Environment Variables for Production

Make sure to set these environment variables in your production environment:

- `DATABASE_URL` - Production PostgreSQL connection string
- `JWT_SECRET` - Strong JWT secret key
- `NODE_ENV=production`
- `PORT` - Server port (default: 5000)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Jimil Patel** - [GitHub](https://github.com/Jimil1407)

## 🙏 Acknowledgments

- Built with [Vite](https://vitejs.dev/) for lightning-fast development
- Powered by [Bun](https://bun.sh/) for optimal performance
- Styled with [Tailwind CSS](https://tailwindcss.com/) for rapid UI development
- State management with [Recoil](https://recoiljs.org/) for efficient React state

---

⭐ **Star this repository if you find it helpful!**
