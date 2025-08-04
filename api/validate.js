export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST requests are allowed.' });
  }

  try {
    const { tokens } = req.body;

    if (!tokens || !Array.isArray(tokens)) {
      return res.status(400).json({ error: 'Invalid input. Expected an array of tokens.' });
    }

    const results = tokens.map(token => {
      const trimmedToken = token.trim();

      // Basic format check (JWT/Discord style: xxx.yyy.zzz)
      const isFormatValid = /^[\w-]{10,256}\.[\w-]{6,128}\.[\w-]{10,256}$/.test(trimmedToken);

      // Additional logic (you can expand this later to call real API if needed)
      return {
        token: trimmedToken,
        valid: isFormatValid,
        type: isFormatValid ? 'JWT / Discord style' : 'Invalid format'
      };
    });

    return res.status(200).json({ results });

  } catch (error) {
    console.error("Validation error:", error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
      }
