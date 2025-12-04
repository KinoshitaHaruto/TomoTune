import React from 'react'
import { Box, Heading, Text, Stack, Card, CardBody, Divider, Badge, Button } from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'
import LikeButton from './LikeButton'
import { API_BASE } from '../config'
import type { Song } from '../types'

interface MusicCardProps {
  song: Song
  isFavorite: boolean
  onLikeSuccess?: (totalLikes: number, isMilestone: boolean) => void
}

const MusicCard: React.FC<MusicCardProps> = ({ song, isFavorite, onLikeSuccess }) => {
  const navigate = useNavigate()

  const handleShareClick = () => {
    navigate('/share', { state: { song } })
  }

  const audioSrc = song.url.startsWith('http') ? song.url : `${API_BASE || ''}${song.url}`

  return (
    <Card
      w="100%"
      shadow="sm"
      borderRadius="lg"
      border="1px solid"
      borderColor={isFavorite ? 'pink.300' : 'gray.200'}
      bg={isFavorite ? 'pink.50' : 'white'}
    >
      <CardBody p={4}>
        <Stack spacing={3}>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Box>
              <Heading size="md">{song.title}</Heading>
              <Text color="gray.500" fontSize="sm">
                {song.artist}
              </Text>
            </Box>
            {isFavorite && (
              <Badge colorScheme="pink" fontSize="xs">
                お気に入り
              </Badge>
            )}
          </Box>

          <Divider />

          <Box display="flex" alignItems="center" gap={3}>
            <Box flex={1}>
              {song.url ? (
                <audio
                  controls
                  src={audioSrc}
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
              ml="auto"
              onLikeSuccess={(total, milestone) => onLikeSuccess?.(total, milestone)}
            />

            <Button
              size="sm"
              colorScheme="teal"
              variant="outline"
              ml={2}
              onClick={handleShareClick}
            >
              投稿
            </Button>
          </Box>
        </Stack>
      </CardBody>
    </Card>
  )
}

export default MusicCard