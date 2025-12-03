import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Heading, VStack, HStack, Box, Text, useToast, Circle, Progress } from '@chakra-ui/react'

interface Answer {
  [key: number]: number // 質問番号 -> 回答（1-7）
}

interface MusicProfile {
  V_C: number // ノリ（V）vs 静けさ（C）
  M_A: number // メロディ（M）vs 世界観（A）
  P_R: number // 技術（P）vs 感情（R）
  H_S: number // 生音（H）vs 電子音（S）
}

function Survey() {
  const [answers, setAnswers] = useState<Answer>({})
  const navigate = useNavigate()
  const toast = useToast()
  const [showResults, setShowResults] = useState(false)
  const [resultProfile, setResultProfile] = useState<MusicProfile | null>(null)

  const questions = [
    // V vs C (ノリ vs 静けさ)
    { id: 1, text: "定期的に新しい友人を作っている。", left: "そう思う", right: "そう思わない", type: "V_C", side: "V" },
    { id: 2, text: "単純明快なアイデアよりも、複雑で新奇なアイデアのほうがワクワクする。", left: "そう思う", right: "そう思わない", type: "V_C", side: "V" },
    { id: 3, text: "BGMにはテンポ感のある曲を選びがちだ。", left: "そう思う", right: "そう思わない", type: "V_C", side: "V" },

    // M vs A (メロディ vs 世界観)
    { id: 4, text: "曲の良さは、メロディのキャッチーさで決まることが多い。", left: "そう思う", right: "そう思わない", type: "M_A", side: "M" },
    { id: 5, text: "音楽に世界観やストーリー性を重視する。", left: "そう思わない", right: "そう思う", type: "M_A", side: "A" },
    { id: 6, text: "曲単体より、アルバム全体の雰囲気のほうが気になる。", left: "そう思わない", right: "そう思う", type: "M_A", side: "A" },

    // P vs R (技術 vs 感情)
    { id: 7, text: "曲を聴くとき、まず「どう作っているのか」が気になる。", left: "そう思う", right: "そう思わない", type: "P_R", side: "P" },
    { id: 8, text: "ボーカルの感情が乗っている曲に弱い。", left: "そう思わない", right: "そう思う", type: "P_R", side: "R" },
    { id: 9, text: "同じ曲でも、歌声の\"表現\"で評価が大きく変わる。", left: "そう思わない", right: "そう思う", type: "P_R", side: "R" },

    // H vs S (生音 vs 電子音)
    { id: 10, text: "生楽器の温もりのある音が好きだ。", left: "そう思う", right: "そう思わない", type: "H_S", side: "H" },
    { id: 11, text: "電子音やシンセサウンドに魅力を感じる。", left: "そう思わない", right: "そう思う", type: "H_S", side: "S" },
    { id: 12, text: "生演奏より電子的なアレンジのほうが集中できる。", left: "そう思わない", right: "そう思う", type: "H_S", side: "S" },
  ]

  const groupedQuestions = {
    "V（ノリ）↔ C（静けさ）": questions.slice(0, 3),
    "M（メロディ）↔ A（世界観）": questions.slice(3, 6),
    "P（技術）↔ R（感情）": questions.slice(6, 9),
    "H（生音）↔ S（電子音）": questions.slice(9, 12),
  }

  const handleAnswer = (questionId: number, value: number) => {
    setAnswers({ ...answers, [questionId]: value })
  }

  // 円のサイズ（中心が最小になるよう両端を大きくする）
  const circleSizes = ["44px", "36px", "28px", "20px", "28px", "36px", "44px"]

  const calculateProfile = (): MusicProfile => {
    const profile: MusicProfile = {
      V_C: 0,
      M_A: 0,
      P_R: 0,
      H_S: 0,
    }

    questions.forEach((q) => {
      const answer = answers[q.id] || 4 // デフォルト値は4（中立）
      const score = answer - 4 // -3 to 3の範囲に正規化

      if (q.type === "V_C") {
        profile.V_C += q.side === "V" ? score : -score
      } else if (q.type === "M_A") {
        profile.M_A += q.side === "M" ? -score : score // Mが左（1）、Aが右（7）
      } else if (q.type === "P_R") {
        profile.P_R += q.side === "P" ? score : -score
      } else if (q.type === "H_S") {
        profile.H_S += q.side === "H" ? -score : score // Hが左（1）、Sが右（7）
      }
    })

    return profile
  }

  // 結果から上位の傾向を返す（例: ['V寄り','A寄り']）
  const getTopTraits = (profile: MusicProfile) => {
    const entries = [
      ["V_C", "V寄り", "C寄り", Math.abs(profile.V_C), profile.V_C],
      ["M_A", "M寄り", "A寄り", Math.abs(profile.M_A), profile.M_A],
      ["P_R", "P寄り", "R寄り", Math.abs(profile.P_R), profile.P_R],
      ["H_S", "H寄り", "S寄り", Math.abs(profile.H_S), profile.H_S],
    ] as Array<[keyof MusicProfile | string, string, string, number, number]>

    entries.sort((a, b) => b[3] - a[3])
    return entries.slice(0, 2).map((e) => (e[4] >= 0 ? e[1] : e[2]))
  }

  // プロフィールから4文字アルファベットコードを生成
  const getProfileCode = (profile: MusicProfile): string => {
    const code = [
      profile.V_C >= 0 ? "V" : "C",
      profile.M_A >= 0 ? "M" : "A",
      profile.P_R >= 0 ? "P" : "R",
      profile.H_S >= 0 ? "H" : "S",
    ].join("")
    return code
  }

  // プロフィールコードに対応する絵文字を返す
  const getProfileEmoji = (code: string): string => {
    const emojiMap: { [key: string]: string } = {
      "VMPH": "🎸", "VMPS": "🎹", "VMRH": "🎺", "VMRS": "🎚️",
      "VAMPH": "🎤", "VAMPS": "🎧", "VAMRH": "🎼", "VAMRS": "💿",
      "VRPH": "🎵", "VRPS": "🔊", "VRRH": "🎶", "VRRS": "📻",
      "CMPH": "🎸", "CMPS": "🎹", "CMRH": "🎺", "CMRS": "🎚️",
      "CAMPH": "🎤", "CAMPS": "🎧", "CAMRH": "🎼", "CAMRS": "💿",
      "CRPH": "🎵", "CRPS": "🔊", "CRRH": "🎶", "CRRS": "📻",
    }
    return emojiMap[code] || "🎵"
  }

  const handleSubmit = () => {
    const answeredCount = Object.keys(answers).length
    if (answeredCount < 12) {
      toast({ title: "全ての質問に答えてください", status: "warning" })
      return
    }

    const profile = calculateProfile()
    const code = getProfileCode(profile)

    // プロフィールをlocalStorageに保存（最新）
    localStorage.setItem("tomo_music_profile", JSON.stringify(profile))

    // 履歴としても保存
    const rawHistory = localStorage.getItem("tomo_music_profile_history")
    let history: { timestamp: string; code: string }[] = []
    if (rawHistory) {
      try {
        history = JSON.parse(rawHistory)
      } catch (e) {
        console.error("診断履歴解析エラー:", e)
      }
    }
    history.push({
      timestamp: new Date().toISOString(),
      code,
    })
    localStorage.setItem("tomo_music_profile_history", JSON.stringify(history))

    toast({ title: "プロフィール設定完了！ 結果を表示します", status: "success" })

    // 結果を表示
    setResultProfile(profile)
    setShowResults(true)
  }

  return (
    <VStack spacing={6} mt={4} pb={10}>
      <VStack spacing={2} textAlign="center">
        <Heading color="pink.400" size="md">あなたの音楽嗜好は？</Heading>
        <Text color="gray.500" fontSize="sm">7段階で答えてください</Text>
      </VStack>

      {Object.entries(groupedQuestions).map((entry, groupIndex) => (
        <Box key={groupIndex} width="100%">
          {/* グループ見出しは非表示にする（質問のみ表示） */}

          {entry[1].map((q) => (
            <VStack key={q.id} spacing={2} mb={6} align="start" width="100%">
              <Text fontSize="sm" color="gray.700">
                {q.text}
              </Text>
              <HStack spacing={1} width="100%" justify="space-between">
                <Text fontSize="xs" color="gray.500">
                  {q.left}
                </Text>
                <HStack spacing={1}>
                  {[1, 2, 3, 4, 5, 6, 7].map((value) => (
                    <Circle
                      key={value}
                      size={circleSizes[value - 1]}
                      border="2px solid"
                      borderColor={answers[q.id] === value ? "pink.400" : "gray.300"}
                      bg={answers[q.id] === value ? "pink.400" : "white"}
                      cursor="pointer"
                      onClick={() => handleAnswer(q.id, value)}
                      _hover={{ borderColor: "pink.300" }}
                      transition="all 0.12s"
                    />
                  ))}
                </HStack>
                <Text fontSize="xs" color="gray.500">
                  {q.right}
                </Text>
              </HStack>
            </VStack>
          ))}

          {groupIndex < 3 && (
            <Box width="100%" height="1px" bg="gray.200" my={4} />
          )}
        </Box>
      ))}

      {/* 結果表示セクション（MBTI風二列レイアウト） */}
      {showResults && resultProfile ? (
        <Box width="100%" p={4} borderRadius="md" bg="gray.50" boxShadow="sm">
          <HStack align="flex-start" spacing={6}>
            {/* 左：サマリ */}
            <Box flex="0 0 38%" bg="white" p={6} borderRadius="md" textAlign="center" boxShadow="sm">
              <Heading size="lg" color="gray.700"></Heading>
              <Text color="gray.500" mt={2}></Text>

              {/* 4文字コード表示 */}
              <Box mt={8} mb={6}>
                <Text fontSize="4xl" fontWeight="bold" color="pink.400" letterSpacing={2}>
                  {getProfileCode(resultProfile)}
                </Text>
              </Box>

              {/* 絵文字 */}
              <Text fontSize="6xl" mb={4}>
                {getProfileEmoji(getProfileCode(resultProfile))}
              </Text>

            </Box>

            {/* 右：軸ごとのバー */}
            <Box flex="1" bg="white" p={4} borderRadius="md" boxShadow="sm">
              <Heading size="sm" color="gray.700" mb={4}>詳細スコア</Heading>

              {([
                ["V_C", "V", "C"],
                ["M_A", "M", "A"],
                ["P_R", "P", "R"],
                ["H_S", "H", "S"],
              ] as Array<[keyof MusicProfile, string, string]>).map(([key, leftLabel, rightLabel]) => {
                const val = resultProfile[key]
                const max = 9
                const rightPercent = Math.round(((val + max) / (2 * max)) * 100)
                const leftPercent = 100 - rightPercent
                return (
                  <Box key={key} mb={4}>
                    <HStack justify="space-between" mb={2}>
                      <Text fontSize="xs" color="gray.600">{leftLabel}</Text>
                      <Text fontSize="xs" color="gray.600">{rightLabel}</Text>
                    </HStack>

                    <HStack align="center" spacing={3}>
                      <Text fontSize="xs" color="gray.500" width="40px">{`${leftPercent}%`}</Text>
                      <Box flex="1">
                        <Progress value={rightPercent} size="sm" colorScheme="teal" borderRadius="full" />
                      </Box>
                      <Text fontSize="xs" color="gray.500" width="40px" textAlign="right">{`${rightPercent}%`}</Text>
                    </HStack>
                  </Box>
                )
              })}

              <HStack spacing={3} mt={4} justify="center">
                <Button variant="outline" onClick={() => setShowResults(false)}>戻る</Button>
                <Button colorScheme="pink" onClick={() => navigate('/')}>完了</Button>
              </HStack>
            </Box>
          </HStack>
        </Box>
      ) : (
        <Button
          colorScheme="pink"
          size="lg"
          width="80%"
          onClick={handleSubmit}
          mt={6}
        >
          次へ
        </Button>
      )}
    </VStack>
  )
}

export default Survey
