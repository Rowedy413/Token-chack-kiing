export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST allowed' });
  }

  try {
    const { tokens } = req.body;

    if (!tokens || !Array.isArray(tokens)) {
      return res.status(400).json({ error: 'Tokens must be an array' });
    }

    const results = await Promise.all(tokens.map(async (token) => {
      const cleanedToken = token.trim();

      if (!cleanedToken || cleanedToken.length < 10) {
        return { token: cleanedToken, status: 'invalid_format' };
      }

      try {
        // Optional: Real validation using Facebook Graph API (uncomment to use)
        // const fbRes = await fetch(`https://graph.facebook.com/me?access_token=${cleanedToken}`);
        // const data = await fbRes.json();
        // if (data && data.id) {
        //   return { token: cleanedToken, status: 'valid', user_id: data.id };
        // }

        // Simulated validation logic
        const isLikelyFacebookToken = /^[A-Za-z0-9|\-_.]+$/.test(cleanedToken);
        const valid = isLikelyFacebookToken && cleanedToken.length >= 20;
        return {
          token: cleanedToken,
          status: valid ? 'valid' : 'invalid',
        };
      } catch (err) {
        return { token: cleanedToken, status: 'error', error: err.message };
      }
    }));

    return res.status(200).json({ results });
  } catch (error) {
    return res.status(500).json({ error: 'Server error', details: error.message });
  }
        }
