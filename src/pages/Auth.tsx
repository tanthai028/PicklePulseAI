import { useState } from 'react'
import {
  Box,
  Container,
  VStack,
  Image,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Button,
  Text,
  useToast,
  Divider,
} from '@chakra-ui/react'
import { FcGoogle } from 'react-icons/fc'
import { useNavigate } from 'react-router-dom'
import { signInWithEmail, signUpWithEmail } from '../services/supabase'
import AuthForm from '../components/auth/AuthForm'

const Auth = () => {
  const [isLoading, setIsLoading] = useState(false)
  const toast = useToast()
  const navigate = useNavigate()

  const handleSignIn = async (data: { email: string; password: string }) => {
    setIsLoading(true)
    try {
      const { error } = await signInWithEmail(data.email, data.password)
      
      if (error) {
        if (error.message.includes('Email not confirmed')) {
          toast({
            title: 'Please verify your email',
            description: 'Check your inbox and confirm your account before logging in.',
            status: 'warning',
            duration: 5000,
          })
        } else {
          toast({
            title: 'Login failed',
            description: 'Invalid email or password.',
            status: 'error',
            duration: 3000,
          })
        }
        return
      }

      navigate('/dashboard')
    } catch (error: any) {
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

  const handleSignUp = async (data: { email: string; password: string; name?: string }) => {
    setIsLoading(true)
    try {
      const { error } = await signUpWithEmail(data.email, data.password)
      
      if (error) {
        toast({
          title: 'Sign up failed',
          description: error.message,
          status: 'error',
          duration: 3000,
        })
        return
      }

      toast({
        title: 'Account created!',
        description: 'Please check your email to verify your account.',
        status: 'success',
        duration: 5000,
      })
    } catch (error: any) {
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
      minH="100vh" 
      w="100%" 
      bg="white"
      py={{ base: 4, md: 12 }}
      px={{ base: 4, md: 8 }}
    >
      {/* Logo Section */}
      <Container maxW="md" p={0} mb={{ base: 6, md: 12 }}>
        <Box
          width="40px"
          height="40px"
          borderRadius="full"
          overflow="hidden"
          position="relative"
        >
          <Image
            src="/icon.png"
            alt="PicklePulse Logo"
            as="img"
            position="absolute"
            top="50%"
            left="50%"
            transform="translate(-50%, -50%)"
            width="175%"
            height="175%"
            objectFit="cover"
          />
        </Box>
      </Container>

      {/* Auth Content */}
      <Container maxW="md" p={0}>
        <VStack spacing={{ base: 4, md: 8 }} align="stretch">
          <Tabs isFitted variant="soft-rounded" colorScheme="blue">
            <TabList mb={4}>
              <Tab fontWeight="medium">Sign In</Tab>
              <Tab fontWeight="medium">Sign Up</Tab>
            </TabList>

            <TabPanels>
              {/* Sign In Panel */}
              <TabPanel p={0}>
                <VStack spacing={4}>
                  <Button
                    variant="outline"
                    size="lg"
                    leftIcon={<FcGoogle />}
                    w="100%"
                    h="45px"
                    borderColor="gray.300"
                    _hover={{ bg: 'gray.50' }}
                    onClick={() => {
                      toast({
                        title: "Coming Soon",
                        description: "Google sign in will be available soon!",
                        status: "info",
                        duration: 3000,
                      })
                    }}
                  >
                    Continue with Google
                  </Button>

                  <Box position="relative" py={2} width="100%">
                    <Divider />
                    <Text
                      position="absolute"
                      top="50%"
                      left="50%"
                      transform="translate(-50%, -50%)"
                      bg="white"
                      px={4}
                      fontSize="sm"
                      color="gray.500"
                    >
                      Or continue with
                    </Text>
                  </Box>

                  <AuthForm
                    mode="signin"
                    onSubmit={handleSignIn}
                    isLoading={isLoading}
                  />
                </VStack>
              </TabPanel>

              {/* Sign Up Panel */}
              <TabPanel p={0}>
                <VStack spacing={4}>
                  <Button
                    variant="outline"
                    size="lg"
                    leftIcon={<FcGoogle />}
                    w="100%"
                    h="45px"
                    borderColor="gray.300"
                    _hover={{ bg: 'gray.50' }}
                    onClick={() => {
                      toast({
                        title: "Coming Soon",
                        description: "Google sign up will be available soon!",
                        status: "info",
                        duration: 3000,
                      })
                    }}
                  >
                    Continue with Google
                  </Button>

                  <Box position="relative" py={2} width="100%">
                    <Divider />
                    <Text
                      position="absolute"
                      top="50%"
                      left="50%"
                      transform="translate(-50%, -50%)"
                      bg="white"
                      px={4}
                      fontSize="sm"
                      color="gray.500"
                    >
                      Or continue with
                    </Text>
                  </Box>

                  <AuthForm
                    mode="signup"
                    onSubmit={handleSignUp}
                    isLoading={isLoading}
                  />
                </VStack>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </VStack>
      </Container>
    </Box>
  )
}

export default Auth 