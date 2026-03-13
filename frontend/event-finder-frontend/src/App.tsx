import {ChakraProvider} from '@chakra-ui/react'
import Login from "@pages/Login/Login.tsx";

function App() {

  return (
      <ChakraProvider>
          <Login/>
      </ChakraProvider>
  )
}

export default App
