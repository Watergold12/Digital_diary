const express = require('express');
const axios = require('axios');
const auth = require('../middleware/auth');

const router = express.Router();

const OLLAMA_URL = 'http://localhost:11434/api/generate';

const SYSTEM_PROMPT = `You are an empathetic personal diary assistant. Based on the user's prompt, generate a thoughtful diary entry.
Return EXACTLY a JSON object with this structure:
{
  "title": "A short, engaging title",
  "content": "The full diary entry content in markdown format",
  "tags": ["tag1", "tag2"]
}
Do not return any markdown code blocks (like \`\`\`json), just the raw JSON object.`;

// POST /api/ai/generate
router.post('/generate', auth, async (req, res) => {
  try {
    const { prompt, model = 'llama3.2' } = req.body;

    if (!prompt) {
      return res.status(422).json({ detail: 'Prompt is required.' });
    }

    const payload = {
      model,
      prompt,
      system: SYSTEM_PROMPT,
      stream: false,
      format: 'json',
    };

    let response;
    try {
      response = await axios.post(OLLAMA_URL, payload, { timeout: 60000 });
    } catch (axiosError) {
      if (axiosError.code === 'ECONNREFUSED' || axiosError.code === 'ENOTFOUND') {
        return res.status(503).json({
          detail:
            'Could not connect to local Ollama instance. Is it running on port 11434?',
        });
      }
      return res
        .status(500)
        .json({ detail: 'Failed to generate content with Ollama.' });
    }

    if (response.status !== 200) {
      return res
        .status(500)
        .json({ detail: 'Failed to generate content with Ollama.' });
    }

    const resultText = response.data.response || '';

    try {
      const parsed = JSON.parse(resultText);
      return res.json({
        title: parsed.title,
        content: parsed.content,
        tags: parsed.tags,
      });
    } catch (parseError) {
      return res
        .status(500)
        .json({ detail: 'Model returned invalid JSON format.' });
    }
  } catch (error) {
    console.error('AI generate error:', error);
    return res.status(500).json({ detail: 'Internal server error' });
  }
});

module.exports = router;
