import prisma from '../db/client';
import { extractNarrative } from './extractNarrative';
import { embeddingService } from './embeddingService';
import { noiseFilter } from './noiseFilter';

/**
 * AI Service
 * - Monitors raw_text table for unprocessed items
 * - Calls DeepSeek API
 * - Saves results to narrative_unit
 */
export class AiService {
  
  // Method to process a specific raw text ID
  // Can be called by IngestionService immediately after save, or run as a batch job
  public async processRawText(rawTextId: string) {
    try {
      const rawText = await prisma.rawText.findUnique({
        where: { id: rawTextId }
      });

      if (!rawText) {
        console.error(`RawText not found: ${rawTextId}`);
        return;
      }

      // Check if already processed (optional, if we want to enforce 1:1)
      const existingUnit = await prisma.narrativeUnit.findFirst({
        where: { raw_text_id: rawTextId }
      });

      if (existingUnit) {
        console.log(`Already processed: ${rawTextId}`);
        return;
      }

      // GATEKEEPER CHECK: Is this text worth paying for?
      // Legacy NoiseFilter is now redundant because CuratorService pre-selects items.
      // But we can keep it as a double-check if needed. 
      // For now, if Curator sent it, we assume it's good.
      /*
      if (!noiseFilter.isWorthAnalyzing(rawText.content)) {
          return;
      }
      */

      console.log(`Processing AI extraction for: ${rawTextId}`);
      
      // Parallel Execution: Extraction & Embedding
      const [extractionResult, embeddingResult] = await Promise.all([
          extractNarrative(rawText.content),
          embeddingService.generateEmbedding(rawText.content)
      ]);

      if (extractionResult) {
        await prisma.narrativeUnit.create({
          data: {
            raw_text_id: rawText.id,
            title: extractionResult.title,
            summary: extractionResult.summary,
            sentiment: extractionResult.sentiment,
            entities: JSON.stringify(extractionResult.entities),
            keywords: JSON.stringify(extractionResult.keywords),
            conflict: extractionResult.conflict,
            source_type: rawText.source_type,
            timestamp: rawText.timestamp,
            embedding: embeddingResult ? JSON.stringify(embeddingResult) : null
          }
        });
        console.log(`Narrative Unit created for: ${rawTextId} (Vectorized: ${!!embeddingResult})`);
      } else {
        console.warn(`Failed to extract narrative for: ${rawTextId}`);
      }

    } catch (error) {
      console.error(`Error in AiService processing ${rawTextId}:`, error);
    }
  }

  // Batch process all unprocessed texts (Optional utility)
  public async processAllPending() {
    // Logic to find raw_texts without corresponding narrative_units
    // Left as an exercise or for future implementation
  }
}

export const aiService = new AiService();
