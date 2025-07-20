
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from './firebase';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  signInWithPopup,
  GoogleAuthProvider,
  FacebookAuthProvider,
  updateProfile, 
} from 'firebase/auth';

const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();


export const registerUser = async (email: string, password: string, name: string, role: string) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;
  await updateProfile(user, { displayName: name });

  // Save user in Firestore
  const now = new Date();

  await setDoc(doc(db, "users", user.uid), {
    uid: user.uid,
    name,
    email: user.email,
    bio: "",
    role,
    photoUrl: "/user-default.jpg",
    averageRating: 0,
    totalRatings: 0,
    verified: false,
    isBanned: false,
    profileIncomplete: true,
    genres: [],
    address: "",
    website: "",
    bookIds: [],
    transactionIds: [],
    chatIds: [],
    blogPostIds: [],
    notificationIds: [],
    createdAt: now,
    updatedAt: now,
  });

  return user;
}
export const loginUser = (email: string, password: string) => signInWithEmailAndPassword(auth, email, password);
export const logoutUser = () => signOut(auth);

export const signInWithGoogle = async () => {
  const result = await signInWithPopup(auth, googleProvider);
  const user = result.user;

  // Check if user exists in Firestore
  const userRef = doc(db, 'users', user.uid);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    await setDoc(userRef, {
      uid: user.uid,
      name: user.displayName,
      email: user.email,
      image: user.photoURL,
      role: 'user',
      verified: user.emailVerified,
      active: true,
      isBanned: false,
      createdAt: new Date(),
    });
  }

  return user;
};

export const signInWithFacebook = async () => {

  facebookProvider.addScope('public_profile');
  facebookProvider.addScope('email');
  const result = await signInWithPopup(auth, facebookProvider);
  const user = result.user;

  const userRef = doc(db, 'users', user.uid);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    await setDoc(userRef, {
      uid: user.uid,
      name: user.displayName,
      email: user.email,
      image: user.photoURL,
      role: 'user',
      verified: user.emailVerified,
      active: true,
      isBanned: false,
      createdAt: new Date(),
    });
  }

  return user;
};