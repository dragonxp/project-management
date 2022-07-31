import Avatar from "../../components/Avatar"
import { useAuthContext } from '../../hooks/useAuthContext'
import { useFirestore } from "../../hooks/useFirestore"
import { useNavigate } from 'react-router-dom'

export default function ProjectSummary({ project }) {
    const { user } = useAuthContext()
    const { deleteDocument } = useFirestore('projects')
    const navigate = useNavigate()

    const handleComplete = () => {
        deleteDocument(project.id)
        navigate('/')
    }

    return (
        <div>
            <div className="project-summary">
                <h2 className="page-title">{project.name}</h2>
                <p>By {project.createdBy.displayName}</p>
                <p className="due-date">
                    Project Due by {project.dueDate.toDate().toDateString()}
                </p>
                <p className="details">{project.details}</p>
                <h4>Project is assigned to:</h4>
                <div className="assigned-users">
                    {project.assignedTo.map(user => (
                        <div key={user.id}>
                            <Avatar src={user.photoURL} />
                        </div>
                    ))}
                </div>
            </div>
            {user.uid === project.createdBy.id && (
                <button className="btn" onClick={handleComplete}>Mark as Complete</button>
            )}
        </div>
    )
}