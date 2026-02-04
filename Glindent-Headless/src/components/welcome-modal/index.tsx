import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './welcome-modal.module.css';
import { useFirstVisit } from 'src/hooks/use-first-visit';
import type { WelcomeModalProps } from 'src/components/__generated__/types';

interface InternalWelcomeModalProps extends WelcomeModalProps {
  isOpen?: boolean;
  onClose?: () => void;
}

/**
 * Welcome Modal Component
 * 
 * ikas Panel'den düzenlenebilir welcome modal
 * Video URL'si dinamik olarak ayarlanabilir
 * 
 * Features:
 * - Auto-play video with sound
 * - Cross-browser video format support (MP4, WebM, Ogg)
 * - First visit detection (localStorage)
 * - Responsive design
 * - Smooth animations
 * - ikas panel integration
 */
export const WelcomeModal: React.FC<InternalWelcomeModalProps> = ({
  videoUrl = '/videos/welcome.mp4',
  videoMp4Url = '/videos/welcome.mp4',
  videoWebmUrl = '/videos/welcome.webm',
  videoOgvUrl = '/videos/welcome.ogv',
  title = 'Welcome to Glindent',
  subtitle = 'Discover premium dental supplies',
  enableAutoplay = true,
  showOnlyFirstVisit = true,
  isOpen: externalIsOpen,
  onClose: externalOnClose,
}) => {
  const [mounted, setMounted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // First visit detection
  const { isFirstVisit, hasChecked } = useFirstVisit();

  // Client-side only mounting
  useEffect(() => {
    setMounted(true);
  }, []);

  // Determine if modal should be open
  useEffect(() => {
    if (!mounted || !hasChecked) return;

    // If controlled externally
    if (externalIsOpen !== undefined) {
      setInternalIsOpen(externalIsOpen);
      return;
    }

    // Otherwise use first visit logic
    if (showOnlyFirstVisit) {
      setInternalIsOpen(isFirstVisit);
    } else {
      setInternalIsOpen(true);
    }
  }, [mounted, hasChecked, isFirstVisit, externalIsOpen, showOnlyFirstVisit]);

  // Auto-play video when modal opens
  useEffect(() => {
    if (!mounted || !internalIsOpen) return;

    const timer = setTimeout(() => {
      if (videoRef.current && enableAutoplay) {
        // Enable autoplay with sound
        videoRef.current.volume = 1;
        const playPromise = videoRef.current.play();
        
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              setIsPlaying(true);
            })
            .catch((error) => {
              console.log('Auto-play prevented:', error);
              setIsPlaying(false);
            });
        }
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [internalIsOpen, mounted, enableAutoplay]);

  // Handle ESC key to close modal
  useEffect(() => {
    if (!internalIsOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [internalIsOpen]);

  // Handle manual play button click
  const handlePlayClick = () => {
    if (videoRef.current) {
      videoRef.current.play().catch((error) => {
        console.log('Play error:', error);
      });
      setIsPlaying(true);
    }
  };

  // Handle close modal
  const handleClose = () => {
    if (videoRef.current) {
      videoRef.current.pause();
    }
    setIsPlaying(false);
    setInternalIsOpen(false);
    externalOnClose?.();
  };

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {internalIsOpen && (
        <motion.div
          className={styles.modalOverlay}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={handleClose}
        >
          <motion.div
            className={styles.modalContent}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              className={styles.closeButton}
              onClick={handleClose}
              aria-label="Close welcome modal"
              title="Close (Esc)"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            {/* Video Container */}
            <div className={styles.videoContainer}>
              <video
                ref={videoRef}
                className={styles.video}
                controls={false}
                autoPlay={false}
                playsInline
                controlsList="nodownload"
                loop
              >
                {/* Cross-browser video formats - use provided URLs or defaults */}
                <source src={videoUrl || videoMp4Url} type="video/mp4" />
                {videoWebmUrl && <source src={videoWebmUrl} type="video/webm" />}
                {videoOgvUrl && <source src={videoOgvUrl} type="video/ogg" />}
                
                {/* Fallback message */}
                <p>
                  Your browser does not support HTML5 video. 
                  Please upgrade to a modern browser.
                </p>
              </video>

              {/* Play Button Overlay - shown if autoplay fails */}
              {!isPlaying && (
                <motion.button
                  className={styles.playButton}
                  onClick={handlePlayClick}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <svg
                    width="60"
                    height="60"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <polygon points="5 3 19 12 5 21 5 3" />
                  </svg>
                </motion.button>
              )}
            </div>

            {/* Brand Text */}
            <div className={styles.brandText}>
              <h1>{title}</h1>
              <p>{subtitle}</p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default WelcomeModal;
