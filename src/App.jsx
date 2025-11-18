import React from 'react'
import { BrowserRouter, Routes ,Route } from 'react-router-dom'
import Home from './pages/Home'
import CreateMyrun from './pages/CreateMyrun'
import ShowAllMyrun from './pages/ShowAllMyRun'
import UpdateMyrun from './pages/UpdateMyrun'

export default function App() {
  return (
    <>
    <BrowserRouter>
    <Routes>
    <Route path='/' element={<Home/>}/>
    <Route path='/createmyrun' element={<CreateMyrun/>}/>
    <Route path='/showallmyrun' element={<ShowAllMyrun/>}/>
    <Route path='/updatemyrun/:id' element={<UpdateMyrun/>}/>
    </Routes>
    </BrowserRouter>
    </>
  )
}
