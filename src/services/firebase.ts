// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import { getAnalytics } from 'firebase/analytics'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: 'AIzaSyAt5tf0pjNf7hnkDyBeAL-BKicEH_68nuU',
  authDomain: 'api-dev-academy.firebaseapp.com',
  projectId: 'api-dev-academy',
  storageBucket: 'api-dev-academy.appspot.com',
  messagingSenderId: '848942448986',
  appId: '1:848942448986:web:a2fc33f56adc2fa9447363',
  measurementId: 'G-2VDP6KE8CW'
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const analytics = getAnalytics(app)

const auth = getAuth(app)
const db = getFirestore(app)
export { auth, db }
