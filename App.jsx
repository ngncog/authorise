import { useState } from 'react'
import { BrowserRouter, Link, Routes, Route } from 'react-router-dom'
import './App.css'

function Auth({mode}) {
  const [username,setUsername] = useState('')
  const [password,setPassword] = useState('')
  const [message,setMessage] = useState('')
  const [loading,setLoading] = useState(false)
  
  const handleSubmit = async(e) => {
    e.preventDefault()
    if (!username || !password ) {
      setMessage('Please enter the blank')
      return
    }
    setLoading(true)
    try {
      const res = await fetch('http://localhost:5000/backend',{
      method : 'POST',
      headers: {'content-type': 'application/json'},
      body: JSON.stringify({username,password,action: mode})
    })
    const data = await res.json()
    setMessage(data.message || (data.success ? 'success' : 'failed'))
  } catch(err){
    console.log('connection error:',err)
    setMessage('server connection error')
  } finally{
    setLoading(false)
    setUsername('')
    setPassword('')
  }
  }
  const isLogin = mode === 'login'

  return(

    <div className='flex flex-col items-center justify-center min-h-screen mx-48 bg-blue-400'>
      <form onSubmit={handleSubmit} className='flex flex-col items-center p-6 gap-4 w-80 rounded-lg shadow-2xl bg-white '>
        <h2 className='text-2xl font-bold py-4'>{isLogin? 'Login' : 'Register'}</h2>
        <input type="text" placeholder='Enter username' className='w-full py-2 px-4 rounded-md border focus:outline-none focus:ring-2 focus:ring-blue-500' value={username} onChange={(e)=>setUsername(e.target.value)}/>
        <input type="password" placeholder='Enter password' className='w-full py-2 px-4 rounded-md border focues:outline-none focus:ring-2 focus:ring-blue-500' value={password} onChange={(e)=>setPassword(e.target.value)}/>
        <button type='submit' className=' min-w-20 rounded-lg py-2 bg-blue-500 text-white font-semibold hover:bg-blue-400 disabled:opacity-50'  disabled={loading} > {loading ? 'Loading...' : 'Submit'}</button>
        <Link to={isLogin ? '/register' : '/'}> {isLogin ? 'Register' : 'Login'}</Link>
      </form>
      <p className='text-lg mt-4 text-red-500'>{message}</p>
    </div>
    
  )
}


function App() {
  return (
    <BrowserRouter>

      <Routes>
        <Route path='/' element={<Auth mode='login' />} />
        <Route path='/register' element={<Auth mode='register' />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App


