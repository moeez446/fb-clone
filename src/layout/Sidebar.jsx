import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styles from "../styles/Sidebar.module.scss";
import {
  MdOutlineKeyboardArrowDown,
  MdOutlineKeyboardArrowUp,
  MdChevronLeft,
  MdChevronRight,
  MdEmail,
  MdLogout,
  MdStorefront,
} from "react-icons/md";
import { menuItemsMain, menuItemsExtra, shortcuts } from "../data/Sidebardata";

const Sidebar = () => {
  const [showMore, setShowMore] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleClick = (route) => { if (route) navigate(route); };
  const isActive = (route) => location.pathname === route;

  const handleLogout = () => navigate("/login");

  return (
    <div className={styles["sidebar-wrapper"]}>

      {/* ── Toggle Button ── */}
      <button
        className={`${styles["sidebar__toggle"]} ${collapsed ? styles["sidebar__toggle--collapsed"] : ""}`}
        onClick={() => setCollapsed(!collapsed)}
      >
        {collapsed ? <MdChevronRight size={20} /> : <MdChevronLeft size={20} />}
      </button>

      <div className={`${styles.sidebar} ${collapsed ? styles["sidebar--collapsed"] : ""}`}>

        {/* ── Account Info Block ── */}
        <div className={styles["sidebar__account"]}>
          <div className={styles["sidebar__accountTop"]}>
            <img
              className={styles["sidebar__accountAvatar"]}
              src="https://i.pravatar.cc/40"
              alt="Profile"
            />
            <div className={styles["sidebar__accountInfo"]}>
              <span className={styles["sidebar__accountName"]}>Abdul Moeez</span>
              <span className={styles["sidebar__accountEmail"]}>
                <MdEmail size={13} /> abdulmoeez@gmail.com
              </span>
            </div>
          </div>
        </div>

        <div className={styles["sidebar__divider"]} />

        {/* ── Main Menu ── */}
        <ul className={styles["sidebar__menu"]}>
          {menuItemsMain.map((item, index) => {
            const active = item.route && isActive(item.route);
            return (
              <li
                key={index}
                className={`${styles["sidebar__item"]} ${active ? styles["sidebar__item--active"] : ""}`}
                onClick={() => handleClick(item.route)}
              >
                <span className={`${styles["sidebar__icon"]} ${active ? styles["sidebar__icon--active"] : ""}`}>
                  {item.icon}
                </span>
                <span className={`${styles["sidebar__label"]} ${active ? styles["sidebar__label--active"] : ""}`}>
                  {item.label}
                </span>
              </li>
            );
          })}

          {/* Extra items */}
          {showMore && menuItemsExtra.map((item, index) => (
            <li
              key={`extra-${index}`}
              className={styles["sidebar__item"]}
              onClick={() => handleClick(item.route)}
            >
              <span className={styles["sidebar__icon"]}>{item.icon}</span>
              <span className={styles["sidebar__label"]}>{item.label}</span>
            </li>
          ))}

          {/* See more / See less */}
          <li className={styles["sidebar__item"]} onClick={() => setShowMore(!showMore)}>
            <span className={styles["sidebar__icon"]}>
              {showMore
                ? <MdOutlineKeyboardArrowUp size={22} />
                : <MdOutlineKeyboardArrowDown size={22} />}
            </span>
            <span className={styles["sidebar__label"]}>
              {showMore ? "See less" : "See more"}
            </span>
          </li>
        </ul>

        <div className={styles["sidebar__divider"]} />

        {/* ── Shortcuts ── */}
        <div className={styles["sidebar__shortcuts"]}>
          <h4 className={styles["sidebar__shortcutsTitle"]}>Your Shortcuts</h4>
          {shortcuts.map((shortcut, index) => (
            <div key={index} className={styles["sidebar__shortcutItem"]}>
              <span className={styles["sidebar__shortcutAvatar"]}>{shortcut.icon}</span>
              <span className={styles["sidebar__label"]}>{shortcut.label}</span>
            </div>
          ))}
        </div>

        <div className={styles["sidebar__divider"]} />

        {/* ── Products Button ── */}
        <li
          className={`${styles["sidebar__item"]} ${isActive("/products") ? styles["sidebar__item--active"] : ""}`}
          onClick={() => navigate("/products")}
        >
          <span className={`${styles["sidebar__icon"]} ${isActive("/products") ? styles["sidebar__icon--active"] : ""}`}>
            <MdStorefront size={20} />
          </span>
          <span className={`${styles["sidebar__label"]} ${isActive("/products") ? styles["sidebar__label--active"] : ""}`}>
            Products
          </span>
        </li>

        {/* ── Logout Button ── */}
        <li
          className={`${styles["sidebar__item"]} ${styles["sidebar__item--logout"]}`}
          onClick={handleLogout}
        >
          <span className={`${styles["sidebar__icon"]} ${styles["sidebar__icon--logout"]}`}>
            <MdLogout size={20} />
          </span>
          <span className={`${styles["sidebar__label"]} ${styles["sidebar__label--logout"]}`}>
            Log out
          </span>
        </li>

      </div>
    </div>
  );
};

export default Sidebar;