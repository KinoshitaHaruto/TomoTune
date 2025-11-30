import { useEffect, useState } from 'react'
import { Box, Container, Heading, Text, Button, VStack, Stack, Card, CardBody, Divider} from '@chakra-ui/react'

// 曲データの設計図
type Song = {
  id: number;
  title: string;
  artist: string;
  url: string;
};

function Home() {
    const [songs, setSongs] = useState<Song[]>([])

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
          {/* map関数を使った曲カードリストの表示 */}
        {
          songs.map((song) => (
            <Card key={song.id} w="100%" maxW="600px" boxShadow="md">
              <CardBody>
                <Stack spacing={1}>
                  <Heading size="md">{song.title}</Heading>
                  <Text color="gray.500">{song.artist}</Text>
                  <Divider /> {/* 仕切り線 */}
                  {/* 音楽プレイヤー
                    song.url に文字が入っている時だけプレイヤーを表示
                    src={song.url} で、Pythonのファイル場所を指定
                  */}
                  {song.url ? (
                    <audio controls src={song.url} style={{ width: '100%' }} controlsList="nodownload noplaybackrate">
                    オーディオ非対応
                    </audio>
                  ) : (
                  <Text color="red.400" fontSize="sm">※ 音声ファイルがありません</Text>
                  )}
                </Stack>
              </CardBody>
            </Card>
          ))
        }
        </Box>
      </Container>
    </Box>
  )
}

export default Home
