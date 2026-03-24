# Indian UGC Ad Generator (Vercel Version) 🎬

Lightweight SaaS for generating Indian UGC ad scripts using HuggingFace AI.

## Features

- 🤖 AI-powered script generation (Mistral-7B)
- 🇮🇳 Hinglish style (Hindi + English mix)
- ⚡ Instant results via serverless functions
- 💰 Free to use (runs on Vercel free tier)
- 🎯 Optimized for Instagram Reels & TikTok

## Tech Stack

- **Frontend:** Pure HTML/CSS/JavaScript
- **Backend:** Vercel Serverless Functions (Node.js)
- **AI:** HuggingFace Inference API
- **Hosting:** Vercel (Free)

## Setup

1. Clone this repository
2. Install Vercel CLI: `npm i -g vercel`
3. Run locally: `vercel dev`

## Deployment

### Via Vercel Dashboard

1. Push code to GitHub
2. Import repository in [Vercel Dashboard](https://vercel.com/new)
3. Add Environment Variable: `HF_API_KEY` (get from HuggingFace)
4. Deploy!

### Via CLI

```bash
vercel login
vercel --prod
```

## Environment Variables

Add these in Vercel Dashboard (Settings → Environment Variables):

```
HF_API_KEY=your_huggingface_api_key_here
```

**Get HF API Key:**
1. Go to [HuggingFace Tokens](https://huggingface.co/settings/tokens)
2. Create a new token with "Read" access
3. Copy and add to Vercel

## Usage

1. Open the deployed URL
2. Enter product name (e.g., "Face wash")
3. Click "Generate Ad Script"
4. Get your Hinglish ad script instantly!

## Example Output

```
HOOK: Tumhare face par acne ki problem hai? 😫
PROBLEM: Kya aap roz naye products try karte ho par kuch fark nahi padta? Expensive creams, herbal remedies - sab fail! 💔
SOLUTION: Abhi try karo XYZ Face Wash - 1 week mein clear skin! Natural ingredients, no side effects. Result guaranteed! ✨
CTA: Link bio mein hai - 50% off offer khatam hone se pehle order karo! 🛒
```

## Live Demo

[Your Vercel URL here]

## Cost

- **Vercel:** Free tier (100GB bandwidth/month)
- **HuggingFace:** Free tier (limited requests)
- **Total:** ₹0/month

## Limitations

- Free HuggingFace API: Rate limits apply
- No video/audio generation (text only)
- Script only (you'll need to record voice/video yourself)

## Future Enhancements

- [ ] Add payment gateway for premium features
- [ ] Multiple ad formats (15s, 30s, 60s)
- [ ] A/B testing for scripts
- [ ] Save scripts to database
- [ ] Export to PDF/Notion

## License

MIT - Feel free to use and modify!

---

Built with ❤️ for Indian creators