import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { Box, Container, Heading, Text } from '@chakra-ui/react'

const Layout = () => {
  const navigate = useNavigate()
  const location = useLocation() // 現在のURL情報を取得

  const handleLogout = () => {
    localStorage.removeItem("tomo_user_id")
    localStorage.removeItem("tomo_user_name")
    navigate("/login")
  }
  return (
    // 全体の背景
    <Box bg="gray.100" minH="100vh" py={10} px={4}>
      
      {/* スマホ枠 (固定) */}
      <Container 
        maxW="480px"       
        bg="white"         
        minH="80vh"        
        borderRadius="2xl" 
        boxShadow="xl"     
        p={0}              
        overflow="hidden"
        display="flex"
        flexDirection="column"
      >
          {/* ヘッダー (固定) */}
        <Box bg="pink.400" p={6} textAlign="center" flexShrink={0}>
          <Heading color="white" size="lg">TomoTune</Heading>
          <Text fontSize="sm" color="whiteAlpha.900" mt={1}>音楽でつながるSNS</Text>
        </Box>

        {/* コンテンツエリア */}
        <Box 
          flex={1} 
          overflowY="auto" 
          p={6}
          // スクロールバーを隠すスタイル
          css={{ '&::-webkit-scrollbar': { display: 'none' } }}
        >
          {/* outletにpageを差し込む */}
          <Outlet />
        </Box>

      </Container>
    </Box>
  )
}

export default Layout