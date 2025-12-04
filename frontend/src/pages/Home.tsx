import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { 
  Box,
  Heading, 
  Text, 
  Button, 
  VStack, 
  Stack, 
  Card, 
  CardBody, 
  Divider, 
  useToast,
} from '@chakra-ui/react'

import { API_BASE } from '../config'
import LikeButton from '../components/LikeButton'
import { BiComment } from "react-icons/bi"

import { Drawer, DrawerOverlay, DrawerContent, DrawerHeader, DrawerBody, DrawerCloseButton } from '@chakra-ui/react'

// 曲データの設計図
type Song = {
  id: number;
  title: string;
  artist: string;
  url: string;
};

function Home() {
  const navigate = useNavigate()
  const [openSongID, setOpenSongID] = useState<number | null>(null)
  const [songs, setSongs] = useState<Song[]>([])


  // ログインチェック
  useEffect(() => {
    const userId = localStorage.getItem('tomo_user_id')
    if (!userId) {
      navigate('/login')
    }
  }, [])
  
  const handleComment = (songId: number) => {
    setOpenSongID(songId)
  }

  const handleLike = (songId: number) => {
    console.log("liked:", songId)
  }

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
                        src={song.url}
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

      {/* コメント Drawer */}
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
          display={openSongID ? "block" : "none"}
        >
          <Text fontWeight="bold" mb={3}>
            みんなのコメント
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
