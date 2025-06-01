import { useState } from 'react'
import {
  Box,
  Heading,
  VStack,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Text,
  Button,
  useToast,
  Tooltip,
  Icon,
  HStack
} from '@chakra-ui/react'
import { InfoIcon } from '@chakra-ui/icons'
import { supabase } from '../../services/supabase'

interface DailyCheckInProps {
  isCompleted: boolean;
  onCheckIn: () => void;
}

const DailyCheckIn = ({ isCompleted, onCheckIn }: DailyCheckInProps) => {
  const [values, setValues] = useState({
    sleep: 7,
    hunger: 3,
    soreness: 3,
    performance: 3
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const toast = useToast()

  const sliderInfo = {
    sleep: {
      min: 0,
      max: 12,
      step: 0.5,
      tooltip: 'How many hours did you sleep?'
    },
    hunger: {
      min: 1,
      max: 5,
      step: 1,
      tooltip: 'How hungry do you feel today?'
    },
    soreness: {
      min: 1,
      max: 5,
      step: 1,
      tooltip: 'How sore are your muscles?'
    },
    performance: {
      min: 1,
      max: 5,
      step: 1,
      tooltip: 'How would you rate your performance today?'
    }
  }

  const getSliderColor = (value: number, max: number) => {
    const percentage = (value / max) * 100
    if (percentage <= 20) return 'red.500'
    if (percentage <= 40) return 'orange.500'
    if (percentage <= 60) return 'yellow.500'
    if (percentage <= 80) return 'green.500'
    return 'green.500'
  }

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true)
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('No user found')

      const today = new Date().toISOString().split('T')[0]
      const { error } = await supabase
        .from('health_stats')
        .insert({
          user_id: user.id,
          date: today,
          sleep_hours: values.sleep,
          hunger: values.hunger,
          soreness: values.soreness,
          performance_rating: values.performance
        })

      if (error) throw error

      toast({
        title: 'Check-in complete! 🎉',
        description: 'Your daily health stats have been recorded.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      })

      onCheckIn()
    } catch (error) {
      console.error('Error submitting check-in:', error)
      toast({
        title: 'Error',
        description: 'Failed to submit check-in. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderSlider = (key: keyof typeof values, label: string) => {
    const info = sliderInfo[key]
    const sliderValue = values[key]
    
    return (
      <Box position="relative" pb={6}>
        <HStack spacing={2} mb={2}>
          <Text fontWeight="medium">{label}</Text>
          <Tooltip label={info.tooltip} placement="right">
            <Icon as={InfoIcon} color="gray.400" w={4} h={4} cursor="help" />
          </Tooltip>
          <Text
            ml="auto"
            fontSize="sm"
            fontWeight="bold"
            color={getSliderColor(sliderValue, info.max)}
          >
            {key === 'sleep' ? `${sliderValue}h` : sliderValue}
          </Text>
        </HStack>
        
        <Slider
          value={sliderValue}
          min={info.min}
          max={info.max}
          step={info.step}
          onChange={(v) => setValues(prev => ({ ...prev, [key]: v }))}
          colorScheme={key === 'sleep' ? 'blue' : 'purple'}
        >
          <SliderTrack>
            <SliderFilledTrack bg={getSliderColor(sliderValue, info.max)} />
          </SliderTrack>
          <SliderThumb boxSize={6} />
        </Slider>
      </Box>
    )
  }

  if (isCompleted) {
    return (
      <Box className="content" textAlign="center">
        <Heading size="md" mb={4}>Daily Check-in</Heading>
        <Text fontSize="lg" mb={2}>All Set for Today! 🎉</Text>
        <Text color="gray.500">
          Come back tomorrow for your next check-in
        </Text>
      </Box>
    )
  }

  return (
    <Box className="content">
      <Heading size="md" mb={6}>Daily Check-in</Heading>
      <VStack spacing={8} align="stretch">
        {renderSlider('sleep', 'Sleep Duration')}
        {renderSlider('hunger', 'Energy Level')}
        {renderSlider('soreness', 'Muscle Soreness')}
        {renderSlider('performance', 'Overall Feeling')}

        <Button
          colorScheme="blue"
          size="lg"
          isLoading={isSubmitting}
          onClick={handleSubmit}
          mt={4}
        >
          Complete Check-in
        </Button>
      </VStack>
    </Box>
  )
}

export default DailyCheckIn 