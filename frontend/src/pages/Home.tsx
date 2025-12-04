import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Heading, Text, Button, VStack, Stack, Card, CardBody, Divider, useToast,} from '@chakra-ui/react'

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
  const [songs, setSongs] = useState<Song[]>([])
  const navigate = useNavigate()
  const toast = useToast()
  const [openSongID, setOpenSongID] = useState<number | null>(null);

  // いいね！ボタンが押されたときの処理
  const handleLike = (songId: number) => {
    const userId = localStorage.getItem("tomo_user_id")
    if (!userId) {
      console.error("ユーザーIDが見つかりません")
      return
    }

    // localStorage にいいね履歴を記録
    const savedLikes = localStorage.getItem(`tomo_user_likes_${userId}`)
    const likes = savedLikes ? JSON.parse(savedLikes) : []
    likes.push({ song_id: songId, timestamp: new Date().toISOString() })
    localStorage.setItem(`tomo_user_likes_${userId}`, JSON.stringify(likes))

    // いいね数をカウント
    const likeCount = likes.filter((like: any) => like.song_id === songId).length

    // バックエンド API にも送信（非同期で）
    fetch("${API_BASE}/likes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        song_id: songId,
        user_id: userId
      }),
    })
    .then(res => {
      if (!res.ok) throw new Error("送信失敗")
      return res.json()
    })
    .then(data => {
      console.log("バックエンド応答:", data)
    })
    .catch(error => console.error("バックエンド送信エラー:", error))

    // ローカルのいいね数で判定
    if (likeCount === 5) {
      toast({
        title: "Congratulations! 🎉",
        description: "5回いいね！お気に入りに登録されました",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top", 
        containerStyle: { marginTop: "40px" }
      })
    }
  }

  // コメントボタンが押されたときの処理
  const handleComment = (songId: number) => {
    setOpenSongID(openSongID === songId ? null : songId);

  } 

  // ログインチェック
    useEffect(() => {
    const userId = localStorage.getItem("tomo_user_id")
    if (!userId) {
      navigate("/login")
    }
  }, [])

  // useEffct(何をするか いつするか)
  // 画面が出たら一度だけ実行
  useEffect(() => {
    fetch("http://127.0.0.1:8000/songs")  // 通信機能
      .then(res => res.json())
      .then(data => {
        console.log("データ受信 : ", data)
        setSongs(data)
      })
  }, [])

  return (
  <>
    <VStack spacing={4}>
      {songs.map((song) => (
        <Card key={song.id} w="100%" shadow="sm" borderRadius="lg" border="1px solid" borderColor="gray.200">
          <CardBody p={4}>
            <Stack spacing={3}>
              <Box>
                <Heading size="md">{song.title}</Heading>
                <Text color="gray.500" fontSize="sm">{song.artist}</Text>
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
                    <Text color="red.400" fontSize="sm">※ 音声ファイルがありません</Text>
                  )}
                </Box>

                <LikeButton 
                  songId={song.id} 
                  onClick={handleLike} 
                  ml="auto"
                />

                <Button
                  bg="pink.400"
                  color="white"
                  ml={3}
                  onClick={() => handleComment(song.id)}
                  p={2}
                  borderRadius="full"
                  _hover={{ bg: "pink.500" }}
                >
                  <BiComment size="22px" />
                </Button>


              </Box>

            </Stack>
          </CardBody>
        </Card>
      ))}
    </VStack>

    {/* ← Drawer は return の「内側」に置くこと！ */}
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
