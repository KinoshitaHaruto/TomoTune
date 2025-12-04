import React from 'react'
import { useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Box, Heading, Text, Button, VStack } from '@chakra-ui/react'

function Home() {
  const navigate = useNavigate()

  // ログインチェック
  useEffect(() => {
    const userId = localStorage.getItem('tomo_user_id')
    if (!userId) {
      navigate('/login')
    }
  }, [])

  return (
    <VStack spacing={6} align="stretch">
      <Heading size="lg" color="pink.400">
        TomoTune へようこそ
      </Heading>
      <Text color="gray.600" fontSize="sm">
        曲を聴いて気に入った曲のハートボタンを押そう！Music Type がどんどん今のあなたに近づいていきます！（投稿見れる画面）
      </Text>
      <Box>
        <Button
          as={Link}
          to="/music"
          colorScheme="pink"
          width="100%"
        >
          曲一覧へ
        </Button>
      </Box>
    </VStack>
  )
}

export default Home
