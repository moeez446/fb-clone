import styles from '../styles/Mediamodal.module.scss';
import { MdClose, MdVideoCall, MdAddPhotoAlternate, MdPublic, MdKeyboardArrowDown, MdCloudUpload } from 'react-icons/md';

const FEELINGS = ['😊 Happy', '😢 Sad', '😍 Loved', '😎 Cool', '🎉 Celebrating', '😴 Tired', '😡 Angry', '🥳 Excited'];

export default function MediaModal({ mode, onClose }) {
  const titles = { video: 'Go Live', photo: 'Create Photo/Video Post', feeling: 'How are you feeling?' };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>

        <div className={styles.header}>
          <h2 className={styles.title}>{titles[mode]}</h2>
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

        {(mode === 'photo' || mode === 'video') && (
          <div className={styles['upload-area']}>
            <div className={styles['upload__icon']}>
              {mode === 'photo'
                ? <MdAddPhotoAlternate size={48} color="#45bd62" />
                : <MdVideoCall size={48} color="#f3425f" />
              }
            </div>
            <p className={styles['upload__text']}>
              {mode === 'photo' ? 'Add Photos/Videos' : 'Start your live video'}
            </p>
            <p className={styles['upload__sub']}>
              {mode === 'photo' ? 'or drag and drop' : 'Connect with friends in real time'}
            </p>
            <button className={`${styles['upload__btn']} ${mode === 'video' ? styles['upload__btn--live'] : ''}`}>
              {mode === 'photo'
                ? <><MdCloudUpload size={20} /> Upload from device</>
                : <><MdVideoCall size={20} /> Go Live Now</>
              }
            </button>
          </div>
        )}

        {mode === 'feeling' && (
          <div className={styles.feelings}>
            <p className={styles['feelings__title']}>How are you feeling?</p>
            <div className={styles['feelings__grid']}>
              {FEELINGS.map((f) => (
                <button key={f} className={styles['feeling-item']} onClick={onClose}>
                  {f}
                </button>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}