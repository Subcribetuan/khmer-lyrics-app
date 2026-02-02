import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Music, Plus, LogOut, Search, Music2, 
  Sun, Moon, Disc3 
} from 'lucide-react';
import { useAuth, useTheme } from '../App';
import { db } from '../firebase';
import { 
  collection, 
  getDocs, 
  query, 
  orderBy,
  deleteDoc,
  doc 
} from 'firebase/firestore';

function HomePage() {
  const [songs, setSongs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  // Fetch songs from Firebase
  useEffect(() => {
    fetchSongs();
  }, []);

  const fetchSongs = async () => {
    try {
      const songsRef = collection(db, 'songs');
      const q = query(songsRef, orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      const songsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setSongs(songsData);
    } catch (error) {
      console.error('Error fetching songs:', error);
      // If Firebase is not configured, show empty state
      setSongs([]);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredSongs = songs.filter(song => 
    song.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    song.artist?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="page"
    >
      <div className="container">
        {/* Header */}
        <motion.header
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="header"
        >
          <div className="logo">
            <div className="logo-icon">
              <Music size={24} />
            </div>
            <span className="logo-text">Khmer Lyrics</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
            <button 
              onClick={toggleTheme} 
              className="theme-toggle"
              aria-label="Toggle theme"
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLogout}
              className="btn btn-secondary"
              style={{ gap: '0.5rem' }}
            >
              <LogOut size={18} />
              <span>Logout</span>
            </motion.button>
          </div>
        </motion.header>

        {/* Search Bar */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          style={{ marginBottom: 'var(--space-xl)' }}
        >
          <div style={{ position: 'relative', maxWidth: '500px' }}>
            <Search 
              size={20} 
              style={{ 
                position: 'absolute', 
                left: '1rem', 
                top: '50%', 
                transform: 'translateY(-50%)',
                color: 'var(--text-muted)'
              }} 
            />
            <input
              type="text"
              className="input-field"
              placeholder="Search songs by title or artist..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ paddingLeft: '3rem' }}
            />
          </div>
        </motion.div>

        {/* Page Title */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          style={{ marginBottom: 'var(--space-lg)' }}
        >
          <h1 style={{ marginBottom: 'var(--space-xs)' }}>My Collection</h1>
          <p style={{ color: 'var(--text-muted)' }}>
            {songs.length} {songs.length === 1 ? 'song' : 'songs'} saved
          </p>
        </motion.div>

        {/* Songs List */}
        {isLoading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="empty-state"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <Disc3 size={64} style={{ color: 'var(--gold-primary)' }} />
            </motion.div>
            <p style={{ marginTop: 'var(--space-md)' }}>Loading your collection...</p>
          </motion.div>
        ) : filteredSongs.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="empty-state"
          >
            <div className="empty-state-icon">🎵</div>
            <h3 className="empty-state-title">
              {searchTerm ? 'No songs found' : 'No songs yet'}
            </h3>
            <p style={{ marginBottom: 'var(--space-lg)' }}>
              {searchTerm 
                ? 'Try a different search term'
                : 'Start building your lyrics collection'}
            </p>
            {!searchTerm && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/add')}
                className="btn btn-primary"
              >
                <Plus size={20} />
                Add Your First Song
              </motion.button>
            )}
          </motion.div>
        ) : (
          <motion.div 
            className="song-grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <AnimatePresence>
              {filteredSongs.map((song, index) => (
                <motion.div
                  key={song.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ delay: index * 0.05 }}
                  className="song-item"
                  onClick={() => navigate(`/song/${song.id}`)}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-md)' }}>
                    <div style={{
                      width: '48px',
                      height: '48px',
                      background: 'linear-gradient(135deg, var(--gold-primary) 0%, var(--orange-warm) 100%)',
                      borderRadius: 'var(--radius-sm)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      <Music2 size={24} color="white" />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <h3 className="song-title" style={{ 
                        overflow: 'hidden', 
                        textOverflow: 'ellipsis', 
                        whiteSpace: 'nowrap' 
                      }}>
                        {song.title}
                      </h3>
                      <p className="song-artist">{song.artist || 'Unknown Artist'}</p>
                      <div className="song-meta">
                        {song.lyricsKhmer && <span className="song-tag">ខ្មែរ</span>}
                        {song.lyricsRomanized && <span className="song-tag">Romanized</span>}
                        {song.lyricsEnglish && <span className="song-tag">English</span>}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Floating Action Button */}
        <motion.button
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
          whileHover={{ scale: 1.1, rotate: 90 }}
          whileTap={{ scale: 0.9 }}
          className="fab"
          onClick={() => navigate('/add')}
          aria-label="Add new song"
        >
          <Plus size={28} />
        </motion.button>
      </div>
    </motion.div>
  );
}

export default HomePage;
