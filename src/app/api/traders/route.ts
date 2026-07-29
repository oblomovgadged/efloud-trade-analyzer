import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import type { Trader } from '@/lib/types';

const TRADERS_FILE = path.join(process.cwd(), 'src', 'data', 'traders.json');

async function getTraders(): Promise<Trader[]> {
  try {
    const data = await fs.readFile(TRADERS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

async function saveTraders(traders: Trader[]): Promise<void> {
  const dir = path.dirname(TRADERS_FILE);
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(TRADERS_FILE, JSON.stringify(traders, null, 2), 'utf-8');
}

export async function GET() {
  const traders = await getTraders();
  return NextResponse.json({ success: true, data: traders });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    let username = (body.username || body.twitterUrl || '').trim();
    
    // Extract username from URL if needed
    const urlMatch = username.match(/(?:twitter\.com|x\.com)\/([\w]+)/i);
    if (urlMatch) username = urlMatch[1];
    username = username.replace(/^@/, '');

    if (!username) {
      return NextResponse.json({ success: false, error: 'Geçerli bir Twitter kullanıcı adı veya URL gerekli.' }, { status: 400 });
    }

    const traders = await getTraders();
    if (traders.some(t => t.username.toLowerCase() === username.toLowerCase())) {
      return NextResponse.json({ success: false, error: 'Bu trader zaten ekli.' }, { status: 409 });
    }

    const newTrader: Trader = {
      username,
      displayName: body.displayName || username,
      twitterUrl: `https://x.com/${username}`,
      addedAt: new Date().toISOString(),
      lastAnalyzedAt: null,
    };

    traders.push(newTrader);
    await saveTraders(traders);

    return NextResponse.json({ success: true, data: newTrader }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get('username');
    if (!username) {
      return NextResponse.json({ success: false, error: 'Username parametresi gerekli.' }, { status: 400 });
    }

    const traders = await getTraders();
    const filtered = traders.filter(t => t.username.toLowerCase() !== username.toLowerCase());
    if (filtered.length === traders.length) {
      return NextResponse.json({ success: false, error: 'Trader bulunamadı.' }, { status: 404 });
    }

    await saveTraders(filtered);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
