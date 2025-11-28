import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'

function App() {
    return (
        <Routes>
            
            <Route path="/" element={<Home />} />
            {/* path="/" : http://localhost:5173/ にアクセスした時
            element={<Home />} : Homeコンポーネントを表示する
            */}
    
        </Routes>
    )
}

export default App
