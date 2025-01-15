import express from 'express';
import mysql from 'mysql2';
import multer from 'multer';
import cors from 'cors';
import bodyParser from 'body-parser';
import fs from 'fs';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Create an uploads directory if it doesn't exist
const uploadDir = process.env.UPLOAD_DIR || 'uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Configure Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); // Directory where files will be saved
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// Create MySQL connection using environment variables
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Connect to MySQL
db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    process.exit(1);
  }
  console.log('Connected to MySQL database');
});

// Route to handle file uploads
app.post('/api/upload', upload.array('files', 10), (req, res) => {
  const { name, socialMediaHandle } = req.body;
  const files = req.files;

  // Validate input
  if (!name || !socialMediaHandle) {
    return res.status(400).json({ message: 'Name and Social Media Handle are required' });
  }

  if (!files || files.length === 0) {
    return res.status(400).json({ message: 'No files were uploaded' });
  }

  // Insert user data into the 'users' table
  const userQuery = 'INSERT INTO users (name, social_media_handle) VALUES (?, ?)';
  db.query(userQuery, [name, socialMediaHandle], (err, result) => {
    if (err) {
      console.error('Error inserting user:', err);
      return res.status(500).json({ message: 'Error saving user data' });
    }

    const userId = result.insertId;

    // Insert file data into the 'files' table
    const fileQuery = 'INSERT INTO files (user_id, filename, path, size) VALUES (?, ?, ?, ?)';
    files.forEach((file) => {
      db.query(fileQuery, [userId, file.filename, file.path, file.size], (err) => {
        if (err) {
          console.error('Error inserting file data:', err);
          return res.status(500).json({ message: 'Error saving file data' });
        }
      });
    });

    // Respond with success
    res.status(200).json({
      message: 'Form submitted successfully!',
      data: {
        name,
        socialMediaHandle,
        files: files.map((file) => ({
          filename: file.filename,
          path: file.path,
          size: file.size,
        })),
      },
    });
  });
});

app.get('/api/dashboard', (req, res) => {
  const query = `
    SELECT u.id, u.name, u.social_media_handle, f.filename, f.path, f.size, f.uploaded_at
    FROM users u
    LEFT JOIN files f ON u.id = f.user_id
    ORDER BY u.created_at DESC;
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching data:', err);
      return res.status(500).json({ message: 'Error fetching data' });
    }

    const users = {};

    results.forEach((row) => {
      if (!users[row.id]) {
        users[row.id] = {
          name: row.name,
          social_media_handle: row.social_media_handle,
          files: [],
        };
      }
      if (row.filename) {
        users[row.id].files.push({
          filename: row.filename,
          path: row.path,
          size: row.size,
          uploaded_at: row.uploaded_at,
        });
      }
    });

    res.json(Object.values(users));
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
