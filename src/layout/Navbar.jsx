import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { NavLink } from 'react-router-dom';
import styles from '../styles/Navbar.module.scss';
import { FaFacebook, FaSearch } from 'react-icons/fa';
import { FaFacebookMessenger } from 'react-icons/fa6';
import { HiHome, HiUserGroup } from 'react-icons/hi';
import { RiVideoFill, RiStore2Fill } from 'react-icons/ri';
import { IoNotifications, IoAppsSharp } from 'react-icons/io5';
import { IoMdArrowDropdown } from 'react-icons/io';
import { MdShoppingCart } from 'react-icons/md';
import AccountDropdown from '../components/Accountdropdown';
import CartPopup from '../components/CartPopup';
import NotificationPopup from '../components/NotificationPopup';
import { useCart } from '../context/CartContext';
import { NOTIFICATIONS } from '../data/Notificationsdata';

const Navbar = () => {
    const [dropdownOpen, setDropdownOpen]       = useState(false);
    const [cartOpen, setCartOpen]               = useState(false);
    const [notifOpen, setNotifOpen]             = useState(false);
    const navigate = useNavigate();
    const { totalCount } = useCart();

    const unreadCount = NOTIFICATIONS.filter(n => !n.read).length;

    const closeAll = () => {
        setDropdownOpen(false);
        setCartOpen(false);
        setNotifOpen(false);
    };

    return (
        <nav className={styles.navbar}>

            {/* ── Left ── */}
            <div className={styles['navbar__left']}>
                <NavLink to="/">
                    <FaFacebook className={styles.logo} />
                </NavLink>
                <div className={styles.searchWrapper}>
                    <FaSearch color="#65676B" />
                    <input type="text" placeholder="Search Facebook" />
                </div>
            </div>

            {/* ── Center ── */}
            <div className={styles['navbar__center']}>
                <NavLink to="/" end className={({ isActive }) => isActive ? `${styles.option} ${styles.active}` : styles.option} data-tooltip="Home">
                    <HiHome />
                </NavLink>
                <NavLink to="/friends" className={({ isActive }) => isActive ? `${styles.option} ${styles.active}` : styles.option} data-tooltip="Friends">
                    <HiUserGroup />
                </NavLink>
                <NavLink to="/watch" className={({ isActive }) => isActive ? `${styles.option} ${styles.active}` : styles.option} data-tooltip="Watch">
                    <RiVideoFill />
                </NavLink>
                <NavLink to="/marketplace" className={({ isActive }) => isActive ? `${styles.option} ${styles.active}` : styles.option} data-tooltip="Marketplace">
                    <RiStore2Fill />
                </NavLink>
            </div>

            {/* ── Right ── */}
            <div className={styles['navbar__right']}>
                <div className={styles.iconBtn} data-tooltip="Menu">
                    <IoAppsSharp />
                </div>
                <div
                    className={styles.iconBtn}
                    data-tooltip="Messenger"
                    onClick={() => navigate('/messenger')}
                    style={{ cursor: 'pointer' }}
                >
                    <FaFacebookMessenger />
                </div>

                {/* ── Notifications ── */}
                <div className={styles.accountWrapper}>
                    <div
                        className={`${styles.iconBtn} ${notifOpen ? styles.iconBtnActive : ''}`}
                        data-tooltip="Notifications"
                        onClick={() => { setNotifOpen(prev => !prev); setDropdownOpen(false); setCartOpen(false); }}
                    >
                        <IoNotifications />
                        {unreadCount > 0 && (
                            <span className={styles.notifBadge}>
                                {unreadCount > 9 ? '9+' : unreadCount}
                            </span>
                        )}
                    </div>
                    {notifOpen && <NotificationPopup onClose={() => setNotifOpen(false)} />}
                </div>

                {/* ── Cart ── */}
                <div className={styles.accountWrapper}>
                    <div
                        className={`${styles.iconBtn} ${cartOpen ? styles.iconBtnActive : ''}`}
                        data-tooltip="Cart"
                        onClick={() => { setCartOpen(prev => !prev); setDropdownOpen(false); setNotifOpen(false); }}
                    >
                        <MdShoppingCart />
                        {totalCount > 0 && (
                            <span className={styles.cartBadge}>
                                {totalCount > 99 ? '99+' : totalCount}
                            </span>
                        )}
                    </div>
                    {cartOpen && <CartPopup onClose={() => setCartOpen(false)} />}
                </div>

                {/* ── Account ── */}
                <div className={styles.accountWrapper}>
                    <div
                        className={`${styles.iconBtn} ${dropdownOpen ? styles.iconBtnActive : ''}`}
                        data-tooltip="Account"
                        onClick={() => { setDropdownOpen(prev => !prev); setCartOpen(false); setNotifOpen(false); }}
                    >
                        <IoMdArrowDropdown />
                    </div>
                    {dropdownOpen && (
                        <AccountDropdown onClose={() => setDropdownOpen(false)} />
                    )}
                </div>
            </div>

        </nav>
    );
};

export default Navbar;