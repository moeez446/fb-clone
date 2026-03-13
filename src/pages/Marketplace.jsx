import { useState } from 'react';
import styles from '../styles/Marketplace.module.scss';
import { MdAddBox, MdSettings } from 'react-icons/md';
import { LISTINGS, NAV_ITEMS } from '../data/Marketplacedata';

export default function Marketplace() {
    const [activeNav, setActiveNav] = useState(0);

    return (
        <div className={styles['market']}>

            {/* ── Header + Tabs ── */}
            <div className={styles['market__tabs']}>
                <div className={styles['market__tabsHeader']}>
                    <h1 className={styles['market__title']}>Marketplace</h1>
                    <div className={styles['market__headerActions']}>
                        <button className={styles['market__create-btn']}>
                            <MdAddBox size={18} /> Create Listing
                        </button>
                        <button className={styles['market__settingsBtn']}>
                            <MdSettings size={20} />
                        </button>
                    </div>
                </div>
                <div className={styles['market__tabList']}>
                    {NAV_ITEMS.map((item, i) => (
                        <button
                            key={i}
                            className={`${styles['market__tab']} ${activeNav === i ? styles['market__tab--active'] : ''}`}
                            onClick={() => setActiveNav(i)}
                        >
                            {item.icon}
                            {item.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* ── Grid ── */}
            <h3 className={styles['market__section-title']}>Today's Picks</h3>
            <div className={styles['market__grid']}>
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
    );
}