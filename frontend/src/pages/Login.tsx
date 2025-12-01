import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Heading, Input, Text, VStack, useToast } from '@chakra-ui/react'

function Login() {
  const [name, setName] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate() // 画面遷移用のフック
  const toast = useToast()

  const handleLogin = () => {
    if (!name) {
      toast({ title: "名前を入力してください", status: "warning" })
      return
    }

    setIsLoading(true)

    // ログインAPIへPOSTリクエスト
    fetch("http://127.0.0.1:8000/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: name }),
    })
    .then(res => res.json())
    .then(data => {
      console.log("ログイン成功:", data)
      
      // IDをlocalStorageに保存
      localStorage.setItem("tomo_user_id", data.id)
      localStorage.setItem("tomo_user_name", data.name)

      toast({ title: `ようこそ、${data.name}さん！`, status: "success" })

      // アンケートページへ移動
      navigate("/survey")
    })
    .catch(err => {
      console.error(err)
      toast({ title: "ログインエラー", status: "error" })
    })
    .finally(() => setIsLoading(false))
  }

  return (
    <VStack spacing={8} mt={10}>
      <VStack spacing={2}>
        <Heading color="pink.400" size="xl">ログイン</Heading>
        <Text color="gray.500">名前を入力してスタート</Text>
      </VStack>

      <Input 
        placeholder="ニックネーム" 
        size="lg" 
        bg="white"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <Button 
        colorScheme="pink" 
        size="lg" 
        width="100%" 
        onClick={handleLogin}
        isLoading={isLoading} 
      >
        はじめる
      </Button>
    </VStack>
  )
}

export default Login