import { useState } from 'react'
import { useSignup } from '../../hooks/useSignup'

//styles
import './Signup.css'

export default function Signup() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [displayName, setDisplayName] = useState('')
    const [thumbnail, setThumbnail] = useState(null)
    const [thumbnailError, setThumbnailError] = useState(null)
    const { signup, isPending, error } = useSignup()

    const handleSubmit = (e) => {
        e.preventDefault()
        signup(email, password, displayName, thumbnail)
    }

    const handleFileChange = (e) => {
        setThumbnailError(null)
        let imgFile = e.target.files[0]
        console.log(imgFile)

        if (!imgFile) return setThumbnailError('Please select a file')
        if (!imgFile.type.includes('image')) return setThumbnailError('Selected File must be an image')
        if (imgFile.size > 102400) return setThumbnailError('File size must not exceed 100KB')

        setThumbnailError(null)
        setThumbnail(imgFile)
        console.log('thumbnail updated')
    }

    return (
        <form className='auth-form' onSubmit={handleSubmit}>
            <h2>Sign up</h2>
            <label>
                <span>Email</span>
                <input 
                    type="email" 
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                    required
                />
            </label>
            <label>
                <span>Password</span>
                <input 
                    type="password" 
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}
                    required
                />
            </label>
            <label>
                <span>Display Name</span>
                <input 
                    type="text" 
                    onChange={(e) => setDisplayName(e.target.value)}
                    value={displayName}
                    required
                />
            </label>
            <label>
                <span>Profile Thumbnail</span>
                <input 
                    type="file" 
                    onChange={handleFileChange}
                    required
                />
                {thumbnailError && <div className='error'>{thumbnailError}</div>}
            </label>
            {!isPending && <button className='btn'>Sign up</button>}
            {isPending && <button className='btn' disabled>Loading</button>}
            {error && <div className='error'>{error}</div>}
        </form>
    )
}