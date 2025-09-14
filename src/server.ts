// server.js
import express from "express";
import { initializeApp, cert, ServiceAccount } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import serviceAccount from "../serviceAccountKey.json";

initializeApp({ credential: cert(serviceAccount as ServiceAccount) });
const db = getFirestore();
const app = express();

// endpoint to return weekly paragraphs
app.get("/api/weekly", async (req, res) => {
  const snapshot = await db
    .collection("weeklyParagraphs")
    .orderBy("week", "desc")
    .limit(1) // latest week
    .get();
  const docs = snapshot.docs.map((doc) => doc.data());
  res.json(docs);
});

app.listen(3000, () => console.log("server running on http://localhost:3000"));
