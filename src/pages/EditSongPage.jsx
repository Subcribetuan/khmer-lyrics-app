import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Save, Music, Disc3 } from 'lucide-react';
import { useTheme } from '../App';
import { db } from '../firebase';
import { doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';

function EditSongPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    title: '',
    artist: '',
    youtubeUrl: '',
    lyricsKhmer: '',
    lyricsRomanized: '',
    lyricsEnglish: ''
  });

  useEffect(() => {
    fetchSong();
  }, [id]);

  const fetchSong = async () => {
    try {
      const songRef = doc(db, 'songs', id);
      const songSnap = await getDoc(songRef);
      
      if (songSnap.exists()) {
        const data = songSnap.data();
        setFormData({
          title: data.title || '',
          artist: data.artist || '',
          youtubeUrl: data.youtubeUrl || '',
          lyricsKhmer: data.lyricsKhmer || '',
          lyricsRomanized: data.lyricsRomanized || '',
          lyricsEnglish: data.lyricsEnglish || ''
        });
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!formData.title.trim()) {
      setError('Please enter a song title');
      return;
    }

    setIsSaving(true);
    
    try {
      const songRef = doc(db, 'songs', id);
      await updateDoc(songRef, {
        ...formData,
        updatedAt: serverTimestamp()
      });
      navigate(`/song/${id}`);
    } catch (error) {
      console.error('Error updating song:', error);
      setError('Failed to update song. Please try again.');
      setIsSaving(false);
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

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="page"
    >
      <div className="container">
        {/* Header */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: 'var(--space-lg)'
        }}>
          <motion.button
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="back-btn"
            onClick={() => navigate(`/song/${id}`)}
          >
            <ArrowLeft size={18} />
            Back to song
          </motion.button>

          <button 
            onClick={toggleTheme} 
            className="theme-toggle"
            aria-label="Toggle theme"
          />
        </div>

        {/* Page Title */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          style={{ marginBottom: 'var(--space-xl)' }}
        >
          <h1>Edit Song</h1>
          <p style={{ color: 'var(--text-muted)' }}>
            Update lyrics and song information
          </p>
        </motion.div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="login-error"
            style={{ marginBottom: 'var(--space-lg)', maxWidth: '600px' }}
          >
            {error}
          </motion.div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Song Info */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="card"
            style={{ marginBottom: 'var(--space-lg)', maxWidth: '600px' }}
          >
            <h3 style={{ marginBottom: 'var(--space-md)', display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
              <Music size={20} style={{ color: 'var(--gold-primary)' }} />
              Song Information
            </h3>
            
            <div className="form-group" style={{ marginBottom: 'var(--space-md)' }}>
              <label className="form-label">Song Title *</label>
              <input
                type="text"
                name="title"
                className="input-field"
                placeholder="e.g., ម៉េចហើយជីវិត?"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group" style={{ marginBottom: 'var(--space-md)' }}>
              <label className="form-label">Artist</label>
              <input
                type="text"
                name="artist"
                className="input-field"
                placeholder="e.g., Preap Sovath"
                value={formData.artist}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">YouTube URL (optional)</label>
              <input
                type="url"
                name="youtubeUrl"
                className="input-field"
                placeholder="https://www.youtube.com/watch?v=..."
                value={formData.youtubeUrl}
                onChange={handleChange}
              />
            </div>
          </motion.div>

          {/* Lyrics Sections */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="lyrics-container"
            style={{ marginBottom: 'var(--space-xl)' }}
          >
            {/* Khmer Lyrics */}
            <div className="lyrics-column">
              <div className="lyrics-column-header">
                <span className="lyrics-column-title">ខ្មែរ</span>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Khmer Script</span>
              </div>
              <textarea
                name="lyricsKhmer"
                className="textarea-field khmer"
                placeholder="បញ្ចូលអក្សរខ្មែរនៅទីនេះ..."
                value={formData.lyricsKhmer}
                onChange={handleChange}
                style={{ minHeight: '300px' }}
              />
            </div>

            {/* Romanized Lyrics */}
            <div className="lyrics-column">
              <div className="lyrics-column-header">
                <span className="lyrics-column-title">Romanized</span>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Transliteration</span>
              </div>
              <textarea
                name="lyricsRomanized"
                className="textarea-field"
                placeholder="Enter romanized lyrics here..."
                value={formData.lyricsRomanized}
                onChange={handleChange}
                style={{ minHeight: '300px' }}
              />
            </div>

            {/* English Lyrics */}
            <div className="lyrics-column">
              <div className="lyrics-column-header">
                <span className="lyrics-column-title">English</span>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Translation</span>
              </div>
              <textarea
                name="lyricsEnglish"
                className="textarea-field"
                placeholder="Enter English translation here..."
                value={formData.lyricsEnglish}
                onChange={handleChange}
                style={{ minHeight: '300px' }}
              />
            </div>
          </motion.div>

          {/* Submit Button */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            style={{ display: 'flex', gap: 'var(--space-sm)' }}
          >
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate(`/song/${id}`)}
              disabled={isSaving}
            >
              Cancel
            </button>
            <motion.button
              type="submit"
              className="btn btn-primary"
              disabled={isSaving}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isSaving ? (
                <>
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    style={{ display: 'inline-block' }}
                  >
                    ⏳
                  </motion.span>
                  Saving...
                </>
              ) : (
                <>
                  <Save size={18} />
                  Save Changes
                </>
              )}
            </motion.button>
          </motion.div>
        </form>
      </div>
    </motion.div>
  );
}

export default EditSongPage;
