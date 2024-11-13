import { db } from '../Firebase';
import { collection, addDoc, doc, updateDoc, arrayUnion, onSnapshot, Timestamp, DocumentData } from "firebase/firestore";
import { useEffect, useState } from 'react';

export const createSession = async (hostId: string, hostName: string) => {
  try {
    const sessionRef = await addDoc(collection(db, "sessions"), {
      hostId,
      hostName,
      createdAt: Timestamp.now(),
      status: "active",
      participants: [{ userId: hostId, name: hostName }],
    });
    return sessionRef.id;
  } catch (error) {
    console.error("Erreur lors de la création de la session:", error);
    return null;
  }
};

export const joinSession = async (sessionId: string, userId: string, userName: string) => {
    if (!sessionId) {
      console.error("No session ID provided.");
      return;
    }
    const sessionRef = doc(db, "sessions", sessionId);
    try {
      await updateDoc(sessionRef, {
        participants: arrayUnion({ userId, name: userName })
      });
    } catch (error) {
      console.error("Erreur lors de la connexion à la session:", error);
    }
  };


  export const useSession = (sessionId: string) => {
    const [sessionData, setSessionData] = useState<DocumentData | null>(null);
  
    useEffect(() => {
      if (!sessionId) return;
      
      const sessionRef = doc(db, "sessions", sessionId);
      const unsubscribe = onSnapshot(sessionRef, (docSnapshot) => {
        if (docSnapshot.exists()) {
          setSessionData(docSnapshot.data());
        } else {
          console.log("No such document!");
          setSessionData(null);
        }
      });
  
      return () => unsubscribe();
    }, [sessionId]);
  
    return sessionData;
  };
