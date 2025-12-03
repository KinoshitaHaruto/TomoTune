import React from 'react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Heading, Text, Button, VStack, Stack, Card, CardBody, Divider, useToast,} from '@chakra-ui/react'

import { API_BASE } from '../config'
import LikeButton from '../components/LikeButton'

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
    fetch(`${API_BASE}/likes`, {
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
    fetch(`${API_BASE}/songs`)  // 通信機能
      .then(res => res.json())
      .then(data => {
        console.log("データ受信 : ", data)
        setSongs(data)
      })
  }, [])

  return (
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
                
                <LikeButton /* 自作したLikeButton部品 */
                  songId={song.id} 
                  onClick={handleLike} 
                  ml="auto"
                />
              </Box>
            </Stack>
          </CardBody>
        </Card>
      ))}
    </VStack>
  )
}

export default Home
