import {Container, Form, Button, Alert} from 'react-bootstrap';
import {useState} from 'react';
import {doLogin} from '../api/auth.js';

function LoginForm(props) {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        setErrorMessage('');

        if (username.trim() === '' || password.trim() === '') {
            setErrorMessage('Please submit both username and password');
            return
        }

        try {
            const user = await doLogin(username, password);
            props.doLogin(user);
        } catch (ex) {
            setErrorMessage(ex.message)
        }
    }

    return (
        <Container className="text-center mt-5">
            <h2>Registered Users Login</h2>

            {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}

            <Form onSubmit={handleSubmit} className="border p-4 rounded shadow-sm bg-light">
                <Form.Group className="mb-3">
                    <Form.Label>Username</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Insert your username"
                        value={username}
                        onChange={(e)=>setUsername(e.target.value)}
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        type="password"
                        placeholder="Insert your password"
                        value={password}
                        onChange={(e)=>setPassword(e.target.value)}
                    />
                </Form.Group>

                <Button variant="primary" type="submit" className="w-100">
                    Log in 
                </Button>
            </Form>
        </Container>
    )
}

export default LoginForm;