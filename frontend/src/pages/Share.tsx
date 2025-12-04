import { Box, Heading, Text, VStack, useToast } from '@chakra-ui/react'
import { useEffect } from 'react'

function Share() {
  const toast = useToast()

  useEffect(() => {
    const checkTime = () => {
      const now = new Date()
      const hour = now.getHours()
      const minute = now.getMinutes()

      // 例: 毎日21:00に通知
      if (hour === 21 && minute === 0) {
        toast({
          title: "投稿の時間です！",
          description: "音楽をシェアしましょう 🎵",
          status: "info",
          duration: 5000,
          isClosable: true,
        })
      }
    }

    // 1分ごとに時刻チェック
    const interval = setInterval(checkTime, 60000)

    return () => clearInterval(interval)
  }, [toast])


  return (
    <VStack spacing={4}>
      <Heading color="pink.400">音楽をシェア</Heading>
      <Text>投稿ページはこちら</Text>
    </VStack>
  )
}

export default Share
