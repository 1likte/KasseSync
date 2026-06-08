import { NextResponse } from 'next/server';

// This is a Mock API to simulate the Fiskaly TSE (KassenSichV) signing process in Germany.
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { total, items } = body;

    // Simulate network delay to Fiskaly API
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Generate Mock TSE Data
    const transactionId = `tx_${Math.random().toString(36).substring(2, 11).toUpperCase()}`;
    const tseSignature = Buffer.from(`TSE_SIGNATURE_MOCK_${Date.now()}_${total}`).toString('base64');
    const timestamp = new Date().toISOString();
    
    // In Germany, the receipt must contain a QR code with the TSE data
    const qrCodeData = `V0;${transactionId};${timestamp};${total};${tseSignature}`;

    return NextResponse.json({
      success: true,
      data: {
        fiskaly_transaction_id: transactionId,
        fiskaly_signature: tseSignature,
        tse_start_time: timestamp,
        tse_end_time: timestamp,
        qr_code_data: qrCodeData,
        message: 'TSE signing successful (Mock)',
      }
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to communicate with Fiskaly API' }, { status: 500 });
  }
}
