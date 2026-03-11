import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/Events.module.scss';
import {
  MdAddBox, MdLocationOn, MdPeople,
  MdGridView,MdTableRows, MdChevronLeft, MdChevronRight,
  MdSettings, MdHome,
} from 'react-icons/md';
import { EVENT_FILTERS, EVENTS } from '../data/Eventsdata.jsx';


export default function Events() {
  const [activeFilter, setActiveFilter] = useState(1);
  const [viewMode, setViewMode] = useState('list');
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

  const s = styles;

  return (
    <div className={s.events}>

      {/* ── Left Panel ── */}
      <div className={`${s.events__panel} ${collapsed ? s['events__panel--collapsed'] : ''}`}>

        <div className={s['events__panel-top']}>
          <h2 className={s['events__panel-title']}>Events</h2>
          <button className={s['events__panel-icon-btn']}>
            <MdSettings size={20} />
          </button>
        </div>

        <nav className={s['events__nav']}>
          {EVENT_FILTERS.map((f) => (
            <div
              key={f.id}
              className={`${s['events__nav-item']} ${activeFilter === f.id ? s['events__nav-item--active'] : ''}`}
              onClick={() => setActiveFilter(f.id)}
              title={f.label}
            >
              <span className={s['events__nav-icon']}>{f.icon}</span>
              <span className={s['events__nav-label']}>{f.label}</span>
              {f.badge && <span className={s['events__nav-badge']}>{f.badge}</span>}
              {f.hasArrow && !f.badge && <span className={s['events__nav-arrow']}>›</span>}
            </div>
          ))}
        </nav>

        {/* ── Back to Home — divider + separate btn like Friends ── */}
        <div className={s['events__nav-divider']} />
        <div
          className={s['events__home-btn']}
          onClick={() => navigate('/')}
          title="Back to Home"
        >
          <span className={s['events__nav-icon']}><MdHome size={20} /></span>
          <span className={s['events__home-label']}>Back to Home</span>
        </div>
      </div>

      {/* ── Toggle Button ── */}
      <button
        className={`${s['events__toggle']} ${collapsed ? s['events__toggle--collapsed'] : ''}`}
        onClick={() => setCollapsed(!collapsed)}
        title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {collapsed ? <MdChevronRight size={22} /> : <MdChevronLeft size={22} />}
      </button>

      {/* ── Right Content ── */}
      <div className={s['events__content']}>

        <div className={s['events__content-top']}>
          <h3 className={s['events__section-title']}>Upcoming Events</h3>
          <div className={s['events__content-actions']}>
            <button className={s['events__create-btn']}>
              <MdAddBox size={18} /> Create event
            </button>
            <div className={s['events__view-toggle']}>
              <button
                className={`${s['events__view-btn']} ${viewMode === 'grid' ? s['events__view-btn--active'] : ''}`}
                onClick={() => setViewMode('grid')}
                title="Grid View"
              >
                <MdGridView size={20} />
              </button>
              <button
                className={`${s['events__view-btn']} ${viewMode === 'list' ? s['events__view-btn--active'] : ''}`}
                onClick={() => setViewMode('list')}
                title="Table View"
              >
                <MdTableRows size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* ── Grid View ── */}
        {viewMode === 'grid' && (
          <div className={`${s['events__grid']} ${collapsed ? s['events__grid--wide'] : ''}`}>
            {EVENTS.map((ev) => (
              <div key={ev.id} className={s['events__grid-card']}>
                <img src={ev.img} alt={ev.title} className={s['events__grid-img']} />
                <div className={s['events__grid-body']}>
                  <p className={s['events__card-date']}>{ev.date}</p>
                  <p className={s['events__card-title']}>{ev.title}</p>
                  <p className={s['events__card-location']}><MdLocationOn size={14} /> {ev.location}</p>
                  <p className={s['events__card-interested']}><MdPeople size={14} /> {ev.interested} interested</p>
                  <div className={s['events__card-actions']}>
                    <button className={s['events__btn-interested']}>Interested</button>
                    <button className={s['events__btn-going']}>Going</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── Table View ── */}
        {viewMode === 'list' && (
          <div className={s['events__table-wrap']}>
            <table className={s['events__table']}>
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
                  <tr
                    key={ev.id}
                    className={index % 2 === 0 ? s['events__tr-even'] : s['events__tr-odd']}
                  >
                    <td>
                      <div className={s['events__table-event']}>
                        <img src={ev.img} alt={ev.title} className={s['events__table-img']} />
                        <span className={s['events__table-title']}>{ev.title}</span>
                      </div>
                    </td>
                    <td><span className={s['events__table-date']}>{ev.date}</span></td>
                    <td>
                      <div className={s['events__table-location']}>
                        <MdLocationOn size={14} /> {ev.location}
                      </div>
                    </td>
                    <td>
                      <span className={s['events__table-interested']}>
                        <MdPeople size={14} /> {ev.interested}
                      </span>
                    </td>
                    <td>
                      <div className={s['events__table-actions']}>
                        <button className={s['events__btn-interested']}>Interested</button>
                        <button className={s['events__btn-going']}>Going</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>
    </div>
  );
}