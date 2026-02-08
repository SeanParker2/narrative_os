import prisma from '../db/client';
import { calculateIndex } from './indexEngine';

export class IndexingService {
  
  public async runIndexing() {
    console.log("Starting Indexing Job...");

    // 1. Fetch all clusters (or active ones)
    const clusters = await prisma.narrativeCluster.findMany();

    for (const cluster of clusters) {
      // 2. Fetch associated units
      const unitIds = JSON.parse(cluster.unit_ids);
      const units = await prisma.narrativeUnit.findMany({
        where: {
          id: { in: unitIds }
        }
      });

      if (units.length === 0) continue;

      // 3. Calculate Metrics
      const metrics = calculateIndex(units);

      // 4. Save Index
      await prisma.narrativeIndex.create({
        data: {
          cluster_id: cluster.id,
          strength: metrics.strength,
          sentiment_score: metrics.sentiment_score,
          velocity: metrics.velocity,
          media_coverage: metrics.media_coverage,
          social_heat: metrics.social_heat,
          consistency: metrics.consistency,
          lifecycle: metrics.lifecycle
        }
      });
      console.log(`Indexed Cluster: ${cluster.name} (Strength: ${metrics.strength.toFixed(2)})`);
    }

    console.log("Indexing Job Completed.");
  }
}

export const indexingService = new IndexingService();
