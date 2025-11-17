import { useRef } from 'react'


export default function useSpeechSynthesis() {
const synthRef = useRef(window.speechSynthesis)


function speak(text, onEnd) {
if (!synthRef.current) return
if (synthRef.current.speaking) {
synthRef.current.cancel()
}


const utterance = new SpeechSynthesisUtterance(text)


utterance.onstart = () => {
// nothing — main module orchestrates start/stop of recognition
}


utterance.onend = () => {
  // AUTO-RESUME LISTENING AFTER SPEAKING
  if (window.__visionlink && window.__visionlink.listen) {
    window.__visionlink.listen()
  }

  if (onEnd) onEnd()
}


utterance.onerror = (e) => {
console.error('Speech synthesis error', e)
if (onEnd) onEnd()
}


synthRef.current.speak(utterance)
}


function cancel() {
synthRef.current && synthRef.current.cancel()
}


return { speak, cancel }
}