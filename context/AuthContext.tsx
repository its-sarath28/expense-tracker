import { auth, firestore } from "@/config/firebase";
import { AuthContextType, UserType } from "@/types";
import { useRouter } from "expo-router";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { setDoc, doc, getDoc } from "firebase/firestore";
import {
  createContext,
  FC,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserType>(null);

  const router = useRouter();

  useEffect(() => {
    const unSub = onAuthStateChanged(auth, (firebaseUser) => {
      console.log("firebaseUser", firebaseUser);

      if (firebaseUser) {
        setUser({
          uid: firebaseUser?.uid,
          email: firebaseUser?.email,
          name: firebaseUser?.displayName,
        });

        router.replace("/(tabs)" as any);
      } else {
        setUser(null);
        router.replace("/(auth)/login");
      }
    });

    return () => unSub();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email.toLowerCase(), password);

      return { success: true };
    } catch (err: any) {
      let msg = err.message;
      return { success: false, msg };
    }
  };

  const register = async (
    email: string,
    password: string,
    fullName: string
  ) => {
    try {
      let res = await createUserWithEmailAndPassword(auth, email, password);

      await setDoc(doc(firestore, "users", res?.user?.uid), {
        name: fullName,
        email: email.toLowerCase(),
        uid: res?.user?.uid,
      });

      return { success: true };
    } catch (err: any) {
      let msg = err.message;
      return { success: false, msg };
    }
  };

  const updateUserData = async (uid: string) => {
    try {
      const docRef = doc(firestore, "users", uid);

      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        const userData: UserType = {
          uid: data?.uid || null,
          email: data.email || null,
          name: data.name || null,
          image: data.image || null,
        };

        setUser({ ...userData });
      }
    } catch (err: any) {
      let msg = err.message;
      console.log("Error in updating: ", msg);
    }
  };

  const contextValue: AuthContextType = {
    user,
    setUser,
    login,
    register,
    updateUserData,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be wrapped inside AuthProvider");
  }

  return context;
};
