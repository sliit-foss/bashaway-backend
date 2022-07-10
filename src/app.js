import express from 'express';
import compression from 'compression';
import helmet from 'helmet';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './database';
import routes from './routes/index.routes';
import { isCelebrateError } from 'celebrate';
import { makeResponse } from "./utils/response";
import logger from "./utils/logger";

dotenv.config();

const app = express();

app.use(helmet());

app.use(compression());

app.use(cors());

app.use(express.json({ limit: '1mb' }));

app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => res.status(200).json({ message: 'Bashaway Server Up and Running' }));

app.use('/api', routes);

app.use((err, req, res, next) => {
    logger.error(`Error: ${err.message} | Stack: ${err.stack}`);
    if (isCelebrateError(err)) {
        for (const [key, value] of err.details.entries()) {
            return makeResponse({ res, status: 422, message: value.details[0].message });
        }
    } else return makeResponse({ res, status: 500, message: "Just patching things up. This'll be over in a jiffy!" });
});

connectDB();

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Bashaway server successfully started on port ${port}`)
})
