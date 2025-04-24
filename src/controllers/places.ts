import express from 'express';
import axios from 'axios';

export const lookupPlace = async (req: express.Request, res: express.Response) => {
  const { placeName } = req.body;
  const apiKey = process.env.GOOGLE_API_KEY;

  try {
    // 1. Find place_id
    const searchRes = await axios.get("https://maps.googleapis.com/maps/api/place/findplacefromtext/json", {
      params: {
        input: placeName,
        inputtype: "textquery",
        fields: "place_id",
        key: apiKey,
      },
    });

    const candidates = searchRes.data?.candidates;
    if (!candidates || candidates.length === 0) {
      console.warn("📭 No candidates found for:", placeName);
       res.status(404).json({ error: "Place not found" });
       return;
    }

    const placeId = candidates[0].place_id;

    // 2. Get full details
    const detailsRes = await axios.get("https://maps.googleapis.com/maps/api/place/details/json", {
      params: {
        place_id: placeId,
        fields: "name,geometry,photos",
        key: apiKey,
      },
    });

    const place = detailsRes.data.result;
    if (!place || !place.name || !place.geometry) {
       res.status(404).json({ error: "Incomplete place details" });
       return;
    }

    // 3. Optional photo
    let photoUrl = null;
    const ref = place?.photos?.[0]?.photo_reference;
    if (ref) {
      photoUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photoreference=${ref}&key=${apiKey}`;
    }

    res.json({
      name: place.name,
      lat: place.geometry.location.lat,
      lng: place.geometry.location.lng,
      photoUrl,
    });

  } catch (err) {
    console.error("❌ Google Place lookup failed:", err);
    res.status(500).json({ error: "Google Place lookup failed" });
  }
};
