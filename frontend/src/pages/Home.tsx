import { useEffect, useState } from 'react'
import { Box, Heading, Text, Container } from '@chakra-ui/react'

function Home() {
    const [text, setText] = useState("データが届いてません")

  // useEffct(何をするか いつするか)
  useEffect(() => {
    console.log("通信開始！")

    fetch("http://127.0.0.1:8000/hello")  // 通信機能
      .then(res => res.json())
      .then(data => {
        console.log("届いたデータ : ", data)
        setText(data.message)
      })
  }, [])

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
        </Box>

        <Box p={6}>{/* メインコンテンツBox */}
          <Text fontSize="xl" color="gray.600">サーバーからのメッセージ: {text}</Text>
        </Box>
      </Container>
    </Box>
  )
}

export default Home
