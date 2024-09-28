import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Signup from './user-service/Signup'
import Login from "./user-service/Login"
import UserRestrictedRoute from './common/UserRestrictedRoute'

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          {/* logged-in users cannot access routes included in 'UserRestrictedRoute' */}
          <Route element={<UserRestrictedRoute />}>
            <Route path='/user/signup' element={<Signup />}></Route>
            <Route path='/user/login' element={<Login />}></Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App