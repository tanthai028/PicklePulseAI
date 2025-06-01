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
import { signInWithEmail } from '../services/supabase'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const toast = useToast()
  const navigate = useNavigate()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    console.log('Attempting login with email:', email)

    try {
      const { data, error } = await signInWithEmail(email, password)
      console.log('Login response:', { data, error })
      
      if (error) {
        // Handle specific error cases
        if (error.message.includes('Email not confirmed')) {
          setError('Please check your email and confirm your account before logging in.')
        } else if (error.message.includes('Invalid login credentials')) {
          setError('Invalid email or password. If you just registered, please confirm your email first.')
        } else {
          throw error
        }
        return
      }

      if (data.user) {
        console.log('Login successful, user:', data.user)
        toast({
          title: 'Login successful',
          status: 'success',
          duration: 3000,
        })
        
        navigate('/dashboard')
      } else {
        throw new Error('No user data received')
      }
    } catch (error: any) {
      console.error('Login error:', error)
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
    <Box 
      h="100vh" 
      w="100vw" 
      display="flex" 
      alignItems="center" 
      justifyContent="center"
    >
      <Box 
        w="400px" 
        bg="white" 
        p={8} 
        rounded="lg" 
        shadow="base"
      >
        <VStack spacing={6}>
          <Heading size="lg">Welcome Back</Heading>
          
          {error && (
            <Alert status="error" rounded="md">
              <AlertIcon />
              <AlertTitle>Login Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleLogin} style={{ width: '100%' }}>
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
                  autoComplete="current-password"
                />
              </FormControl>
              <Button
                type="submit"
                width="100%"
                isLoading={isLoading}
                loadingText="Logging in..."
              >
                Log In
              </Button>
            </VStack>
          </form>
          <Text>
            Don't have an account?{' '}
            <Link to="/register">
              <Text as="span" color="brand.500">
                Sign up
              </Text>
            </Link>
          </Text>
        </VStack>
      </Box>
    </Box>
  )
}

export default Login 