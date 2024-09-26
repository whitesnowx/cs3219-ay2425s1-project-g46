import React from 'react'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Signup from './user-service/Signup'
import Login from "./user-service/Login"

function App() {
  return (
    <div>
      <BrowserRouter>
      <Routes>
        <Route path='/signup' element={<Signup />}></Route>
        <Route path='/login' element={<Login />}></Route>
      </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App