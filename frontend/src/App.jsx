import { useState } from 'react'
import {BrowserRouter,Routes,Route} from 'react-router-dom'
import SignUp from './components/SignUp'
import LogIn from './components/LogIn'
import TodoList from './components/TodoList'
import './App.css'

function App() {
  

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<SignUp />}></Route>
        <Route path='/register' element={<SignUp />}></Route>
        <Route path='/login' element={<LogIn />}></Route>
        <Route path='/todos' element={<TodoList />}></Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
