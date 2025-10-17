import { initializeApp, cert, ServiceAccount } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import data from "../libraries.json";
import serviceAccount from "../serviceAccountKey.json";

initializeApp({ credential: cert(serviceAccount as ServiceAccount) });
const db = getFirestore();
(async () => {
  for (const entry of data) {
    const docRef = db.collection("libraries").doc();
    await docRef.set({
      specialty: entry.specialty,
      title: entry.title,
      libraries: entry.libraries,
      updatedAt: new Date().toISOString(),
    });
    console.log("Added:", entry.title);
  }
})()
  .then(() => console.log("Import complete"))
  .catch((error) => console.error("Error importing data:", error));
