import { useState, useEffect, useRef } from "react"
import { projectFirestore } from "../firebase/config"

export const useCollection = (collection, _query, _orderBy) => {
    const [isPending, setIsPending] = useState(false)
    const [error, setError] = useState(null)
    const [documents, setDocuments] = useState(null)

    // if we don't use a ref --> infinite loop in useEffect
    // _query is an array and is "different" on every function call
    const query = useRef(_query).current
    const orderBy = useRef(_orderBy).current

    useEffect(() => {
        setIsPending(true)
        let ref = projectFirestore.collection(collection)

        if (query) ref = ref.where(...query)

        if (orderBy) ref = ref.orderBy(...orderBy)

        const unsub = ref.onSnapshot((snapshot) => {
            let results = []
            snapshot.docs.forEach(doc => {
                results.push({ ...doc.data(), id: doc.id })
            })

            //update states
            setDocuments(results)
            setIsPending(false)
            setError(null)
        }, (err) => {
            setIsPending(false)
            console.log(err.message)
            setError(err.message)
        })

        //unsubscribe when unmount
        return () => unsub()
    }, [collection, query, orderBy])

    return { documents, error, isPending }
}