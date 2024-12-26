import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, collection, getCountFromServer, DocumentSnapshot, query, orderBy, limit, startAfter, endBefore, limitToLast, getDocs } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const getPaginatedData = async (
  collection_name: string,
  order_by: string,
  direction: 'next' | 'prev' | undefined,
  startAfterDoc?: DocumentSnapshot,
  endBeforeDoc?: DocumentSnapshot,
  numPerPage: number = 10,
) => {
  const dataCollection = collection(db, collection_name);

  let dataQuery = query(dataCollection, orderBy(order_by), limit(numPerPage));

  if (direction === 'next' && startAfterDoc) {
    dataQuery = query(dataQuery, startAfter(startAfterDoc));
  } 
  
  if (direction === 'prev' && endBeforeDoc) {
    dataQuery = query(
      dataCollection,
      orderBy(order_by),
      endBefore(endBeforeDoc),
      limitToLast(numPerPage)
    );
  }

  const snapshots = await getDocs(dataQuery);

  const result = snapshots.docs.map((doc) => doc.data());

  return {
    result: result as any[],
    lastDoc: snapshots.docs[snapshots.docs.length - 1],
    firstDoc: snapshots.docs[0],
  };
};

const getNumPages = async (collection_name: string, per_page: number): Promise<number> => {
  const dataCollection = collection(db, collection_name)
  const count = await getCountFromServer(dataCollection)
  const numPages = Math.ceil(count.data().count / per_page)
  return numPages
}

export { app, auth, db, getPaginatedData, getNumPages };