import { useState } from 'react';
import styles from '../styles/Friends.module.scss';
import { MdPeople, MdChevronRight, MdSettings } from 'react-icons/md';
import { REQUESTS, NAV_ITEMS } from '../data/Frienddata';

export default function Friends() {
    const [activeNav, setActiveNav] = useState(0);

    return (
        <div className={styles['friends']}>

            {/* ── Tabs ── */}
            <div className={styles['friends__tabs']}>
                <div className={styles['friends__tabsHeader']}>
                    <h1 className={styles['friends__title']}>Friends</h1>
                    <button className={styles['friends__settingsBtn']}>
                        <MdSettings size={20} />
                    </button>
                </div>
                <div className={styles['friends__tabList']}>
                    {NAV_ITEMS.map((item, i) => (
                        <button
                            key={i}
                            className={`${styles['friends__tab']} ${activeNav === i ? styles['friends__tab--active'] : ''}`}
                            onClick={() => setActiveNav(i)}
                        >
                            {item.icon}
                            {item.label}
                            {item.badge && (
                                <span className={styles['friends__tab-badge']}>{item.badge}</span>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* ── Friend Requests Grid ── */}
            <h3 className={styles['friends__section-title']}>Friend Requests</h3>
            <div className={styles['friends__grid']}>
                {REQUESTS.map((r) => (
                    <div key={r.id} className={styles['friends__card']}>
                        <img src={r.avatar} alt={r.name} className={styles['friends__card-img']} />
                        <div className={styles['friends__card-body']}>
                            <p className={styles['friends__card-name']}>{r.name}</p>
                            <p className={styles['friends__card-mutual']}>
                                <MdPeople size={14} /> {r.mutual} mutual friends
                            </p>
                            <div className={styles['friends__card-actions']}>
                                <button className={styles['friends__btn-confirm']}>Confirm</button>
                                <button className={styles['friends__btn-delete']}>Delete</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

        </div>
    );
}