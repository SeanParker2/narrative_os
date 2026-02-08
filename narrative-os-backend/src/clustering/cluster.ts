import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;
const CHAT_API_URL = 'https://api.deepseek.com/chat/completions'; 

// Unit interface now includes keywords for Jaccard similarity
export interface ClusterUnit {
    id: string;
    title: string;
    summary: string;
    keywords: string[];
}

/**
 * Calculate Jaccard Similarity between two sets of keywords
 */
function calculateJaccardSimilarity(setA: Set<string>, setB: Set<string>): number {
    const intersection = new Set([...setA].filter(x => setB.has(x)));
    const union = new Set([...setA, ...setB]);
    return intersection.size / union.size;
}

/**
 * Perform clustering on narrative units using Keyword Co-occurrence (Graph-based)
 */
export async function performClustering(units: ClusterUnit[]) {
  if (units.length === 0) return [];

  console.log(`Starting keyword-based clustering for ${units.length} units...`);

  // 1. Build Adjacency Matrix (Graph) based on Jaccard Similarity
  const adj: number[][] = Array.from({ length: units.length }, () => []);
  const visited = new Array(units.length).fill(false);
  const SIMILARITY_THRESHOLD = 0.15; // Tunable threshold: 15% keyword overlap

  // Pre-process keywords to sets for speed (lowercase)
  const unitSets = units.map(u => new Set(u.keywords.map(k => k.toLowerCase())));

  for (let i = 0; i < units.length; i++) {
      for (let j = i + 1; j < units.length; j++) {
          const score = calculateJaccardSimilarity(unitSets[i], unitSets[j]);
          if (score >= SIMILARITY_THRESHOLD) {
              adj[i].push(j);
              adj[j].push(i);
          }
      }
  }

  // 2. Find Connected Components (Clusters)
  const clusters = [];
  
  for (let i = 0; i < units.length; i++) {
      if (!visited[i]) {
          const component: number[] = [];
          const queue: number[] = [i];
          visited[i] = true;

          while (queue.length > 0) {
              const u = queue.shift()!;
              component.push(u);
              
              for (const v of adj[u]) {
                  if (!visited[v]) {
                      visited[v] = true;
                      queue.push(v);
                  }
              }
          }

          // Only keep clusters with at least 2 items, or keep singles?
          // For narrative detection, we usually want patterns (>=2)
          if (component.length >= 1) { 
              const clusterUnits = component.map(idx => units[idx]);
              
              // 3. Generate Cluster Name & Description using DeepSeek
              // Only generate for clusters > 1 to save tokens, or all?
              // Let's generate for all valid clusters.
              const theme = await generateClusterTheme(clusterUnits);
              
              clusters.push({
                  name: theme.name,
                  description: theme.description,
                  unitIds: clusterUnits.map(u => u.id)
              });
          }
      }
  }

  return clusters;
}

async function generateClusterTheme(units: ClusterUnit[]) {
  // Take a sample to avoid token limits (max 10 items)
  const sample = units.slice(0, 10).map(u => `- ${u.title} (Keywords: ${u.keywords.slice(0,3).join(', ')})`).join('\n');
  
  const prompt = `
  Analyze these news items and identify the common narrative theme.
  
  Items:
  ${sample}

  Output JSON only:
  {
    "name": "Short Theme Name (3-5 words, e.g. 'Crypto Regulation Tightens')",
    "description": "One sentence description of the narrative trend."
  }
  `;

  try {
    const response = await axios.post(
      CHAT_API_URL,
      {
        model: "deepseek-chat",
        messages: [
            { role: "system", content: "You are a helpful assistant that outputs JSON." },
            { role: "user", content: prompt }
        ],
        temperature: 0.3,
        response_format: { type: "json_object" }
      },
      { 
          headers: { 
              'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
              'Content-Type': 'application/json'
          },
          timeout: 20000 
      }
    );
    
    const content = response.data.choices?.[0]?.message?.content;
    const jsonStr = content.replace(/```json\n?|```/g, '').trim();
    return JSON.parse(jsonStr);
  } catch (e) {
    console.error("Theme generation failed", e);
    // Fallback if AI fails
    const topKeyword = units[0]?.keywords[0] || "Unknown";
    return { name: `${topKeyword} Narrative`, description: "Automated grouping based on keywords." };
  }
}
