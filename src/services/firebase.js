import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: 'AIzaSyDQRiyGn52o5nJ2gaz4QRJwje-UKyaE-Gw',
  authDomain: 'reels-6b3bf.firebaseapp.com',
  projectId: 'reels-6b3bf',
  storageBucket: 'reels-6b3bf.firebasestorage.app',
  messagingSenderId: '1079525589901',
  appId: '1:1079525589901:web:9280ab89022825f5d673c4',
  measurementId: 'G-FJ0FDRCL2Z',
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)