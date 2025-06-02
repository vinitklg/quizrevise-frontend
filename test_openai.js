// Test OpenAI API connection
import OpenAI from 'openai';

const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY 
});

async function testOpenAI() {
  try {
    console.log('Testing OpenAI API...');
    
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system", 
          content: "You are a helpful assistant. Respond with a simple test message."
        },
        {
          role: "user",
          content: "Say hello"
        }
      ],
      max_tokens: 50
    });

    console.log('✓ OpenAI API is working');
    console.log('Response:', response.choices[0].message.content);
    
  } catch (error) {
    console.error('✗ OpenAI API error:', error.message);
    if (error.status === 401) {
      console.error('Authentication failed - invalid API key');
    }
  }
}

testOpenAI();