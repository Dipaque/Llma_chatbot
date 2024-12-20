import { NextResponse,NextRequest } from "next/server";
import { collection, addDoc, query, where, Timestamp, orderBy, onSnapshot, getDocs, limit } from "firebase/firestore";
import { db } from "../../../firebaseConfig";
import { cookies } from "next/headers";

export async function GET(req) {
    try {
      const { searchParams } = new URL(req.url);
      const email = searchParams.get("email");
  
      if (!email) {
        return NextResponse.json(
          { success: false, message: "Email query parameter is required." },
          { status: 400 }
        );
      }
  
      const collRef = collection(db, "Chats");

      const historyQuery = query(
        collRef,
        where("email", "==", email),
        limit(10)
      );
      const querySnapshot = await getDocs(historyQuery);  
      const todayHistory = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      const sortedHistory = todayHistory.sort((a,b)=>new Date(b.timestamp) - new Date(a.timestamp));
  
      return NextResponse.json({ success: true, data: sortedHistory });
    } catch (error) {
      console.error("Error fetching chats:", error);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }
  }