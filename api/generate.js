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
    // Try HuggingFace API first
    const HF_API_KEY = process.env.HF_API_KEY;

    // Build prompt for Hinglish ad generation
    const prompt = `Create a 20-second Hinglish Instagram Reel ad for the product: "${product}".

Format the response exactly as:
HOOK: [3-5 seconds catchy opening]
PROBLEM: [8-10 seconds pain point]
SOLUTION: [8-10 seconds how the product helps]
CTA: [3-5 seconds call to action]

Use natural Hinglish (Hindi + English mix) with appropriate emojis. Keep it conversational and energetic.`;

    let generatedText = '';

    // Try HuggingFace API if key is available
    if (HF_API_KEY) {
      const endpoints = [
        'https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.1',
        'https://api-inference.huggingface.co/models/meta-llama/Llama-2-7b-chat-hf',
        'https://api-inference.huggingface.co/models/google/gemma-7b-it'
      ];

      for (const endpoint of endpoints) {
        try {
          const hfResponse = await fetch(endpoint, {
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
            signal: AbortSignal.timeout(10000), // 10 second timeout
          });

          if (hfResponse.ok) {
            const data = await hfResponse.json();

            if (Array.isArray(data) && data.length > 0) {
              generatedText = data[0]?.generated_text || '';
            } else if (data.generated_text) {
              generatedText = data.generated_text;
            }

            if (generatedText && generatedText.length > 50) {
              break; // Success!
            }
          }
        } catch (err) {
          console.log(`Endpoint ${endpoint} failed:`, err.message);
          continue; // Try next endpoint
        }
      }
    }

    // Fallback if API fails or no key
    if (!generatedText || generatedText.length < 20) {
      generatedText = generateFallbackScript(product);
    }

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

    // Fallback to template
    const fallbackScript = generateFallbackScript(product);

    return res.status(200).json({
      success: true,
      product: product,
      script: fallbackScript,
      fallback: true,
      timestamp: new Date().toISOString(),
    });
  }
}

// Fallback script generator - High quality Hinglish templates
function generateFallbackScript(product) {
  const templates = [
    `HOOK: Dosto, ${product} try kiya hai? 😱

PROBLEM: Agar nahi, toh seriously miss kar rahe ho! Daily struggle mein apna time waste kar rahe ho.

SOLUTION: ${product} ye sab change kar deta hai! 10 mein kaam ho jata hai, aur result bhi dekho.

CTA: Abhi order karo, link bio mein hai! 🔥`,

    `HOOK: Stop scrolling! 🛑

PROBLEM: Kya aap ${product} use karte hain? Baki log paid mein bech rahe hain, aap free mein reh rahe ho.

SOLUTION: ${product} mein ye feature free hai! Jaldi check karo.

CTA: Share karo friends ke sath! 🚀`,

    `HOOK: Secret reveal kar raha hu! 🤫

PROBLEM: ${product} - sab log ignore kar rahe hain! Bade brands wahi cheez expensive bech rahe hain.

SOLUTION: Isse similar quality, lekin aadha price mein!

CTA: Comment "YES" agar chahiye! 👇`,

    `HOOK: Tumhare liye surprise hai! 🎁

PROBLEM: ${product} ka idea hi nahi tha? Abhi tak experience nahi kiya?

SOLUTION: ${product} use karke dekho - result guaranteed! 1 week mein farak dikhega.

CTA: Link bio hai, abhi click karo! 📱`,

    `HOOK: Warning! ⚠️

PROBLEM: ${product} nahi use karte? Aap paisa waste kar rahe ho duplicate products pe!

SOLUTION: ${product} original hai, aur price mein aadha! Quality ekdum top!

CTA: Order karo, shipping free hai! 🚚`
  ];

  return templates[Math.floor(Math.random() * templates.length)];
}