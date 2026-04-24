import { db } from "./firebase";
import {
  collection, addDoc, getDocs, query, where, deleteDoc, doc,
} from "firebase/firestore";

const col = collection(db, "assignments");

// Assign a volunteer to a task
export const assign = (volunteerId, taskId) =>
  addDoc(col, { volunteerId, taskId, assignedAt: new Date() });

// Get all assignments
export const getAssignments = async () => {
  const snap = await getDocs(col);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
};

// Get assignments for a specific volunteer
export const getAssignmentsByVolunteer = async (volunteerId) => {
  const q = query(col, where("volunteerId", "==", volunteerId));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
};

// Remove an assignment
export const removeAssignment = (id) =>
  deleteDoc(doc(db, "assignments", id));