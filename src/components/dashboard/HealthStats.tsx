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

type TimeRange = 'Weekly' | 'Bi-weekly' | 'Monthly'

interface HealthStatsProps {
  stats: {
    sleep: number;
    hunger: number;
    soreness: number;
    performance: number;
  };
  isLoading: boolean;
}

const HealthStats = ({ isLoading }: HealthStatsProps) => {
  const [timeRange, setTimeRange] = useState<TimeRange>('Weekly')
  const [averageStats, setAverageStats] = useState({
    sleep: 0,
    hunger: 0,
    soreness: 0,
    performance: 0
  })
  const [isLoadingStats, setIsLoadingStats] = useState(true)

  const bg = useColorModeValue('white', 'gray.800')
  const itemBg = useColorModeValue('gray.50', 'gray.700')
  const labelColor = useColorModeValue('gray.600', 'gray.300')
  const valueColor = useColorModeValue('gray.900', 'white')
  const menuBg = useColorModeValue('white', 'gray.700')
  const menuHoverBg = useColorModeValue('gray.100', 'gray.600')

  useEffect(() => {
    loadAverageStats()
  }, [timeRange])

  const loadAverageStats = async () => {
    try {
      setIsLoadingStats(true)
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('No user found')

      // Calculate date range
      const today = new Date()
      const daysToSubtract = timeRange === 'Weekly' ? 7 : timeRange === 'Bi-weekly' ? 14 : 30
      const startDate = new Date(today)
      startDate.setDate(today.getDate() - daysToSubtract)

      // Fetch stats within date range
      const { data, error } = await supabase
        .from('health_stats')
        .select('sleep_hours, hunger, soreness, performance_rating')
        .eq('user_id', user.id)
        .gte('date', startDate.toISOString().split('T')[0])
        .lte('date', today.toISOString().split('T')[0])
        .order('date', { ascending: false })

      if (error) throw error

      if (data && data.length > 0) {
        // Calculate averages
        const sums = data.reduce((acc, curr) => ({
          sleep: acc.sleep + (curr.sleep_hours || 0),
          hunger: acc.hunger + (curr.hunger || 0),
          soreness: acc.soreness + (curr.soreness || 0),
          performance: acc.performance + (curr.performance_rating || 0)
        }), { sleep: 0, hunger: 0, soreness: 0, performance: 0 })

        setAverageStats({
          sleep: Number((sums.sleep / data.length).toFixed(1)),
          hunger: Number((sums.hunger / data.length).toFixed(1)),
          soreness: Number((sums.soreness / data.length).toFixed(1)),
          performance: Number((sums.performance / data.length).toFixed(1))
        })
      }
    } catch (error) {
      console.error('Error loading average stats:', error)
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