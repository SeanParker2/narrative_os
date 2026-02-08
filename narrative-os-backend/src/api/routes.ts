import { Router, Request, Response } from 'express';
import prisma from '../db/client';

const router = Router();

// 1. GET /api/narratives - List all narratives with latest index
router.get('/narratives', async (req: Request, res: Response) => {
  try {
    const clusters = await prisma.narrativeCluster.findMany();
    const result = [];

    for (const cluster of clusters) {
      const latestIndex = await prisma.narrativeIndex.findFirst({
        where: { cluster_id: cluster.id },
        orderBy: { timestamp: 'desc' }
      });

      // Calculate derived fields
      const trend = latestIndex ? (latestIndex.velocity > 0.5 ? 'up' : latestIndex.velocity < -0.5 ? 'down' : 'stable') : 'stable';
      const sentiment = latestIndex ? (latestIndex.sentiment_score > 0.3 ? 'Bullish' : latestIndex.sentiment_score < -0.3 ? 'Bearish' : 'Neutral') : 'Neutral';

      // Fetch history for sparklines (Last 7 days)
      const history = await prisma.narrativeIndex.findMany({
          where: { cluster_id: cluster.id },
          orderBy: { timestamp: 'asc' },
          take: 7, // Limit to 7 data points for now
          select: { strength: true, timestamp: true }
      });

      result.push({
        id: cluster.id,
        name: cluster.name,
        strength: latestIndex ? Math.floor(latestIndex.strength) : 0,
        trend: trend,
        lifecycle: latestIndex?.lifecycle || 'Emerging',
        sources_count: latestIndex ? Math.floor(latestIndex.media_coverage + latestIndex.social_heat) : 0,
        sentiment: sentiment,
        divergence: latestIndex ? Math.floor((1 - latestIndex.consistency) * 100) : 0,
        market: 'Crypto', // Placeholder for now
        industry: 'Tech', // Placeholder for now
        created_at: latestIndex?.timestamp || new Date(),
        description: cluster.description,
        history: history.map(h => ({ value: h.strength })) // Add history
      });
    }

    res.json(result);
  } catch (error) {
    console.error("Error fetching narratives:", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// 2. GET /api/narratives/:id - Details
router.get('/narratives/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const narrativeId = String(id);
    const cluster = await prisma.narrativeCluster.findUnique({ where: { id: narrativeId } });
    
    if (!cluster) {
      res.status(404).json({ error: 'Narrative not found' });
      return;
    }

    const unitIds = JSON.parse(cluster.unit_ids);
    const units = await prisma.narrativeUnit.findMany({
      where: { id: { in: unitIds } }
    });
    
    const parsedUnits = units.map(u => ({
        ...u,
        entities: JSON.parse(u.entities),
        keywords: JSON.parse(u.keywords)
    }));

    const indexHistory = await prisma.narrativeIndex.findMany({
      where: { cluster_id: narrativeId },
      orderBy: { timestamp: 'asc' }
    });
    
    const latestIndex = indexHistory[indexHistory.length - 1];

    // Construct Narrative Detail response
    const narrativeDetail = {
        // Base Narrative fields
        id: cluster.id,
        name: cluster.name,
        strength: latestIndex ? Math.floor(latestIndex.strength) : 0,
        trend: latestIndex ? (latestIndex.velocity > 0.5 ? 'up' : latestIndex.velocity < -0.5 ? 'down' : 'stable') : 'stable',
        lifecycle: latestIndex?.lifecycle || 'Emerging',
        sources_count: latestIndex ? Math.floor(latestIndex.media_coverage + latestIndex.social_heat) : 0,
        sentiment: latestIndex ? (latestIndex.sentiment_score > 0.3 ? 'Bullish' : latestIndex.sentiment_score < -0.3 ? 'Bearish' : 'Neutral') : 'Neutral',
        divergence: latestIndex ? Math.floor((1 - latestIndex.consistency) * 100) : 0,
        market: 'Crypto',
        industry: 'Tech',
        created_at: latestIndex?.timestamp || new Date(),
        description: cluster.description,

        // Detail fields
        timeline: indexHistory.map(idx => ({
            date: idx.timestamp.toISOString().split('T')[0],
            value: idx.strength,
            sentiment: idx.sentiment_score,
            event: undefined
        })),
        evidence: parsedUnits.map(u => ({
            id: u.id,
            source: u.source_type,
            content: u.summary,
            timestamp: u.timestamp,
            sentiment: u.sentiment === 'Bullish' ? 'Positive' : u.sentiment === 'Bearish' ? 'Negative' : 'Neutral',
            url: '#' // We might need to store URL in NarrativeUnit if possible, but currently not in schema
        })),
        relations: {
            nodes: [], // TODO: Implement graph logic
            links: []
        },
        competitors: [], // TODO: Implement competitor logic
        radar_data: {
            volume: latestIndex?.media_coverage || 50,
            velocity: latestIndex?.velocity || 50,
            reach: latestIndex?.social_heat || 50,
            engagement: latestIndex?.social_heat || 50,
            credibility: latestIndex?.consistency || 50,
            persistence: 50
        }
    };

    res.json(narrativeDetail);
  } catch (error) {
    console.error("Error fetching narrative detail:", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// 3. GET /api/narratives/map - Real Knowledge Graph Data
router.get('/narratives/map', async (req: Request, res: Response) => {
  try {
    const clusters = await prisma.narrativeCluster.findMany();
    
    // Nodes: Clusters (Group 1) + Entities (Group 2)
    const nodes: any[] = [];
    const links: any[] = [];
    const entityCount: Record<string, number> = {};

    // 1. Create Cluster Nodes
    for (const cluster of clusters) {
      nodes.push({
        id: `cluster-${cluster.id}`,
        name: cluster.name,
        val: 20, // Base size for clusters
        group: 1, // 1 = Narrative
        color: '#4f46e5' // Indigo
      });

      // 2. Extract Entities from this cluster's units
      const unitIds = JSON.parse(cluster.unit_ids);
      const units = await prisma.narrativeUnit.findMany({
        where: { id: { in: unitIds } },
        select: { entities: true }
      });

      // Aggregate entities
      const clusterEntities = new Set<string>();
      units.forEach(u => {
          try {
              const ents = JSON.parse(u.entities);
              if (Array.isArray(ents)) {
                  ents.forEach((e: string) => {
                      if (e && e.length > 2) { // Filter noise
                          clusterEntities.add(e);
                          entityCount[e] = (entityCount[e] || 0) + 1;
                      }
                  });
              }
          } catch(e) {}
      });

      // 3. Create Links (Cluster -> Entity)
      // Limit to top entities per cluster to avoid graph explosion
      Array.from(clusterEntities).slice(0, 5).forEach(entity => {
          links.push({
              source: `cluster-${cluster.id}`,
              target: `entity-${entity}`,
              value: 1
          });
      });
    } // END loop over clusters

    // 4. Create Entity Nodes (only those that are linked)
    const linkedEntities = new Set(links.map(l => l.target));
    linkedEntities.forEach(eId => {
        const name = eId.replace('entity-', '');
        nodes.push({
            id: eId,
            name: name,
            val: 5 + (entityCount[name] || 0), // Size based on frequency
            group: 2, // 2 = Entity
            color: '#10b981' // Emerald
        });
    });

    // Ensure all nodes and links are valid objects
    const validNodes = nodes.filter(n => n && n.id);
    const validLinks = links.filter(l => l && l.source && l.target);

    res.json({ nodes: validNodes, links: validLinks });
  } catch (error) {
    console.error("Error generating graph:", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// 4. GET /api/alerts - Detect sudden changes
router.get('/alerts/shock', async (req: Request, res: Response) => {
  try {
    // Logic: Find indexes where strength changed > 20% in last 2 entries
    // This is a simplified mock implementation
    const alerts = [];
    
    const clusters = await prisma.narrativeCluster.findMany();
    for (const cluster of clusters) {
      const history = await prisma.narrativeIndex.findMany({
        where: { cluster_id: cluster.id },
        orderBy: { timestamp: 'desc' },
        take: 2
      });

      if (history.length === 2) {
        const [current, prev] = history;
        // Lowered threshold from 20 to 5 to make it more sensitive for real-world data testing
        if (Math.abs(current.strength - prev.strength) > 5) {
          const change = current.strength - prev.strength;
          alerts.push({
            id: `alert-${cluster.id}-${Date.now()}`,
            type: 'Shock',
            narrative_id: cluster.id,
            narrative_name: cluster.name,
            message: `Narrative "${cluster.name}" strength ${change > 0 ? 'surged' : 'dropped'} by ${Math.abs(change).toFixed(1)} points.`,
            severity: Math.abs(change) > 15 ? 'High' : 'Medium',
            timestamp: current.timestamp.toISOString()
          });
        }
      }
    }
    
    // NO MOCK DATA: Return empty array if no alerts.
    // Frontend handles empty state gracefully.
    res.json(alerts);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

import { briefingService } from '../ai/briefingService';

// 5. GET /api/briefing - AI Generated Market Outlook
router.get('/briefing', async (req: Request, res: Response) => {
    try {
        const briefing = await briefingService.generateDailyBriefing();
        res.json({ content: briefing, timestamp: new Date() });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

import { deepDiveService } from '../ai/deepDiveService';

// 6. GET /api/narratives/:id/report - Generate or fetch Deep Dive Report
router.get('/narratives/:id/report', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const narrativeId = String(id);
        // In a real app, we would cache this in the DB (e.g., NarrativeCluster.report field)
        // For this MVP, we generate on fly (or check simple in-memory cache if we had one)
        
        const report = await deepDiveService.generateReport(narrativeId);
        res.json({ content: report, timestamp: new Date() });
    } catch (error) {
        console.error("Report generation error:", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

import { ingestionService } from '../ingestion/ingestionService';
import { clusteringService } from '../clustering/clusteringService';
import { indexingService } from '../indexing/indexingService';

// 7. POST /api/system/refresh - Manual Trigger
router.post('/system/refresh', async (req: Request, res: Response) => {
    try {
        console.log("Manual Refresh Triggered");
        
        // Run in background, don't block response
        (async () => {
            try {
                // IngestAll now includes AI Extraction, Embedding, and Clustering internally
                // But we should double check if it calls clustering. 
                // In previous step we added clustering call to ingestAll.
                await ingestionService.ingestAll();
                
                // Indexing still needs to run to update stats
                await indexingService.runIndexing();
                console.log("Manual Refresh Completed");
            } catch (e) {
                console.error("Manual Refresh Failed", e);
            }
        })();

        res.json({ status: "Refresh started", timestamp: new Date() });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// 8. GET /api/entities/:name/analysis - Entity Dossier
router.get('/entities/:name/analysis', async (req: Request, res: Response) => {
    try {
        const { name } = req.params;
        const decodedName = decodeURIComponent(String(name));

        // Find all NarrativeUnits containing this entity
        // Note: This is a heavy query because entities are stored as JSON strings. 
        // In production, we'd use a dedicated Entity table or Full Text Search.
        // For MVP SQLite, we fetch all and filter (inefficient but works for small scale)
        const allUnits = await prisma.narrativeUnit.findMany({
            select: { id: true, entities: true, sentiment: true, title: true, raw_text_id: true }
        });

        const relatedUnits = allUnits.filter(u => {
            try {
                const entities = JSON.parse(u.entities) as string[];
                return entities.some(e => e.toLowerCase() === decodedName.toLowerCase());
            } catch { return false; }
        });

        if (relatedUnits.length === 0) {
            res.json({ name: decodedName, found: false });
            return;
        }

        // Calculate Stats
        const sentimentCounts = { Bullish: 0, Bearish: 0, Neutral: 0 };
        relatedUnits.forEach(u => {
            if (u.sentiment === 'Bullish') sentimentCounts.Bullish++;
            else if (u.sentiment === 'Bearish') sentimentCounts.Bearish++;
            else sentimentCounts.Neutral++;
        });

        // Find associated narratives
        // We need to map units back to clusters
        const allClusters = await prisma.narrativeCluster.findMany();
        const involvedNarratives = allClusters.filter(c => {
            const clusterUnitIds = JSON.parse(c.unit_ids) as string[];
            return relatedUnits.some(ru => clusterUnitIds.includes(relatedUnits[0].id)); // Just check intersection
        }).map(c => ({ id: c.id, name: c.name }));

        res.json({
            name: decodedName,
            found: true,
            mentions: relatedUnits.length,
            sentiment_bias: sentimentCounts.Bullish > sentimentCounts.Bearish ? 'Bullish' : 'Bearish',
            narratives: involvedNarratives.slice(0, 3), // Top 3
            recent_headlines: relatedUnits.slice(0, 3).map(u => u.title)
        });

    } catch (error) {
        console.error("Entity analysis error:", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

import { wargameService } from '../ai/wargameService';

// 9. GET /api/narratives/:id/wargame - Run Simulation
router.get('/narratives/:id/wargame', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const narrativeId = String(id);
        const simulation = await wargameService.runSimulation(narrativeId);
        res.json(simulation);
    } catch (error) {
        console.error("Wargame error:", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

import { researchAgent } from '../ai/researchAgent';

// 10. POST /api/research/trigger - Manually trigger deep research on a cluster
router.post('/research/trigger', async (req: Request, res: Response) => {
    try {
        const { clusterId } = req.body;
        if (!clusterId) {
            res.status(400).json({ error: 'clusterId is required' });
            return;
        }

        console.log(`Manual Research Triggered for Cluster ${clusterId}`);
        
        // Run in background
        researchAgent.conductDeepResearch(String(clusterId));

        res.json({ status: "Research started", timestamp: new Date() });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

export default router;
