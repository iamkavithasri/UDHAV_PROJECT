import { db } from "./firebase";
import {
  collection, addDoc, getDocs, doc, updateDoc, deleteDoc,
} from "firebase/firestore";

const col = collection(db, "tasks");

export const addTask = (data) => addDoc(col, data);

export const getTasks = async () => {
  const snap = await getDocs(col);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
};

export const updateTask = (id, data) =>
  updateDoc(doc(db, "tasks", id), data);

export const deleteTask = (id) =>
  deleteDoc(doc(db, "tasks", id));