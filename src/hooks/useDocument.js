import { useState, useEffect } from "react"
import { projectFirestore } from "../firebase/config"

export const useDocument = (collection, id) => {
    const [document, setDocument] = useState('')
    const [error, setError] = useState(null)

    useEffect(() => {
        const ref = projectFirestore.collection(collection).doc(id)

        const unsub = ref.onSnapshot((snapshot) => {
            if (snapshot.data()) {
                setDocument({ ...snapshot.data(), id: snapshot.id })
                setError(null)
            } else setError('No project found with that Id')
        }, (err) => {
            console.log(err.message)
            setError(err.message)
        })

        return () => unsub()
    }, [collection, id])

    return { document, error }
}