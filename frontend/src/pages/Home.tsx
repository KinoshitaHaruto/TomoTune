import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Heading,
  Text,
  Button,
  VStack,
  Card,
  CardBody,
  Stack,
  Divider,
} from '@chakra-ui/react'
import LikeButton from '../components/LikeButton'
import { API_BASE } from '../config'

function Home() {
  const navigate = useNavigate()

  // ===== 必要な state を追加 =====
  const [songs, setSongs] = useState<any[]>([])
  const [openSongID, setOpenSongID] = useState<number | null>(null)

  // いいね（今回は Home 側で何もしないので空）
  const handleLike = () => {}

  // コメント押した時
  const handleComment = (songId: number) => {
    setOpenSongID(songId)
  }

  // ===== ログインチェック =====
  useEffect(() => {
    const userId = localStorage.getItem('tomo_user_id')
    if (!userId) {
      navigate('/login')
    }
  }, [])

  // ===== 曲の読み込み（本番API）=====
  useEffect(() => {
    fetch(`${API_BASE}/songs`)
      .then((res) => res.json())
      .then((data) => setSongs(data))
      .catch((err) => console.error("曲取得エラー:", err))
  }, [])

  return (
    <>
      <VStack spacing={4}>
        {songs.map((song) => (
          <Card
            key={song.id}
            w="100%"
            shadow="sm"
            borderRadius="lg"
            border="1px solid"
            borderColor="gray.200"
          >
            <CardBody p={4}>
              <Stack spacing={3}>
                <Box>
                  <Heading size="md">{song.title}</Heading>
                  <Text color="gray.500" fontSize="sm">
                    {song.artist}
                  </Text>
                </Box>

                <Divider />

                <Box display="flex" alignItems="center">
                  <Box flex={1}>
                    {song.url ? (
                      <audio
                        controls
                        src={
                          song.url.startsWith("http")
                            ? song.url
                            : `${API_BASE}${song.url}`
                        }
                        style={{ width: '100%' }}
                        controlsList="nodownload noplaybackrate"
                      >
                        オーディオ非対応
                      </audio>
                    ) : (
                      <Text color="red.400" fontSize="sm">
                        ※ 音声ファイルがありません
                      </Text>
                    )}
                  </Box>

                  <LikeButton
                    songId={song.id}
                    onClick={handleLike}
                    ml="auto"
                  />

                  <Button
                    bg="#ff78b5ff"
                    color="white"
                    ml={3}
                    onClick={() => handleComment(song.id)}
                  >
                    コメント
                  </Button>
                </Box>
              </Stack>
            </CardBody>
          </Card>
        ))}
      </VStack>

      {/* ===== コメント Drawer ===== */}
      <Box
        position="fixed"
        bottom={0}
        left="50%"
        transform="translateX(-50%)"
        width="100%"
        maxW="480px"
        bg="white"
        borderTopRadius="24px"
        boxShadow="0 -4px 12px rgba(0,0,0,0.15)"
        maxH="55vh"
        overflowY="auto"
        zIndex={2000}
        p={4}
        display={openSongID ? 'block' : 'none'}
      >
        <Text fontWeight="bold" mb={3}>
          投稿ID: {openSongID}
        </Text>

        <VStack align="start" spacing={3}>
          <Text>・めっちゃいい曲！</Text>
          <Text>・歌詞がしみる…</Text>
          <Text>・声好きすぎる</Text>
        </VStack>

        <Button mt={4} onClick={() => setOpenSongID(null)} w="100%">
          閉じる
        </Button>
      </Box>
    </>
  )
}

export default Home