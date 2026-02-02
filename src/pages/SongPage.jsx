import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, Edit, Trash2, ExternalLink, 
  Music, Youtube, Disc3 
} from 'lucide-react';
import { useTheme } from '../App';
import { db } from '../firebase';
import { doc, getDoc, deleteDoc } from 'firebase/firestore';

function SongPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [song, setSong] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchSong();
  }, [id]);

  const fetchSong = async () => {
    try {
      const songRef = doc(db, 'songs', id);
      const songSnap = await getDoc(songRef);
      
      if (songSnap.exists()) {
        setSong({ id: songSnap.id, ...songSnap.data() });
      } else {
        navigate('/');
      }
    } catch (error) {
      console.error('Error fetching song:', error);
      navigate('/');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteDoc(doc(db, 'songs', id));
      navigate('/');
    } catch (error) {
      console.error('Error deleting song:', error);
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="page">
        <div className="container">
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
            <p style={{ marginTop: 'var(--space-md)' }}>Loading song...</p>
          </motion.div>
        </div>
      </div>
    );
  }

  if (!song) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="page"
    >
      <div className="container">
        {/* Back Button */}
        <motion.button
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="back-btn"
          onClick={() => navigate('/')}
        >
          <ArrowLeft size={18} />
          Back to collection
        </motion.button>

        {/* Song Header */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="song-header"
        >
          <h1 className="song-header-title">{song.title}</h1>
          <p className="song-header-artist">{song.artist || 'Unknown Artist'}</p>
          
          <div className="song-header-actions">
            {song.youtubeUrl && (
              <motion.a
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href={song.youtubeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="youtube-link"
              >
                <Youtube size={18} />
                Watch on YouTube
              </motion.a>
            )}
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate(`/edit/${id}`)}
              className="btn btn-secondary"
            >
              <Edit size={18} />
              Edit
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowDeleteModal(true)}
              className="btn btn-danger"
            >
              <Trash2 size={18} />
              Delete
            </motion.button>

            <button 
              onClick={toggleTheme} 
              className="theme-toggle"
              aria-label="Toggle theme"
            />
          </div>
        </motion.div>

        {/* Lyrics Columns */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="lyrics-container"
        >
          {/* Khmer Lyrics */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="lyrics-column"
          >
            <div className="lyrics-column-header">
              <span className="lyrics-column-title">ខ្មែរ</span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Khmer</span>
            </div>
            <div className="lyrics-content khmer">
              {song.lyricsKhmer || (
                <span style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>
                  No Khmer lyrics added yet
                </span>
              )}
            </div>
          </motion.div>

          {/* Romanized Lyrics */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="lyrics-column"
          >
            <div className="lyrics-column-header">
              <span className="lyrics-column-title">Romanized</span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Transliteration</span>
            </div>
            <div className="lyrics-content">
              {song.lyricsRomanized || (
                <span style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>
                  No romanized lyrics added yet
                </span>
              )}
            </div>
          </motion.div>

          {/* English Lyrics */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="lyrics-column"
          >
            <div className="lyrics-column-header">
              <span className="lyrics-column-title">English</span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Translation</span>
            </div>
            <div className="lyrics-content">
              {song.lyricsEnglish || (
                <span style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>
                  No English translation added yet
                </span>
              )}
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="modal-overlay"
          onClick={() => setShowDeleteModal(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="modal"
            onClick={e => e.stopPropagation()}
          >
            <div className="modal-header">
              <h3>Delete Song</h3>
            </div>
            <div className="modal-body">
              <p>Are you sure you want to delete "<strong>{song.title}</strong>"?</p>
              <p style={{ color: 'var(--text-muted)', marginTop: 'var(--space-sm)' }}>
                This action cannot be undone.
              </p>
            </div>
            <div className="modal-footer">
              <button 
                className="btn btn-secondary"
                onClick={() => setShowDeleteModal(false)}
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button 
                className="btn btn-danger"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
}

export default SongPage;
