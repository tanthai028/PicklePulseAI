import { 
  Box, 
  Heading, 
  Menu, 
  MenuButton, 
  MenuList, 
  MenuItem, 
  IconButton,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Button,
  Input,
  useDisclosure,
  useToast,
  useColorModeValue,
  Text,
  useBreakpointValue,
  Spinner,
  Center
} from '@chakra-ui/react'
import { AddIcon, EditIcon, DeleteIcon } from '@chakra-ui/icons'
import { useState, useEffect } from 'react'
import { supabase } from '../../services/supabase'

interface Skill {
  id: string
  name: string
  section: 'planning' | 'practicing'
}

interface SkillsState {
  planning: Skill[]
  practicing: Skill[]
}

const SkillsBoard = () => {
  // All hooks must be called at the top level
  const [skills, setSkills] = useState<SkillsState>({
    planning: [],
    practicing: []
  })
  const [isLoading, setIsLoading] = useState(true)
  const [selectedSkill, setSelectedSkill] = useState<{ section: string; skill?: Skill }>({ section: '' })
  const [newSkillName, setNewSkillName] = useState('')
  const { isOpen, onOpen, onClose } = useDisclosure()
  const toast = useToast()

  // Color mode values - must be called before any conditional logic
  const bg = useColorModeValue('white', 'gray.800')
  const sectionBg = useColorModeValue('gray.50', 'gray.700')
  const itemBg = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.600')
  const headingColor = useColorModeValue('gray.900', 'white')
  const textColor = useColorModeValue('gray.700', 'gray.200')
  const modalSize = useBreakpointValue({ base: "full", md: "xl" })
  const isCentered = useBreakpointValue({ base: false, md: true })

  useEffect(() => {
    loadSkills()
  }, [])

  const loadSkills = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('No user found')

      const { data, error } = await supabase
        .from('skills')
        .select('*')
        .eq('user_id', user.id)

      if (error) throw error

      const groupedSkills = data.reduce((acc: SkillsState, skill) => {
        acc[skill.section as keyof SkillsState].push(skill)
        return acc
      }, { planning: [], practicing: [] })

      setSkills(groupedSkills)
    } catch (error) {
      console.error('Error loading skills:', error)
      toast({
        title: 'Error loading skills',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddSkill = (section: string) => {
    setSelectedSkill({ section })
    setNewSkillName('')
    onOpen()
  }

  const handleEditSkill = (section: string, skill: Skill) => {
    setSelectedSkill({ section, skill })
    setNewSkillName(skill.name)
    onOpen()
  }

  const handleDeleteSkill = async (section: string, skillId: string) => {
    try {
      const { error } = await supabase
        .from('skills')
        .delete()
        .eq('id', skillId)

      if (error) throw error

      setSkills(prev => ({
        ...prev,
        [section]: prev[section as keyof SkillsState].filter(s => s.id !== skillId)
      }))

      toast({
        title: 'Skill deleted',
        status: 'success',
        duration: 2000,
        isClosable: true,
      })
    } catch (error) {
      console.error('Error deleting skill:', error)
      toast({
        title: 'Error deleting skill',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    }
  }

  const handleSaveSkill = async () => {
    if (!newSkillName.trim()) {
      toast({
        title: 'Please enter a skill name',
        status: 'error',
        duration: 2000,
        isClosable: true,
      })
      return
    }

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('No user found')

      if (selectedSkill.skill) {
        // Edit existing skill
        const { error } = await supabase
          .from('skills')
          .update({ name: newSkillName })
          .eq('id', selectedSkill.skill.id)

        if (error) throw error

        setSkills(prev => ({
          ...prev,
          [selectedSkill.section]: prev[selectedSkill.section as keyof SkillsState].map(s => 
            s.id === selectedSkill.skill?.id 
              ? { ...s, name: newSkillName }
              : s
          )
        }))
      } else {
        // Add new skill
        const { data, error } = await supabase
          .from('skills')
          .insert({
            user_id: user.id,
            name: newSkillName,
            section: selectedSkill.section
          })
          .select()
          .single()

        if (error) throw error

        setSkills(prev => ({
          ...prev,
          [selectedSkill.section]: [...prev[selectedSkill.section as keyof SkillsState], data]
        }))
      }

      onClose()
      toast({
        title: selectedSkill.skill ? 'Skill updated' : 'Skill added',
        status: 'success',
        duration: 2000,
        isClosable: true,
      })
    } catch (error) {
      console.error('Error saving skill:', error)
      toast({
        title: 'Error saving skill',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    }
  }

  const renderSkillSection = (section: keyof SkillsState, title: string) => (
    <Box 
      bg={sectionBg}
      p={4}
      borderRadius="2xl"
      flex="1"
      minW={0}
    >
      <Text 
        fontSize="md" 
        fontWeight="semibold" 
        color={headingColor}
        mb={3}
        pb={2}
        borderBottom="2px solid"
        borderColor={borderColor}
      >
        {title}
      </Text>
      <Box display="flex" flexDirection="column" gap={3}>
        {skills[section].map((skill) => (
          <Menu key={skill.id}>
            <MenuButton
              as={Box}
              bg={itemBg}
              p={4}
              borderRadius="xl"
              boxShadow="sm"
              cursor="pointer"
              border="1px solid"
              borderColor={borderColor}
              color={textColor}
              transition="all 0.2s"
              _hover={{
                transform: 'scale(1.02)',
                borderColor: 'blue.400',
                bg: useColorModeValue('blue.50', 'blue.900'),
              }}
              _active={{
                transform: 'scale(0.98)',
              }}
            >
              {skill.name}
            </MenuButton>
            <MenuList>
              <MenuItem icon={<EditIcon />} onClick={() => handleEditSkill(section, skill)}>
                Edit
              </MenuItem>
              <MenuItem icon={<DeleteIcon />} onClick={() => handleDeleteSkill(section, skill.id)}>
                Delete
              </MenuItem>
            </MenuList>
          </Menu>
        ))}
        <IconButton
          aria-label="Add skill"
          icon={<AddIcon />}
          variant="outline"
          h="48px"
          w="100%"
          borderStyle="dashed"
          borderWidth="2px"
          borderColor={borderColor}
          bg="transparent"
          transition="all 0.2s"
          _hover={{
            borderColor: 'blue.400',
            bg: useColorModeValue('blue.50', 'blue.900'),
          }}
          onClick={() => handleAddSkill(section)}
        />
      </Box>
    </Box>
  )

  if (isLoading) {
    return (
      <Box bg={bg} borderRadius="2xl" boxShadow="md" p={6} minH="300px">
        <Center h="100%">
          <Spinner size="xl" color="blue.500" thickness="4px" />
        </Center>
      </Box>
    )
  }

  return (
    <Box bg={bg} borderRadius="2xl" boxShadow="md" p={6}>
      <Heading size="md" mb={4}>Skills Progress</Heading>
      <Box 
        display="flex"
        flexDirection="row"
        gap={4}
      >
        {renderSkillSection('planning', 'Planning')}
        {renderSkillSection('practicing', 'Practicing')}
      </Box>

      <Modal 
        isOpen={isOpen} 
        onClose={onClose}
        size={modalSize}
        motionPreset="slideInBottom"
        isCentered={isCentered}
      >
        <ModalOverlay 
          bg="blackAlpha.300"
          backdropFilter="blur(10px)"
        />
        <ModalContent 
          position={{ base: "fixed", md: "relative" }}
          bottom={{ base: 0, md: "auto" }}
          mb={{ base: 0, md: "auto" }}
          mx={{ base: 0, md: 8 }}
          my={{ base: 0, md: "3.75rem" }}
          borderRadius={{ base: "2xl 2xl 0 0", md: "2xl" }}
          maxHeight={{ base: "75vh", md: "calc(100vh - 96px)" }}
          overflow="auto"
        >
          <ModalHeader pt={6} px={6}>
            {selectedSkill.skill ? 'Edit Skill' : 'Add New Skill'}
          </ModalHeader>
          <ModalCloseButton top={6} right={6} />
          <ModalBody px={6} pb={6}>
            <Input
              placeholder="Enter skill name"
              value={newSkillName}
              onChange={(e) => setNewSkillName(e.target.value)}
              mb={4}
              autoFocus
            />
            <Button colorScheme="blue" mr={3} onClick={handleSaveSkill}>
              Save
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  )
}

export default SkillsBoard 