import { useState, useEffect } from 'react';
import styles from '../styles/Storyviewer.module.scss';
import { MdClose, MdChevronLeft, MdChevronRight } from 'react-icons/md';

const STORY_DURATION = 4000;

export default function StoryViewer({ stories, startIndex = 0, onClose }) {
  const [current, setCurrent] = useState(startIndex);
  const [progress, setProgress] = useState(0);

  const story = stories?.[current];

  useEffect(() => {
    setProgress(0);
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(interval);
          if (current < stories.length - 1) {
            setCurrent(c => c + 1);
          } else {
            onClose();
          }
          return 0;
        }
        return p + (100 / (STORY_DURATION / 100));
      });
    }, 100);
    return () => clearInterval(interval);
  }, [current]);

  if (!story || !stories?.length) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.viewer}>

        <div className={styles.progress}>
          {stories.map((_, i) => (
            <div key={i} className={styles.progress__bar}>
              <div
                className={styles.progress__fill}
                style={{ width: i < current ? '100%' : i === current ? `${progress}%` : '0%' }}
              />
            </div>
          ))}
        </div>

        <div className={styles.header}>
          <img src={story.avatar} alt={story.user} className={styles.avatar} />
          <span className={styles.username}>{story.user}</span>
          <button className={styles.close} onClick={onClose}>
            <MdClose size={24} />
          </button>
        </div>

        <div className={styles.bg} style={{ backgroundImage: `url(${story.bg})` }} />

        {current > 0 && (
          <button className={`${styles.arrow} ${styles['arrow--left']}`} onClick={() => setCurrent(c => c - 1)}>
            <MdChevronLeft size={28} />
          </button>
        )}
        {current < stories.length - 1 && (
          <button className={`${styles.arrow} ${styles['arrow--right']}`} onClick={() => setCurrent(c => c + 1)}>
            <MdChevronRight size={28} />
          </button>
        )}

      </div>
    </div>
  );
}