import { Link, Outlet } from "react-router-dom";
import { Navbar, Nav, Container } from 'react-bootstrap';

export default function NavigationBar() {
    return (
      <>
        <Navbar bg="dark" variant="dark" expand="lg">
           <Container>
              <Navbar.Brand className="d-flex align-items-center">
                 <img src="https://ik.imagekit.io/rmhnagyqw/habitatT/logo.png?updatedAt=1720008714144" alt="logo" className='me-2' style={{ width: 50, height: 50 }}/>
              </Navbar.Brand>
              <Navbar.Toggle aria-controls="navbar-nav"/>
              <Navbar.Collapse id="navbar-nav">
                <Nav className="ms-auto">
                  <Nav.Link as={Link} to="/">Home</Nav.Link>
                  <Nav.Link as={Link} to="/about">About Us</Nav.Link>
                  <Nav.Link as={Link} to="/contact">Contact Us</Nav.Link>
                  <Nav.Link as={Link} to="/login">Login</Nav.Link> 
                </Nav>
              </Navbar.Collapse>
           </Container>
        </Navbar>
        <Outlet />
      </>
    );
}
