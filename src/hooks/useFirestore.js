import { useState, useEffect, useReducer } from "react"
import { projectFirestore, timestamp } from '../firebase/config'

const inititalState = {
    isPending: false,
    document: null,
    success: null,
    error: null
}

const firestoreReducer = (state, action) => {
    switch (action.type) {
        case 'IS_PENDING':
            return { isPending: true, document: null, success: false, error: null }
        case 'ADDED_DOCUMENT':
            return { isPending: false, document: action.payload, success: true, error: null }
        case 'DELETED_DOCUMENT':
            return { isPending: false, document: null, success: true, error: null }
        case 'UPDATED_DOCUMENT':
            return { isPending: false, document: action.payload, success: true, error: null }
        case 'ERROR':
            return { isPending: false, document: null, success: false, error: action.payload }
        default:
            return state
    }
}

export const useFirestore = (collection) => {
    const [response, dispatch] = useReducer(firestoreReducer, inititalState)
    const [isCancelled, setIsCancelled] = useState(false)

    // firestore collection ref
    const ref = projectFirestore.collection(collection)

    // only dispatch if isCancelled = false
    const dispatchIfNotCancelled = (action) => {
        if (!isCancelled) dispatch(action)
    }

    // add a document
    const addDocument = async (doc) => {
        dispatchIfNotCancelled({ type: 'IS_PENDING' })

        try {
            const createdAt = timestamp.fromDate(new Date())
            const addedDocument = await ref.add({ ...doc, createdAt })
            dispatchIfNotCancelled({ type: 'ADDED_DOCUMENT', payload: addedDocument })
        } catch (err) {
            dispatchIfNotCancelled({ type: 'ERROR', payload: err.message })
        }
    }

    // delete a document
    const deleteDocument = async (id) => {
        dispatchIfNotCancelled({ type: 'IS_PENDING' })

        try {
            await ref.doc(id).delete()
            dispatchIfNotCancelled({ type: 'DELETED_DOCUMENT' })
        } catch (err) {
            dispatchIfNotCancelled({ type: 'ERROR', payload: err.message })
        }
    }

    // update a document
    const updateDocument = async (id, updates) => {
        dispatchIfNotCancelled({ type: 'IS_PENDING' })

        try {
            const updatedDocument = await ref.doc(id).update(updates)
            dispatchIfNotCancelled({ type: 'UPDATED_DOCUMENT', payload: updatedDocument})
            return updatedDocument
        } catch (err) {
            dispatchIfNotCancelled({ type: 'ERROR', payload: err.message })
            return null
        }
    }

    useEffect(() => {
        return () => setIsCancelled(true)
    }, [])

    return { addDocument, deleteDocument, updateDocument, response }
}