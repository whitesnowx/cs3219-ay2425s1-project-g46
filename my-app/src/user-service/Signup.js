import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Validation from './SignupValidation'
import axios from 'axios'

function Signup() {
    const [values, setValues] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const [errors, setErrors] = useState({})

    const handleInput = (event) => {
        setValues(prev => ({...prev, [event.target.name]: event.target.value}));

    };

    const naviagte = useNavigate();

    const handleSubmit = (event) => {
        event.preventDefault();
        const validationErrors = Validation(values);
        setErrors(validationErrors);
        
        if (values.name !== "" && 
            values.email !== "" && 
            values.password !== "" && 
            values.confirmPassword !== "" && 
            validationErrors.name === "" && 
            validationErrors.email === "" && 
            validationErrors.password === "" && 
            validationErrors.confirmPassword === "") {
            axios.post("http://localhost:5000/user/signup", values)
            .then(res => {
                naviagte('/');
                setValues({ 
                    name: '',
                    email: '',
                    password: ''});
            })
            .catch(err => {
                if (err.response && err.response.data.message) {
                    setErrors(preErrors => ({...preErrors, email: err.response.data.message}));
                } else {
                    console.log(err);
                }
            });
        }
    };

    
    return (
        <div className='d-flex justify-content-center align-items-center  vh-100'>
            <div className='bg-white p-3 rounded w-50'>
                <h2>Sign-up</h2>
                <form action='' onSubmit={handleSubmit}>
                    <div className='mb-3'>
                        <label htmlFor='name' className='mb-1'><strong>Name</strong></label>
                        <input type='text' placeholder='Your username' name='name' value={values.name} onChange={handleInput} className='form-control'/>
                        {errors.name && <span className='text-danger'> {errors.name}</span>}
                    </div>
                    <div className='mb-3'>
                        <label htmlFor='email' className='mb-1'><strong>Email</strong></label>
                        <input type='email' placeholder='example@example.com' name='email' value={values.email} onChange={handleInput} className='form-control'/>
                        {errors.email && <span className='text-danger'> {errors.email}</span>}
                    </div>
                    <div className='mb-3'>
                        <label htmlFor='password' className='mb-1'><strong>Password</strong></label>
                        <input type='password' placeholder='Password' name='password' value={values.password} onChange={handleInput} className='form-control'/>
                        {errors.password && <span className='text-danger'> {errors.password}</span>}
                    </div>
                    <div className='mb-3'>
                        <label htmlFor='confirmPassword' className='mb-1'><strong>Confirm Password</strong></label>
                        <input type='password' placeholder='Confirm Password' name='confirmPassword' value={values.confirmPassword} onChange={handleInput} className='form-control'/>
                        {errors.confirmPassword && <span className='text-danger'> {errors.confirmPassword}</span>}
                    </div>
                    <button type='submit' style={{
                            backgroundColor: '#333',  /* Dark gray background */
                            color: 'white',            /* White text */
                            padding: '10px 20px',      /* Padding inside the button */
                            borderRadius: '10px',      /* Rounded corners */
                            fontSize: '16px',          /* Font size */
                            border: 'none',            /* Remove default border */
                            cursor: 'pointer',         /* Pointer cursor on hover */
                            transition: 'background-color 0.3s ease', /* Smooth hover effect */
                            float: "right",
                            marginTop: "10px" 
                        }}>Register </button>
                    <p>You are agree to our terms and policies</p>
                    <Link to="/" className='btn btn-default border w-100 bg-light rounded-0 text-decoration-none'>Login</Link>
                </form>
            </div>
    
        </div>
      )
}

export default Signup