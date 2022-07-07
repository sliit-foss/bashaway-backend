import express from 'express';
import compression from 'compression';
import helmet from 'helmet';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './database';
import routes from './routes/index.routes';

dotenv.config();

const app = express();

app.use(helmet());

app.use(compression());

app.use(cors());

app.use(express.json({ limit: '1mb' }));

app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => res.status(200).json({ message: 'Bashaway Server Up and Running' }));

app.use('/api', routes);

connectDB();

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Bashaway server successfully started on port ${port}`)
})
