import {useContext} from 'react';
import {Button, Container, Navbar, Nav} from 'react-bootstrap';
import {Link} from 'react-router';
import UserContext from '../contexts/UserContext';

function Header(props) {
    const user = useContext(UserContext);

    return (
        <Navbar bg="dark" variant="dark" expand="lg" className="mb-4">
            <Container>
                <Navbar.Brand as={Link} to="/">Race the Rails</Navbar.Brand>
                <Nav className="me-auto">
                    <Nav.Link as={Link} to="/">Instructions</Nav.Link>
                    {user.id && <Nav.Link as={Link} to="/play">Play</Nav.Link>}
                    {user.id && <Nav.Link as={Link} to="/ranking">Ranking</Nav.Link>}
                </Nav>
                <Nav>
                    {user.id ? (
                        <>
                            <Navbar.Text className="me-3">Hello, {user.username}!</Navbar.Text>
                            <Button variant="outline-light" onClick={props.handleLogout}>Logout</Button>
                        </>
                    ) : (
                        <Button variant="primary" as={Link} to="/login">Login</Button>
                    )}
                </Nav>
            </Container>
        </Navbar>
    )
}

export default Header;