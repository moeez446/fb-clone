import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/Saved.module.scss';
import {
    MdBookmark,
    MdMoreHoriz,
    MdChevronLeft,
    MdChevronRight,
    MdHome
} from 'react-icons/md';
import { SAVED_CATEGORIES, SAVED_ITEMS } from '../data/SavedData';

export default function Saved() {

    const [activeCategory, setActiveCategory] = useState(1);
    const [collapsed, setCollapsed] = useState(false);
    const navigate = useNavigate();

    return (
        <div className={styles['saved']}>

            {/* ── Left Panel ── */}
            <div className={`${styles['saved__panel']} ${collapsed ? styles['saved__panel--collapsed'] : ''}`}>

                {/* ── Home Button ── */}
                <div
                    className={styles['saved__home-btn']}
                    onClick={() => navigate('/')}
                >
                    <span className={styles['saved__nav-icon']}>
                        <MdHome size={20} />
                    </span>

                    <span className={styles['saved__nav-label']}>
                        Back to Home
                    </span>
                </div>

                <div className={styles['saved__panel-top']}>
                    <h2 className={styles['saved__panel-title']}>Saved</h2>
                    <button className={styles['saved__panel-icon-btn']}>
                        <MdMoreHoriz size={20} />
                    </button>
                </div>

                {/* Search remove ho gaya */}

                <nav className={styles['saved__nav']}>

                    {SAVED_CATEGORIES.map((cat) => (
                        <div
                            key={cat.id}
                            className={`${styles['saved__nav-item']} ${activeCategory === cat.id ? styles['saved__nav-item--active'] : ''}`}
                            onClick={() => setActiveCategory(cat.id)}
                            title={collapsed ? cat.label : ''}
                        >

                            <span className={styles['saved__nav-icon']}>
                                <MdBookmark size={18} />
                            </span>

                            <span className={styles['saved__nav-label']}>
                                {cat.label}
                            </span>

                            <span className={styles['saved__nav-count']}>
                                {cat.count}
                            </span>

                        </div>
                    ))}

                </nav>

            </div>


            {/* Toggle Button */}
            <button
                className={`${styles['saved__toggle']} ${collapsed ? styles['saved__toggle--collapsed'] : ''}`}
                onClick={() => setCollapsed(!collapsed)}
            >
                {collapsed ? <MdChevronRight size={22} /> : <MdChevronLeft size={22} />}
            </button>


            {/* ── Right Content ── */}
            <div className={styles['saved__content']}>

                <div className={styles['saved__content-top']}>
                    <h3 className={styles['saved__section-title']}>
                        All Saved Items
                    </h3>
                </div>

                <div className={`${styles['saved__grid']} ${collapsed ? styles['saved__grid--wide'] : ''}`}>

                    {SAVED_ITEMS.map((item) => (

                        <div key={item.id} className={styles['saved__card']}>

                            <img
                                src={item.img}
                                alt={item.title}
                                className={styles['saved__card-img']}
                            />

                            <div className={styles['saved__card-body']}>

                                <span className={styles['saved__card-type']}>
                                    {item.type}
                                </span>

                                <p className={styles['saved__card-title']}>
                                    {item.title}
                                </p>

                                <p className={styles['saved__card-page']}>
                                    {item.page}
                                </p>

                                <p className={styles['saved__card-time']}>
                                    {item.time}
                                </p>

                            </div>

                            <button className={styles['saved__card-more']}>
                                <MdMoreHoriz size={20} />
                            </button>

                        </div>

                    ))}

                </div>

            </div>

        </div>
    );
}