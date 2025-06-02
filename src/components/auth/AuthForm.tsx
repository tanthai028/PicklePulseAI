import {
  FormControl,
  FormLabel,
  Input,
  Button,
  VStack,
  InputGroup,
  InputRightElement,
  IconButton,
  Checkbox,
  HStack,
  Link as ChakraLink,
} from '@chakra-ui/react'
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons'
import { useState } from 'react'

interface AuthFormProps {
  mode: 'signin' | 'signup'
  onSubmit: (data: { email: string; password: string; name?: string }) => void
  isLoading: boolean
  onForgotPassword?: () => void
}

const AuthForm = ({ mode, onSubmit, isLoading, onForgotPassword }: AuthFormProps) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({ email, password, ...(mode === 'signup' ? { name } : {}) })
  }

  return (
    <form onSubmit={handleSubmit} style={{ width: '100%' }}>
      <VStack spacing={3}>
        {mode === 'signup' && (
          <FormControl isRequired>
            <FormLabel color="gray.700" fontSize="sm" mb={1}>Full Name</FormLabel>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              size="lg"
              h="45px"
              borderColor="gray.300"
              _hover={{ borderColor: 'gray.400' }}
            />
          </FormControl>
        )}

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
            {mode === 'signin' && onForgotPassword && (
              <ChakraLink 
                as="button"
                type="button"
                onClick={onForgotPassword}
                color="blue.500" 
                fontSize="sm"
                fontWeight="medium"
              >
                Forget?
              </ChakraLink>
            )}
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

        {mode === 'signin' && (
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
        )}

        <Button
          type="submit"
          colorScheme="blue"
          size="lg"
          width="100%"
          h="45px"
          isLoading={isLoading}
          loadingText={mode === 'signin' ? 'Signing in...' : 'Creating account...'}
          mt={1}
        >
          {mode === 'signin' ? 'Sign in' : 'Create Account'}
        </Button>
      </VStack>
    </form>
  )
}

export default AuthForm 