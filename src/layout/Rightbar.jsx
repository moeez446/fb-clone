import styles from "../styles/Rightbar.module.scss";
import { MdSearch, MdVideocam, MdMoreHoriz } from "react-icons/md";
import { CONTACTS, SPONSORED } from "../data/Rightbar";

export default function RightBar() {
  return (
    <div className={styles['rightbar']}>

      {/* ── Sponsored ── */}
      <p className={styles['rightbar__heading']}>Sponsored</p>
      <div className={styles['rightbar__sponsored']}>
        {SPONSORED.map((ad) => (
          <div key={ad.id} className={styles['rightbar__ad']}>
            <img src={ad.image} alt={ad.brand} className={styles['rightbar__ad-img']} />
            <div className={styles['rightbar__ad-body']}>
              <p className={styles['rightbar__ad-brand']}>{ad.brand}</p>
              <p className={styles['rightbar__ad-tagline']}>{ad.tagline}</p>
              <p className={styles['rightbar__ad-desc']}>{ad.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Divider ── */}
      <hr className={styles['rightbar__divider']} />

      {/* ── Contacts ── */}
      <div className={styles['rightbar__contacts-top']}>
        <p className={styles['rightbar__heading']}>Contacts</p>
        <div className={styles['rightbar__contacts-icons']}>
          <button className={styles['rightbar__icon-btn']}><MdVideocam  size={16} /></button>
          <button className={styles['rightbar__icon-btn']}><MdSearch    size={16} /></button>
          <button className={styles['rightbar__icon-btn']}><MdMoreHoriz size={16} /></button>
        </div>
      </div>

      <ul className={styles['rightbar__contact-list']}>
        {CONTACTS.map((c) => (
          <li key={c.id} className={styles['rightbar__contact-item']}>
            <div className={styles['rightbar__contact-img-wrap']}>
              <img src={c.avatar} alt={c.name} className={styles['rightbar__contact-img']} />
              {c.online && <span className={styles['rightbar__dot']} />}
            </div>
            <span className={styles['rightbar__contact-name']}>{c.name}</span>
          </li>
        ))}
      </ul>

    </div>
  );
}