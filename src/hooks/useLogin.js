import { useState, useEffect } from "react"
import { useAuthContext } from "./useAuthContext"
import { projectAuth, projectFirestore } from "../firebase/config"


export const useLogin = () => {
    const [isCancelled, setIsCancelled] = useState(false)
    const [error, setError] = useState(null)
    const [isPending, setIsPending] = useState(false)
    const { dispatch } = useAuthContext()

    const login = async (email, password) => {
        setError(null)
        setIsPending(true)

        try {
            const res = await projectAuth.signInWithEmailAndPassword(email, password)

            // update online status
            await projectFirestore.collection('users').doc(res.user.uid).update({ online: true })

            //dispatch login action
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

    return { error, isPending, login }
}