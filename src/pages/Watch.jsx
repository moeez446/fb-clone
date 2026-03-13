import { useState } from 'react';
import styles from '../styles/Watch.module.scss';
import { MdPlayCircle, MdVideoLibrary, MdLiveTv, MdSavedSearch } from 'react-icons/md';
import { VIDEOS } from '../data/Watchdata';

const TABS = [
    { id: 'home',    label: 'Home',         icon: <MdPlayCircle size={18} /> },
    { id: 'live',    label: 'Live Videos',   icon: <MdLiveTv size={18} /> },
    { id: 'saved',   label: 'Saved Videos',  icon: <MdVideoLibrary size={18} /> },
    { id: 'history', label: 'Watch History', icon: <MdSavedSearch size={18} /> },
];

export default function Watch() {
    const [activeTab, setActiveTab] = useState('home');

    return (
        <div className={styles['watch']}>

            {/* ── Tabs ── */}
            <div className={styles['watch__tabs']}>
                <h1 className={styles['watch__title']}>Watch</h1>
                <div className={styles['watch__tabList']}>
                    {TABS.map(tab => (
                        <button
                            key={tab.id}
                            className={`${styles['watch__tab']} ${activeTab === tab.id ? styles['watch__tab--active'] : ''}`}
                            onClick={() => setActiveTab(tab.id)}
                        >
                            {tab.icon}
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* ── Videos Grid ── */}
            <h3 className={styles['watch__section-title']}>Videos For You</h3>

            <div className={styles['watch__grid']}>
                {VIDEOS.map((v) => (
                    <div key={v.id} className={styles['watch__card']}>
                        <div className={styles['watch__thumb-wrap']}>
                            <img src={v.thumb} alt={v.title} className={styles['watch__thumb']} />
                            <div className={styles['watch__play-icon']}>
                                <MdPlayCircle size={48} />
                            </div>
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
    );
}