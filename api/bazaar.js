// api/bazaar.js
const axios = require('axios');

// Vercel handles caching headers for us, so we can simplify the logic.
// The handler function MUST be the default export.
export default async function handler(req, res) {
    // IMPORTANT: Get your API key from Vercel's Environment Variables, NOT from the code.
    const API_KEY = process.env.HYPIXEL_API_KEY;

    try {
        const response = await axios.get(`https://api.hypixel.net/skyblock/bazaar?key=${API_KEY}`);
        
        if (!response.data.success) {
            throw new Error("Hypixel API returned an error.");
        }

        const simplifiedProducts = {};
        for (const productId in response.data.products) {
            const product = response.data.products[productId];
            simplifiedProducts[productId] = {
                id: productId,
                buyPrice: product.quick_status.buyPrice,
                sellPrice: product.quick_status.sellPrice,
            };
        }

        // Tell the browser to cache this result for 2 minutes
        res.setHeader('Cache-Control', 's-maxage=120, stale-while-revalidate');
        res.status(200).json(simplifiedProducts);

    } catch (error) {
        res.status(500).json({ error: "Failed to fetch Bazaar data." });
    }
}