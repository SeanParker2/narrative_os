import cron from 'node-cron';
import prisma from '../db/client';
import { fetch36Kr, fetchCailianshe, fetchSinaFinance, NewsItem } from './news';
import { aiService } from '../ai/aiService';
import { clusteringService } from '../clustering/clusteringService';
import { researchAgent } from '../ai/researchAgent';
import { curatorService } from '../ai/curatorService';
import prisma from '../db/client';

/**
 * Main Ingestion Service
 * - Schedules fetching tasks
 * - Deduplicates
 * - Cleans text
 * - Saves to DB (RawText)
 * - Triggers Curator -> AI Processing
 */
export class IngestionService {
  
  constructor() {
    this.scheduleJobs();
  }

  private scheduleJobs() {
    // Run at 7:00, 12:00, 16:00, 20:00
    cron.schedule('0 7,12,16,20 * * *', async () => {
      console.log('Running scheduled batch ingestion job...');
      await this.ingestAll();
    });
    console.log('Ingestion cron job scheduled (07:00, 12:00, 16:00, 20:00).');
  }

  public async ingestAll() {
    const sources = [fetch36Kr, fetchCailianshe, fetchSinaFinance];
    
    console.log("Step 1: Fetching Raw Data...");
    // 1. Fetch & Save Only (No immediate AI processing)
    for (const fetcher of sources) {
      await fetcher(); // This saves to RawText table internally
    }

    console.log("Step 2: AI Curation (The Editor-in-Chief)...");
    // 2. Trigger Curator to select best stories
    const selectedIds = await curatorService.curateRecentItems();
    
    console.log(`Step 3: Processing ${selectedIds.length} selected stories...`);
    // 3. Process only the selected ones
    for (const id of selectedIds) {
        await aiService.processRawText(id);
    }

    // 4. Trigger Clustering (Once all new items are vectorized)
    console.log("Ingestion complete. Triggering clustering...");
    await clusteringService.runClustering();
    
    // 5. Trigger Deep Research on Top Cluster
    // Find the largest cluster from today
    console.log("Identifying top narrative for Deep Research...");
    const topCluster = await prisma.narrativeCluster.findFirst({
        orderBy: { id: 'desc' } // Approximation for 'latest big one'
    });

    if (topCluster) {
        // THRESHOLD CHECK: Only research if the cluster is substantial (> 5 items)
        const unitIds = JSON.parse(topCluster.unit_ids);
        if (Array.isArray(unitIds) && unitIds.length > 5) {
            console.log(`Triggering Auto-Research for large cluster: ${topCluster.name} (${unitIds.length} items)`);
            // Run async, don't block
            researchAgent.conductDeepResearch(topCluster.id).then(() => {
                console.log("Deep Research background job finished.");
            });
        } else {
            console.log(`Skipping Auto-Research: Cluster too small (${unitIds.length} items)`);
        }
    }

    console.log("Batch processing pipeline finished.");
  }
  
  // Deprecated: Internal method previously used for stream processing
  // private async processItems(items: NewsItem[]) { ... } 
}

// Start the service when this file is imported (singleton pattern or explicit start)
export const ingestionService = new IngestionService();
