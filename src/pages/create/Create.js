import { useState, useEffect } from 'react'
import Select from 'react-select'
import { useCollection } from '../../hooks/useCollection'
import { timestamp } from '../../firebase/config'
import { useAuthContext } from '../../hooks/useAuthContext'
import { useFirestore } from '../../hooks/useFirestore'
import { useNavigate } from 'react-router-dom'

//styles
import './Create.css'

const CATEGORIES = [
	{ value: 'design', label: 'Design'},
	{ value: 'development', label: 'Development'},
	{ value: 'sales', label: 'Sales'},
	{ value: 'marketing', label: 'Marketing'}
]

export default function Create() {
	const { documents } = useCollection('users')
	const [users, setUsers] = useState([])
	const { user } = useAuthContext()
	const { addDocument, response } = useFirestore('projects')
	const navigate = useNavigate()

	// form field values
	const [name, setName] = useState('')
	const [details, setDetails] = useState('')
	const [dueDate, setDueDate] = useState('')
	const [category, setCategory] = useState('')
	const [assignedUsers, setAssignedUsers] = useState([])
	const [formError, setFormError] = useState(null)

	useEffect(() => {
		if (response.success) navigate('/')
	}, [response.success])
	
	useEffect(() => {
		if (documents) {
			const options = documents.map(user => {
				return { value: user, label: user.displayName }
			})
			
			setUsers(options)
		}
	}, [documents])

	const handleSubmit = (e) => {
		e.preventDefault()
		setFormError(null)

		if(!category) return setFormError('Please select a category')
		if(!assignedUsers.length) return setFormError('Please assign at least 1 user')

		const createdBy = {
			displayName: user.displayName,
			photoURL: user.photoURL,
			id: user.uid
		}

		const assignedTo = assignedUsers.map(u => {
			return {
				displayName: u.value.displayName,
				photoURL: u.value.photoURL,
				id: u.value.id
			}
		})

		const project = {
			name,
			details,
			category: category.value,
			dueDate: timestamp.fromDate(new Date(dueDate)),
			comments: [],
			createdBy,
			assignedTo
		}

		addDocument(project)
	}

	return (
		<form className='create-form' onSubmit={handleSubmit}>
			<h2 className='page-title'>Create a new Project</h2>
			<label>
				<span>Project Name:</span>
				<input 
					required
					type="text"
					onChange={e => setName(e.target.value)}
					value={name}
				/>
			</label>
			<label>
				<span>Project Details:</span>
				<textarea 
					required
					type="text"
					onChange={e => setDetails(e.target.value)}
					value={details}
				></textarea>
			</label>
			<label>
				<span>Due Date:</span>
				<input 
					required
					type="date"
					onChange={e => setDueDate(e.target.value)}
					value={dueDate}
				/>
			</label>
			<label>
				<span>Category</span>
				<Select 
					options={CATEGORIES}
					onChange={(option) => setCategory(option)}
					value={category}
				/>
			</label>
			<label>
				<span>Assign to</span>
				<Select 
					options={users}
					onChange={(option) => setAssignedUsers(option)}
					isMulti
					value={assignedUsers}
				/>
			</label>
			{!response.isPending && <button className='btn'>Add Project</button>}
			{response.isPending && <button className='btn' disabled>Adding Project..</button>}

			{response.error && <p className='error'>{response.error}</p>}
			{formError && <p className='error'>{formError}</p>}
		</form>
	)
}