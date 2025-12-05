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
} from '@chakra-ui/react'
import LikeButton from '../components/LikeButton'
import PostCard from '../components/PostCard'
import { API_BASE } from '../config'
import { BiComment } from 'react-icons/bi'

function Home() {
  const navigate = useNavigate()

  const [userId, setUserId] = useState<string | null>(null)
  const [songs, setSongs] = useState<any[]>([])
  const [posts, setPosts] = useState<any[]>([])
  const [openSongID, setOpenSongID] = useState<number | null>(null)

  // Like ボタン処理（仮）
  const handleLike = () => {}

  // コメント Drawer 開く
  const handleComment = (id: number) => {
    setOpenSongID(id)
  }

  // ログイン確認
  useEffect(() => {
    const storedId = localStorage.getItem('tomo_user_id')
    if (!storedId) {
      navigate('/login')
    } else {
      setUserId(storedId)
    }
  }, [])

  // 曲データ取得
  useEffect(() => {
    fetch(`${API_BASE}/songs`)
      .then((res) => res.json())
      .then((data) => setSongs(data))
  }, [])

  // 投稿取得
  useEffect(() => {
    fetch(`${API_BASE}/posts`)
      .then((res) => res.json())
      .then((data) => setPosts(data))
  }, [])

  return (
    <VStack spacing={8} align="stretch">

      {/* ------------------- 曲一覧 ------------------- */}
      <Heading size="md" color="gray.700">曲一覧</Heading>

      <VStack spacing={4}>
        {songs.map((song) => (
          <Card key={song.id} w="100%" shadow="sm">
            <CardBody p={4}>
              <Stack spacing={3}>
                <Box>
                  <Heading size="md">{song.title}</Heading>
                  <Text fontSize="sm" color="gray.500">{song.artist}</Text>
                </Box>

                <Divider />

                <Box display="flex" alignItems="center">
                  <Box flex={1}>
                    {song.url ? (
                      <audio controls src={song.url} style={{ width: '100%' }} />
                    ) : (
                      <Text color="red.400">※ 音声ファイルなし</Text>
                    )}
                  </Box>

                  <LikeButton songId={song.id} onClick={handleLike} ml="auto" />

                  <Button
                    bg="#fff6f6cf"
                    color="#ff78b5ff"
                    ml={3}
                    onClick={() => handleComment(song.id)}
                    p={2}
                    borderRadius="full"
                  >
                    <BiComment size={20} />
                  </Button>
                </Box>
              </Stack>
            </CardBody>
          </Card>
        ))}
      </VStack>

      {/* コメント Drawer */}
      {openSongID && (
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
        >
          <Text fontWeight="bold" mb={3}>みんなの投稿</Text>

          <VStack align="start">
            <Text>・めっちゃいい曲！</Text>
            <Text>・歌詞がしみる…</Text>
            <Text>・声好きすぎる</Text>
          </VStack>

          <Button mt={4} onClick={() => setOpenSongID(null)} w="100%">
            閉じる
          </Button>
        </Box>
      )}

      {/* ------------------- 投稿一覧 ------------------- */}
      <Heading size="md" color="gray.700">みんなの投稿</Heading>
      <VStack spacing={4} align="stretch">
        {posts.length === 0 ? (
          <Text color="gray.500">まだ投稿はありません。</Text>
        ) : (
          posts.map((post) => (
            <PostCard key={post.id} post={post} currentUserId={userId ?? undefined} />
          ))
        )}
      </VStack>

    </VStack>
  )
}

export default Home
