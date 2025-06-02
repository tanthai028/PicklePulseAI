import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Text,
  useToast,
} from '@chakra-ui/react'
import { useState } from 'react'
import { sendPasswordResetEmail } from '../../services/supabase'

interface ForgotPasswordModalProps {
  isOpen: boolean
  onClose: () => void
}

const ForgotPasswordModal = ({ isOpen, onClose }: ForgotPasswordModalProps) => {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const toast = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const { error } = await sendPasswordResetEmail(email)
      
      if (error) {
        toast({
          title: 'Error',
          description: error.message,
          status: 'error',
          duration: 5000,
        })
        return
      }

      setSuccess(true)
      toast({
        title: 'Reset link sent!',
        description: 'Check your email for password reset instructions.',
        status: 'success',
        duration: 5000,
      })

      // Close modal after 2 seconds on success
      setTimeout(() => {
        onClose()
        setSuccess(false)
        setEmail('')
      }, 2000)

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
    <Modal 
      isOpen={isOpen} 
      onClose={onClose}
      isCentered
      motionPreset="slideInBottom"
    >
      <ModalOverlay />
      <ModalContent mx={4}>
        <form onSubmit={handleSubmit}>
          <ModalHeader>Reset Password</ModalHeader>
          <ModalCloseButton />
          
          <ModalBody>
            <VStack spacing={4}>
              <Text fontSize="sm" color="gray.600">
                Enter your email address and we'll send you a link to reset your password.
              </Text>
              
              <FormControl isRequired>
                <FormLabel fontSize="sm">Email Address</FormLabel>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  size="lg"
                  disabled={isLoading || success}
                />
              </FormControl>
            </VStack>
          </ModalBody>

          <ModalFooter>
            <Button
              variant="ghost"
              mr={3}
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              colorScheme="blue"
              isLoading={isLoading}
              loadingText="Sending..."
              disabled={success}
            >
              Send Reset Link
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  )
}

export default ForgotPasswordModal 