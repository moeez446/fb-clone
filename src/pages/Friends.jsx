import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/Friends.module.scss';
import { MdPeople, MdChevronRight, MdSettings, MdChevronLeft, MdHome } from 'react-icons/md';
import { REQUESTS, NAV_ITEMS } from '../data/Frienddata';

export default function Friends() {
    const [collapsed, setCollapsed] = useState(false);
    const navigate = useNavigate();

    return (
        <div className={styles['friends']}>

            {/* ── Left Panel ── */}
            <div className={`${styles['friends__panel']} ${collapsed ? styles['friends__panel--collapsed'] : ''}`}>

                <div className={styles['friends__panel-top']}>
                    <h2 className={styles['friends__panel-title']}>Friends</h2>
                    <button className={styles['friends__panel-icon-btn']}>
                        <MdSettings size={20} />
                    </button>
                </div>

                <nav className={styles['friends__nav']}>
                    {NAV_ITEMS.map((item, i) => (
                        <div
                            key={i}
                            className={`${styles['friends__nav-item']} ${item.active ? styles['friends__nav-item--active'] : ''}`}
                        >
                            <span className={styles['friends__nav-icon']}>{item.icon}</span>
                            <span className={styles['friends__nav-label']}>{item.label}</span>
                            {item.badge && (
                                <span className={styles['friends__nav-badge']}>{item.badge}</span>
                            )}
                            {item.arrow && !item.badge && (
                                <MdChevronRight size={20} className={styles['friends__nav-arrow']} />
                            )}
                        </div>
                    ))}
                </nav>

                {/* ── Home Button ── */}
                <div
                    className={styles['friends__home-btn']}
                    onClick={() => navigate('/')}
                    title="Back to Home"
                >
                    <span className={styles['friends__nav-icon']}><MdHome size={20} /></span>
                    <span className={styles['friends__home-label']}>Back to Home</span>
                </div>

            </div>

            {/* ── Toggle Button ── */}
            <button
                className={`${styles['friends__toggle']} ${collapsed ? styles['friends__toggle--collapsed'] : ''}`}
                onClick={() => setCollapsed(!collapsed)}
            >
                {collapsed ? <MdChevronRight size={20} /> : <MdChevronLeft size={20} />}
            </button>

            {/* ── Right Content ── */}
            <div className={styles['friends__content']}>
                <h3 className={styles['friends__section-title']}>Friend Requests</h3>
                <div className={`${styles['friends__grid']} ${collapsed ? styles['friends__grid--wide'] : ''}`}>
                    {REQUESTS.map((r) => (
                        <div key={r.id} className={styles['friends__card']}>
                            <img src={r.avatar} alt={r.name} className={styles['friends__card-img']} />
                            <div className={styles['friends__card-body']}>
                                <p className={styles['friends__card-name']}>{r.name}</p>
                                <p className={styles['friends__card-mutual']}>
                                    <MdPeople size={14} /> {r.mutual} mutual friends
                                </p>
                                <div className={styles['friends__card-actions']}></div>
                                <button className={styles['friends__btn-confirm']}>Confirm</button>
                                <button className={styles['friends__btn-delete']}>Delete</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

        </div>
    );
}