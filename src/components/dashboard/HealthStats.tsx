import { 
  Box, 
  Heading, 
  Skeleton, 
  useColorModeValue,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
  HStack,
  Text as ChakraText
} from '@chakra-ui/react'
import { ChevronDownIcon } from '@chakra-ui/icons'
import { useState, useEffect } from 'react'
import { supabase } from '../../services/supabase'
import { useToast } from '@chakra-ui/react'
import { isGuestUser } from '../../services/guestMode'
import { getGuestHealthStatsForRange } from '../../services/guestStorage'

type TimeRange = 'Weekly' | 'Bi-weekly' | 'Monthly'

interface HealthStat {
  sleep_hours: number
  hunger: number
  soreness: number
  performance_rating: number
}

interface HealthStatsProps {
  stats: {
    sleep: number
    hunger: number
    soreness: number
    performance: number
  }
  isLoading: boolean
  checkInCompleted?: boolean
}

const HealthStats = ({ isLoading, checkInCompleted }: HealthStatsProps) => {
  const [timeRange, setTimeRange] = useState<TimeRange>('Weekly')
  const [averageStats, setAverageStats] = useState({
    sleep: 0,
    hunger: 0,
    soreness: 0,
    performance: 0
  })
  const [isLoadingStats, setIsLoadingStats] = useState(true)
  const toast = useToast()

  const bg = useColorModeValue('white', 'gray.800')
  const itemBg = useColorModeValue('gray.50', 'gray.700')
  const labelColor = useColorModeValue('gray.600', 'gray.300')
  const valueColor = useColorModeValue('gray.900', 'white')
  const menuBg = useColorModeValue('white', 'gray.700')
  const menuHoverBg = useColorModeValue('gray.100', 'gray.600')

  useEffect(() => {
    loadAverageStats()
  }, [timeRange, checkInCompleted])

  const loadAverageStats = async () => {
    try {
      const today = new Date()
      const startDate = new Date(today)
      startDate.setDate(today.getDate() - (timeRange === 'Weekly' ? 7 : timeRange === 'Bi-weekly' ? 14 : 30))

      let statsData: HealthStat[] = []

      if (isGuestUser()) {
        // Load guest stats from local storage
        statsData = getGuestHealthStatsForRange(startDate, today)
      } else {
        // Load authenticated user stats from Supabase
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          setIsLoadingStats(false)
          return
        }

        // Format dates as YYYY-MM-DD for Supabase DATE type
        const formattedStartDate = startDate.toISOString().split('T')[0]
        const formattedEndDate = today.toISOString().split('T')[0]

        const { data, error } = await supabase
          .from('health_stats')
          .select('*')
          .eq('user_id', user.id)
          .gte('date', formattedStartDate)
          .lte('date', formattedEndDate)

        if (error) {
          if (error.code !== '406') {
            throw error
          }
          statsData = []
        } else {
          statsData = (data || []) as HealthStat[]
        }
      }

      if (statsData.length === 0) {
        setAverageStats({
          sleep: 0,
          hunger: 0,
          soreness: 0,
          performance: 0
        })
        return
      }

      // Calculate averages from valid data
      const sums = statsData.reduce((acc, curr) => ({
        sleep: acc.sleep + (curr.sleep_hours || 0),
        hunger: acc.hunger + (curr.hunger || 0),
        soreness: acc.soreness + (curr.soreness || 0),
        performance: acc.performance + (curr.performance_rating || 0)
      }), { sleep: 0, hunger: 0, soreness: 0, performance: 0 })

      setAverageStats({
        sleep: Number((sums.sleep / statsData.length).toFixed(1)),
        hunger: Number((sums.hunger / statsData.length).toFixed(1)),
        soreness: Number((sums.soreness / statsData.length).toFixed(1)),
        performance: Number((sums.performance / statsData.length).toFixed(1))
      })
    } catch (error) {
      console.error('Error loading average stats:', error)
      if (!isGuestUser()) {
        toast({
          title: 'Error loading stats',
          status: 'error',
          duration: 3000,
          isClosable: true,
        })
      }
    } finally {
      setIsLoadingStats(false)
    }
  }

  const statItems = [
    { label: 'Performance', value: averageStats.performance, icon: '⭐' },
    { label: 'Sleep', value: `${averageStats.sleep}h`, icon: '😴' },
    { label: 'Hunger', value: averageStats.hunger, icon: '🍽️' },
    { label: 'Soreness', value: averageStats.soreness, icon: '💪' }
  ]

  return (
    <Box bg={bg} borderRadius="2xl" boxShadow="md" p={{ base: 6, md: 6 }}>
      <HStack justify="space-between" mb={4} align="center">
        <Heading size="md">Health Overview</Heading>
        <Menu>
          <MenuButton
            as={Button}
            rightIcon={<ChevronDownIcon />}
            size="sm"
            variant="ghost"
            _hover={{ bg: menuHoverBg }}
          >
            {timeRange}
          </MenuButton>
          <MenuList bg={menuBg}>
            <MenuItem onClick={() => setTimeRange('Weekly')} bg={menuBg} _hover={{ bg: menuHoverBg }}>
              Weekly
            </MenuItem>
            <MenuItem onClick={() => setTimeRange('Bi-weekly')} bg={menuBg} _hover={{ bg: menuHoverBg }}>
              Bi-weekly
            </MenuItem>
            <MenuItem onClick={() => setTimeRange('Monthly')} bg={menuBg} _hover={{ bg: menuHoverBg }}>
              Monthly
            </MenuItem>
          </MenuList>
        </Menu>
      </HStack>
      <Box 
        display="grid"
        gridTemplateColumns={{ base: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }}
        gap={{ base: 3, md: 6 }}
      >
        {statItems.map((item) => (
          <Box
            key={item.label}
            bg={itemBg}
            p={{ base: 3, md: 6 }}
            textAlign="center"
            borderRadius="2xl"
            transition="all 0.2s"
            _hover={{ transform: 'translateY(-4px)', boxShadow: 'md' }}
          >
            <Box
              fontSize="sm"
              fontWeight="medium"
              color={labelColor}
              mb={3}
              display="flex"
              alignItems="center"
              justifyContent="center"
              gap={2}
              whiteSpace="nowrap"
              minW={0}
              overflow="hidden"
            >
              <Box as="span" flexShrink={0}>{item.icon}</Box>
              <Box as="span" overflow="hidden" textOverflow="ellipsis">{item.label}</Box>
            </Box>
            <Skeleton isLoaded={!isLoading && !isLoadingStats}>
              <Box fontSize="2xl" fontWeight="bold" color={valueColor}>
                {item.value}
              </Box>
            </Skeleton>
          </Box>
        ))}
      </Box>
      <ChakraText fontSize="sm" color={labelColor} mt={4} textAlign="center" opacity={0.5}>
        Showing average from the last {timeRange === 'Weekly' ? '7' : timeRange === 'Bi-weekly' ? '14' : '30'} days
      </ChakraText>
    </Box>
  )
}

export default HealthStats 