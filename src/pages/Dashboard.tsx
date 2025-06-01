import { useEffect, useState } from 'react'
import { Box, Container, Heading } from '@chakra-ui/react'
import Layout from '../components/Layout'
import { supabase } from '../services/supabase'
import HealthStats from '../components/dashboard/HealthStats'
import DailyCheckIn from '../components/dashboard/DailyCheckIn'
import SkillsBoard from '../components/dashboard/SkillsBoard'
import PerformanceLog from '../components/dashboard/PerformanceLog'

const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [healthStats, setHealthStats] = useState({
    sleep: 0,
    hunger: 0,
    soreness: 0,
    performance: 0
  })
  const [checkInCompleted, setCheckInCompleted] = useState(false)

  useEffect(() => {
    loadDashboardData()
    checkDailyCheckInStatus()
  }, [])

  const loadDashboardData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('No user found')

      // Load today's health stats
      const today = new Date().toISOString().split('T')[0]
      const { data: healthData } = await supabase
        .from('health_stats')
        .select('*')
        .eq('user_id', user.id)
        .eq('date', today)
        .single()

      if (healthData) {
        setHealthStats({
          sleep: healthData.sleep_hours,
          hunger: healthData.hunger,
          soreness: healthData.soreness,
          performance: healthData.performance_rating
        })
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error)
    } finally {
      setIsLoading(false)
    }
  }

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
    }
  }

  return (
    <Layout>
      <Box className="dashboard">
        <div className="dashboard__header">
          <Heading size="lg">Dashboard</Heading>
        </div>

        <div className="dashboard__grid">
          {/* Health Stats Card */}
          <div className="dashboard__health-stats">
            <HealthStats stats={healthStats} isLoading={isLoading} />
          </div>

          {/* Daily Check-in Card */}
          <div className={`dashboard__check-in ${checkInCompleted ? 'completed' : ''}`}>
            <DailyCheckIn 
              isCompleted={checkInCompleted}
              onCheckIn={loadDashboardData}
            />
          </div>

          {/* Skills Board Card */}
          <div className="dashboard__skills-board">
            <SkillsBoard />
          </div>

          {/* Performance Log Card */}
          <div className="dashboard__performance-log">
            <PerformanceLog />
          </div>
        </div>
      </Box>
    </Layout>
  )
}

export default Dashboard 