import {Container} from 'react-bootstrap';

function LoginForm(props) {
    return (
        <Container className="text-center mt-5">
            <h2>Registered Users Login</h2>
            <p>Form for login</p>
            <button className="btn btn-success mt-3" onClick={() => props.doLogin({id: 1, username:"test_user"})}>
                Prova login
            </button>
        </Container>
    )
}

export default LoginForm;