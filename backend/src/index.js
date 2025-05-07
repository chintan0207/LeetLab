import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth.routes.js';
import problemsRoutes from './routes/problem.routes.js';
import excecutionRoutes from './routes/execute-code.routes.js';
import submissionRoutes from './routes/submission.routes.js';
import playlistRoutes from './routes/playlist.routes.js';

dotenv.config();

const app = express();

const port = process.env.PORT || 8080;

app.use(express.json());
app.use(cookieParser());

app.get('/', (req, res) => {
  res.send('Hello guys welcome to the leetlab 🎉');
});
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/problems', problemsRoutes);
app.use('/api/v1/execute-code', excecutionRoutes);
app.use('/api/v1/submission', submissionRoutes);
app.use('/api/v1/playlist', playlistRoutes);


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
