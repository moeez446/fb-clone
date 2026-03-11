import { useLocation, useNavigate } from 'react-router-dom';
import styles from '../styles/CommingSoon.module.scss';
import { MdArrowBack, MdConstruction } from 'react-icons/md';

export default function ComingSoon() {
    const location = useLocation();
    const navigate = useNavigate();

    // URL se page name nikalo — /gaming → Gaming
    const pageName = location.pathname
        .replace('/', '')
        .replace(/-/g, ' ')
        .replace(/\b\w/g, (c) => c.toUpperCase()) || 'This Page';

    return (
        <div className={styles['coming']}>
            <div className={styles['coming__box']}>
                <MdConstruction size={64} className={styles['coming__icon']} />
                <h2 className={styles['coming__title']}>{pageName}</h2>
                <p className={styles['coming__text']}>This page is coming soon. We're working on it!</p>
                <button className={styles['coming__btn']} onClick={() => navigate('/')}>
                    <MdArrowBack size={18} /> Go to Home
                </button>
            </div>
        </div>
    );
}