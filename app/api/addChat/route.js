import { NextResponse } from "next/server";
import { collection, addDoc, getDocs, query, where, orderBy, deleteDoc, doc, updateDoc, arrayUnion, getDoc } from "firebase/firestore";
import { db } from "../../../firebaseConfig"; // Update path if needed

// POST Method for Adding a Chat
export async function POST(req) {
  try {
    const body = await req.json();

    const docRef = await addDoc(collection(db, "Chats"), {
      email:body.email,
      title:"New Chat",
      messages:[],
      timestamp:new Date().toISOString()
    });

    return NextResponse.json({ success: true, id: docRef.id });
  } catch (error) {
    console.error("Error adding document:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(req) {
  try {
    const body = await req.json();

    if(body.title){
      const docRef = await updateDoc(doc(db, "Chats",body.id), {
        messages:arrayUnion(body.message),
        title:body.title
      });
      
    return NextResponse.json({ success: true,  });
    }else{
      const docRef = await updateDoc(doc(db, "Chats",body.id), {
        messages:arrayUnion(body.message),
      });
      return NextResponse.json({ success: true });
    }

  } catch (error) {
    console.error("Error adding document:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// GET Method for Fetching Chats by Email
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Chat Id query parameter is required." },
        { status: 400 }
      );
    }

    const collRef = collection(db, "Chats");
 
    const querySnapshot = await getDoc(doc(collRef,id));

    const chats = querySnapshot.data().messages;
    const sortedChats = chats.sort((a,b)=>new Date(a.timestamp) - new Date(b.timestamp));

    return NextResponse.json({ success: true, data: sortedChats, title:querySnapshot.data().title });
  } catch (error) {
    console.error("Error fetching chats:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}


export async function DELETE(req) {
  try{
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const chats = searchParams.get("chats");
    if (!chats) {
      return NextResponse.json(
        { success: false, message: "No chat  deleted." },
        { status: 400 }
      );
    }
    const collRef = collection(db, "Chats");
    const response =  await updateDoc(doc(collRef,id),{
      messages:JSON.parse(chats)
    });
    return NextResponse.json({success:true,message:"Chat deleted"})
  }
  catch(error){
    console.error("Error fetching chats:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}