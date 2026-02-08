import prisma from '../db/client';
import computeCosineSimilarity from 'compute-cosine-similarity';

export class ClusteringService {
  
  public async runClustering() {
    console.log("Starting Vector Clustering Job...");

    // 1. Fetch recent units with embeddings
    const since = new Date(Date.now() - 24 * 60 * 60 * 1000); // 24h ago
    
    const units = await prisma.narrativeUnit.findMany({
      where: {
        timestamp: { gte: since },
        embedding: { not: null }
      },
      select: { id: true, title: true, summary: true, embedding: true, keywords: true }
    });
    
    console.log(`Fetched ${units.length} vectorized units for clustering.`);

    if (units.length === 0) return;

    // 2. Vector Clustering (DBSCAN-lite / Greedy Threshold)
    // Since we don't have a vector DB, we do in-memory clustering.
    // O(N^2) complexity, but N is small (daily news count ~100-500).
    // Threshold: 0.85 cosine similarity implies very close semantic meaning.
    
    const SIMILARITY_THRESHOLD = 0.85;
    const clusters: { name: string, unitIds: string[] }[] = [];
    const assignedUnitIds = new Set<string>();

    // Helper to parse embedding string
    const getVector = (u: any): number[] => JSON.parse(u.embedding!);

    for (let i = 0; i < units.length; i++) {
        if (assignedUnitIds.has(units[i].id)) continue;

        const currentCluster = [units[i].id];
        assignedUnitIds.add(units[i].id);
        const vectorA = getVector(units[i]);

        for (let j = i + 1; j < units.length; j++) {
            if (assignedUnitIds.has(units[j].id)) continue;

            const vectorB = getVector(units[j]);
            const similarity = computeCosineSimilarity(vectorA, vectorB);

            if (similarity && similarity > SIMILARITY_THRESHOLD) {
                currentCluster.push(units[j].id);
                assignedUnitIds.add(units[j].id);
            }
        }

        // Only create cluster if significant enough (or keep singletons as "Emerging")
        // Naming strategy: Use the title of the first item (centroid) as the cluster name for now.
        // In a pro system, we'd ask LLM to generate a name for the cluster.
        clusters.push({
            name: units[i].title, // Temporary name
            unitIds: currentCluster
        });
    }

    console.log(`Generated ${clusters.length} semantic clusters.`);

    // 3. Save Clusters
    // Clear old clusters for this window? Or append?
    // For this MVP cycle, we create new clusters daily.
    
    // Optional: Ask AI to name the clusters properly
    // ... skipped for speed, using centroid title

    for (const cluster of clusters) {
      await prisma.narrativeCluster.create({
        data: {
          name: cluster.name,
          description: `Semantic cluster of ${cluster.unitIds.length} items.`,
          unit_ids: JSON.stringify(cluster.unitIds)
        }
      });
    }

    console.log("Vector Clustering Job Completed.");
  }
}

export const clusteringService = new ClusteringService();
