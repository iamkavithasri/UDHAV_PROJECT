import { db } from "./firebase";
import {
  collection, addDoc, getDocs, doc, updateDoc, deleteDoc,
} from "firebase/firestore";

const col = collection(db, "volunteers");

export const addVolunteer = (data) => addDoc(col, data);

export const getVolunteers = async () => {
  const snap = await getDocs(col);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
};

export const updateVolunteer = (id, data) =>
  updateDoc(doc(db, "volunteers", id), data);

export const deleteVolunteer = (id) =>
  deleteDoc(doc(db, "volunteers", id));