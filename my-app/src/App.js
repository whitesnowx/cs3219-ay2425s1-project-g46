import React from 'react'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Signup from './Signup'

function App() {
  return (
    <div>
      <BrowserRouter>
      <Routes>
        <Route path='/signup' element={<Signup />}></Route>
      </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App