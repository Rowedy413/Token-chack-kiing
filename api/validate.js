export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST requests allowed' });
  }

  try {
    const { tokens } = req.body;

    if (!tokens || !Array.isArray(tokens)) {
      return res.status(400).json({ error: 'Tokens must be an array' });
    }

    const results = tokens.map(token => {
      const trimmedToken = token.trim();

      // Format check (JWT / Discord token pattern)
      const isFormatValid = /^[\w-]{20,}\.[\w-]{5,}\.[\w-]{10,}$/.test(trimmedToken) ||
                            /^[\w-]{24,}$/.test(trimmedToken); // e.g., Discord bot token or numeric IDs

      return {
        token: trimmedToken,
        valid: isFormatValid,
        type: isFormatValid ? (
          trimmedToken.includes('.') ? 'JWT-like' : 'Discord-like'
        ) : 'Invalid'
      };
    });

    return res.status(200).json({ results });
  } catch (error) {
    console.error("Validation error:", error);
    return res.status(500).json({ error: 'Server error during validation' });
  }
}
