import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Heading, Text, Button, VStack, Stack, Card, CardBody, Divider} from '@chakra-ui/react'

// 曲データの設計図
type Song = {
  id: number;
  title: string;
  artist: string;
  url: string;
};

function Home() {
  const [songs, setSongs] = useState<Song[]>([])
  const navigate = useNavigate()

  // ログインチェック
    useEffect(() => {
    const userId = localStorage.getItem("tomo_user_id")
    if (!userId) {
      navigate("/login")
    }
  }, [])

  // useEffct(何をするか いつするか)
  // 画面が出たら一度だけ実行
  useEffect(() => {
    fetch("http://127.0.0.1:8000/songs")  // 通信機能
      .then(res => res.json())
      .then(data => {
        console.log("データ受信 : ", data)
        setSongs(data)
      })
  }, [])

  return (
    <VStack spacing={4}>
      {songs.map((song) => (
        <Card key={song.id} w="100%" shadow="sm" borderRadius="lg" border="1px solid" borderColor="gray.200">
          <CardBody p={4}>
            <Stack spacing={3}>
              <Box>
                <Heading size="md">{song.title}</Heading>
                <Text color="gray.500" fontSize="sm">{song.artist}</Text>
              </Box>
              
              <Divider /> 

              {song.url ? (
                <audio 
                  controls 
                  src={song.url} 
                  style={{ width: '100%' }} 
                  controlsList="nodownload noplaybackrate"
                >
                  オーディオ非対応
                </audio>
              ) : (
                <Text color="red.400" fontSize="sm">※ 音声ファイルがありません</Text>
              )}
            </Stack>
          </CardBody>
        </Card>
      ))}
    </VStack>
  )
}

export default Home
