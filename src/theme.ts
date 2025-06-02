import { extendTheme } from '@chakra-ui/react'

// Define fonts at the top level for easy changes
const fonts = {
  heading: "Inter, system-ui, sans-serif",
  body: "Inter, system-ui, sans-serif",
}

const theme = extendTheme({
  fonts,
  styles: {
    global: {
      body: {
        bg: 'gray.100', // Slightly darker background
      },
      '@keyframes successPop': {
        '0%': {
          opacity: 0,
          transform: 'translate(-50%, -50%) scale(0.5)',
          filter: 'blur(10px)',
        },
        '50%': {
          opacity: 1,
          transform: 'translate(-50%, -50%) scale(1.2)',
          filter: 'blur(0)',
        },
        '100%': {
          opacity: 0,
          transform: 'translate(-50%, -50%) scale(1)',
          filter: 'blur(5px)',
        },
      },
    }
  },
  components: {
    IconButton: {
      baseStyle: {
        svg: {
          width: '1.5em',
          height: '1.5em',
        }
      }
    },
    Card: {
      baseStyle: (props: { colorMode: string }) => ({
        container: {
          bg: props.colorMode === 'dark' ? 'gray.800' : 'white',
          color: props.colorMode === 'dark' ? 'whiteAlpha.900' : 'gray.800',
        }
      })
    },
    Text: {
      baseStyle: {}
    },
    Heading: {
      baseStyle: {}
    },
    Button: {
      baseStyle: {}
    },
    Input: {
      baseStyle: {
        field: {}
      }
    },
    Menu: {
      baseStyle: {
        list: {},
        item: {}
      }
    }
  },
  semanticTokens: {
    colors: {
      'card-bg': {
        default: 'white',
        _dark: 'gray.800',
      },
      'card-border': {
        default: 'gray.200',
        _dark: 'gray.700',
      },
      'text-primary': {
        default: 'gray.800',
        _dark: 'whiteAlpha.900',
      },
      'text-secondary': {
        default: 'gray.600',
        _dark: 'whiteAlpha.700',
      },
      'section-bg': {
        default: 'gray.50',
        _dark: 'gray.700',
      }
    }
  }
})

export default theme 