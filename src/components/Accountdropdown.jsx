import { useRef, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { MdEmail } from 'react-icons/md';
import { FaSignInAlt } from 'react-icons/fa';
import styles from '../styles/AccountDropdown.module.scss';

const AccountDropdown = ({ onClose }) => {
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                onClose();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [onClose]);

    return (
        <div className={styles.dropdown} ref={dropdownRef}>

            {/* 1. Profile — Name + Photo */}
            <div className={styles.profile}>
                <div className={styles.avatar}>
                    <img src="https://i.pravatar.cc/40" alt="Profile" />
                </div>
                <span className={styles.name}>Abdul Moeez</span>
            </div>

            <hr className={styles.divider} />

            {/* 2. Gmail */}
            <div className={styles.item}>
                <span className={styles.iconWrap}>
                    <MdEmail />
                </span>
                <span>abdulmoeez@gmail.com</span>
            </div>

            <hr className={styles.divider} />

            {/* 3. Login Page Button */}
            <NavLink to="/login" className={styles.item} onClick={onClose}>
                <span className={styles.iconWrap}>
                    <FaSignInAlt />
                </span>
                <span>Login Page</span>
            </NavLink>

        </div>
    );
};

export default AccountDropdown;