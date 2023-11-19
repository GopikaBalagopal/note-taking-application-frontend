import React, { useEffect, useState } from "react";
import { Container, Form, Button } from "react-bootstrap";
import "../style/Login.css";
import { Link, useNavigate } from "react-router-dom"

const Login = () => {
    const [formData,setFormData]=useState({
        email: "",
        password: ""
    })
    const navigate = useNavigate();

    useEffect(() => {
        // Check for an existing token in localStorage on component mount
        const existingToken = localStorage.getItem("token");

        if (existingToken) {
            // Perform auto-login or redirect to the home page
            
            navigate("/home");
        }
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData({
            ...formData,
            [name]: value
        })
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(formData)

        try {
            // Make a POST request to your login API
            const response = await fetch("http://localhost:5000/login", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(formData),
            });
      
            // Handle the response
            if (response.ok) {
              const data = await response.json();
      
              // Save the token to localStorage
              localStorage.setItem("token", data.token);
      
              // Redirect to the "/home" page
              navigate("/home");
            } else {
              // Handle errors, e.g., display an error message
              console.error("Login failed:", response.statusText);
            }
          } catch (error) {
            console.error("An error occurred during login:", error);
          }
    }

    return (
        <Container>
        <h1>Login form</h1>
        <Form onSubmit={handleSubmit}>
            
            <Form.Group>
                <Form.Label>Email</Form.Label>
                <Form.Control type="text" name="email" value={formData.email} onChange={handleChange} required />
            </Form.Group>
       
            <Form.Group>
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" name="password" value={formData.password} onChange={handleChange} required />
            </Form.Group>
            <Button variant="primary" type="submit" >Login</Button>
            <p>Create new account?<Link to="/">signup</Link></p>
        </Form>
    </Container>
    )
}

export default Login