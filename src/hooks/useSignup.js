import { useState, useEffect } from "react"
import { projectAuth, projectStorage, projectFirestore } from "../firebase/config"
import { useAuthContext } from "./useAuthContext"


export const useSignup = () => {
    const [isCancelled, setIsCancelled] = useState(false)
    const [error, setError] = useState(null)
    const [isPending, setIsPending] = useState(false)
    const { dispatch } = useAuthContext()

    const signup = async ( email, password, displayName, thumbnail) => {
        setError(null)
        setIsPending(true)

        try {
            //signup user here
            const res = await projectAuth.createUserWithEmailAndPassword(email, password)

            if (!res) throw new Error('Could not signup')

            //upload thumbnail and get download url
            const uploadPath = `thumbnails/${res.user.uid}/${thumbnail.name}`
            const img = await projectStorage.ref(uploadPath).put(thumbnail)
            const imgUrl = await img.ref.getDownloadURL()

            //add displayName and thumbnail to user
            await res.user.updateProfile({ displayName, photoURL: imgUrl })

            //create a user document
            await projectFirestore.collection('users').doc(res.user.uid).set({
                online: true,
                displayName,
                photoURL: imgUrl
            })

            //dispatch login event
            dispatch({ type: 'LOGIN', payload: res.user })

            if (!isCancelled) {
                setIsPending(false)
                setError(null)
            }
        } catch (err) {
            if (!isCancelled) {
                console.log(err.message)
                setError(err.message)
                setIsPending(false)
            }
        }
    }

    useEffect(() => {
        return () => setIsCancelled(true)
    }, [])

    return { error, isPending, signup }
}