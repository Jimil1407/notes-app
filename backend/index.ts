import express from 'express';
import { Client } from 'pg'
import cors from 'cors'
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import type { Request, Response, NextFunction } from 'express';

const app = express()
const pool = new Client({
    connectionString: process.env.DATABASE_URL,
})

app.use(express.json())
app.use(cors())
// Connect to database when server starts
pool.connect()
    .then(() => console.log('Connected to database'))
    .catch((err: any) => console.error('Database connection error:', err))

async function createTable(){
    const result = await pool.query(`
       CREATE TABLE IF NOT EXISTS notes(
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      title VARCHAR(20) NOT NULL,
      description VARCHAR(100) NOT NULL,
      date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      user_id UUID REFERENCES users(id) ON DELETE CASCADE,
      category VARCHAR(20) DEFAULT 'Personal'
    )`
    );
    console.log('notes Table created successfully')
}

async function createUsers(){
    const result = await pool.query(`
        CREATE TABLE IF NOT EXISTS users(
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        username VARCHAR(20) UNIQUE NOT NULL,
        password VARCHAR(100) NOT NULL 
        )`
    );
    console.log("users table created")
}

createUsers()
createTable()

app.post('/signup', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }
    try {
        const userCheck = await pool.query(`SELECT * FROM users WHERE username = $1`, [username]);
        if (userCheck.rows.length > 0) {
            return res.status(409).json({ error: 'User already exists' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        await pool.query('INSERT INTO users (username, password) VALUES ($1, $2)', [username, hashedPassword]);
        res.status(201).json({ message: 'User registered successfully' });
        
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Registration failed' });
    }
});


app.post('/signin', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }
    try {
       
        const userResult = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
        if (userResult.rows.length === 0) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        const user = userResult.rows[0];
        const valid = await bcrypt.compare(password, user.password);
        if (!valid) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) {
            throw new Error('JWT_SECRET environment variable is not set');
        }
        const token = jwt.sign({ userId: user.id, email: user.username }, jwtSecret, { expiresIn: '7d' });
        res.json({ token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Login failed' });
    }
});


interface AuthenticatedRequest extends Request {
    user?: any;
}

function authenticateToken(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.sendStatus(401);

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
        throw new Error('JWT_SECRET environment variable is not set');
    }

    jwt.verify(token, jwtSecret, (err: any, user: any) => {
        if (err) return res.sendStatus(403);
        (req as any).user = user;
        next();
    });
}

app.post('/submit', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
    try {
        const { title, description, category } = req.body;
        const userId = req.user.userId;
        if (!title || !description) {   
            return res.status(400).json({ error: 'Title and description are required' });
        }
        const result = await pool.query(
            `INSERT INTO notes (title, description, user_id, category) VALUES ($1, $2, $3, $4)`,
            [title, description, userId, category || 'Personal']
        );
        res.send('Note added successfully');
    } catch (error) {
        console.error('Error adding note:', error);
        res.status(500).send('Error adding note');
    }
});

app.get('/showNotes', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
    try {
        const userId = req.user.userId;
        const result = await pool.query(
            `SELECT * FROM notes WHERE user_id = $1`,
            [userId]
        );
        res.send(result.rows);
    } catch (error) {
        console.error('Error fetching notes:', error);
        res.status(500).send('Error fetching notes');
    }
});

app.delete('/delete/:id', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const userId = req.user.userId;
    // Only delete if the note belongs to the user
    const result = await pool.query(
        `DELETE FROM notes WHERE id = $1 AND user_id = $2`,
        [id, userId]
    );
    res.send('Note deleted successfully');
});

app.put('/update/:id', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const { title, description } = req.body;
    if (!title || !description) {
        return res.status(400).json({ error: 'Title and description are required' });
    }

    const userId = req.user.userId;
    try {
        await pool.query(
            "UPDATE notes SET title = $1, description = $2 WHERE id = $3 AND user_id = $4",
            [title, description, id, userId]
        );
        res.status(200).json({ message: "Note updated successfully" });
    } catch (err) {
        console.error(err);

        res.status(500).json({ error: "Failed to update note" });
    }
});

app.listen(3001, () => {
    console.log('Server is running on port 3001')
})
