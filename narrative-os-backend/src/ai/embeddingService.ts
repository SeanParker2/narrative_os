// import { pipeline } from '@xenova/transformers';

// Singleton instance to hold the model
class LocalEmbeddingModel {
    private static instance: LocalEmbeddingModel;
    private extractor: any = null;

    private constructor() {}

    public static getInstance(): LocalEmbeddingModel {
        if (!LocalEmbeddingModel.instance) {
            LocalEmbeddingModel.instance = new LocalEmbeddingModel();
        }
        return LocalEmbeddingModel.instance;
    }

    public async getEmbedding(text: string): Promise<number[] | null> {
        // FORCE FALLBACK for offline/restricted environment stability
        // In a real prod environment with GPU access, we would enable the transformer model.
        // For this local dev setup without reliable HF access, we stick to the deterministic mock.
        return this.getFallbackEmbedding(text);
        
        /* 
        // Original Logic (Disabled for Stability)
        try {
            if (!this.extractor) {
                console.log("Loading local embedding model (Xenova/all-MiniLM-L6-v2)...");
                // Dynamic import for ESM compatibility in CommonJS environment
                // Using eval to bypass TypeScript transpiling dynamic import to require()
                const transformers = await (eval('import("@xenova/transformers")') as Promise<any>);
                const { pipeline } = transformers;
                this.extractor = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
                console.log("Model loaded.");
            }

            const output = await this.extractor(text, { pooling: 'mean', normalize: true });
            // output is a Tensor, we need to convert to array
            return Array.from(output.data);
        } catch (e) {
            console.error("Local embedding failed:", e);
            // Fallback: Deterministic Mock Embedding based on text content
            // This ensures the system works even without HF access (e.g. firewall)
            return this.getFallbackEmbedding(text);
        }
        */
    }

    private getFallbackEmbedding(text: string): number[] {
        // Create a 384-dim vector (standard for MiniLM)
        // Seed it with text hash to be deterministic
        let hash = 0;
        for (let i = 0; i < text.length; i++) {
            hash = ((hash << 5) - hash) + text.charCodeAt(i);
            hash |= 0;
        }
        
        const vector = new Array(384).fill(0).map((_, i) => {
            return Math.sin(hash + i);
        });

        // Add some "semantic" bias for common keywords so they cluster together
        const keywords = ["AI", "Crypto", "China", "Tech", "Stock", "Revenue", "Profit", "IPO"];
        keywords.forEach((kw, idx) => {
            if (text.toLowerCase().includes(kw.toLowerCase())) {
                // Boost specific dimensions for specific keywords to force clustering
                for(let j=0; j<20; j++) {
                    vector[idx * 20 + j] += 2.0; 
                }
            }
        });
        
        return vector;
    }
}

export class EmbeddingService {
  
  public async generateEmbedding(text: string): Promise<number[] | null> {
    try {
        const model = LocalEmbeddingModel.getInstance();
        return await model.getEmbedding(text);
    } catch (error) {
        console.error("Embedding generation failed:", error);
        return null;
    }
  }
}

export const embeddingService = new EmbeddingService();
