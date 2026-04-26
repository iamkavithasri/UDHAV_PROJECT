import { db } from "./firebase";
import { collection,addDoc,getDocs,query,where,deleteDoc,doc,updateDoc } from "firebase/firestore";

const col = collection(db, "assignments");

// Assign a volunteer to a task
export const assign = (volunteer, task) =>
  addDoc(col, {
    volunteerId: volunteer.id,
    volunteerName: volunteer.name,
    taskId: task.id,
    taskTitle: task.title,
    priority: task.priority,
    category: task.category,
    deadline: task.deadline,
    status: 'Pending',
    assignedDate: new Date().toISOString(),
  });

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

export const updateAssignmentStatus = (id, status) =>
  updateDoc(doc(db, "assignments", id), { status })

// Remove an assignment
export const removeAssignment = (id) =>
  deleteDoc(doc(db, "assignments", id));