import { useState } from 'react';
import styles from '../styles/Notifications.module.scss';
import { NOTIFICATIONS } from '../data/Notificationsdata';
import { MdSettings, MdMoreHoriz, MdDoneAll } from 'react-icons/md';

const FILTERS = ['All', 'Unread', 'Likes', 'Comments', 'Friends', 'Events'];

const Notifications = () => {
    const [activeFilter, setActiveFilter] = useState('All');

    const filtered = NOTIFICATIONS.filter(n => {
        if (activeFilter === 'All')      return true;
        if (activeFilter === 'Unread')   return !n.read;
        if (activeFilter === 'Likes')    return n.type === 'like';
        if (activeFilter === 'Comments') return n.type === 'comment';
        if (activeFilter === 'Friends')  return n.type === 'friend';
        if (activeFilter === 'Events')   return n.type === 'event';
        return true;
    });

    const unread  = filtered.filter(n => !n.read);
    const earlier = filtered.filter(n => n.read);

    return (
        <div className={styles.page}>

            {/* ── Sidebar panel ── */}
            <aside className={styles.panel}>
                <div className={styles.panel__header}>
                    <h1 className={styles.panel__title}>Notifications</h1>
                    <button className={styles.panel__settings}>
                        <MdSettings size={20} />
                    </button>
                </div>

                {/* Filter chips */}
                <div className={styles.panel__filters}>
                    {FILTERS.map(f => (
                        <button
                            key={f}
                            className={`${styles.chip} ${activeFilter === f ? styles['chip--active'] : ''}`}
                            onClick={() => setActiveFilter(f)}
                        >
                            {f}
                        </button>
                    ))}
                </div>

                {/* Mark all read */}
                <button className={styles.panel__markAll}>
                    <MdDoneAll size={18} />
                    Mark all as read
                </button>
            </aside>

            {/* ── Main feed ── */}
            <main className={styles.feed}>

                {filtered.length === 0 && (
                    <div className={styles.feed__empty}>
                        <p>No notifications in this category.</p>
                    </div>
                )}

                {unread.length > 0 && (
                    <section>
                        <h2 className={styles.feed__sectionTitle}>New</h2>
                        {unread.map(n => <NotifRow key={n.id} n={n} />)}
                    </section>
                )}

                {earlier.length > 0 && (
                    <section>
                        <h2 className={styles.feed__sectionTitle}>Earlier</h2>
                        {earlier.map(n => <NotifRow key={n.id} n={n} />)}
                    </section>
                )}

            </main>
        </div>
    );
};

const NotifRow = ({ n }) => (
    <div className={`${styles.row} ${!n.read ? styles['row--unread'] : ''}`}>

        {/* Avatar + type icon */}
        <div className={styles.row__avatarWrap}>
            {n.avatar ? (
                <img src={n.avatar} alt={n.user} className={styles.row__avatar} />
            ) : (
                <div className={styles.row__avatarFallback}>{n.user.charAt(0)}</div>
            )}
            <span className={styles.row__typeIcon} style={{ background: n.iconColor }}>
                {n.icon}
            </span>
        </div>

        {/* Text */}
        <div className={styles.row__body}>
            <p className={styles.row__text}>
                <strong>{n.user}</strong> {n.action}
            </p>
            <span className={`${styles.row__time} ${!n.read ? styles['row__time--unread'] : ''}`}>
                {n.time}
            </span>
        </div>

        {/* Thumbnail */}
        {n.image && (
            <img src={n.image} alt="" className={styles.row__thumb} />
        )}

        {/* More options */}
        <button className={styles.row__more}>
            <MdMoreHoriz size={20} />
        </button>

        {/* Unread dot */}
        {!n.read && <span className={styles.row__dot} />}
    </div>
);

export default Notifications;