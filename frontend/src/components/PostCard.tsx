import React from 'react'
import { Box, Heading, Text, VStack, Card, CardBody, HStack, Badge, Divider } from '@chakra-ui/react'
import { API_BASE } from '../config'
import type { Post } from '../types'

interface PostCardProps {
  post: Post
  currentUserId?: string
}

const PostCard: React.FC<PostCardProps> = ({ post, currentUserId }) => {
  const audioSrc = post.song.url.startsWith('http') ? post.song.url : `${API_BASE || ''}${post.song.url}`
  const date = new Date(post.created_at)
  const isMine = currentUserId && post.user && post.user.id === currentUserId

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
        </VStack>
      </CardBody>
    </Card>
  )
}

export default PostCard