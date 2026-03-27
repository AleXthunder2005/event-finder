import {ChakraProvider} from '@chakra-ui/react'
import Register from "@pages/Register/Register.tsx";
import Login from "@pages/Login/Login.tsx";
import {Navigate, Route, Routes} from "react-router-dom";

function App() {

  return (
      <ChakraProvider>
          <Routes>
              <Route path="/" element={<Navigate to="/login" />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
          </Routes>
      </ChakraProvider>
  )
}

export default App
