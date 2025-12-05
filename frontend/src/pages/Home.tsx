import React, { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
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

import { API_BASE } from '../config'
import LikeButton from '../components/LikeButton'
import PostCard from '../components/PostCard'
import type { Post } from '../types'

// 曲の型
type Song = {
  id: number
  title: string
  artist: string
  url: string
}

function Home() {
  const navigate = useNavigate()

  const [userId, setUserId] = useState<string | null>(null)

  // 曲関連
  const [songs, setSongs] = useState<Song[]>([])
  const [openSongID, setOpenSongID] = useState<number | null>(null)

  // 投稿関連
  const [posts, setPosts] = useState<Post[]>([])

  // ログインチェック
  useEffect(() => {
    const storedId = localStorage.getItem('tomo_user_id')
    if (!storedId) {
      navigate('/login')
    } else {
      setUserId(storedId)
    }
  }, [navigate])

  // 曲取得
  useEffect(() => {
    fetch(`${API_BASE}/songs`)
      .then((res) => res.json())
      .then((data: Song[]) => setSongs(data))
      .catch((err) => console.error('曲の取得に失敗しました', err))
  }, [])

  // 投稿取得
  useEffect(() => {
    fetch(`${API_BASE}/posts`)
      .then((res) => res.json())
      .then((data: Post[]) => setPosts(data))
      .catch((err) => console.error('投稿の取得に失敗しました', err))
  }, [])

  const handleComment = (songId: number) => {
    setOpenSongID(songId)
  }

  return (
    <VStack spacing={8} align="stretch">
      {/* 🏠 ヘッダ */}
      <Heading size="lg" color="pink.400">
        TomoTune へようこそ
      </Heading>
      <Text color="gray.600" fontSize="sm">
        曲を聴いて気に入った曲のハートボタンを押そう！今日は何が見つかるかな？
      </Text>

      {/* 🎵 曲セクション */}
      <VStack spacing={4} align="stretch">
        <Heading size="md" color="gray.700">
          人気の曲
        </Heading>

        {songs.length === 0 ? (
          <Text color="gray.500" fontSize="sm">曲を読み込んでいます…</Text>
        ) : (
          songs.map((song) => (
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

                  {/* audio, Like, コメント */}
                  <Box display="flex" alignItems="center">
                    <Box flex={1}>
                      <audio
                        controls
                        src={song.url}
                        style={{ width: '100%' }}
                        controlsList="nodownload noplaybackrate"
                      />
                    </Box>

                    <LikeButton songId={song.id} ml="auto" />

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
          ))
        )}
      </VStack>

      {/* 💬 コメント Drawer */}
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
          <Text fontWeight="bold" mb={3}>
            みんなのコメント
          </Text>

          <VStack align="start" spacing={3}>
            <Text>・めっちゃいい曲！</Text>
            <Text>・歌詞がしみる…</Text>
            <Text>・声好きすぎる</Text>
          </VStack>

          <Button mt={4} width="100%" onClick={() => setOpenSongID(null)}>
            閉じる
          </Button>
        </Box>
      )}

      {/* ✍ 投稿一覧 */}
      <VStack spacing={4} align="stretch" mt={6}>
        <Heading size="md" color="gray.700">
          みんなの投稿
        </Heading>

        {posts.length === 0 ? (
          <Text color="gray.500" fontSize="sm">投稿を読み込んでいます…</Text>
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