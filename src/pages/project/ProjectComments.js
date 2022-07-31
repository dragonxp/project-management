import { useEffect, useState } from "react"
import { useAuthContext } from "../../hooks/useAuthContext"
import { timestamp } from "../../firebase/config"
import { useFirestore } from "../../hooks/useFirestore"
import Avatar from '../../components/Avatar'
import formatDistanceToNow from 'date-fns/formatDistanceToNow'

export default function ProjectComments({ project }) {
    const { updateDocument, response } = useFirestore('projects')
    const [newComment, setNewComment] = useState('')
    const { user } = useAuthContext()

    const handleSubmit = (e) => {
        e.preventDefault()

        const commentToAdd = {
            content: newComment,
            displayName: user.displayName,
            photoURL: user.photoURL,
            createdAt: timestamp.fromDate(new Date()),
            id: Math.random()
        }

        updateDocument(project.id, {
            comments: [...project.comments, commentToAdd]
        })
    }

    useEffect(() => {
        if (response.success) setNewComment('')
    }, [response.success])

    return (
        <div className="project-comments">
            <h4>Project Comments</h4>

            <ul>
                {project.comments.length > 0 && project.comments.map(comment => (
                    <li key={comment.id}>
                        <div className="comment-author">
                            <Avatar src={comment.photoURL} />
                            <p>{comment.displayName}</p>
                        </div>
                        <div className="comment-date">
                            <p>{formatDistanceToNow(comment.createdAt.toDate(), { addSuffix: true })}</p>
                        </div>
                        <div className="comment-content">
                            <p>{comment.content}</p>
                        </div>
                    </li>
                ))}
            </ul>

            <form onSubmit={handleSubmit} className="add-comment">
                <label>
                    <textarea
                        type="text"
                        required
                        onChange={(e) => setNewComment(e.target.value)}
                        value={newComment}
                    ></textarea>
                    <button className="btn">Add Comment</button>
                </label>
            </form>
        </div>
    )
}