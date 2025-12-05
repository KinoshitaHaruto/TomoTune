import React, { useMemo, useState } from 'react'
import {
  Box,
  Heading,
  Text,
  VStack,
  Card,
  CardBody,
  HStack,
  Badge,
  Divider,
  Textarea,
  Button,
  Stack,
  Tag,
} from '@chakra-ui/react'
import { API_BASE } from '../config'
import type { Post, Comment } from '../types'

interface PostCardProps {
  post: Post
  currentUserId?: string
}

const PostCard: React.FC<PostCardProps> = ({ post, currentUserId }) => {
  const audioSrc = post.song.url.startsWith('http') ? post.song.url : `${API_BASE || ''}${post.song.url}`
  const date = new Date(post.created_at)
  const isMine = currentUserId && post.user && post.user.id === currentUserId
  const [commentText, setCommentText] = useState('')
  const [comments, setComments] = useState<Comment[]>(post.comments ?? [])

  const userTypeLabel = useMemo(() => {
    if (!post.user?.music_type) return null
    return `${post.user.music_type.code} ${post.user.music_type.name ?? ''}`.trim()
  }, [post.user?.music_type])

  const handleAddComment = async () => {
    if (!currentUserId) return alert('コメントするにはログインしてください')
    if (!commentText.trim()) return

    const res = await fetch(`${API_BASE}/posts/${post.id}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: currentUserId, content: commentText.trim() }),
    })

    if (!res.ok) {
      alert('コメントの送信に失敗しました')
      return
    }

    const newComment = (await res.json()) as Comment
    setComments((prev) => [...prev, newComment])
    setCommentText('')
  }

  return (
    <Card
      w="100%"
      shadow="sm"
      borderRadius="lg"
      border="1px solid"
      borderColor={isMine ? 'purple.300' : 'gray.200'}
      bg={isMine ? 'purple.50' : 'white'}
    >
      <CardBody>
        <VStack align="stretch" spacing={3}>
          <HStack justify="space-between" align="center">
            <Box>
              <Text fontSize="sm" color="gray.500">
                投稿者
              </Text>
              <Heading size="sm" color="gray.800">
                {post.user?.name ?? 'Unknown'}
              </Heading>
              {userTypeLabel && (
                <Tag size="sm" colorScheme="purple" mt={1} variant="subtle">
                  {userTypeLabel}
                </Tag>
              )}
            </Box>
            <Badge colorScheme="pink" fontSize="xs">
              {date.toLocaleString()}
            </Badge>
          </HStack>

          <Divider />

          <Box>
            <Text fontSize="xs" color="gray.500" mb={1}>
              曲
            </Text>
            <Text fontWeight="bold">{post.song.title}</Text>
            <Text fontSize="sm" color="gray.500">
              {post.song.artist}
            </Text>
          </Box>

          <Box>
            <audio
              controls
              src={audioSrc}
              style={{ width: '100%' }}
              controlsList="nodownload noplaybackrate"
            >
              オーディオ非対応
            </audio>
          </Box>

          <Box>
            <Text fontSize="xs" color="gray.500" mb={1}>
              コメント
            </Text>
            <Text fontSize="sm" color="gray.800">
              {post.comment}
            </Text>
          </Box>

          <Divider />

          <VStack align="stretch" spacing={3}>
            <HStack justify="space-between">
              <Text fontSize="sm" fontWeight="bold">
                コメント一覧
              </Text>
              <Text fontSize="xs" color="gray.500">
                {comments.length}件
              </Text>
            </HStack>

            {comments.length === 0 ? (
              <Text fontSize="sm" color="gray.500">
                まだコメントはありません。
              </Text>
            ) : (
              <VStack align="stretch" spacing={2}>
                {comments.map((c) => (
                  <Box key={c.id} p={2} bg="gray.50" borderRadius="md" border="1px solid" borderColor="gray.100">
                    <HStack justify="space-between" mb={1}>
                      <Box>
                        <Text fontSize="sm" fontWeight="semibold">
                          {c.user?.name ?? 'Unknown'}
                        </Text>
                        {c.user?.music_type?.code && (
                          <Tag size="xs" colorScheme="purple" variant="subtle" mt={1}>
                            {c.user.music_type.code}
                          </Tag>
                        )}
                      </Box>
                      <Text fontSize="xs" color="gray.500">
                        {new Date(c.created_at).toLocaleString()}
                      </Text>
                    </HStack>
                    <Text fontSize="sm" color="gray.800">
                      {c.content}
                    </Text>
                  </Box>
                ))}
              </VStack>
            )}

            <Stack spacing={2}>
              <Textarea
                placeholder="投稿へのコメントを書く"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                size="sm"
                bg="gray.50"
              />
              <Button colorScheme="pink" size="sm" onClick={handleAddComment} isDisabled={!currentUserId}>
                コメントを送信
              </Button>
              {!currentUserId && (
                <Text fontSize="xs" color="gray.500">
                  コメントするにはログインしてください。
                </Text>
              )}
            </Stack>
          </VStack>
        </VStack>
      </CardBody>
    </Card>
  )
}

export default PostCard