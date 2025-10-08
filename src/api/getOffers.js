// api/getOffers.js
import { db } from "../../src/firebase";
import { collection, getDocs, query, limit } from "firebase/firestore";

export default async function handler(req, res) {
  try {
    // Only allow GET requests
    if (req.method !== "GET") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    // Optional: handle pagination via query param ?limit=10
    const limitParam = parseInt(req.query.limit) || 20;

    // Fetch limited offers from Firestore
    const offersQuery = query(collection(db, "offers"), limit(limitParam));
    const snapshot = await getDocs(offersQuery);

    const offers = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        title: data.title || "",
        description: data.description || "",
        imageUrl: data.imageUrl || "",  // Store URLs only
        startDate: data.startDate?.toDate?.()?.toISOString() || null,
        endDate: data.endDate?.toDate?.()?.toISOString() || null,
        terms: data.terms || ""
      };
    });

    res.status(200).json({ offers });
  } catch (error) {
    console.error("Firebase API error:", error);
    res.status(500).json({ error: error.message });
  }
}
vercel --prod
