import { Box, Heading, Skeleton } from '@chakra-ui/react'

interface HealthStatsProps {
  stats: {
    sleep: number;
    hunger: number;
    soreness: number;
    performance: number;
  };
  isLoading: boolean;
}

const HealthStats = ({ stats, isLoading }: HealthStatsProps) => {
  const statItems = [
    { label: 'Sleep', value: `${stats.sleep}h`, icon: '😴' },
    { label: 'Hunger', value: stats.hunger, icon: '🍽️' },
    { label: 'Soreness', value: stats.soreness, icon: '💪' },
    { label: 'Performance', value: stats.performance, icon: '⭐' }
  ]

  return (
    <Box>
      <Heading size="md" mb={4}>Health Overview</Heading>
      <div className="dashboard__health-stats-grid">
        {statItems.map((item) => (
          <div key={item.label} className="dashboard__health-stats-item">
            <h3>{item.icon} {item.label}</h3>
            <Skeleton isLoaded={!isLoading}>
              <div className="value">{item.value}</div>
            </Skeleton>
          </div>
        ))}
      </div>
    </Box>
  )
}

export default HealthStats 