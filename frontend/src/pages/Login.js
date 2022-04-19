import React from 'react'
import {
  Row,
  Col,
  Button,
  Typography,
} from 'antd'

const { Title } = Typography

const Login = () => (
  <div style={{ height: '100%' }}>
    <Row style={{ alignItems: 'center', justifyContent: 'center' }}>
      <Col
        flex={1}
        span={6}
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 30,
          border: '10px solid rgba(0, 0, 0, 0.05)',
          textAlign: 'center',
          height: '100%',
          marginTop: 140,
          paddingTop: 50,
          paddingBottom: 50,
        }}
      >
        <Title level={1}>Sign in</Title>
        <br />
        <Button>
          <a href="http://localhost:3000/login/federated/google">
            <img
              width="20px"
              style={{
                marginBottom: '3px',
                marginRight: '5px',
              }}
              alt="Google sign-in"
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/512px-Google_%22G%22_Logo.svg.png"
            />
            Sign in with Google
          </a>
        </Button>
      </Col>
    </Row>
  </div>
)

export default Login
