import React, { createContext, useContext, useEffect, useReducer,  useState } from 'react'
import { onAuthStateChanged } from 'firebase/auth';
import { auth, firestore } from '../config/firebase';
import { doc, getDoc } from 'firebase/firestore';
 const AuthContext = createContext()
const initialState = { isAuth: false, user: {} }
const reducer = (state, { type, payload }) => {
    switch (type) {
        case "SET-LOGGED-IN":
            return { ...state, isAuth: true, user: payload.user };
        case "SET-LOGGED-OUT":
            return initialState;
        default:
            return state; 
    }
};

export default function AuthContextProvider({ children }) {
    const [state, dispatch] = useReducer(reducer, initialState)
    const [isAppLoading, setIsAppLoading] = useState(false)
    const [blockAuthCheck, setBlockAuthCheck] = useState(false); 
    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (blockAuthCheck) return;
           if (user) {
                console.log("user", user);
                readUserProfile(user)        
            } else {
                dispatch({ type: "SET-LOGGED-OUT" });
            }
        });
    }, [blockAuthCheck]);
    const readUserProfile = async(user)=>{
    const docSnap = await getDoc(doc(firestore, "user",user.uid ));
if (docSnap.exists()) {
    const userData =  docSnap.data()
    dispatch({ type: "SET-LOGGED-IN", payload: { user: userData} });
} else {
  // docSnap.data() will be undefined in this case
  console.log("No such document!");
}
    }
    return (
        <AuthContext.Provider value={{ ...state, dispatch, isAppLoading,setIsAppLoading, setBlockAuthCheck }}>
            {children}
        </AuthContext.Provider>
    )
}
export const useAuthContext = () => useContext(AuthContext)