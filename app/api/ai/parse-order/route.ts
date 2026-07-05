import { generateObject } from 'ai';
import { google } from '@ai-sdk/google';
import { z } from 'zod';

export async function POST(req: Request) {
  try {
    const { text } = await req.json();

    if (!text) {
      return Response.json({ items: [] });
    }

    const prompt = `Şu sipariş metnini analiz et: "${text}"
    Sadece sipariş edilen ürünlerin isimlerini ve miktarlarını JSON olarak dön.
    Miktar belirtilmemişse 1 olarak kabul et.
    Örnek: "İki burger ve bir kola" -> [{ productName: "burger", quantity: 2 }, { productName: "kola", quantity: 1 }]`;

    const { object } = await generateObject({
      model: google('models/gemini-2.5-flash'), // or gemini-1.5-pro
      schema: z.object({
        items: z.array(z.object({
          productName: z.string(),
          quantity: z.number(),
        }))
      }),
      prompt,
    });

    return Response.json({ items: object.items });
  } catch (error) {
    console.error('AI Parse Order error:', error);
    return Response.json({ items: [] }, { status: 500 });
  }
}
