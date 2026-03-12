import {Box, ChakraProvider} from '@chakra-ui/react'

function App() {

  return (
      <ChakraProvider>
          <h1>Welcome to Client:</h1>
          <Box bg='var(--primary-color)' w='100%' p={4} color='white'>
              This is the Box
          </Box>
      </ChakraProvider>
  )
}

export default App
