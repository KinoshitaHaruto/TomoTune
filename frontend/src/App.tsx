import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Login from './pages/Login'
import Survey from './pages/Survey'
import Share from './pages/Share'
import Music from './pages/Music'
import Profile from './pages/Profile'


function App() {
    return (
        <Routes>
            <Route element={<Layout />}>
            {/* Layoutで囲む
                path="/" 以下の全てのページに Layoutを適用
            */}
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/survey" element={<Survey />} />
                <Route path="/share" element={<Share />} />
                <Route path="/music" element={<Music />} />
                <Route path="/profile" element={<Profile />} />
        </Route>
            
    
        </Routes>
    )
}

export default App