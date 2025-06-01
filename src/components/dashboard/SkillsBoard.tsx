import { Box, Heading } from '@chakra-ui/react'

const mockSkills = {
  planning: [
    { id: 1, name: 'Drop Shot' },
    { id: 2, name: 'Backhand Slice' }
  ],
  practicing: [
    { id: 3, name: 'Serve' },
    { id: 4, name: 'Forehand' },
    { id: 5, name: 'Volley' }
  ],
  mastered: [
    { id: 6, name: 'Basic Rally' },
    { id: 7, name: 'Scoring' }
  ]
}

const SkillsBoard = () => {
  return (
    <Box>
      <Heading size="md" mb={4}>Skills Progress</Heading>
      <div className="dashboard__skills-board-columns">
        <div className="dashboard__skills-board-column">
          <h3>Planning</h3>
          {mockSkills.planning.map((skill) => (
            <div key={skill.id} className="dashboard__skills-board-item">
              {skill.name}
            </div>
          ))}
        </div>

        <div className="dashboard__skills-board-column">
          <h3>Practicing</h3>
          {mockSkills.practicing.map((skill) => (
            <div key={skill.id} className="dashboard__skills-board-item">
              {skill.name}
            </div>
          ))}
        </div>

        <div className="dashboard__skills-board-column">
          <h3>Mastered</h3>
          {mockSkills.mastered.map((skill) => (
            <div key={skill.id} className="dashboard__skills-board-item">
              {skill.name}
            </div>
          ))}
        </div>
      </div>
    </Box>
  )
}

export default SkillsBoard 