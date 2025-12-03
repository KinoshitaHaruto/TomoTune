import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { Box, Container, Heading, Text, HStack, IconButton, useToast } from '@chakra-ui/react'
import { FiHome, FiPlus, FiMusic, FiUser } from 'react-icons/fi'

const Layout = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const toast = useToast()

  const handleLogout = () => {
    localStorage.removeItem("tomo_user_id")
    localStorage.removeItem("tomo_user_name")
    navigate("/login")
  }

  // ナビゲーションアイテム
  const navItems = [
    { icon: FiHome, label: 'ホーム', path: '/' },
    { icon: FiPlus, label: '投稿', path: '/share' },
    { icon: FiMusic, label: '曲', path: '/music' },
    { icon: FiUser, label: 'プロフ', path: '/profile' },
  ]

  const isActive = (path: string) => location.pathname === path
  return (
    // 全体の背景
    <Box bg="gray.100" minH="100vh" py={10} px={4}>
      
      {/* スマホ枠 (固定) */}
      <Container 
        maxW="480px"       
        bg="white"         
        h="800px"          // 固定高さ（スマホサイズ）
        borderRadius="2xl" 
        boxShadow="xl"     
        p={0}              
        overflow="hidden"
        display="flex"
        flexDirection="column"
      >
        {/* ヘッダー (固定) - グラデーション背景 */}
        <Box
          bgGradient="linear(to-r, purple.500, pink.400, red.400)"
          p={4}
          textAlign="center"
          flexShrink={0}
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          color="white"
        >
          <Box flex={1} />

          <Box flex={2} textAlign="center">
            <Heading size="lg" color="white">
              TomoTune
            </Heading>
          </Box>

          <Box flex={1} />
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

        {/* フッター (固定) - グラデーション背景 + ナビゲーション */}
        <Box
          bgGradient="linear(to-r, purple.500, pink.400, blue.400)"
          p={4}
          flexShrink={0}
        >
          <HStack
            spacing={0}
            justify="space-around"
            color="white"
          >
            {navItems.map((item) => (
              <IconButton
                key={item.path}
                aria-label={item.label}
                icon={<item.icon size={28} />}
                bg={isActive(item.path) ? 'whiteAlpha.300' : 'transparent'}
                color="white"
                fontSize="24px"
                _hover={{ bg: 'whiteAlpha.200' }}
                onClick={() => navigate(item.path)}
                borderRadius="full"
                size="lg"
              />
            ))}
          </HStack>
        </Box>

      </Container>
    </Box>
  )
}

export default Layout