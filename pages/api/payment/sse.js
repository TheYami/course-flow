// /api/payment/sse.js

export default function handler(req, res) {
    // Set headers for SSE
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
  
    // Ensure that the response doesn't automatically time out
    res.flushHeaders();  // Important: This makes sure headers are sent right away
  
    // Initialize the global array for SSE clients if it doesn't exist
    if (!global.sseClients) {
      global.sseClients = [];
    }
  
    // Add the client to the list of active clients
    global.sseClients.push(res);
  
    // Send a message when the connection is successfully established
    res.write(`data: {"status": "connected"}\n\n`);
  
    // Cleanup the client from the list when they disconnect
    req.on("close", () => {
      console.log("Client disconnected");
      global.sseClients = global.sseClients.filter(client => client !== res);
    });
  
    // Optionally, you can send periodic messages to keep the connection alive
    setInterval(() => {
      res.write(`data: {"status": "ping"}\n\n`);
    }, 10000); // Ping every 10 seconds
  }
  