import { Box, Heading, Text, VStack, Button, useToast } from '@chakra-ui/react'
import { useEffect, useState } from 'react'

function Share() {
  const toast = useToast()
  const [time, setTime] = useState(new Date())


  useEffect(() => {
    const checkTime = () => {
      const now = new Date()
      setTime(now) // ← 現在時刻を更新して画面に表示
      const hour = now.getHours()
      const minute = now.getMinutes()


      // 例: 毎日21:00に通知
      if ((hour === 8 && minute === 0) || (hour === 13 && minute === 0) || (hour === 18 && minute === 0)) {
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

  // 手動で通知を出す関数
  const notifyNow = () => {
    toast({
      title: "テスト通知",
      description: "これは動作確認用の通知です ✅",
      status: "success",
      duration: 3000,
      isClosable: true,
    })
  }


  return (
    <VStack spacing={4}>
      <Heading color="pink.400">音楽をシェア</Heading>
      <Text>投稿ページはこちら</Text>

       {/* 現在時刻を表示 */}
      <Box>
        <Text>現在時刻: {time.toLocaleTimeString()}</Text>
      </Box>

      {/* テスト通知ボタン */}
      <Button onClick={notifyNow} colorScheme="pink">
        通知テスト
      </Button>

    </VStack>
  )
}

export default Share
