import { addDoc, serverTimestamp, Timestamp } from "firebase/firestore";

import { db } from "../Firebase"; 
import { collection, query, orderBy } from "firebase/firestore";
import { SkPath } from '@shopify/react-native-skia';

export const pushCanvas = async (sessionId: string, paths :SkPath[]) => {
    if (paths.length > 0) {
      const drawingData = paths.map((path) => ({
        points: path.toSVGString(),
        timestamp: Timestamp.now(),
      }));

      try {
        await addDoc(collection(db, "sessions", sessionId, "drawings"), {
          drawings: drawingData,
        });
        console.log("Dessin envoyé avec succès !");
      } catch (error) {
        console.error("Erreur lors de l'envoi du dessin : ", error);
      }
    }
  };