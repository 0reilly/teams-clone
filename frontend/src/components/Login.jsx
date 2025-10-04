import React, { useState } from 'react'
import styled from 'styled-components'
import { useAuth } from '../contexts/AuthContext'

const LoginContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: linear-gradient(135deg, #464EB8 0%, #6264A7 100%);
`

const LoginCard = styled.div`
  background: white;
  padding: 40px;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  width: 400px;
  max-width: 90vw;
`

const Title = styled.h1`
  color: #464EB8;
  text-align: center;
  margin-bottom: 30px;
  font-size: 28px;
  font-weight: 600;
`

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`

const Input = styled.input`
  padding: 12px 16px;
  border: 2px solid #E1E5F2;
  border-radius: 4px;
  font-size: 16px;
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: #464EB8;
  }

  &::placeholder {
    color: #A0A3BD;
  }
`

const Button = styled.button`
  background: #464EB8;
  color: white;
  border: none;
  padding: 12px 16px;
  border-radius: 4px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background: #3A4194;
  }

  &:disabled {
    background: #A0A3BD;
    cursor: not-allowed;
  }
`

const ToggleText = styled.p`
  text-align: center;
  margin-top: 20px;
  color: #666;
`

const ToggleButton = styled.button`
  background: none;
  border: none;
  color: #464EB8;
  cursor: pointer;
  font-weight: 600;
  text-decoration: underline;

  &:hover {
    color: #3A4194;
  }
`

const ErrorMessage = styled.div`
  background: #FFE6E6;
  color: #D13438;
  padding: 12px;
  border-radius: 4px;
  border: 1px solid #D13438;
  text-align: center;
`

function Login() {
  const [isLogin, setIsLogin] = useState(true)
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const { login, register } = useAuth()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      let result
      
      if (isLogin) {
        result = await login(formData.email, formData.password)
      } else {
        result = await register(formData.email, formData.username, formData.password)
      }

      if (!result.success) {
        setError(result.error)
      }
    } catch (err) {
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  const toggleMode = () => {
    setIsLogin(!isLogin)
    setError('')
    setFormData({ email: '', username: '', password: '' })
  }

  return (
    <LoginContainer>
      <LoginCard>
        <Title>Teams Clone</Title>
        
        {error && <ErrorMessage>{error}</ErrorMessage>}
        
        <Form onSubmit={handleSubmit}>
          <Input
            type="email"
            name="email"
            placeholder="Email address"
            value={formData.email}
            onChange={handleChange}
            required
          />
          
          {!isLogin && (
            <Input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          )}
          
          <Input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          
          <Button type="submit" disabled={loading}>
            {loading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Sign Up')}
          </Button>
        </Form>
        
        <ToggleText>
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <ToggleButton type="button" onClick={toggleMode}>
            {isLogin ? 'Sign up' : 'Sign in'}
          </ToggleButton>
        </ToggleText>
      </LoginCard>
    </LoginContainer>
  )
}

export default Login