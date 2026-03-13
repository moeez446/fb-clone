import { useState } from 'react';
import styles from '../styles/Saved.module.scss';
import { MdBookmark, MdMoreHoriz } from 'react-icons/md';
import { SAVED_CATEGORIES, SAVED_ITEMS } from '../data/SavedData';

export default function Saved() {
    const [activeCategory, setActiveCategory] = useState(1);

    const filtered = activeCategory === 1
        ? SAVED_ITEMS
        : SAVED_ITEMS.filter(item => item.categoryId === activeCategory);

    return (
        <div className={styles['saved']}>

            {/* ── Category Tabs ── */}
            <div className={styles['saved__tabs']}>
                <h1 className={styles['saved__title']}>Saved</h1>
                <div className={styles['saved__tabList']}>
                    {SAVED_CATEGORIES.map((cat) => (
                        <button
                            key={cat.id}
                            className={`${styles['saved__tab']} ${activeCategory === cat.id ? styles['saved__tab--active'] : ''}`}
                            onClick={() => setActiveCategory(cat.id)}
                        >
                            <MdBookmark size={16} />
                            {cat.label}
                            <span className={styles['saved__tab-count']}>{cat.count}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* ── Grid ── */}
            <div className={styles['saved__grid']}>
                {filtered.map((item) => (
                    <div key={item.id} className={styles['saved__card']}>
                        <img
                            src={item.img}
                            alt={item.title}
                            className={styles['saved__card-img']}
                        />
                        <div className={styles['saved__card-body']}>
                            <span className={styles['saved__card-type']}>{item.type}</span>
                            <p className={styles['saved__card-title']}>{item.title}</p>
                            <p className={styles['saved__card-page']}>{item.page}</p>
                            <p className={styles['saved__card-time']}>{item.time}</p>
                        </div>
                        <button className={styles['saved__card-more']}>
                            <MdMoreHoriz size={20} />
                        </button>
                    </div>
                ))}
            </div>

        </div>
    );
}