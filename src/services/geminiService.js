const API_KEY = "AIzaSyCZZjPMrrxSj69vpiiEDjRG2S1Goj58bx0" 
const MODEL_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${API_KEY}`


export async function sendToGemini(text, base64ImageData) {
const systemPrompt = "You are a helpful visual assistant. Your user is showing you a video feed and asking you questions. Answer their question based on what you see in the image. Be concise and descriptive.";


const payload = {
systemInstruction: { parts: [{ text: systemPrompt }] },
contents: [
{
role: 'user',
parts: [
{ text },
{ inlineData: { mimeType: 'image/jpeg', data: base64ImageData } }
]
}
]
}


const response = await fetch(MODEL_URL, {
method: 'POST',
headers: { 'Content-Type': 'application/json' },
body: JSON.stringify(payload)
})


if (!response.ok) throw new Error(`HTTP ${response.status}`)


const json = await response.json()
const candidate = json.candidates?.[0]
const textOut = candidate?.content?.parts?.[0]?.text
if (!textOut) throw new Error('Unexpected API response')
return textOut
}