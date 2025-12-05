import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Heading, Text, VStack, Stack, Card, CardBody, Divider } from '@chakra-ui/react'

import LikeButton from '../components/LikeButton'
import PostCard from '../components/PostCard'
import { API_BASE } from '../config'
function Home() {
  const navigate = useNavigate()

  const [userId, setUserId] = useState<string | null>(null)
  const [songs, setSongs] = useState<any[]>([])
  const [posts, setPosts] = useState<any[]>([])

  // Like ボタン処理（仮）
  const handleLike = () => {}

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

  // 投稿データ取得
  useEffect(() => {
    fetch(`${API_BASE}/posts`)
      .then((res) => res.json())
      .then((data) => setPosts(data))
  }, [])

  return (
    <VStack spacing={8} align="stretch">

      {/* ------------------- 曲一覧 ------------------- */}
      <Heading size="md" color="gray.700">曲一覧</Heading>

      <VStack spacing={4} align="stretch">
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

                  {/* Like */}
                  <LikeButton songId={song.id} onClick={handleLike} ml="auto" />

                </Box>
              </Stack>
            </CardBody>
          </Card>
        ))}
      </VStack>

      {/* ------------------- 投稿一覧 ------------------- */}
      <Heading size="md" color="gray.700">みんなの投稿</Heading>
      <VStack spacing={4} align="stretch">
        {posts.length === 0 ? (
          <Text color="gray.500">まだ投稿はありません。</Text>
        ) : (
          posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              currentUserId={userId ?? undefined}
            />
          ))
        )}
      </VStack>

    </VStack>
  )
}

export default Home
