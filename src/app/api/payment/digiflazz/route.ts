import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    // Parse the callback data from Digiflazz
    const callbackData = await req.json();
    console.log('Digiflazz callback received:', JSON.stringify(callbackData));

   
    const {
      ref_id,
      buyer_sku_code,
      customer_no,
      status,
      message,
      sn,
    } = callbackData.data;

    
    const referenceId = ref_id;
    console.log('Processing reference ID:', referenceId);

    // Validate required parameters
    if (!referenceId || !buyer_sku_code || !customer_no) {
      console.log('Missing required parameters');
      return NextResponse.json({
        data: {
          status: "2",
          message: "Terdapat parameter yang kosong",
          rc: "07"
        }
      });
    }

    // Map Digiflazz status to your application status - using trim and case insensitive comparison
    const normalizedStatus = status ? status.trim().toLowerCase() : '';
    console.log('Original status:', status);
    console.log('Normalized status:', normalizedStatus);
    
    // Simplified status mapping - only SUCCESS or FAILED
    const purchaseStatus = normalizedStatus === 'sukses' ? 'SUCCESS' : 'FAILED';
    
    console.log('Mapped purchase status:', purchaseStatus);

    
  } catch (error) {
    console.error('DigiFlazz callback error:', error);
    return NextResponse.json({
      data: {
        status: "2",
        message: "System error",
        rc: "99"
      }
    });
  }
}