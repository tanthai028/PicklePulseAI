import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Button,
  VStack,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Text,
  Tooltip,
  IconButton,
  HStack,
  useToast,
  useBreakpointValue,
  useOutsideClick
} from '@chakra-ui/react'
import { InfoIcon } from '@chakra-ui/icons'
import { useState, useRef, useEffect } from 'react'
import { supabase } from '../../services/supabase'

interface CheckInModalProps {
  isOpen: boolean
  onClose: () => void
  onComplete: () => void
}

const CheckInModal = ({ isOpen, onClose, onComplete }: CheckInModalProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null)
  const [values, setValues] = useState({
    sleep: 7,
    hunger: 3,
    soreness: 3,
    performance: 3
  })
  const toast = useToast()
  const isMobile = useBreakpointValue({ base: true, md: false })
  const tooltipRef = useRef(null)

  // Reset values when modal opens
  useEffect(() => {
    if (isOpen) {
      setValues({
        sleep: 7,
        hunger: 3,
        soreness: 3,
        performance: 3
      })
    }
  }, [isOpen])

  // Handle click outside
  useOutsideClick({
    ref: tooltipRef,
    handler: () => setActiveTooltip(null),
  })

  // Auto-dismiss tooltip after 3 seconds
  useEffect(() => {
    if (activeTooltip) {
      const timer = setTimeout(() => {
        setActiveTooltip(null)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [activeTooltip])

  const handleSliderChange = (name: string, value: number) => {
    setValues(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const toggleTooltip = (name: string) => {
    if (isMobile) {
      setActiveTooltip(activeTooltip === name ? null : name)
    }
  }

  const getSliderColor = (name: string, value: number) => {
    // For muscle soreness, reverse the color logic
    if (name === 'soreness') {
      if (value <= 1) return 'green.500'
      if (value <= 2) return 'yellow.400'
      if (value <= 3) return 'orange.400'
      return 'red.500'
    }

    // For all other metrics, higher is better
    const max = name === 'sleep' ? 12 : 5
    const percentage = (value / max) * 100

    if (percentage >= 80) return 'green.500'
    if (percentage >= 60) return 'yellow.400'
    if (percentage >= 40) return 'orange.400'
    return 'red.500'
  }

  const renderSlider = (name: string, label: string) => {
    const tooltips = {
      sleep: 'Hours of sleep last night',
      hunger: 'Current energy level (1-5)',
      soreness: 'Muscle soreness level (1-5)',
      performance: 'How are you feeling today? (1-5)'
    }

    const max = name === 'sleep' ? 12 : 5
    const min = name === 'sleep' ? 0 : 1
    const step = name === 'sleep' ? 0.5 : 1
    const value = values[name as keyof typeof values]
    const sliderColor = getSliderColor(name, value)

    return (
      <VStack align="stretch" spacing={2}>
        <HStack spacing={1} ref={tooltipRef}>
          <Text fontWeight="medium">{label}</Text>
          <Tooltip 
            label={tooltips[name as keyof typeof tooltips]}
            placement="top"
            hasArrow
            isOpen={isMobile ? activeTooltip === name : undefined}
          >
            <IconButton
              icon={<InfoIcon />}
              aria-label={`Info for ${label}`}
              variant="ghost"
              size="xs"
              color="gray.400"
              onClick={() => toggleTooltip(name)}
              minW="auto"
              height="auto"
              padding={1}
            />
          </Tooltip>
        </HStack>
        <Slider
          value={value}
          onChange={(v) => handleSliderChange(name, v)}
          min={min}
          max={max}
          step={step}
        >
          <SliderTrack>
            <SliderFilledTrack bg={sliderColor} />
          </SliderTrack>
          <SliderThumb boxSize={6} />
        </Slider>
        <Text textAlign="center" fontSize="lg" fontWeight="bold" color={sliderColor}>
          {value}
          {name === 'sleep' ? 'h' : ''}
        </Text>
      </VStack>
    )
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('No user found')

      const today = new Date().toISOString().split('T')[0]

      // First check if an entry already exists for today
      const { data: existingEntry } = await supabase
        .from('health_stats')
        .select('id')
        .eq('user_id', user.id)
        .eq('date', today)
        .single()

      let error
      if (existingEntry) {
        // Update existing entry
        const { error: updateError } = await supabase
          .from('health_stats')
          .update({
            sleep_hours: values.sleep,
            hunger: values.hunger,
            soreness: values.soreness,
            performance_rating: values.performance
          })
          .eq('id', existingEntry.id)
        error = updateError
      } else {
        // Insert new entry
        const { error: insertError } = await supabase
          .from('health_stats')
          .insert({
            user_id: user.id,
            date: today,
            sleep_hours: values.sleep,
            hunger: values.hunger,
            soreness: values.soreness,
            performance_rating: values.performance
          })
        error = insertError
      }

      if (error) throw error

      onClose()
      onComplete()
      toast({
        title: 'Check-in completed',
        status: 'success',
        duration: 3000,
        isClosable: true,
      })
    } catch (error) {
      console.error('Error submitting check-in:', error)
      toast({
        title: 'Error submitting check-in',
        description: error instanceof Error ? error.message : 'An error occurred',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      isCentered
      motionPreset="slideInBottom"
      size={{ base: "lg", md: "2xl" }}
    >
      <ModalOverlay 
        bg="blackAlpha.300"
        backdropFilter="blur(10px)"
      />
      <ModalContent 
        mx={{ base: 6, md: 8 }}
        my={{ base: 8, md: 12 }}
        maxHeight={{ base: "calc(100vh - 64px)", md: "calc(100vh - 96px)" }}
        overflow="auto"
      >
        <ModalHeader pt={6} px={6}>Daily Check-in</ModalHeader>
        <ModalCloseButton top={6} right={6} />
        <ModalBody px={6} pt={4} pb={6}>
          <VStack spacing={6} align="stretch">
            {renderSlider('sleep', 'Sleep Duration')}
            {renderSlider('hunger', 'Energy Level')}
            {renderSlider('soreness', 'Muscle Soreness')}
            {renderSlider('performance', 'Overall Feeling')}
            <Button
              colorScheme="blue"
              isLoading={isSubmitting}
              onClick={handleSubmit}
              size="lg"
              mt={4}
            >
              Complete Check-in
            </Button>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

export default CheckInModal 