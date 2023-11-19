import React, { useState } from "react";
import { Container, Form, Button } from "react-bootstrap";
import "../style/SignUp.css";
import { Link, useNavigate } from "react-router-dom"

const SignUp = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: ""
    });

    const navigate = useNavigate();


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
            // Make a POST request to your signup API
            const response = await fetch("http://localhost:5000/signup", {
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
              console.error("Signup failed:", response.statusText);
            }
          } catch (error) {
            console.error("An error occurred during signup:", error);
          }
    }

    return (
        <Container>
            <h1>Registration form</h1>
            <Form onSubmit={handleSubmit}>
                <Form.Group>
                    <Form.Label className="formlabel">Name</Form.Label>
                    <Form.Control type="text" name="name" value={formData.name} onChange={handleChange} required />
                </Form.Group>

                <Form.Group>
                    <Form.Label>Email</Form.Label>
                    <Form.Control type="text" name="email" value={formData.email} onChange={handleChange} required />
                </Form.Group>

                <Form.Group>
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="text" name="password" value={formData.password} onChange={handleChange} required />
                </Form.Group>
                <Button variant="primary" type="submit" >Register</Button>
                <p>Already have an account?<Link to="/login">Login</Link></p>
            </Form>
        </Container>
    );
}
export default SignUp