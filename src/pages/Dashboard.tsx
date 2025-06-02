import { useEffect, useState } from 'react'
import { Box, Button, useDisclosure, SimpleGrid, useColorModeValue } from '@chakra-ui/react'
import Layout from '../components/Layout'
import { supabase } from '../services/supabase'
import HealthStats from '../components/dashboard/HealthStats'
import SkillsBoard from '../components/dashboard/SkillsBoard'
import CheckInModal from '../components/dashboard/CheckInModal'

const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [checkInCompleted, setCheckInCompleted] = useState(false)
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false)
  const { isOpen, onOpen, onClose } = useDisclosure()

  useEffect(() => {
    checkDailyCheckInStatus()
  }, [])

  const checkDailyCheckInStatus = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const today = new Date().toISOString().split('T')[0]
      const { data } = await supabase
        .from('health_stats')
        .select('id')
        .eq('user_id', user.id)
        .eq('date', today)
        .single()

      setCheckInCompleted(!!data)
    } catch (error) {
      console.error('Error checking daily check-in status:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCheckInComplete = () => {
    onClose()
    setCheckInCompleted(true)
    
    // Show success animation
    setShowSuccessAnimation(true)
    setTimeout(() => {
      setShowSuccessAnimation(false)
    }, 1000)
  }

  return (
    <Layout>
      <Box p={{ base: 2, md: 6 }} pb={{ base: '80px', lg: 6 }}>
        <SimpleGrid columns={{ base: 1, lg: 12 }} spacing={{ base: 4, md: 6 }}>
          {/* Health Stats Card */}
          <Box gridColumn={{ base: "1 / -1", lg: "span 12" }}>
            <HealthStats isLoading={isLoading} stats={{ sleep: 0, hunger: 0, soreness: 0, performance: 0 }} />
          </Box>

          {/* Skills Board Card */}
          <Box gridColumn={{ base: "1 / -1", md: "span 1", lg: "span 8" }}>
            <SkillsBoard />
          </Box>
        </SimpleGrid>

        {/* Mobile Check-in Footer */}
        <Box
          position="fixed"
          bottom={0}
          left={0}
          right={0}
          p={4}
          bg={useColorModeValue('white', 'gray.800')}
          borderTop="1px solid"
          borderColor={useColorModeValue('gray.100', 'gray.700')}
          display={{ base: 'flex', lg: 'none' }}
          justifyContent="center"
          zIndex={100}
        >
          <Button
            onClick={onOpen}
            isDisabled={checkInCompleted}
            maxW="400px"
            w="100%"
            h="48px"
            colorScheme={checkInCompleted ? "green" : "blue"}
            bg={checkInCompleted ? "green.500" : undefined}
            _hover={{
              bg: checkInCompleted ? "green.600" : undefined
            }}
          >
            {checkInCompleted ? '✓ Checked In' : 'Daily Check-in'}
          </Button>
        </Box>

        {/* Check-in Modal */}
        <CheckInModal 
          isOpen={isOpen} 
          onClose={onClose}
          onComplete={handleCheckInComplete}
        />

        {/* Success Animation */}
        {showSuccessAnimation && (
          <Box
            position="fixed"
            top="50%"
            left="50%"
            transform="translate(-50%, -50%)"
            zIndex={1000}
            fontSize="4xl"
            color="green.500"
            opacity={0}
            filter="blur(10px)"
            animation="successPop 1s ease-out forwards"
          >
            ✓
          </Box>
        )}
      </Box>
    </Layout>
  )
}

export default Dashboard 