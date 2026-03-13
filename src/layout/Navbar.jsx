import { useState } from 'react';
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
import { useCart } from '../context/CartContext';

const Navbar = () => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [cartOpen, setCartOpen]         = useState(false);
    const { totalCount } = useCart();

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
                <div className={styles.iconBtn} data-tooltip="Messenger">
                    <FaFacebookMessenger />
                </div>
                <div className={styles.iconBtn} data-tooltip="Notifications">
                    <IoNotifications />
                </div>

                {/* ── Cart ── */}
                <div className={styles.accountWrapper}>
                    <div
                        className={styles.iconBtn}
                        data-tooltip="Cart"
                        onClick={() => { setCartOpen(prev => !prev); setDropdownOpen(false); }}
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
                        className={styles.iconBtn}
                        data-tooltip="Account"
                        onClick={() => { setDropdownOpen(prev => !prev); setCartOpen(false); }}
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