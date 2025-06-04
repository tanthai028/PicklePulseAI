import { ReactNode } from 'react'
import {
  Box,
  Flex,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useColorMode,
  useColorModeValue,
  Container,
  Tag,
} from '@chakra-ui/react'
import { MoonIcon, SunIcon } from '@chakra-ui/icons'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import { signOut } from '../services/auth'
import { FiUser } from 'react-icons/fi'
import { isGuestUser } from '../services/guestMode'

interface Props {
  children: ReactNode
}

const Layout = ({ children }: Props) => {
  const { colorMode, toggleColorMode } = useColorMode()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    const { error } = await signOut()
    if (!error) {
      navigate('/login')
    }
  }

  return (
    <Box maxW="100vw" minH="100vh" bg={useColorModeValue('gray.100', 'gray.900')}>
      <Box 
        position="sticky"
        top={0}
        zIndex={1000}
        backdropFilter="blur(5px)"
        bg={useColorModeValue('rgba(255, 255, 255, 0.8)', 'rgba(26, 32, 44, 0.8)')}
        borderBottom="2px solid"
        borderColor={useColorModeValue('gray.100', 'gray.700')}
      >
        <Container maxW="container.xl" px={{ base: 6, md: 6 }}>
          <Flex h={16} alignItems="center" justifyContent="space-between">
            <RouterLink to="/dashboard">
              <Box
                fontSize={{ base: "xl", md: "2xl" }}
                fontWeight="bold"
                color={useColorModeValue('gray.800', 'white')}
              >
                PicklePulse
              </Box>
            </RouterLink>

            <Flex alignItems="center" gap={2}>
              {isGuestUser() && (
                <Tag
                  size="md"
                  variant="subtle"
                  colorScheme="orange"
                  borderRadius="full"
                  px={3}
                >
                  Guest Mode
                </Tag>
              )}
              <IconButton
                aria-label="Toggle dark mode"
                icon={colorMode === 'dark' ? <SunIcon boxSize={5} /> : <MoonIcon boxSize={5} />}
                onClick={toggleColorMode}
                variant="ghost"
                className="nav-icon"
                fontSize="xl"
              />
              <Menu>
                <MenuButton
                  as={IconButton}
                  icon={<FiUser size="20px" />}
                  variant="ghost"
                  className="nav-icon"
                  aria-label="User menu"
                  fontSize="xl"
                />
                <MenuList>
                  <MenuItem onClick={handleSignOut}>
                    Sign Out
                  </MenuItem>
                </MenuList>
              </Menu>
            </Flex>
          </Flex>
        </Container>
      </Box>
      <Container maxW="container.xl" px={{ base: 3, md: 6 }} py={{ base: 4, md: 8 }}>
        {children}
      </Container>
    </Box>
  )
}

export default Layout 