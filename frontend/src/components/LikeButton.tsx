import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Box, IconButton } from '@chakra-ui/react'

type FlyingHeartProps = {
    // 引数なしで、何も返さない関数
    removeHeart: () => void;
};

// 飛び出すハートコンポーネント（LikeButton内で使うのでエクスポートしない）
const FlyingHeart = ({ removeHeart }: FlyingHeartProps) => {
    const randomX = Math.random() * 60 - 30;
    return (
        <motion.div
        /* アニメーション開始時の状態(スタート地点) */
        initial={{ opacity: 1, y: 0, x: 0, scale: 0.5 }}
        //opacity:透明度（0が透明、1が不透明）
        /* アニメーション後の状態(ゴール地点) */
        animate={{ 
            opacity: 0, 
            y: -150,
            x: randomX,
            scale: 1.3,
            rotate: randomX
        }}
        transition={{ duration: 1, ease: "easeOut" }}
        /* 終わったら自分を消す命令を呼ぶ */
        onAnimationComplete={removeHeart}

        style={{
        position: 'absolute',
        top: '10px',
        left: '10px',
        fontSize: '24px',
        pointerEvents: 'none',
        zIndex: 10
        }}
    >
    ❤️
    </motion.div>
    )
}

type LikeButtonProps = {
    songId: number;
    onClick: (id: number) => void; 
    [key: string]: any;     // その他のpropsはなんでもOK
};
// LikeButton
// songId: いいね！対象の曲ID
// onClick: ハートが押されたときの親コンポーネントから渡される通信用関数
const LikeButton = ({ songId, onClick, ...props }: LikeButtonProps) => {
    // 飛び出すハートのリスト状態管理
    const [hearts, setHearts] = useState<{ id: number }[]>([]);

    // ハートをクリックしたときの処理
    const handleClick = () => {
        const newHeart = { id: Date.now() }; // ユニークIDを生成
        setHearts((prev) => [...prev, newHeart]);   // 現在のリスト(prev)を展開して新しいハートを追加
        onClick(songId);    // 親コンポーネントから渡された通信関数を呼び出す
    };

    // ハートアニメーションが終わったら呼ばれる関数
    const removeHeart = (heartId: number) => {
        setHearts((prev) => prev.filter((h) => h.id !== heartId)); // 指定されたIDのハートをリストから削除
    }

    return (
    <Box position="relative" display="inline-block">
        <AnimatePresence>{/* 消えるハートのアニメーション領域 */}
        {hearts.map((heart) => (
            <FlyingHeart 
            key={heart.id} 
            removeHeart={() => removeHeart(heart.id)} 
            />
        ))}
        </AnimatePresence>

        <motion.div whileTap={{ scale: 0.8 }}>
        <IconButton
            icon={<span style={{ fontSize: "20px", marginTop: "2px" }}>❤</span>}
            aria-label="いいね"
            isRound={true}
            bg="pink.50"
            color="pink.400"
            size="lg"
            _hover={{ bg: "pink.100" }}
            onClick={handleClick}
        />
        </motion.div>
    </Box>
    )
}
export default LikeButton