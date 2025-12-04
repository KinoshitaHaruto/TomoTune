export interface MusicType {
  code: string;
  name: string;
  description: string;
}

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
  music_type: MusicType | null;
}

export interface Song {
  id: number;
  title: string;
  artist: string;
  url: string;
  // parametersはフロントではあまり使わないかもですが定義
  parameters?: string; 
}