/**
 * Noise Filter Service
 * Acts as a "Gatekeeper" to prevent low-value or irrelevant text from hitting the expensive AI API.
 * Uses local heuristics (Regex, Keywords, Length checks).
 */
export class NoiseFilter {

    // Keywords that indicate low informational value for macro analysis
    private static SPAM_KEYWORDS = [
        "广告", "优惠", "促销", "点击链接", "关注公众号", 
        "免责声明", "风险提示", "仅供参考", "不构成投资建议",
        "advertisement", "subscribe", "promo", "discount"
    ];

    // Keywords for routine, low-impact market noise
    private static NOISE_KEYWORDS = [
        "股价异动", "盘中异动", "快速拉升", "大宗交易", // Routine volatility
        "融资净买入", "龙虎榜", // Routine data dumps
        "报", "元", "跌", "涨" // If title is just "Stock X rose Y%", usually noise unless accompanied by reason
    ];

    /**
     * Checks if the text is worth processing by AI.
     * @returns true if valid, false if noise
     */
    public isWorthAnalyzing(text: string): boolean {
        if (!text) return false;

        // 1. Length Check
        // Too short texts usually lack context for narrative analysis
        if (text.length < 20) {
            console.log(`[NoiseFilter] Skipped: Too short (${text.length} chars)`);
            return false;
        }

        // 2. Spam Check
        for (const kw of NoiseFilter.SPAM_KEYWORDS) {
            if (text.includes(kw)) {
                console.log(`[NoiseFilter] Skipped: Spam keyword detected (${kw})`);
                return false;
            }
        }

        // 3. Routine Noise Check (Heuristic)
        // If it matches "Stock X rose Y%" pattern without much else, skip it.
        // Simple regex for "Stock Code + Number + %"
        // (This is a simplified example, can be tuned)
        let noiseScore = 0;
        for (const kw of NoiseFilter.NOISE_KEYWORDS) {
            if (text.includes(kw)) noiseScore++;
        }
        
        // If it has multiple noise keywords and is short, it's likely just a ticker update
        if (noiseScore >= 2 && text.length < 50) {
             console.log(`[NoiseFilter] Skipped: High noise score`);
             return false;
        }

        return true;
    }
}

export const noiseFilter = new NoiseFilter();
