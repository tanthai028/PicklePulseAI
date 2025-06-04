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
  useDisclosure,
} from '@chakra-ui/react'
import { FcGoogle } from 'react-icons/fc'
import { useNavigate } from 'react-router-dom'
import { signInWithEmail, signUpWithEmail } from '../services/supabase'
import { continueAsGuest } from '../services/guestMode'
import AuthForm from '../components/auth/AuthForm'
import ForgotPasswordModal from '../components/auth/ForgotPasswordModal'

const Auth = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [googleButtonDisabled, setGoogleButtonDisabled] = useState(false)
  const { isOpen, onOpen, onClose } = useDisclosure()
  const toast = useToast()
  const navigate = useNavigate()

  const handleGuestMode = () => {
    continueAsGuest()
    toast({
      title: "Guest Mode Activated",
      description: "You're now using the app as a guest. Your data will not be saved.",
      status: "info",
      duration: 2500,
    })
    navigate('/dashboard')
  }

  const handleGoogleClick = () => {
    if (googleButtonDisabled) return;
    
    setGoogleButtonDisabled(true);
    toast({
      title: "Coming Soon",
      description: "Google sign in will be available soon!",
      status: "info",
      duration: 3000,
    });

    // Re-enable after 5 seconds
    setTimeout(() => setGoogleButtonDisabled(false), 5000);
  };

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
      py={{ base: 4, md: 16 }}
      px={{ base: 4, md: 8 }}
    >
      {/* Logo Section */}
      <Container maxW="md" p={0} mb={{ base: 4, md: 8 }} textAlign="left">
        <Box
          width={{ base: "50px", md: "100px" }}
          height={{ base: "50px", md: "100px" }}
          borderRadius="full"
          overflow="hidden"
          position="relative"
          mb={8}
          className="logo-bounce"
          boxShadow="lg"
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
        <Text
          fontSize={{ base: "3xl", md: "4xl" }}
          fontWeight="bold"
          color="gray.800"
          mb={0}
        >
          Sign in
        </Text>
      </Container>

      {/* Auth Content */}
      <Container maxW="md" p={0}>
        <VStack spacing={6} align="stretch">
          {/* Guest Mode Button */}
          <Button
            size="lg"
            w="100%"
            h="45px"
            colorScheme="gray"
            onClick={handleGuestMode}
          >
            Continue as Guest
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
              fontSize={{ base: "xs", md: "sm" }}
              color="gray.500"
              whiteSpace="nowrap"
            >
              or
            </Text>
          </Box>

          <Tabs variant="soft-rounded" colorScheme="blue" width="100%">
            <TabList mb={6} width="100%" position="relative">
              <Tab 
                fontWeight="medium" 
                width="50%"
                _selected={{
                  color: "blue.500",
                  bg: "blue.50"
                }}
              >
                Sign In
              </Tab>
              <Box 
                position="absolute" 
                left="50%" 
                top="15%" 
                height="70%" 
                width="1px" 
                transform="translateX(-50%)"
              />
              <Tab 
                fontWeight="medium"
                width="50%"
                _selected={{
                  color: "blue.500",
                  bg: "blue.50"
                }}
              >
                Sign Up
              </Tab>
            </TabList>

            <TabPanels>
              {/* Sign In Panel */}
              <TabPanel p={0}>
                <VStack spacing={4} width="100%">
                  <Box position="relative" py={2} width="100%">
                    <Divider />
                    <Text
                      position="absolute"
                      top="50%"
                      left="50%"
                      transform="translate(-50%, -50%)"
                      bg="white"
                      px={4}
                      fontSize={{ base: "xs", md: "sm" }}
                      color="gray.500"
                      whiteSpace="nowrap"
                    >
                      Sign in details
                    </Text>
                  </Box>

                  <AuthForm
                    mode="signin"
                    onSubmit={handleSignIn}
                    isLoading={isLoading}
                    onForgotPassword={onOpen}
                  />
                </VStack>
              </TabPanel>

              {/* Sign Up Panel */}
              <TabPanel p={0}>
                <VStack spacing={4} width="100%">
                  <Box position="relative" py={2} width="100%">
                    <Divider />
                    <Text
                      position="absolute"
                      top="50%"
                      left="50%"
                      transform="translate(-50%, -50%)"
                      bg="white"
                      px={4}
                      fontSize={{ base: "xs", md: "sm" }}
                      color="gray.500"
                      whiteSpace="nowrap"
                    >
                      Create account
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

      <ForgotPasswordModal isOpen={isOpen} onClose={onClose} />
    </Box>
  )
}

export default Auth 