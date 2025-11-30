import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Login from './pages/Login'


function App() {
    return (
        <Routes>
            <Route element={<Layout />}>
            {/* Layoutで囲む
                path="/" 以下の全てのページに Layoutを適用
            */}
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
        </Route>
            
    
        </Routes>
    )
}

export default App