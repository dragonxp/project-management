import { useState } from "react"
import ProjectList from '../../components/ProjectList'
import { useAuthContext } from "../../hooks/useAuthContext"
import { useCollection } from '../../hooks/useCollection'

//styles
import './Dashboard.css'
import ProjectFilter from './ProjectFilter'

export default function Dashboard() {
    const { user } = useAuthContext()
    const { documents, error } = useCollection('projects')
    const [currentFilter, setCurrentFilter] = useState('all')

    const changeFilter = (newFilter) => {
        setCurrentFilter(newFilter)
    }

    const projects = documents ? documents.filter((project) => {
        switch(currentFilter) {
            case 'all':
                return true
            case 'mine':
                let isAssignedToMe = false
                project.assignedTo.forEach((assignedUser) => {
                    if (user.uid === assignedUser.id) isAssignedToMe = true
                })

                return isAssignedToMe
            case 'design':
            case 'development':
            case 'sales':
            case 'marketing':
                return currentFilter === project.category
            default:
                return true
        }
    }) : null

    return (
        <div>
            <h2 className='page-title'>Dashboard</h2>
            {error && <p className='error'>{error}</p>}
            {documents && <ProjectFilter currentFilter={currentFilter} changeFilter={changeFilter} />}
            {projects && <ProjectList projects={projects} />}
        </div>
    )
}