import { useEffect, useState } from 'react'
import { Box, Heading, Text, Container } from '@chakra-ui/react'

function Home() {
  const [songs, setSongs] = useState([])

  return (
    <Box bg="gray.100" minH="100vh" py={10} px={4}>{/* 全体の背景Box */}
      
      <Container /* 画面用の白いコンテナ */
        maxW="480px"  
        bg="white"         
        minH="80vh"        
        borderRadius="2xl" 
        boxShadow="xl"     
        p={0}              
        overflow="hidden"
      >
        <Box bg="pink.400" p={6} textAlign="center">{/* ヘッダーBox */}
          <Heading color="white" size="lg">TomoTune</Heading>
          <Text fontSize="sm" color="whiteAlpha.900" mt={1}>音楽でつながるSNS</Text>
        </Box>

        <Box p={6}>{/* メインコンテンツBox */}
          <Text fontSize="md">Hello</Text>
        </Box>
      </Container>
    </Box>
  )
}

export default Home
