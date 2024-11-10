import { Link, Outlet } from "react-router-dom";
import { Navbar, Nav, Container } from 'react-bootstrap';

export default function NavigationBar() {
    return (
      <>
        <Navbar bg="dark" variant="dark" expand="lg">
           <Container>
              <Navbar.Brand>
                 <img src="https://ik.imagekit.io/rmhnagyqw/habitatT/logo.png?updatedAt=1720008714144" alt="logo" className='h-12 w-12' style={{ width: 60, height: 60 }}/>
              </Navbar.Brand>
              <Nav className="me-auto">
                <Nav.Link as={Link} to="/">Home</Nav.Link>
                <Nav.Link as={Link} to="/about">About Us</Nav.Link>
                <Nav.Link as={Link} to="/contact">Contact Us</Nav.Link>
                <Nav.Link as={Link} to="/login">Login</Nav.Link> 
              </Nav>
           </Container>
        </Navbar>
        <Outlet />
      </>
    );
}
