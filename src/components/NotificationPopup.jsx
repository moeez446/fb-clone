import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/NotificationPopup.module.scss';
import { NOTIFICATIONS } from '../data/Notificationsdata';
import { MdSettings } from 'react-icons/md';

const NotificationPopup = ({ onClose }) => {
    const ref = useRef(null);
    const navigate = useNavigate();
    const unread = NOTIFICATIONS.filter(n => !n.read);
    const earlier = NOTIFICATIONS.filter(n => n.read);

    // Close on outside click
    useEffect(() => {
        const handler = (e) => {
            if (ref.current && !ref.current.contains(e.target)) onClose();
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, [onClose]);

    const handleSeeAll = () => {
        onClose();
        navigate('/notifications');
    };

    return (
        <div className={styles.popup} ref={ref}>

            {/* Header */}
            <div className={styles.popup__header}>
                <h2 className={styles.popup__title}>Notifications</h2>
                <button className={styles.popup__settings}>
                    <MdSettings size={20} />
                </button>
            </div>

            {/* Tabs - just visual, no filter */}
            <div className={styles.popup__tabs}>
                <button className={`${styles.popup__tab} ${styles['popup__tab--active']}`}>All</button>
                <button className={styles.popup__tab}>Unread</button>
            </div>

            {/* Scrollable list */}
            <div className={styles.popup__list}>

                {unread.length > 0 && (
                    <>
                        <p className={styles.popup__sectionLabel}>New</p>
                        {unread.map(n => (
                            <NotifItem key={n.id} n={n} />
                        ))}
                    </>
                )}

                {earlier.length > 0 && (
                    <>
                        <p className={styles.popup__sectionLabel}>Earlier</p>
                        {earlier.map(n => (
                            <NotifItem key={n.id} n={n} />
                        ))}
                    </>
                )}
            </div>

            {/* Footer */}
            <div className={styles.popup__footer}>
                <button className={styles.popup__seeAll} onClick={handleSeeAll}>
                    See all notifications
                </button>
            </div>

        </div>
    );
};

const NotifItem = ({ n }) => (
    <div className={`${styles.notif} ${!n.read ? styles['notif--unread'] : ''}`}>
        {/* Avatar */}
        <div className={styles.notif__avatarWrap}>
            {n.avatar ? (
                <img src={n.avatar} alt={n.user} className={styles.notif__avatar} />
            ) : (
                <div className={styles.notif__avatarFallback}>
                    {n.user.charAt(0)}
                </div>
            )}
            <span className={styles.notif__typeIcon} style={{ background: n.iconColor }}>
                {n.icon}
            </span>
        </div>

        {/* Text */}
        <div className={styles.notif__body}>
            <p className={styles.notif__text}>
                <strong>{n.user}</strong> {n.action}
            </p>
            <span className={`${styles.notif__time} ${!n.read ? styles['notif__time--unread'] : ''}`}>
                {n.time}
            </span>
        </div>

        {/* Thumbnail */}
        {n.image && (
            <img src={n.image} alt="" className={styles.notif__thumb} />
        )}

        {/* Unread dot */}
        {!n.read && <span className={styles.notif__dot} />}
    </div>
);

export default NotificationPopup;