import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuthContext } from './hooks/useAuthContext'

//styles
import './App.css'

//pages and components
import Dashboard from './pages/dashboard/Dashboard'
import Create from './pages/create/Create'
import Project from './pages/project/Project'
import Login from './pages/login/Login'
import Signup from './pages/signup/Signup'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import OnlineUsers from './components/OnlineUsers'

function App() {
	const { user, isAuthReady } = useAuthContext()

	return (
		<div className="App">
			{isAuthReady && (
				<BrowserRouter>
					{user && <Sidebar />}
					<div className="container">
						<Navbar />
						<Routes>
							<Route path="/" element={user ? <Dashboard /> : <Navigate to='/login' />} />
							<Route path="create" element={user ? <Create /> : <Navigate to='/login' />} />
							<Route path="projects/:id" element={user ? <Project /> : <Navigate to='/login' />} />
							<Route path="login" element={!user ? <Login /> : <Navigate to='/' />} />
							<Route path="signup" element={!user ? <Signup /> : <Navigate to='/' />} />
							<Route path="*" element={<Navigate to='/' />} />
						</Routes>
					</div>
					{user && <OnlineUsers />}
				</BrowserRouter>
			)}
		</div>
	);
}

export default App;
