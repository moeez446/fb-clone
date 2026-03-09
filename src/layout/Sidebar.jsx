import { useState } from "react";
import styles from "../styles/Sidebar.module.scss";
import { MdOutlineKeyboardArrowDown, MdOutlineKeyboardArrowUp } from "react-icons/md";
import { menuItemsMain, menuItemsExtra, shortcuts } from "../data/Sidebardata";

const Sidebar = () => {
  const [showMore, setShowMore] = useState(false);

  return (
    <div className={styles.sidebar}>

      {/* Profile */}
      <div className={styles['sidebar__profile']}>
        <div className={styles['sidebar__avatar']} />
        <span className={styles['sidebar__name']}>Your Name</span>
      </div>

      {/* Main Menu Items — hamesha visible */}
      <ul className={styles['sidebar__menu']}>
        {menuItemsMain.map((item, index) => (
          <li key={index} className={styles['sidebar__item']}>
            <span className={styles['sidebar__icon']}>{item.icon}</span>
            <span className={styles['sidebar__label']}>{item.label}</span>
          </li>
        ))}

        {/* Extra items — showMore true hone par */}
        {showMore && menuItemsExtra.map((item, index) => (
          <li key={`extra-${index}`} className={styles['sidebar__item']}>
            <span className={styles['sidebar__icon']}>{item.icon}</span>
            <span className={styles['sidebar__label']}>{item.label}</span>
          </li>
        ))}

        {/* See more / See less button */}
        <li
          className={styles['sidebar__item']}
          onClick={() => setShowMore(!showMore)}
        >
          <span className={styles['sidebar__icon']}>
            {showMore
              ? <MdOutlineKeyboardArrowUp  size={22} />
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
            <div className={styles['sidebar__shortcutAvatar']} />
            <span className={styles['sidebar__label']}>{shortcut.label}</span>
          </div>
        ))}
      </div>

    </div>
  );
};

export default Sidebar;