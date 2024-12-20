import {auth} from "@/firebaseConfig"
import { GoogleAuthProvider,onAuthStateChanged,signInWithPopup } from 'firebase/auth'
const provider = new GoogleAuthProvider();

export  default async function signInWithGoogle(){

    try {
        const result = await signInWithPopup(auth,provider)
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential?.accessToken;

        // The signed-in user info.
        const user = result.user;
        if(user){  
            return user
        }
    }catch(err){
        return err
    }

}