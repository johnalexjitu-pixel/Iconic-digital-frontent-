import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const stream = new ReadableStream({
    start(controller) {
      // Send initial connection message
      const encoder = new TextEncoder();

      const sendEvent = (data: any, event?: string) => {
        const message = `${event ? `event: ${event}\n` : ''}data: ${JSON.stringify(data)}\n\n`;
        controller.enqueue(encoder.encode(message));
      };

      // Send initial data
      sendEvent({
        type: 'connection',
        message: 'Connected to SocialTrend real-time updates',
        timestamp: new Date().toISOString()
      });

      // Send periodic updates
      const interval = setInterval(() => {
        // Mock real-time data updates
        const updates = [
          {
            type: 'balance_update',
            data: {
              accountBalance: 61076 + Math.floor(Math.random() * 1000),
              timestamp: new Date().toISOString()
            }
          },
          {
            type: 'campaign_update',
            data: {
              campaignId: 'P1IT7024',
              participants: 45 + Math.floor(Math.random() * 10),
              timestamp: new Date().toISOString()
            }
          },
          {
            type: 'transaction_update',
            data: {
              newTransaction: {
                id: `TXN${Date.now()}`,
                amount: Math.floor(Math.random() * 5000),
                type: 'campaign_earning',
                timestamp: new Date().toISOString()
              }
            }
          }
        ];

        const randomUpdate = updates[Math.floor(Math.random() * updates.length)];
        sendEvent(randomUpdate, 'update');
      }, 5000); // Send update every 5 seconds

      // Handle client disconnect
      request.signal.addEventListener('abort', () => {
        clearInterval(interval);
        controller.close();
      });
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET',
      'Access-Control-Allow-Headers': 'Cache-Control',
    },
  });
}
