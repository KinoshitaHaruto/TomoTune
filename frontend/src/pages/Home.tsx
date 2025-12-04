import React, { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
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
import PostCard from '../components/PostCard'
import type { Post } from '../types'

function Home() {
  const navigate = useNavigate()
  const [posts, setPosts] = useState<Post[]>([])
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    const storedId = localStorage.getItem('tomo_user_id')
    if (!storedId) {
      navigate('/login')
    } else {
      setUserId(storedId)
    }
  }, [])

  useEffect(() => {
    fetch(`${API_BASE}/posts`)
      .then((res) => res.json())
      .then((data: Post[]) => {
        setPosts(data)
      })
      .catch((err) => {
        console.error('投稿の取得に失敗しました', err)
      })
  }, [])

  return (
    <VStack spacing={6} align="stretch">
      <Heading size="lg" color="pink.400">
        TomoTune へようこそ
      </Heading>
      <Text color="gray.600" fontSize="sm">
        曲を聴いて気に入った曲のハートボタンを押そう！Music Type がどんどん今のあなたに近づいていきます。
      </Text>
      <Box>
        <Button
          as={Link}
          to="/music"
          colorScheme="pink"
          width="100%"
        >
          曲一覧へ
        </Button>
      </Box>

      {/* 投稿一覧 */}
      <VStack spacing={4} align="stretch">
        <Heading size="md" color="gray.700">
          みんなの投稿
        </Heading>
        {posts.length === 0 ? (
          <Text color="gray.500" fontSize="sm">
            まだ投稿はありません。気に入った曲をシェアしてみましょう！
          </Text>
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