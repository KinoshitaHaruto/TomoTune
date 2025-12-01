import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Heading,
  Text,
  VStack,
  HStack,
  Avatar,
  Badge,
  Divider,
  Button,
  useToast,
  Input,
  IconButton,
  Textarea,
  CloseButton,
} from '@chakra-ui/react'
import { FiEdit2, FiCheck } from 'react-icons/fi'

interface MusicProfile {
  V_C: number
  M_A: number
  P_R: number
  H_S: number
}

function Profile() {
  const [userName, setUserName] = useState('')
  const [musicProfile, setMusicProfile] = useState<MusicProfile | null>(null)
  const [profileCode, setProfileCode] = useState('')
  const [followers, setFollowers] = useState(120)
  const [following, setFollowing] = useState(85)
  const [tags, setTags] = useState(['ライブガチ勢', '回担担否！！', '気志圏'])
  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [editingTags, setEditingTags] = useState('ライブガチ勢, 回担担否！！, 気志圏')
  const [newTag, setNewTag] = useState('')
  const navigate = useNavigate()
  const toast = useToast()

  // 4文字コードを生成
  const getProfileCode = (profile: MusicProfile): string => {
    const code = [
      profile.V_C >= 0 ? 'V' : 'C',
      profile.M_A >= 0 ? 'M' : 'A',
      profile.P_R >= 0 ? 'P' : 'R',
      profile.H_S >= 0 ? 'H' : 'S',
    ].join('')
    return code
  }

  // ページ読み込み時：localStorage からユーザー情報を取得
  useEffect(() => {
    const userId = localStorage.getItem('tomo_user_id')
    const name = localStorage.getItem('tomo_user_name')

    if (!userId || !name) {
      navigate('/login')
      return
    }

    setUserName(name)

    // 音楽プロフィールを取得
    const savedProfile = localStorage.getItem('tomo_music_profile')
    if (savedProfile) {
      try {
        const profile = JSON.parse(savedProfile) as MusicProfile
        setMusicProfile(profile)
        setProfileCode(getProfileCode(profile))
      } catch (err) {
        console.error('プロフィール解析エラー:', err)
      }
    }

    // localStorage からタグを取得
    const savedTags = localStorage.getItem('tomo_profile_tags')
    if (savedTags) {
      try {
        const parsedTags = JSON.parse(savedTags)
        setTags(parsedTags)
        setEditingTags(parsedTags.join(', '))
      } catch (err) {
        console.error('タグ解析エラー:', err)
      }
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('tomo_user_id')
    localStorage.removeItem('tomo_user_name')
    localStorage.removeItem('tomo_music_profile')
    toast({ title: 'ログアウトしました', status: 'info' })
    navigate('/login')
  }

  // 編集を保存
  const handleSaveProfile = () => {
    const tagsArray = editingTags
      .split(',')
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0)
    localStorage.setItem('tomo_profile_tags', JSON.stringify(tagsArray))

    setTags(tagsArray)
    setIsEditingProfile(false)
    toast({ title: 'プロフィールを保存しました', status: 'success' })
  }

  // 編集をキャンセル
  const handleCancelEdit = () => {
    setEditingTags(tags.join(', '))
    setIsEditingProfile(false)
  }

  // 新しいタグを追加（編集モード）
  const handleAddTag = () => {
    if (newTag.trim()) {
      const currentTags = editingTags
        .split(',')
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0)
      currentTags.push(newTag.trim())
      setEditingTags(currentTags.join(', '))
      setNewTag('')
    }
  }

  // タグを削除（表示モード）
  const handleRemoveTag = (idx: number) => {
    const updatedTags = tags.filter((_, i) => i !== idx)
    setTags(updatedTags)
    localStorage.setItem('tomo_profile_tags', JSON.stringify(updatedTags))
  }

  return (
    <VStack spacing={6}>
      {/* ユーザー情報セクション */}
      <Box
        width="100%"
        bg="white"
        p={6}
        borderRadius="lg"
        boxShadow="sm"
        border="1px solid"
        borderColor="gray.200"
      >
        <VStack spacing={4} align="start" width="100%">
          {/* アカウント名ラベル */}
          <Text fontSize="xs" color="gray.500" fontWeight="bold">
          </Text>

          {/* ユーザー情報 - 横並び */}
          <HStack spacing={6} width="100%">
            {/* アバター */}
            <Avatar
              name={userName}
              bg="pink.100"
              color="pink.400"
              size="lg"
              borderRadius="full"
              icon={<Text fontSize="2xl">🎵</Text>}
            />

            {/* ユーザー名とフォロー情報 */}
            <VStack align="start" spacing={2} flex={1}>
              <Heading size="md" color="gray.800">
                {userName}
              </Heading>
              <HStack spacing={4} fontSize="sm">
                <Text color="gray.600">
                  フォロワー数： <strong>{followers}</strong>
                </Text>
                <Text color="gray.600">
                  フォロー数： <strong>{following}</strong>
                </Text>
              </HStack>
            </VStack>
          </HStack>
        </VStack>
      </Box>

      <Divider />

      {/* 音楽プロフィールセクション */}
      {musicProfile ? (
        <Box
          width="100%"
          bg="blue.50"
          p={6}
          borderRadius="lg"
          boxShadow="sm"
          border="2px solid"
          borderColor="blue.200"
        >
          <VStack spacing={4} align="start" width="100%">
            {/* ヘッダー：4文字コードと編集ボタン */}
            <HStack width="100%" justify="space-between">
              <Heading size="lg" color="blue.600">
                {profileCode}
              </Heading>
              <IconButton
                aria-label={isEditingProfile ? '完了' : '編集'}
                icon={isEditingProfile ? <FiCheck /> : <FiEdit2 />}
                colorScheme={isEditingProfile ? 'green' : 'blue'}
                variant="ghost"
                onClick={() => {
                  if (isEditingProfile) {
                    handleSaveProfile()
                  } else {
                    setIsEditingProfile(true)
                  }
                }}
              />
            </HStack>

            {/* 編集モード */}
            {isEditingProfile ? (
              <VStack spacing={3} width="100%">
                <Box width="100%">
                  <Text fontSize="xs" color="gray.600" mb={1}>
                    タグ（カンマ区切り）
                  </Text>
                  <Textarea
                    value={editingTags}
                    onChange={(e) => setEditingTags(e.target.value)}
                    placeholder="例: ライブガチ勢, 回担担否！！, 気志圏"
                    size="sm"
                    minH="80px"
                    bg="white"
                  />
                </Box>

                <HStack spacing={2} width="100%">
                  <Button
                    size="sm"
                    colorScheme="green"
                    flex={1}
                    onClick={handleSaveProfile}
                  >
                    保存
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    flex={1}
                    onClick={handleCancelEdit}
                  >
                    キャンセル
                  </Button>
                </HStack>
              </VStack>
            ) : (
              /* 表示モード */
              <VStack spacing={2} width="100%" align="start">
                <HStack spacing={2} flexWrap="wrap" width="100%">
                  {tags.map((tag, idx) => (
                    <Badge
                      key={idx}
                      variant="solid"
                      colorScheme="blue"
                      display="flex"
                      alignItems="center"
                      gap={1}
                    >
                      # {tag}
                      <CloseButton
                        size="sm"
                        onClick={() => handleRemoveTag(idx)}
                        ml={1}
                      />
                    </Badge>
                  ))}
                </HStack>
              </VStack>
            )}
          </VStack>
        </Box>
      ) : (
        <Box
          width="100%"
          bg="gray.50"
          p={6}
          borderRadius="lg"
          textAlign="center"
        >
          <Text color="gray.500">
            音楽プロフィールを設定してください
          </Text>
          <Button
            colorScheme="pink"
            size="sm"
            mt={4}
            onClick={() => navigate('/survey')}
          >
            設定する
          </Button>
        </Box>
      )}

      <Divider />

      {/* ログアウトボタン */}
      <Button
        colorScheme="red"
        variant="outline"
        width="100%"
        onClick={handleLogout}
      >
        ログアウト
      </Button>
    </VStack>
  )
}

export default Profile
