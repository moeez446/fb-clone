import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/Marketplace.module.scss';
import { MdHome, MdAddBox, MdChevronLeft, MdChevronRight, MdSettings } from 'react-icons/md';
import { LISTINGS, NAV_ITEMS } from '../data/Marketplacedata';

export default function Marketplace() {
    const [collapsed, setCollapsed] = useState(false);
    const [activeNav, setActiveNav] = useState(0);
    const navigate = useNavigate();

    return (
        <div className={styles['market']}>

            {/* ── Left Panel ── */}
            <div className={`${styles['market__panel']} ${collapsed ? styles['market__panel--collapsed'] : ''}`}>

                <div className={styles['market__panel-top']}>
                    <h2 className={styles['market__panel-title']}>Marketplace</h2>
                    <button className={styles['market__panel-icon-btn']}>
                        <MdSettings size={20} />
                    </button>
                </div>

                <button className={styles['market__create-btn']}>
                    <MdAddBox size={18} />
                    <span className={styles['market__create-label']}>Create Listing</span>
                </button>

                <nav className={styles['market__nav']}>
                    <p className={styles['market__nav-title']}>Browse by Category</p>
                    {NAV_ITEMS.map((item, i) => (
                        <div
                            key={i}
                            className={`${styles['market__nav-item']} ${activeNav === i ? styles['market__nav-item--active'] : ''}`}
                            onClick={() => setActiveNav(i)}
                            title={item.label}
                        >
                            <span className={styles['market__nav-icon']}>{item.icon}</span>
                            <span className={styles['market__nav-label']}>{item.label}</span>
                        </div>
                    ))}
                </nav>

                {/* ── Home Button ── */}
                <div
                    className={styles['market__home-btn']}
                    onClick={() => navigate('/')}
                    title="Back to Home"
                >
                    <span className={styles['market__nav-icon']}><MdHome size={20} /></span>
                    <span className={styles['market__home-label']}>Back to Home</span>
                </div>

            </div>

            {/* ── Toggle Button ── */}
            <button
                className={`${styles['market__toggle']} ${collapsed ? styles['market__toggle--collapsed'] : ''}`}
                onClick={() => setCollapsed(!collapsed)}
            >
                {collapsed ? <MdChevronRight size={20} /> : <MdChevronLeft size={20} />}
            </button>

            {/* ── Right Content ── */}
            <div className={styles['market__content']}>
                <h3 className={styles['market__section-title']}>Today's Picks</h3>
                <div className={`${styles['market__grid']} ${collapsed ? styles['market__grid--wide'] : ''}`}>
                    {LISTINGS.map((item) => (
                        <div key={item.id} className={styles['market__card']}>
                            <img src={item.img} alt={item.title} className={styles['market__card-img']} />
                            <div className={styles['market__card-info']}>
                                <p className={styles['market__card-price']}>{item.price}</p>
                                <p className={styles['market__card-title']}>{item.title}</p>
                                <p className={styles['market__card-location']}>{item.location}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

        </div>
    );
}