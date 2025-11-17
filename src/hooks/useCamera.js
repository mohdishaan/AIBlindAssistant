import { useCallback } from 'react'


export default function useCamera(videoRef) {
let streamRef = { current: null }


const startCamera = useCallback(async () => {
const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' }, audio: true })
streamRef.current = stream
if (videoRef.current) videoRef.current.srcObject = stream
await videoRef.current.play()
}, [videoRef])


const stopCamera = useCallback(() => {
if (streamRef.current) {
streamRef.current.getTracks().forEach(t => t.stop())
streamRef.current = null
}
if (videoRef.current) videoRef.current.srcObject = null
}, [videoRef])


return { startCamera, stopCamera, stream: streamRef }
}