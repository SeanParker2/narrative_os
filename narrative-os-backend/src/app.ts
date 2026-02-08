import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import apiRoutes from './api/routes';
import './scheduler/schedulerService'; // Start scheduler

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

import { ingestionService } from './ingestion/ingestionService';
import { clusteringService } from './clustering/clusteringService';
import { indexingService } from './indexing/indexingService';

app.use('/api', apiRoutes);

app.post('/api/ingest', async (req: Request, res: Response) => {
  try {
    console.log("Manual ingestion triggered");
    await ingestionService.ingestAll();
    console.log("Manual clustering triggered");
    await clusteringService.runClustering();
    console.log("Manual indexing triggered");
    await indexingService.runIndexing();
    res.json({ status: 'Full pipeline completed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Pipeline failed' });
  }
});

app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
