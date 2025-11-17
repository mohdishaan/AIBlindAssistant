import React, { useRef, useEffect } from 'react'
import useCamera from '../hooks/useCamera'
import useSpeechRecognition from '../hooks/useSpeechRecognition'
import { sendToGemini } from '../services/geminiService'


export default function VideoFeed({ setStatus, setResponseText, speak }) {
const videoRef = useRef(null)
const canvasRef = useRef(null)
const { startCamera, stopCamera, stream } = useCamera(videoRef)


const onTranscript = async (transcript) => {
setStatus(`Heard: "${transcript}". Processing...`)
setResponseText('')


const base64 = captureFrame()
if (!base64) {
speak("I couldn't capture the video frame. Please try again.")
return
}


setStatus('Thinking...')
try {
const text = await sendToGemini(transcript, base64)
setResponseText(text.replace(/\*\*/g, ""))
speak(text)
} catch (err) {
console.error(err)
setStatus('Error connecting to AI. Please try again.')
}
}
const { startListening, stopListening } = useSpeechRecognition({ onResult: onTranscript, setStatus })


useEffect(() => {
// nothing here; starting/stopping controlled by buttons through events
return () => {
stopCamera()
stopListening()
}
}, [])


function captureFrame() {
try {
const canvas = canvasRef.current
const video = videoRef.current
if (!canvas || !video) return null


canvas.width = video.videoWidth
canvas.height = video.videoHeight
const ctx = canvas.getContext('2d')
ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
const dataUrl = canvas.toDataURL('image/jpeg', 0.7)
return dataUrl.split(',')[1]
} catch (err) {
console.error('capture error', err)
return null
}
}


// Expose some functions to window for ControlButtons to call (simple approach)
useEffect(() => {
window.__visionlink = {
start: async () => {
setStatus('Requesting permissions...')
try {
await startCamera()
setStatus('Assistant is active')
speak("Hi! I'm ready. What are you looking for?")
startListening()

// startListening will be triggered after speech synthesis ends in the hook
} catch (err) {
console.error(err)
setStatus('Error: Could not access camera or microphone.')
}
},
stop: () => {
stopCamera()
stopListening()
setStatus('Click \"Start\" to begin...')
setResponseText('')
},
listen: () => {
  startListening()
},
}
}, [startCamera, stopCamera, startListening, stopListening, setStatus, setResponseText, speak])


return (
<>
<video ref={videoRef} id="videoElement" className="w-full h-full object-cover" autoPlay muted playsInline />
<canvas ref={canvasRef} id="captureCanvas" className="hidden" />
</>
)
}