import { useState } from 'react'
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Text,
  useToast,
  Container,
  InputGroup,
  InputRightElement,
  IconButton,
  Heading,
  Image,
  Checkbox,
  HStack,
  Link as ChakraLink,
  Divider,
} from '@chakra-ui/react'
import { Link, useNavigate } from 'react-router-dom'
import { signInWithEmail } from '../services/supabase'
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons'
import { FcGoogle } from 'react-icons/fc'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const toast = useToast()
  const navigate = useNavigate()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const { data, error } = await signInWithEmail(email, password)
      
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

      if (data.user) {
        navigate('/dashboard')
      }
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

      {/* Sign In Content */}
      <Container maxW="md" p={0}>
        <VStack spacing={{ base: 4, md: 8 }} align="stretch">
          <Heading size="xl">Sign in</Heading>

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

          <Box position="relative" py={2}>
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

          <form onSubmit={handleLogin} style={{ width: '100%' }}>
            <VStack spacing={3}>
              <FormControl isRequired>
                <FormLabel color="gray.700" fontSize="sm" mb={1}>Email Address</FormLabel>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  size="lg"
                  h="45px"
                  borderColor="gray.300"
                  _hover={{ borderColor: 'gray.400' }}
                />
              </FormControl>

              <FormControl isRequired>
                <HStack justify="space-between" mb={1}>
                  <FormLabel color="gray.700" fontSize="sm" mb={0}>Password</FormLabel>
                  <ChakraLink 
                    as={Link} 
                    to="/forgot-password" 
                    color="blue.500" 
                    fontSize="sm"
                    fontWeight="medium"
                  >
                    Forget?
                  </ChakraLink>
                </HStack>
                <InputGroup size="lg">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    borderColor="gray.300"
                    h="45px"
                    _hover={{ borderColor: 'gray.400' }}
                  />
                  <InputRightElement h="45px">
                    <IconButton
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                      icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                      variant="ghost"
                      onClick={() => setShowPassword(!showPassword)}
                      h="45px"
                    />
                  </InputRightElement>
                </InputGroup>
              </FormControl>

              <Checkbox
                isChecked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                colorScheme="blue"
                size="md"
                spacing={3}
                alignSelf="flex-start"
              >
                Remember Me
              </Checkbox>

              <Button
                type="submit"
                colorScheme="blue"
                size="lg"
                width="100%"
                h="45px"
                isLoading={isLoading}
                loadingText="Signing in..."
                mt={1}
              >
                Sign in
              </Button>
            </VStack>
          </form>

          <HStack spacing={1} justify="center" pt={2}>
            <Text color="gray.600" fontSize="sm">Don't have an account?</Text>
            <ChakraLink 
              as={Link} 
              to="/register" 
              color="blue.500"
              fontWeight="medium"
              fontSize="sm"
            >
              Sign up
            </ChakraLink>
          </HStack>
        </VStack>
      </Container>
    </Box>
  )
}

export default Login 