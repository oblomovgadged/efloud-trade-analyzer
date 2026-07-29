import fs from 'fs/promises';
import path from 'path';
import type { TweetAnalysis, AnalysisFilters } from './types';

const DATA_FILE = path.join(process.cwd(), 'src', 'data', 'analyses.json');

async function ensureFileExists() {
  try {
    await fs.access(DATA_FILE);
  } catch {
    const dir = path.dirname(DATA_FILE);
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(DATA_FILE, '[]', 'utf-8');
  }
}

export async function getAllAnalyses(): Promise<TweetAnalysis[]> {
  await ensureFileExists();
  try {
    const data = await fs.readFile(DATA_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading analyses data:', err);
    return [];
  }
}

export async function getAnalysisById(id: string): Promise<TweetAnalysis | null> {
  const all = await getAllAnalyses();
  return all.find(a => a.id === id) || null;
}

export async function saveAnalysis(analysis: TweetAnalysis): Promise<void> {
  const all = await getAllAnalyses();
  // Filter out duplicate if existing id
  const existingIndex = all.findIndex(a => a.id === analysis.id);
  if (existingIndex >= 0) {
    all[existingIndex] = analysis;
  } else {
    all.unshift(analysis); // newest first
  }
  await fs.writeFile(DATA_FILE, JSON.stringify(all, null, 2), 'utf-8');
}

export async function deleteAnalysis(id: string): Promise<boolean> {
  const all = await getAllAnalyses();
  const filtered = all.filter(a => a.id !== id);
  if (filtered.length === all.length) return false;
  await fs.writeFile(DATA_FILE, JSON.stringify(filtered, null, 2), 'utf-8');
  return true;
}

export async function getFilteredAnalyses(filters: AnalysisFilters): Promise<TweetAnalysis[]> {
  let analyses = await getAllAnalyses();
  
  if (filters.instrument && filters.instrument !== 'ALL') {
    const target = filters.instrument.toUpperCase();
    analyses = analyses.filter(a => 
      a.analysis.instruments?.some(i => i.toUpperCase() === target) ||
      a.analysis.primaryInstrument?.toUpperCase() === target
    );
  }

  if (filters.trader && filters.trader !== 'ALL') {
    analyses = analyses.filter(a => a.traderUsername.toLowerCase() === filters.trader?.toLowerCase());
  }

  if (filters.bias && filters.bias !== ('ALL' as any)) {
    analyses = analyses.filter(a => a.analysis.bias === filters.bias);
  }

  return analyses;
}
