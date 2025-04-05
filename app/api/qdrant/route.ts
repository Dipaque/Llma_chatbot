import { NextResponse } from "next/server";
import { QdrantClient } from "@qdrant/js-client-rest";
import { generateEmbedding } from "@/lib/utils";
import crypto from "crypto"

const client = new QdrantClient({
    url: "https://61b605c9-f773-4c78-a69b-e4e727df76bf.us-east4-0.gcp.cloud.qdrant.io:6333",
    apiKey: process.env.QDRANT_API_KEY,
});

export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const query:string = searchParams.get("query");
    if (!query) {
        return NextResponse.json({ success: false, error: "Query is required." }, { status: 400 });
      }
    try {
        // 1. Get embedding for the user's query
    const queryEmbedding = await generateEmbedding(query);

    // 2. Perform similarity search in Qdrant
    const searchResults = await client.search("chitti_knowledge_base", {
      vector: queryEmbedding,
      limit: 5,
      with_payload: true,
      score_threshold:0.8
    });
    // 3. Extract relevant context
    const contextChunks = searchResults
      .map((item: any) => item.payload?.response || "")
      .filter(Boolean)
      .join("\n\n");
      return NextResponse.json({ success: true,data:contextChunks }, { status: 200 });
    } catch (error:any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
export async function PUT(req) {
    try {
        const body = await req.json();
        console.log(body)
        const vector = await generateEmbedding(body.query)
        if(body.vectorId){
          await client.delete("chitti_knowledge_base", {
            points: [body.vectorId],
          });
          console.log("inside")
          const response = await client.upsert("chitti_knowledge_base", {
            points: [
                {
                  id: body.vectorId,
                  payload: {
                   query: body.query,
                   response: body.response
                  }, 
                  vector: vector,
                },
              ],
        });
        return NextResponse.json({ success: true,data:body.vectorId }, { status: 200 });
        }else{
          const searchResult = await client.search("chitti_knowledge_base", {
            vector: vector,
            limit: 1,
            with_payload: true,
            score_threshold: 0.8,
          });
          if(searchResult.length===0){
            const id = crypto.randomUUID();
         const response = await client.upsert("chitti_knowledge_base", {
                points: [
                    {
                      id: id,
                      payload: {
                       query: body.query,
                       response: body.response
                      }, 
                      vector: vector,
                    },
                  ],
            });
            return NextResponse.json({ success: true,data:id }, { status: 200 });
          }else{
            searchResult.sort((a,b)=>b.score-a.score)
            return NextResponse.json({ success: true,data:searchResult[0].id }, { status: 200 });
        
          }
        }
        
    } catch (error:any) {
      console.log(error)
        return NextResponse.json({ success: false, error: error }, { status: 500 });
    }
}

