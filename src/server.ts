// server.js
import express from "express";
import { initializeApp, cert, ServiceAccount } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import serviceAccount from "../serviceAccountKey.json";

initializeApp({ credential: cert(serviceAccount as ServiceAccount) });
const db = getFirestore();
const app = express();

// endpoint to return weekly paragraphs
// app.get("/api/weekly", async (req, res) => {
//   const snapshot = await db
//     .collection("weeklyParagraphs")
//     .orderBy("week", "desc")
//     .limit(1) // latest week
//     .get();
//   const docs = snapshot.docs.map((doc) => doc.data());
//   res.json(docs);
// });

// Get all libraries
app.get("/api/libraries", async (req, res) => {
  try {
    const snapshot = await db.collection("libraries").get();
    const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get libraries by specialty
app.get("/api/libraries/:specialty", async (req, res) => {
  try {
    const { specialty } = req.params;
    const snapshot = await db
      .collection("libraries")
      .where("specialty", "==", specialty)
      .get();

    if (snapshot.empty) return res.status(404).json({ message: "Not found" });

    const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    res.json(data[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(3000, () => console.log("server running on http://localhost:3000"));
