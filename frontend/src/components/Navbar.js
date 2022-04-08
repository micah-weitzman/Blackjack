import React from 'react'
import Nbar from 'react-bootstrap/Navbar'
import Container from 'react-bootstrap/Container'
import Nav from 'react-bootstrap/Nav'
import 'bootstrap/dist/css/bootstrap.min.css'

const Navbar = ({ name }) => (
  <Nbar bg="dark" variant="dark" style={{ color: 'white' }}>
    <Container>
      <Nbar.Brand href="/">Blackjack</Nbar.Brand>
      <Nav className="me-auto">
        <Nav.Link href="/home">Home</Nav.Link>
        <Nav.Link href="/game">Game</Nav.Link>
      </Nav>
      <div className="d-flex">
        {`Welcome ${name}`}
      </div>
    </Container>
  </Nbar>

)

export default Navbar
