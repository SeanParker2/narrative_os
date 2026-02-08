import cron from 'node-cron';
import { ingestionService } from '../ingestion/ingestionService';
import { aiService } from '../ai/aiService';
import { clusteringService } from '../clustering/clusteringService';
import { indexingService } from '../indexing/indexingService';

export class SchedulerService {
  constructor() {
    this.init();
  }

  private init() {
    console.log('Initializing Scheduler Service...');

    // 1. Ingestion: Every 10 minutes
    // Note: IngestionService has its own internal cron, but unifying here is cleaner.
    // Assuming we remove internal scheduling from individual services or just call methods here.
    // For safety, I'll assume methods are exposed and safe to call.
    cron.schedule('*/10 * * * *', async () => {
      console.log('[Scheduler] Running Ingestion...');
      await ingestionService.ingestAll();
    });

    // 2. Narrative Extraction: Every 10 minutes (offset by 2 min to allow ingestion)
    cron.schedule('2-59/10 * * * *', async () => {
       console.log('[Scheduler] Running Narrative Extraction...');
       await aiService.processAllPending();
    });

    // 3. Clustering: Every hour
    cron.schedule('0 * * * *', async () => {
      console.log('[Scheduler] Running Clustering...');
      await clusteringService.runClustering();
    });

    // 4. Indexing: Every hour (offset by 5 min to allow clustering)
    cron.schedule('5 * * * *', async () => {
      console.log('[Scheduler] Running Indexing...');
      await indexingService.runIndexing();
    });

    // 5. Alerts: Every 5 minutes
    cron.schedule('*/5 * * * *', async () => {
       console.log('[Scheduler] Checking Alerts...');
       // alertService.checkAlerts(); // To be implemented
    });
  }
}

export const schedulerService = new SchedulerService();
