import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import {
  Container,
  VStack,
  Heading,
  Text,
  Spinner,
  Button,
  useToast,
} from '@chakra-ui/react'
import { supabase } from '../services/supabase'

const EmailConfirm = () => {
  const [searchParams] = useSearchParams()
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()
  const toast = useToast()

  useEffect(() => {
    const confirmEmail = async () => {
      try {
        // Get the token from URL
        const token = searchParams.get('token')
        const type = searchParams.get('type')

        if (!token || type !== 'signup') {
          setError('Invalid confirmation link')
          return
        }

        // Get the session from the token
        const { data: { session }, error: sessionError } = await supabase.auth.getSession()

        if (sessionError) {
          throw sessionError
        }

        if (session) {
          toast({
            title: 'Email confirmed!',
            description: 'Your account has been verified successfully.',
            status: 'success',
            duration: 5000,
          })
          
          // Redirect to dashboard after successful confirmation
          setTimeout(() => navigate('/dashboard'), 2000)
        }
      } catch (err: any) {
        console.error('Error confirming email:', err)
        setError(err.message || 'An error occurred during confirmation')
      } finally {
        setIsLoading(false)
      }
    }

    confirmEmail()
  }, [searchParams, navigate, toast])

  if (isLoading) {
    return (
      <Container maxW="md" py={12}>
        <VStack spacing={8} align="center">
          <Spinner size="xl" color="blue.500" />
          <Text>Confirming your email...</Text>
        </VStack>
      </Container>
    )
  }

  if (error) {
    return (
      <Container maxW="md" py={12}>
        <VStack spacing={6} align="center">
          <Heading size="lg" color="red.500">❌ Error</Heading>
          <Text color="gray.600" textAlign="center">{error}</Text>
          <Button 
            colorScheme="blue" 
            onClick={() => navigate('/auth')}
          >
            Return to Sign In
          </Button>
        </VStack>
      </Container>
    )
  }

  return (
    <Container maxW="md" py={12}>
      <VStack spacing={6} align="center">
        <Heading size="lg" color="green.500">✅ Email Confirmed!</Heading>
        <Text color="gray.600" textAlign="center">
          Your email has been confirmed successfully. You'll be redirected to the dashboard shortly.
        </Text>
      </VStack>
    </Container>
  )
}

export default EmailConfirm 