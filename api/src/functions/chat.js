const { app } = require('@azure/functions');
const { AzureOpenAI } = require('openai');

app.http('chat', {
  methods: ['POST'],
  authLevel: 'anonymous',
  handler: async (request, context) => {
    try {
      const body = await request.json();
      const { message, systemPrompt } = body;

      context.log("Received message:", message);

      const client = new AzureOpenAI({
        endpoint: process.env.AZURE_OPENAI_ENDPOINT,
        apiKey: process.env.AZURE_OPENAI_KEY,
        apiVersion: process.env.AZURE_OPENAI_API_VERSION,
        deployment: process.env.AZURE_OPENAI_DEPLOYMENT
      });

      const messages = [];
      if (systemPrompt) {
        messages.push({ role: 'system', content: systemPrompt });
      }
      messages.push({ role: 'user', content: message });

      const response = await client.chat.completions.create({
        messages: messages,
        max_completion_tokens: 2000
      });

      const replyText = response.choices[0]?.message?.content || "No text generated.";
      context.log("AI Reply:", replyText);

      return {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
        jsonBody: { reply: replyText }
      };
    } catch (error) {
      context.error('Error handling chat request:', error);
      return {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
        jsonBody: { reply: 'Error processing request.' }
      };
    }
  }
});