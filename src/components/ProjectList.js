import { Link } from 'react-router-dom'
import Avatar from './Avatar'

// styles
import './ProjectList.css'

export default function ProjectList({ projects }) {
    return (
        <div className='project-list'>
            {!projects.length && <p>No projects to show</p>}
            {projects.map(project => (
                <Link to={`/projects/${project.id}`} key={project.id}>
                    <h4>{project.name}</h4>
                    <p>Due by {project.dueDate.toDate().toDateString()}</p>
                    <div className="assigned-to">
                        <ul>
                            {project.assignedTo.map(user => (
                                <li key={user.photoURL}>
                                    <Avatar src={user.photoURL} />
                                </li>
                            ))}
                        </ul>
                    </div>

                </Link>
            ))}
        </div>
    )
}