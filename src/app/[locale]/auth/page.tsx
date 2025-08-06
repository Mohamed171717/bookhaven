
"use client";
import { useTranslations } from "next-intl";
import { loginUser, registerUser, signInWithFacebookPopup, signInWithGooglePopup } from '@/lib/authService';
import { FirebaseError } from 'firebase/app';
import { signOut, updateProfile, User } from 'firebase/auth';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { useState } from "react";
import { FaFacebookF } from "react-icons/fa";
import { FaGoogle } from "react-icons/fa";
import SelectRoleModal from "@/components/SelectRoleModal";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { UserType } from "@/types/UserType";
import { AbsoluteLanguageSwitcher } from "@/components/layout/languageSwitcher";

type Role = "reader" | "library";
type Error = {
  name?: string;
  email?: string;
  password?: string;
};

export default function AuthPage() {
  const t = useTranslations('LoginPage');
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<Role>('reader');
  const [errors, setErrors] = useState<Error>({});
  const [showRoleModal, setShowRoleModal] = useState(false);
  // const [loginProvider, setLoginProvider] = useState<"google" | "facebook" | null>(null);
  const [tempUser, setTempUser] = useState<User | null>(null);

  // Regex patterns for validation
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  const nameRegex = /^[a-zA-Z\s]{2,50}$/;

  // Real-time validation functions
  const validateName = (value: string) => {
    if (!value) return '';
    if (!nameRegex.test(value)) {
      return 'Name must be 2-50 characters long and contain only letters and spaces';
    }
    return '';
  };

  const validateEmail = (value: string) => {
    if (!value) return '';
    if (!emailRegex.test(value)) {
      return 'Please enter a valid email address';
    }
    return '';
  };

  const validatePassword = (value: string, isLogin: boolean = false) => {
    if (!value) return '';
    if (isLogin) {
      if (value.length < 6) {
        return 'Password must be at least 6 characters long';
      }
    } else {
      if (value.length < 8) {
        return 'Password must be at least 8 characters long';
      }
      if (!passwordRegex.test(value)) {
        return 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&)';
      }
    }
    return '';
  };

  const getPasswordStrength = (value: string) => {
    if (!value) return { strength: 0, color: 'bg-gray-200', text: '' };
    
    let score = 0;
    if (value.length >= 8) score++;
    if (/[a-z]/.test(value)) score++;
    if (/[A-Z]/.test(value)) score++;
    if (/\d/.test(value)) score++;
    if (/[@$!%*?&]/.test(value)) score++;
    
    const strengths = [
      { strength: 0, color: 'bg-red-500', text: 'Very Weak' },
      { strength: 1, color: 'bg-orange-500', text: 'Weak' },
      { strength: 2, color: 'bg-yellow-500', text: 'Fair' },
      { strength: 3, color: 'bg-blue-500', text: 'Good' },
      { strength: 4, color: 'bg-green-500', text: 'Strong' },
      { strength: 5, color: 'bg-green-600', text: 'Very Strong' }
    ];
    
    return strengths[Math.min(score, 5)];
  };

  // validation
  const registerValidate = () => {
    const newErrors: typeof errors = {};
    
    // Name validation
    if (!name) {
      newErrors.name = t('nameReq');
    } else if (!nameRegex.test(name)) {
      newErrors.name = 'Name must be 2-50 characters long and contain only letters and spaces';
    }
    
    // Email validation
    if (!email) {
      newErrors.email = t('emailReq');
    } else if (!emailRegex.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    // Password validation
    if (!password) {
      newErrors.password = t('passwordReq');
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters long';
    } else if (!passwordRegex.test(password)) {
      newErrors.password = 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&)';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const loginValidate = () => {
    const newErrors: typeof errors = {};
    
    // Email validation
    if (!email) {
      newErrors.email = t('emailReq');
    } else if (!emailRegex.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    // Password validation
    if (!password) {
      newErrors.password = t('passwordReq');
    } else if (password.length < 6) {
      newErrors.password = 'Please enter a valid password';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Login
  const handleLogin = async () => {
    if (!loginValidate()) return;
    try {
      const userCredential = await loginUser(email, password);
      const uid = userCredential.user.uid;

      const userDocRef = doc(db, 'users', uid);
      const userSnap = await getDoc(userDocRef);

      if (userSnap.exists()) {
        const userData = userSnap.data() as UserType;

        if (userData.isBanned) {
          await signOut(auth);
          toast.error('Your account has been banned.');
          return; // Stop further execution
        }

        toast.success('Logged in successfully!!');
        router.push(`/`);
      } else {
        toast.error("User document not found.");
      }
    } catch (err: unknown) {
      if (err instanceof FirebaseError) {
        console.error("Firebase error code:", err.code);
        toast.error(err.message);
      } else {
        console.error("Unknown error:", err);
        toast.error("An unknown error occurred.");
      }
    }
  };

  // Register
  const handleRegister = async () => {
    if (!registerValidate()) return;
    try {
      const user = await registerUser(email, password, name, role);
      await updateProfile(user, {
        displayName: name,
      });
      console.log('Registered', user);
      toast.success('You registered successfully, Go back to Login');
    } catch (err: unknown) {
      if (err instanceof FirebaseError) {
        console.error("Firebase error code:", err.code);
        toast.error(err.message);
      } else {
        console.error("Unknown error:", err);
        toast.error("An unknown error occurred.");
      }
    }
  };

  const openRoleModal = async (gf: 'google' | 'facebook') => {
    try {
      if (gf === 'google') {
        const firebaseUser = await signInWithGooglePopup();
        const userRef = doc(db, "users", firebaseUser.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          // User already exists, just log in and redirect
          toast.success(`Welcome back ${firebaseUser.displayName}`);
          router.push(`/`);
        } else {
          // New user, show role modal and store UID to use later
          setTempUser(firebaseUser); // 👈 store user temporarily
          setShowRoleModal(true);
        }
      } else if (gf === 'facebook') {
        const firebaseUser = await signInWithFacebookPopup();
        const userRef = doc(db, "users", firebaseUser.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          // User already exists, just log in and redirect
          toast.success(`Welcome back ${firebaseUser.displayName}`);
          router.push(`/`);
        } else {
          // New user, show role modal and store UID to use later
          setTempUser(firebaseUser); // 👈 store user temporarily
          setShowRoleModal(true);
        }
      }

    
    } catch (err) {
      if (err instanceof FirebaseError) {
        toast.error(err.message);
      } else {
        console.error("Unknown error during Google login:", err);
      }
    }
  };

  const handleRoleSelect = async (role: 'reader' | 'library') => {
    setShowRoleModal(false);
    try {
      if (!tempUser) return;
      const userData = {
        uid: tempUser.uid,
        name: tempUser.displayName || "",
        email: tempUser.email || "",
        photoUrl: tempUser.photoURL || "",
        role,
        createdAt: serverTimestamp(),
        bio: "",
        averageRating: 0,
        totalRatings: 0,
        verified: tempUser.emailVerified,
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
        updatedAt: serverTimestamp(),
      };

      await setDoc(doc(db, "users", tempUser.uid), userData);
      toast.success(`Welcome ${tempUser.displayName}`);
      router.push(`/`);
    } catch (err) {
      if (err instanceof FirebaseError) {
        toast.error(err.message);
      } else {
        console.error("Error saving user:", err);
      }
    } finally {
      setTempUser(null);
    }
  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-[#9b654d] via-[#D8D2C2] to-[#794f3c] px-4">
      <AbsoluteLanguageSwitcher />
      <div className="relative w-full max-w-5xl h-[500px] overflow-hidden rounded-xl shadow-xl">
        {/* Sliding Container */}
        <div
          className={`w-[200%] h-full flex transition-transform duration-700 ease-in-out ${
            isLogin ? "translate-x-0" : "-translate-x-1/2"
          }`}
        >
          {/* Login Panel */}
          <div className="w-1/2 h-full flex bg-gradient-to-r from-[#f1c8b6] to-[#D8D2C2]">
            {/* Image */}
            <div className="w-1/2 bg-cover bg-center hidden md:block" style={{ backgroundImage: "url('/login.jpeg')" }} />
            {/* Login Form */}
            <div className="w-full md:w-1/2 p-10 flex flex-col justify-center">
              <h2 className="text-3xl font-bold mb-4 text-center">{t('login')}</h2>
              <input 
                type="email" 
                value={email} 
                onChange={(e) => {
                  setEmail(e.target.value);
                  const error = validateEmail(e.target.value);
                  setErrors(prev => ({ ...prev, email: error }));
                }}
                onBlur={(e) => {
                  const error = validateEmail(e.target.value);
                  setErrors(prev => ({ ...prev, email: error }));
                }}
                placeholder={t('email')} 
                className={`border px-4 py-2 mb-3 rounded w-full ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.email && <p className="text-red-600 text-sm mb-2">{errors.email}</p>}
              <input 
                type="password" 
                value={password} 
                onChange={(e) => {
                  setPassword(e.target.value);
                  const error = validatePassword(e.target.value, true);
                  setErrors(prev => ({ ...prev, password: error }));
                }}
                onBlur={(e) => {
                  const error = validatePassword(e.target.value, true);
                  setErrors(prev => ({ ...prev, password: error }));
                }}
                placeholder={t('password')} 
                className={`border px-4 py-2 mb-3 rounded w-full ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.password && <p className="text-red-600 text-sm mb-2">{errors.password}</p>}
              <button onClick={handleLogin} className="bg-primary-color text-white px-4 py-2 rounded">{t('login')}</button>
              <p onClick={() => setIsLogin(false)} className="mt-4 text-sm cursor-pointer">
                {t('dontHave')}
              </p>
              <div className="flex justify-center mt-8 items-center gap-6">
                <div onClick={() => openRoleModal('facebook')} className="w-[40px] h-[40px] flex items-center justify-center rounded-full bg-primary-color cursor-pointer">
                  <FaFacebookF className="text-xl text-white" />
                </div>
                <div onClick={() => openRoleModal('google')} className="w-[40px] h-[40px] flex items-center justify-center rounded-full bg-primary-color cursor-pointer">
                  <FaGoogle className="text-xl text-white" />
                </div>
              </div>
            </div>
          </div>

          {/* Register Panel */}
          <div className="w-1/2 h-full flex bg-gradient-to-r from-[#D8D2C2] to-[#f1c8b6]">
            {/* Register Form */}
            <div className="w-full md:w-1/2 p-10 flex flex-col justify-center">
              <h2 className="text-3xl font-bold mb-4 text-center">{t('register')}</h2>
              <input 
                type="text" 
                value={name} 
                placeholder={t('name')} 
                onChange={(e) => {
                  setName(e.target.value);
                  const error = validateName(e.target.value);
                  setErrors(prev => ({ ...prev, name: error }));
                }}
                onBlur={(e) => {
                  const error = validateName(e.target.value);
                  setErrors(prev => ({ ...prev, name: error }));
                }}
                className={`border px-4 py-2 mb-3 rounded w-full ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.name && <p className="text-red-600 text-sm mb-2">{errors.name}</p>}
              <input 
                type="email" 
                value={email} 
                placeholder={t('email')} 
                onChange={(e) => {
                  setEmail(e.target.value);
                  const error = validateEmail(e.target.value);
                  setErrors(prev => ({ ...prev, email: error }));
                }}
                onBlur={(e) => {
                  const error = validateEmail(e.target.value);
                  setErrors(prev => ({ ...prev, email: error }));
                }}
                className={`border px-4 py-2 mb-3 rounded w-full ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.email && <p className="text-red-600 text-sm mb-2">{errors.email}</p>}
              <input 
                type="password" 
                value={password} 
                placeholder={t('password')} 
                onChange={(e) => {
                  setPassword(e.target.value);
                  const error = validatePassword(e.target.value, false);
                  setErrors(prev => ({ ...prev, password: error }));
                }}
                onBlur={(e) => {
                  const error = validatePassword(e.target.value, false);
                  setErrors(prev => ({ ...prev, password: error }));
                }}
                className={`border px-4 py-2 mb-3 rounded w-full ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.password && <p className="text-red-600 text-sm mb-2">{errors.password}</p>}
              {password && (
                <div className="mb-3">
                  <div className="flex gap-1 mb-1">
                    {[1, 2, 3, 4, 5].map((level) => {
                      const strength = getPasswordStrength(password);
                      return (
                        <div
                          key={level}
                          className={`h-1 flex-1 rounded ${
                            level <= strength.strength ? strength.color : 'bg-gray-200'
                          }`}
                        />
                      );
                    })}
                  </div>
                  <p className="text-xs text-gray-600">
                    {getPasswordStrength(password).text}
                  </p>
                </div>
              )}
              {/* Role selector */}
              <div className="flex items-center gap-4 mb-4 mt-2">
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="reader"
                    checked={role === 'reader'}
                    onChange={() => setRole('reader')}
                    className="appearance-none w-3 h-3 border-2 border-[#4A4947] rounded-full mr-2 checked:bg-[#4A4947] checked:border-[#4A4947] focus:outline-none"
                  />
                  {t('reader')}
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="library"
                    checked={role === 'library'}
                    onChange={() => setRole('library')}
                    className="appearance-none w-3 h-3 border-2 border-[#4A4947] rounded-full mr-2 checked:bg-[#4A4947] checked:border-[#4A4947] focus:outline-none"
                  />
                  {t('library')}
                </label>
              </div>
              <button onClick={handleRegister} className="bg-primary-color text-white px-4 py-2 rounded">{t('submit')}</button>
              <p onClick={() => setIsLogin(true)} className="mt-4 text-sm cursor-pointer">
                {t('iHave')}
              </p>
            </div>
            {/* Image */}
            <div className="w-1/2 bg-cover bg-center hidden md:block" style={{ backgroundImage: "url('/register.jpeg')" }} />
          </div>
        </div>
      </div>
      {/* login modal */}
          {showRoleModal && (
            <SelectRoleModal
              onSelect={handleRoleSelect}
              onClose={() => setShowRoleModal(false)}
            />
          )}
    </div>
  );
}
