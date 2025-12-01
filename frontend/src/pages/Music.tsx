import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Heading, Text, VStack, Stack, Card, CardBody, Divider, useToast, Badge } from '@chakra-ui/react'
import LikeButton from '../components/LikeButton'

type Song = {
  id: number
  title: string
  artist: string
  url: string
}

type LikeLog = {
  id: number
  user_id: string
  song_id: number
  timestamp: string
}

function Music() {
  const [favoriteSongs, setFavoriteSongs] = useState<Song[]>([])
  const [likeCount, setLikeCount] = useState<{ [key: number]: number }>({})
  const navigate = useNavigate()
  const toast = useToast()
  const userId = localStorage.getItem('tomo_user_id')

  // ログインチェック
  useEffect(() => {
    if (!userId) {
      navigate('/login')
    }
  }, [])

  // ユーザーのいいね履歴を取得してお気に入り曲を抽出
  useEffect(() => {
    if (!userId) return

    // バックエンド API から全曲とユーザーのいいね履歴を取得（未実装の場合は localStorage で管理）
    const savedLikes = localStorage.getItem(`tomo_user_likes_${userId}`)
    if (savedLikes) {
      try {
        const likes = JSON.parse(savedLikes)
        const songLikeCount: { [key: number]: number } = {}
        
        // 曲ごとにいいね数をカウント
        likes.forEach((like: { song_id: number }) => {
          songLikeCount[like.song_id] = (songLikeCount[like.song_id] || 0) + 1
        })

        setLikeCount(songLikeCount)

        // お気に入り曲（5回以上いいね）を抽出
        const favoriteIds = Object.entries(songLikeCount)
          .filter(([_, count]) => count >= 5)
          .map(([id, _]) => parseInt(id))

        // 曲情報を取得
        fetch('http://127.0.0.1:8000/songs')
          .then((res) => res.json())
          .then((data: Song[]) => {
            const filtered = data.filter((song) => favoriteIds.includes(song.id))
            setFavoriteSongs(filtered)
          })
          .catch((err) => {
            console.error('曲リストの取得に失敗:', err)
            toast({ title: '曲リストの読み込みエラー', status: 'error' })
          })
      } catch (err) {
        console.error('いいね履歴の解析に失敗:', err)
      }
    } else {
      // いいね履歴がない場合は空表示
      setFavoriteSongs([])
    }
  }, [userId])

  const handleLike = (songId: number) => {
    if (!userId) return

    // localStorage に いいね を記録（バックエンド API の準備中）
    const savedLikes = localStorage.getItem(`tomo_user_likes_${userId}`)
    const likes = savedLikes ? JSON.parse(savedLikes) : []
    likes.push({ song_id: songId, timestamp: new Date().toISOString() })
    localStorage.setItem(`tomo_user_likes_${userId}`, JSON.stringify(likes))

    // いいね数をアップデート
    const newCount = (likeCount[songId] || 0) + 1
    setLikeCount({ ...likeCount, [songId]: newCount })

    if (newCount === 5) {
      toast({
        title: 'Congratulations! 🎉',
        description: 'お気に入りに登録されました！',
        status: 'success',
        duration: 3000,
        isClosable: true,
        position: 'top',
        containerStyle: { marginTop: '40px' },
      })

      // 画面を更新
      setFavoriteSongs((prev) => {
        const song = prev.find((s) => s.id === songId)
        if (song && !favoriteSongs.find((s) => s.id === songId)) {
          return [...prev, song]
        }
        return prev
      })
    }
  }

  return (
    <VStack spacing={4}>
      <Heading color="pink.400" size="lg">
        お気に入り
      </Heading>
      <Text color="gray.500" fontSize="sm">
        5回以上いいねした曲が表示されます
      </Text>

      {favoriteSongs.length === 0 ? (
        <Box textAlign="center" py={10}>
          <Text color="gray.500">お気に入り曲はまだありません</Text>
          <Text color="gray.400" fontSize="sm" mt={2}>
            ホームで曲を5回いいねするとここに表示されます
          </Text>
        </Box>
      ) : (
        favoriteSongs.map((song) => (
          <Card
            key={song.id}
            w="100%"
            shadow="sm"
            borderRadius="lg"
            border="2px solid"
            borderColor="pink.200"
            bg="pink.50"
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
                  <Badge colorScheme="pink" fontSize="sm">
                    ♥ {likeCount[song.id] || 5}
                  </Badge>
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

                  <LikeButton songId={song.id} onClick={handleLike} ml="auto" />
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
