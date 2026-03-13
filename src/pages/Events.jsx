import { useState } from 'react';
import styles from '../styles/Events.module.scss';
import {
    MdAddBox, MdLocationOn, MdPeople,
    MdGridView, MdTableRows, MdSettings,
} from 'react-icons/md';
import { EVENT_FILTERS, EVENTS } from '../data/Eventsdata.jsx';

export default function Events() {
    const [activeFilter, setActiveFilter] = useState(1);
    const [viewMode, setViewMode]         = useState('list');

    return (
        <div className={styles['events']}>

            {/* ── Header + Tabs ── */}
            <div className={styles['events__tabs']}>
                <div className={styles['events__tabsHeader']}>
                    <h1 className={styles['events__title']}>Events</h1>
                    <div className={styles['events__headerActions']}>
                        <button className={styles['events__create-btn']}>
                            <MdAddBox size={18} /> Create event
                        </button>
                        <div className={styles['events__view-toggle']}>
                            <button
                                className={`${styles['events__view-btn']} ${viewMode === 'grid' ? styles['events__view-btn--active'] : ''}`}
                                onClick={() => setViewMode('grid')}
                                title="Grid View"
                            >
                                <MdGridView size={20} />
                            </button>
                            <button
                                className={`${styles['events__view-btn']} ${viewMode === 'list' ? styles['events__view-btn--active'] : ''}`}
                                onClick={() => setViewMode('list')}
                                title="Table View"
                            >
                                <MdTableRows size={20} />
                            </button>
                        </div>
                        <button className={styles['events__settingsBtn']}>
                            <MdSettings size={20} />
                        </button>
                    </div>
                </div>

                <div className={styles['events__tabList']}>
                    {EVENT_FILTERS.map((f) => (
                        <button
                            key={f.id}
                            className={`${styles['events__tab']} ${activeFilter === f.id ? styles['events__tab--active'] : ''}`}
                            onClick={() => setActiveFilter(f.id)}
                        >
                            {f.icon}
                            {f.label}
                            {f.badge && (
                                <span className={styles['events__tab-badge']}>{f.badge}</span>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* ── Content Title ── */}
            <h3 className={styles['events__section-title']}>Upcoming Events</h3>

            {/* ── Grid View ── */}
            {viewMode === 'grid' && (
                <div className={styles['events__grid']}>
                    {EVENTS.map((ev) => (
                        <div key={ev.id} className={styles['events__grid-card']}>
                            <img src={ev.img} alt={ev.title} className={styles['events__grid-img']} />
                            <div className={styles['events__grid-body']}>
                                <p className={styles['events__card-date']}>{ev.date}</p>
                                <p className={styles['events__card-title']}>{ev.title}</p>
                                <p className={styles['events__card-location']}><MdLocationOn size={14} /> {ev.location}</p>
                                <p className={styles['events__card-interested']}><MdPeople size={14} /> {ev.interested} interested</p>
                                <div className={styles['events__card-actions']}>
                                    <button className={styles['events__btn-interested']}>Interested</button>
                                    <button className={styles['events__btn-going']}>Going</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* ── Table View ── */}
            {viewMode === 'list' && (
                <div className={styles['events__table-wrap']}>
                    <table className={styles['events__table']}>
                        <thead>
                            <tr>
                                <th>Event</th>
                                <th>Date</th>
                                <th>Location</th>
                                <th>Interested</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {EVENTS.map((ev, index) => (
                                <tr key={ev.id} className={index % 2 === 0 ? styles['events__tr-even'] : styles['events__tr-odd']}>
                                    <td>
                                        <div className={styles['events__table-event']}>
                                            <img src={ev.img} alt={ev.title} className={styles['events__table-img']} />
                                            <span className={styles['events__table-title']}>{ev.title}</span>
                                        </div>
                                    </td>
                                    <td><span className={styles['events__table-date']}>{ev.date}</span></td>
                                    <td>
                                        <div className={styles['events__table-location']}>
                                            <MdLocationOn size={14} /> {ev.location}
                                        </div>
                                    </td>
                                    <td>
                                        <span className={styles['events__table-interested']}>
                                            <MdPeople size={14} /> {ev.interested}
                                        </span>
                                    </td>
                                    <td>
                                        <div className={styles['events__table-actions']}>
                                            <button className={styles['events__btn-interested']}>Interested</button>
                                            <button className={styles['events__btn-going']}>Going</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

        </div>
    );
}