// frontend/src/types.ts

export interface MusicType {
  code: string;
  name: string;
  description: string;
}

// コンポーネントで使い回せるように切り出しておく
export interface UserScores {
  VC: number;
  MA: number;
  PR: number;
  HS: number;
}

export interface User {
  id: string;
  name: string;
  scores: UserScores; 
  
  // まだ診断されていない(null)場合や、コードだけの取得に備えて ? (Optional) にする
  music_type_code?: string; 
  music_type?: MusicType;   
}

export interface Song {
  id: number;
  title: string;
  artist: string;
  url: string;
  parameters?: string; 
}

export interface Post {
  id: number;
  comment: string;
  created_at: string;
  user: {
    id: string;
    name: string;
  } | null;
  song: Song;
}