import { useState } from 'react'
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Heading,
  Text,
  useToast,
  Container,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from '@chakra-ui/react'
import { Link, useNavigate } from 'react-router-dom'
import { signUpWithEmail } from '../services/supabase'

const Register = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const toast = useToast()
  const navigate = useNavigate()

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setSuccessMessage(null)

    // Validate password
    if (password.length < 6) {
      setError('Password must be at least 6 characters long')
      setIsLoading(false)
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      setIsLoading(false)
      return
    }

    try {
      console.log('Attempting to register with email:', email)
      const { data, error } = await signUpWithEmail(email, password)
      console.log('Registration response:', { data, error })
      
      if (error) throw error

      if (data.user) {
        setSuccessMessage('Registration successful! Please check your email to confirm your account.')
        toast({
          title: 'Account created',
          description: 'Please check your email to confirm your account',
          status: 'success',
          duration: 5000,
        })
        
        // Don't navigate immediately, let user see the success message
        setTimeout(() => {
          navigate('/login')
        }, 5000)
      } else {
        throw new Error('No user data received')
      }
    } catch (error: any) {
      console.error('Registration error:', error)
      setError(error.message)
      toast({
        title: 'Error',
        description: error.message,
        status: 'error',
        duration: 5000,
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Container maxW="container.sm" py={10}>
      <Box bg="white" p={8} rounded="lg" shadow="base">
        <VStack spacing={6}>
          <Heading size="lg">Create Account</Heading>
          
          {error && (
            <Alert status="error" rounded="md">
              <AlertIcon />
              <AlertTitle>Registration Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {successMessage && (
            <Alert status="success" rounded="md">
              <AlertIcon />
              <AlertTitle>Success!</AlertTitle>
              <AlertDescription>{successMessage}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleRegister} style={{ width: '100%' }}>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Email</FormLabel>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Password</FormLabel>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="new-password"
                  placeholder="At least 6 characters"
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Confirm Password</FormLabel>
                <Input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  autoComplete="new-password"
                />
              </FormControl>
              <Button
                type="submit"
                width="100%"
                isLoading={isLoading}
                loadingText="Creating account..."
              >
                Sign Up
              </Button>
            </VStack>
          </form>
          <Text>
            Already have an account?{' '}
            <Link to="/login">
              <Text as="span" color="brand.500">
                Log in
              </Text>
            </Link>
          </Text>
        </VStack>
      </Box>
    </Container>
  )
}

export default Register 