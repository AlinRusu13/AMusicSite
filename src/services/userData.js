import { doc, getDoc, setDoc } from 'firebase/firestore'
import { db } from './firebase'

export async function loadUserData(uid) {
  const ref = doc(db, 'users', uid)
  const snap = await getDoc(ref)
  return snap.exists() ? snap.data() : null
}

export async function saveUserData(uid, data) {
  const ref = doc(db, 'users', uid)
  await setDoc(ref, data, { merge: true })
}