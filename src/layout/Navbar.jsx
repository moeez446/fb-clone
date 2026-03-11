import { NavLink } from 'react-router-dom';
import styles from '../styles/Navbar.module.scss';
import { FaFacebook, FaSearch } from 'react-icons/fa';
import { FaFacebookMessenger } from 'react-icons/fa6';
import { HiHome, HiUserGroup } from 'react-icons/hi';
import { RiVideoFill, RiStore2Fill } from 'react-icons/ri';
import { IoNotifications, IoAppsSharp } from 'react-icons/io5';
import { IoMdArrowDropdown } from 'react-icons/io';

const Navbar = () => {
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
                <NavLink
                    to="/"
                    end
                    className={({ isActive }) =>
                        isActive ? `${styles.option} ${styles.active}` : styles.option
                    }
                    data-tooltip="Home"
                >
                    <HiHome />
                </NavLink>

                <NavLink
                    to="/friends"
                    className={({ isActive }) =>
                        isActive ? `${styles.option} ${styles.active}` : styles.option
                    }
                    data-tooltip="Friends"
                >
                    <HiUserGroup />
                </NavLink>

                <NavLink
                    to="/watch"
                    className={({ isActive }) =>
                        isActive ? `${styles.option} ${styles.active}` : styles.option
                    }
                    data-tooltip="Watch"
                >
                    <RiVideoFill />
                </NavLink>

                <NavLink
                    to="/marketplace"
                    className={({ isActive }) =>
                        isActive ? `${styles.option} ${styles.active}` : styles.option
                    }
                    data-tooltip="Marketplace"
                >
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
                <div className={styles.iconBtn} data-tooltip="Account">
                    <IoMdArrowDropdown />
                </div>
            </div>

        </nav>
    );
};

export default Navbar;