/**
 * Cleaning Module
 * Responsibilities:
 * - Remove HTML tags
 * - Remove Ad texts
 * - Sentence splitting (basic)
 * - Standardize whitespace
 */

export function cleanText(text: string): string {
  if (!text) return '';

  // 1. Remove HTML tags
  let cleaned = text.replace(/<[^>]*>/g, '');

  // 2. Remove common ad phrases (Chinese context)
  const adPhrases = [
    '扫描二维码',
    '关注公众号',
    '版权所有',
    '点击阅读原文',
    'Scan QR code',
    'All rights reserved'
  ];
  
  adPhrases.forEach(phrase => {
    cleaned = cleaned.split(phrase).join('');
  });

  // 3. Standardize whitespace (remove excessive spaces/newlines)
  cleaned = cleaned.replace(/\s+/g, ' ').trim();

  // 4. Basic formatting (optional: ensure period/spacing consistency)
  // For now, just returning the cleaned string is sufficient for AI processing.

  return cleaned;
}
