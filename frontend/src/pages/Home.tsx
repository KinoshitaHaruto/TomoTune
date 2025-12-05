import React, { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import {
  Box,
  Heading,
  Text,
  Button,
  VStack,
  Stack,
  Card,
  CardBody,
  Divider,
} from '@chakra-ui/react'

import { API_BASE } from '../config'
import LikeButton from '../components/LikeButton'
import PostCard from '../components/PostCard'
import type { Post } from '../types'

// 曲データの設計図
type Song = {
  id: number;
  title: string;
  artist: string;
  url: string;
};

function Home() {
  const navigate = useNavigate()
  const [userId, setUserId] = useState<string | null>(null)

  // 曲系
  const [songs, setSongs] = useState<Song[]>([])
  const [openSongID, setOpenSongID] = useState<number | null>(null)

  // 投稿系
  const [posts, setPosts] = useState<Post[]>([])

  // ログインチェック
  useEffect(() => {
    const storedId = localStorage.getItem('tomo_user_id')
    if (!storedId) {
      navigate('/login')
    } else {
      setUserId(storedId)
    }
  }, [navigate])

  // 曲取得
  useEffect(() => {
    fetch(`${API_BASE}/songs`)
      .then((res) => res.json())
      .then((data: Song[]) => setSongs(data))
      .catch((err) => console.error('曲の取得に失敗しました', err))
  }, [])

  // 投稿取得
  useEffect(() => {
    fetch(`${API_BASE}/posts`)
      .then((res) => res.json())
