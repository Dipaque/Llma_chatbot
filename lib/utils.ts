import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export  const formatResponse = (text:string) => {
  const lines = text.split('\n').filter((line) => line.trim() !== ''); // Split into lines
  const formatted = lines.map((line, index) => {
    if (line.startsWith('const')) {
      return { type: 'code', content: line }; // Code snippet
    } else if (/^\d+\./.test(line)) {
      return { type: 'list', content: line }; // List item
    }
    return { type: 'text', content: line }; // Regular text
  })
};

export const speakText = (text:string) => {
  const utterance = new SpeechSynthesisUtterance(text);

  // Set voice properties (optional)
  utterance.rate = 1; // Speed (0.1 to 10, default is 1)
  utterance.pitch = 1; // Pitch (0 to 2, default is 1)
  utterance.volume = 1; // Volume (0 to 1, default is 1)

  // Speak the text
  speechSynthesis.speak(utterance);
}



export const copyText = (text:string) => {
  window.navigator.clipboard.writeText(text);
}




const apiKey = process.env.MISTRAL_EMBEDDING_KEY


export const generateEmbedding = async (text: string): Promise<number[]> => {
  const input = {
    model: "mistral-embed",
    input: [text],
  };

  try {
    const response = await fetch("https://api.mistral.ai/v1/embeddings", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`, // Ensure apiKey is correctly set
        "Content-Type": "application/json",
      },
      body: JSON.stringify(input),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();

    if (!data || !data.data || !data.data[0]?.embedding) {
      throw new Error("Invalid response structure");
    }

    return data.data[0].embedding; // Ensure it returns the correct format
  } catch (error) {
    console.error("Error generating embedding:", error);
    throw error; // Rethrow error for better debugging
  }
};
