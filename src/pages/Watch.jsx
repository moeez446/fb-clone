import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/Watch.module.scss';
import {
    MdPlayCircle,
    MdVideoLibrary,
    MdLiveTv,
    MdSavedSearch,
    MdChevronLeft,
    MdChevronRight,
    MdHome
} from 'react-icons/md';
import { VIDEOS } from '../data/Watchdata';

export default function Watch() {

    const [collapsed, setCollapsed] = useState(false);
    const navigate = useNavigate();

    return (
        <div className={styles['watch']}>

            {/* ── Left Panel ── */}
            <div className={`${styles['watch__panel']} ${collapsed ? styles['watch__panel--collapsed'] : ''}`}>

                {/* ── Home Button — BILKUL TOP pe ── */}
                <div
                    className={styles['watch__home-btn']}
                    onClick={() => navigate('/')}
                >
                    <span className={styles['watch__nav-icon']}><MdHome size={22} /></span>
                    <span className={styles['watch__nav-label']}>Back to Home</span>
                </div>

                <h2 className={styles['watch__panel-title']}>Watch</h2>

                <nav className={styles['watch__nav']}>

                    <div className={`${styles['watch__nav-item']} ${styles['watch__nav-item--active']}`}>
                        <span className={styles['watch__nav-icon']}><MdPlayCircle size={22} /></span>
                        <span className={styles['watch__nav-label']}>Home</span>
                    </div>

                    <div className={styles['watch__nav-item']}>
                        <span className={styles['watch__nav-icon']}><MdLiveTv size={22} /></span>
                        <span className={styles['watch__nav-label']}>Live Videos</span>
                    </div>

                    <div className={styles['watch__nav-item']}>
                        <span className={styles['watch__nav-icon']}><MdVideoLibrary size={22} /></span>
                        <span className={styles['watch__nav-label']}>Saved Videos</span>
                    </div>

                    <div className={styles['watch__nav-item']}>
                        <span className={styles['watch__nav-icon']}><MdSavedSearch size={22} /></span>
                        <span className={styles['watch__nav-label']}>Watch History</span>
                    </div>

                </nav>

            </div>

            {/* Toggle Button */}
            <button
                className={`${styles['watch__toggle']} ${collapsed ? styles['watch__toggle--collapsed'] : ''}`}
                onClick={() => setCollapsed(!collapsed)}
            >
                {collapsed ? <MdChevronRight size={22} /> : <MdChevronLeft size={22} />}
            </button>


            {/* ── Right Content ── */}
            <div className={styles['watch__content']}>

                <h3 className={styles['watch__section-title']}>Videos For You</h3>

                <div className={`${styles['watch__grid']} ${collapsed ? styles['watch__grid--wide'] : ''}`}>

                    {VIDEOS.map((v) => (
                        <div key={v.id} className={styles['watch__card']}>

                            <div className={styles['watch__thumb-wrap']}>
                                <img src={v.thumb} alt={v.title} className={styles['watch__thumb']} />
                                <div className={styles['watch__play-icon']}><MdPlayCircle size={48} /></div>
                            </div>

                            <div className={styles['watch__card-info']}>
                                <p className={styles['watch__card-title']}>{v.title}</p>
                                <p className={styles['watch__card-channel']}>{v.channel}</p>
                                <p className={styles['watch__card-meta']}>{v.views} views · {v.time}</p>
                            </div>

                        </div>
                    ))}

                </div>

            </div>

        </div>
    );
}