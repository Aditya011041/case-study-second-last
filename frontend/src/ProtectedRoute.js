import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function ProtectedRoute(props) {
    const navigate = useNavigate();
    const {Component} = props
    useEffect (()=>{
    const admin  = sessionStorage.getItem('admin bhai')
    if(!admin){
        navigate('/')
    }
    })
  return (
    <div>
        <Component/>
    </div>
  )
}

export default ProtectedRoute