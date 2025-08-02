
import { doc, setDoc } from 'firebase/firestore';
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

export const signInWithGooglePopup = async () => {
  const result = await signInWithPopup(auth, googleProvider);
  return result.user;
};

export const signInWithFacebookPopup = async () => {
  facebookProvider.addScope('public_profile');
  facebookProvider.addScope('email');
  const result = await signInWithPopup(auth, facebookProvider);
  return result.user;
};