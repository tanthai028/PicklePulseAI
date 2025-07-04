import { useEffect, useState } from 'react'
import { Box, Heading, Table, Thead, Tbody, Tr, Th, Td, Skeleton } from '@chakra-ui/react'
import { supabase } from '../../services/supabase'

interface PerformanceEntry {
  id: number;
  date: string;
  location: string;
  performance: string;
  notes: string;
}

const PerformanceLog = () => {
  const [entries, setEntries] = useState<PerformanceEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadPerformanceLog()
  }, [])

  const loadPerformanceLog = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('No user found')

      const { data, error } = await supabase
        .from('performance_logs')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false })
        .limit(10)

      if (error) throw error

      setEntries(data || [])
    } catch (error) {
      console.error('Error loading performance log:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Box>
      <Heading size="md" mb={4}>Performance Log</Heading>
      <Table>
        <Thead>
          <Tr>
            <Th>Date</Th>
            <Th>Location</Th>
            <Th>Performance</Th>
            <Th>Notes</Th>
          </Tr>
        </Thead>
        <Tbody>
          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <Tr key={i}>
                <Td><Skeleton height="20px" /></Td>
                <Td><Skeleton height="20px" /></Td>
                <Td><Skeleton height="20px" /></Td>
                <Td><Skeleton height="20px" /></Td>
              </Tr>
            ))
          ) : entries.length === 0 ? (
            <Tr>
              <Td colSpan={4} textAlign="center">No performance entries yet</Td>
            </Tr>
          ) : (
            entries.map((entry) => (
              <Tr key={entry.id}>
                <Td>{new Date(entry.date).toLocaleDateString()}</Td>
                <Td>{entry.location}</Td>
                <Td>{entry.performance}</Td>
                <Td>{entry.notes}</Td>
              </Tr>
            ))
          )}
        </Tbody>
      </Table>
    </Box>
  )
}

export default PerformanceLog 