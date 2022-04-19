import React from 'react'
import axios from 'axios'
import Nbar from 'react-bootstrap/Navbar'
import Container from 'react-bootstrap/Container'
import Nav from 'react-bootstrap/Nav'
import 'bootstrap/dist/css/bootstrap.min.css'
import { Button } from 'antd'

const Navbar = ({ name }) => (
  <Nbar bg="dark" variant="dark" style={{ color: 'white' }}>
    <Container>
      <Nbar.Brand href="/">Blackjack</Nbar.Brand>
      <Nav className="me-auto">
        <Nav.Link href="/home">Home</Nav.Link>
        <Nav.Link href="/gameOne">Game One</Nav.Link>
        <Nav.Link href="/gameTwo">Game Two</Nav.Link>
        <Nav.Link href="/gameThree">Game Three</Nav.Link>
      </Nav>
      <div className="d-flex" style={{ marginRight: 20 }}>
        {`Welcome,  ${name}!  `}
      </div>
      <a href="/logout">
        <Button
          type="primary"
          shape="round"
        >
          Logout
        </Button>
      </a>
    </Container>
  </Nbar>
)

export default Navbar
