import { generateText } from 'ai';
import { google } from '@ai-sdk/google';

export async function POST(req: Request) {
  try {
    const { cart } = await req.json();

    if (!cart || cart.length === 0) {
      return Response.json({ suggestion: null });
    }

    const prompt = `Müşteri şu ürünleri sipariş etti: ${cart.join(', ')}. 
    Bir restoran menüsü bağlamında, bu siparişle birlikte gitmesi muhtemel, satışı artıracak (upsell) TEK BİR kısa, yaratıcı ve nazik cümlelik öneri ver.
    Örnek: "Burgerinizin yanına çıtır patates kızartması ve buz gibi bir kola ister misiniz?"
    Sadece öneri cümlesini yaz, ekstra açıklama yapma.`;

    const { text } = await generateText({
      model: google('models/gemini-2.5-flash'), // or gemini-1.5-flash if needed
      prompt,
    });

    return Response.json({ suggestion: text });
  } catch (error) {
    console.error('AI Recommendation error:', error);
    return Response.json({ suggestion: null }, { status: 500 });
  }
}
