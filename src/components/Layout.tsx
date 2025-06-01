import { ReactNode } from 'react'
import {
  Box,
  Flex,
  HStack,
  IconButton,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useDisclosure,
  useColorModeValue,
  Stack,
  Container,
} from '@chakra-ui/react'
import { HamburgerIcon, CloseIcon } from '@chakra-ui/icons'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import { signOut } from '../services/supabase'

interface Props {
  children: ReactNode
}

const Links = [
  { name: 'Dashboard', to: '/dashboard' },
]

const NavLink = ({ children, to }: { children: ReactNode; to: string }) => (
  <RouterLink to={to}>
    <Button variant="ghost">{children}</Button>
  </RouterLink>
)

const Layout = ({ children }: Props) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    const { error } = await signOut()
    if (!error) {
      navigate('/login')
    }
  }

  return (
    <Box maxW="100vw" minH="100vh" bg={useColorModeValue('gray.50', 'gray.900')}>
      <Box bg={useColorModeValue('white', 'gray.800')} px={4} boxShadow="sm">
        <Container maxW="container.xl">
          <Flex h={16} alignItems="center" justifyContent="space-between">
            <IconButton
              size="md"
              icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
              aria-label="Open Menu"
              display={{ md: 'none' }}
              onClick={isOpen ? onClose : onOpen}
            />
            <HStack spacing={8} alignItems="center">
              <RouterLink to="/dashboard">
                <Box 
                  fontWeight="bold" 
                  fontSize="xl" 
                  color="brand.500"
                  _hover={{ color: 'brand.600', cursor: 'pointer' }}
                >
                  PicklePulse
                </Box>
              </RouterLink>
              <HStack as="nav" spacing={4} display={{ base: 'none', md: 'flex' }}>
                {Links.map((link) => (
                  <NavLink key={link.name} to={link.to}>
                    {link.name}
                  </NavLink>
                ))}
              </HStack>
            </HStack>
            <Menu>
              <MenuButton as={Button} variant="ghost">
                Profile
              </MenuButton>
              <MenuList>
                <MenuItem as={RouterLink} to="/profile">
                  Settings
                </MenuItem>
                <MenuItem onClick={handleSignOut}>Sign Out</MenuItem>
              </MenuList>
            </Menu>
          </Flex>

          {isOpen ? (
            <Box pb={4} display={{ md: 'none' }}>
              <Stack as="nav" spacing={4}>
                {Links.map((link) => (
                  <NavLink key={link.name} to={link.to}>
                    {link.name}
                  </NavLink>
                ))}
              </Stack>
            </Box>
          ) : null}
        </Container>
      </Box>
      <Container maxW="container.xl" py={8}>
        {children}
      </Container>
    </Box>
  )
}

export default Layout 