export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { product } = req.body;

  // Validate input
  if (!product || product.trim().length === 0) {
    return res.status(400).json({ error: 'Product name is required' });
  }

  try {
    // HuggingFace API endpoint
    const HF_API_URL = 'https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.1';

    // Get API key from environment variable
    const HF_API_KEY = process.env.HF_API_KEY;

    if (!HF_API_KEY) {
      return res.status(500).json({ error: 'HF_API_KEY not configured' });
    }

    // Build prompt for Hinglish ad generation
    const prompt = `Create a 20-second Hinglish Instagram Reel ad for the product: "${product}".

Format the response exactly as:
HOOK: [3-5 seconds catchy opening]
PROBLEM: [8-10 seconds pain point]
SOLUTION: [8-10 seconds how the product helps]
CTA: [3-5 seconds call to action]

Use natural Hinglish (Hindi + English mix) with appropriate emojis. Keep it conversational and energetic.`;

    // Call HuggingFace API
    const hfResponse = await fetch(HF_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${HF_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: {
          max_new_tokens: 300,
          temperature: 0.7,
          top_p: 0.95,
          do_sample: true,
          return_full_text: false,
        },
      }),
    });

    if (!hfResponse.ok) {
      const errorText = await hfResponse.text();
      console.error('HF API Error:', errorText);
      throw new Error(`HuggingFace API error: ${hfResponse.status}`);
    }

    const data = await hfResponse.json();

    // Extract generated text
    let generatedText = data[0]?.generated_text || '';

    // Clean up the response
    generatedText = generatedText.trim();

    // Return success response
    return res.status(200).json({
      success: true,
      product: product,
      script: generatedText,
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error('Error generating ad:', error);
    return res.status(500).json({
      error: 'Failed to generate ad script',
      details: error.message,
    });
  }
}