import { doc, getDoc, setDoc } from 'firebase/firestore'
import { db } from './firebase'

export async function loadUserData(uid) {
  try {
    const ref = doc(db, 'users', uid)
    const snap = await getDoc(ref)
    return snap.exists() ? snap.data() : null
  } catch (err) {
    console.error('Firestore load failed:', err.code, err.message)
    throw err
  }
}

export async function saveUserData(uid, data) {
  try {
    const ref = doc(db, 'users', uid)
    await setDoc(ref, data, { merge: true })
  } catch (err) {
    console.error('Firestore save failed:', err.code, err.message)
    throw err
  }
}