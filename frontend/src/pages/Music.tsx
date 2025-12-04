import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Heading,
  Text,
  VStack,
  Stack,
  Card,
  CardBody,
  Divider,
  useToast,
  Badge,
  HStack,
  Switch,
} from '@chakra-ui/react'
import LikeButton from '../components/LikeButton'
import { API_BASE } from '../config'

type Song = {
  id: number
  title: string
  artist: string
  url: string
}

function Music() {
  const [songs, setSongs] = useState<Song[]>([])
  const [favoriteIds, setFavoriteIds] = useState<number[]>([])
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false)
  const navigate = useNavigate()
  const toast = useToast()
  const userId = localStorage.getItem('tomo_user_id')

  // ログインチェック
  useEffect(() => {
    if (!userId) {
      navigate('/login')
    }
  }, [])

  // 全曲取得
  useEffect(() => {
    fetch(`${API_BASE}/songs`)
      .then((res) => res.json())
      .then((data: Song[]) => {
        setSongs(data)
      })
      .catch((err) => {
        console.error('曲リストの取得に失敗:', err)
        toast({ title: '曲リストの読み込みエラー', status: 'error' })
      })
  }, [])

  const handleLikeSuccess = (songId: number, _total: number, isMilestone: boolean) => {
    if (isMilestone) {
      setFavoriteIds((prev) => {
        if (prev.includes(songId)) return prev
        return [...prev, songId]
      })
    }
  }

  const displayedSongs = showFavoritesOnly
    ? songs.filter((song) => favoriteIds.includes(song.id))
    : songs

  return (
    <VStack spacing={4} align="stretch">
      <HStack justify="space-between" align="center">
        <Heading color="pink.400" size="lg">
          {showFavoritesOnly ? 'お気に入りの曲' : 'すべての曲'}
        </Heading>
        <HStack spacing={2} align="center">
          <Text fontSize="sm" color="gray.600">
            お気に入りだけ
          </Text>
          <Switch
            colorScheme="pink"
            isChecked={showFavoritesOnly}
            onChange={(e) => setShowFavoritesOnly(e.target.checked)}
          />
        </HStack>
      </HStack>

      {displayedSongs.length === 0 ? (
        <Box textAlign="center" py={10}>
          <Text color="gray.500">
            {showFavoritesOnly ? 'お気に入り曲はまだありません' : '曲が見つかりません'}
          </Text>
          {showFavoritesOnly && (
            <Text color="gray.400" fontSize="sm" mt={2}>
              曲を5回いいねすると、お気に入りとしてここに表示されます
            </Text>
          )}
        </Box>
      ) : (
        displayedSongs.map((song) => (
          <Card
            key={song.id}
            w="100%"
            shadow="sm"
            borderRadius="lg"
            border="1px solid"
            borderColor={favoriteIds.includes(song.id) ? 'pink.300' : 'gray.200'}
            bg={favoriteIds.includes(song.id) ? 'pink.50' : 'white'}
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
                  {favoriteIds.includes(song.id) && (
                    <Badge colorScheme="pink" fontSize="xs">
                      お気に入り
                    </Badge>
                  )}
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
                    ml="auto"
                    onLikeSuccess={(total, isMilestone) =>
                      handleLikeSuccess(song.id, total, isMilestone)
                    }
                  />
                </Box>
              </Stack>
            </CardBody>
          </Card>
        ))
      )}
    </VStack>
  )
}

export default Music
