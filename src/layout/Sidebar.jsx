import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styles from "../styles/Sidebar.module.scss";
import {
  MdOutlineKeyboardArrowDown,
  MdOutlineKeyboardArrowUp,
  MdChevronLeft,
  MdChevronRight,
} from "react-icons/md";
import { menuItemsMain, menuItemsExtra, shortcuts } from "../data/Sidebardata";

const Sidebar = () => {
  const [showMore, setShowMore] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleClick = (route) => { if (route) navigate(route); };
  const isActive = (route) => location.pathname === route;

  return (
    <div className={styles['sidebar-wrapper']}>

      {/* ── Toggle Button (desktop only) ── */}
      <button
        className={`${styles['sidebar__toggle']} ${collapsed ? styles['sidebar__toggle--collapsed'] : ''}`}
        onClick={() => setCollapsed(!collapsed)}
      >
        {collapsed ? <MdChevronRight size={20} /> : <MdChevronLeft size={20} />}
      </button>

      <div className={`${styles.sidebar} ${collapsed ? styles['sidebar--collapsed'] : ''}`}>

        {/* Profile */}
        <div className={styles['sidebar__profile']}>
          <div className={styles['sidebar__avatar']} />
          <span className={styles['sidebar__name']}>Your Name</span>
        </div>

        {/* Main Menu */}
        <ul className={styles['sidebar__menu']}>
          {menuItemsMain.map((item, index) => {
            const active = item.route && isActive(item.route);
            return (
              <li
                key={index}
                className={`${styles['sidebar__item']} ${active ? styles['sidebar__item--active'] : ''}`}
                onClick={() => handleClick(item.route)}
              >
                <span className={`${styles['sidebar__icon']} ${active ? styles['sidebar__icon--active'] : ''}`}>
                  {item.icon}
                </span>
                <span className={`${styles['sidebar__label']} ${active ? styles['sidebar__label--active'] : ''}`}>
                  {item.label}
                </span>
              </li>
            );
          })}

          {/* Extra items */}
          {showMore && menuItemsExtra.map((item, index) => (
            <li
              key={`extra-${index}`}
              className={styles['sidebar__item']}
              onClick={() => handleClick(item.route)}
            >
              <span className={styles['sidebar__icon']}>{item.icon}</span>
              <span className={styles['sidebar__label']}>{item.label}</span>
            </li>
          ))}

          {/* See more / See less */}
          <li className={styles['sidebar__item']} onClick={() => setShowMore(!showMore)}>
            <span className={styles['sidebar__icon']}>
              {showMore
                ? <MdOutlineKeyboardArrowUp size={22} />
                : <MdOutlineKeyboardArrowDown size={22} />
              }
            </span>
            <span className={styles['sidebar__label']}>
              {showMore ? "See less" : "See more"}
            </span>
          </li>
        </ul>

        {/* Divider */}
        <div className={styles['sidebar__divider']} />

        {/* Shortcuts */}
        <div className={styles['sidebar__shortcuts']}>
          <h4 className={styles['sidebar__shortcutsTitle']}>Your Shortcuts</h4>
          {shortcuts.map((shortcut, index) => (
            <div key={index} className={styles['sidebar__shortcutItem']}>
              <span className={styles['sidebar__shortcutAvatar']}>
                {shortcut.icon}
              </span>
              <span className={styles['sidebar__label']}>{shortcut.label}</span>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default Sidebar;