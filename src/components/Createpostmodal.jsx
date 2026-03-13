import { useState } from 'react';
import styles from '../styles/Createpostmodal.module.scss';
import { MdClose, MdPublic, MdVideoCall, MdAddPhotoAlternate, MdSentimentSatisfied, MdKeyboardArrowDown } from 'react-icons/md';
import MediaModal from './Mediamodal';

export default function CreatePostModal({ onClose }) {
    const [mediaMode, setMediaMode] = useState(null);

    return (
        <>
            <div className={styles.overlay}>
                <div className={styles.modal}>

                    <div className={styles.header}>
                        <h2 className={styles.title}>Create Post</h2>
                        <button className={styles.close} onClick={onClose}>
                            <MdClose size={22} />
                        </button>
                    </div>

                    <div className={styles.user}>
                        <img src="https://i.pravatar.cc/150?img=3" alt="you" className={styles.avatar} />
                        <div className={styles['user__info']}>
                            <span className={styles.username}>Your Name</span>
                            <button className={styles.privacy}>
                                <MdPublic size={14} /> Public <MdKeyboardArrowDown size={14} />
                            </button>
                        </div>
                    </div>

                    <textarea
                        autoFocus
                        placeholder="What's on your mind?"
                        rows={5}
                        className={styles.textarea}
                    />

                    <div className={styles['add-to-post']}>
                        <span className={styles['add-label']}>Add to your post</span>
                        <div className={styles['add-icons']}>
                            <button className={styles['add-btn']} onClick={() => setMediaMode('photo')}>
                                <MdAddPhotoAlternate size={26} color="#45bd62" />
                            </button>
                            <button className={styles['add-btn']} onClick={() => setMediaMode('feeling')}>
                                <MdSentimentSatisfied size={26} color="#f7b928" />
                            </button>
                            <button className={styles['add-btn']} onClick={() => setMediaMode('video')}>
                                <MdVideoCall size={26} color="#f3425f" />
                            </button>
                        </div>
                    </div>

                    <button className={styles.submit}>Post</button>

                </div>
            </div>

            {mediaMode && (
                <MediaModal mode={mediaMode} onClose={() => setMediaMode(null)} />
            )}
        </>
    );
}