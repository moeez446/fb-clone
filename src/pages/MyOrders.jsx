import { useState } from 'react';
import {
    MdShoppingBag, MdPending, MdLocalShipping, MdCheckCircle,
    MdCancel, MdFilterList, MdKeyboardArrowDown, MdKeyboardArrowUp,
    MdLocationOn, MdPhone, MdEmail, MdPayment, MdWarning,
} from 'react-icons/md';
import { useCart } from '../context/CartContext';
import styles from '../styles/MyOrders.module.scss';

/* ─────────────────────────────────
   CONFIG
───────────────────────────────── */
const STATUS_CONFIG = {
    Pending:   { icon: <MdPending size={13} />,       cls: 'statusPending',   label: 'Pending'   },
    Shipped:   { icon: <MdLocalShipping size={13} />, cls: 'statusShipped',   label: 'Shipped'   },
    Delivered: { icon: <MdCheckCircle size={13} />,   cls: 'statusDelivered', label: 'Delivered' },
    Cancelled: { icon: <MdCancel size={13} />,        cls: 'statusCancelled', label: 'Cancelled' },
};

const STATUS_STEPS = ['Pending', 'Shipped', 'Delivered'];
const FILTERS      = ['All', 'Pending', 'Shipped', 'Delivered', 'Cancelled'];

/* ─────────────────────────────────
   STATUS BADGE
───────────────────────────────── */
const StatusBadge = ({ status }) => {
    const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.Pending;
    return (
        <span className={`${styles.statusBadge} ${styles[cfg.cls]}`}>
            {cfg.icon} {cfg.label}
        </span>
    );
};

/* ─────────────────────────────────
   PROGRESS TRACKER
───────────────────────────────── */
const StatusTracker = ({ status }) => {
    const currentIdx = STATUS_STEPS.indexOf(status);
    return (
        <div className={styles.tracker}>
            {STATUS_STEPS.map((step, i) => {
                const done    = i <= currentIdx;
                const current = i === currentIdx;
                const cfg     = STATUS_CONFIG[step];
                return (
                    <div key={step} className={styles.trackerStep}>
                        {i > 0 && (
                            <div className={`${styles.trackerLine} ${i <= currentIdx ? styles.trackerLineDone : ''}`} />
                        )}
                        <div
                            className={`${styles.trackerDot} ${done ? styles.trackerDotDone : ''} ${current ? styles.trackerDotCurrent : ''}`}
                            style={done ? { background: cfg.color || '#1877f2', borderColor: cfg.color || '#1877f2' } : {}}
                        >
                            {done
                                ? <span style={{ color: '#fff', display: 'flex' }}>{cfg.icon}</span>
                                : <span className={styles.trackerNum}>{i + 1}</span>
                            }
                        </div>
                        <span
                            className={`${styles.trackerLabel} ${done ? styles.trackerLabelDone : ''}`}
                            style={current ? { fontWeight: 700 } : {}}
                        >
                            {step}
                        </span>
                    </div>
                );
            })}
        </div>
    );
};

/* ─────────────────────────────────
   ORDER ROW
───────────────────────────────── */
const OrderRow = ({ order, index, expanded, onToggle }) => (
    <>
        {/* Main Row */}
        <tr
            className={`${index % 2 === 0 ? styles.trEven : styles.trOdd} ${styles.trClickable} ${expanded ? styles.trExpanded : ''}`}
            onClick={onToggle}
        >
            <td className={styles.arrowCell}>
                {expanded
                    ? <MdKeyboardArrowUp size={20} />
                    : <MdKeyboardArrowDown size={20} />
                }
            </td>
            <td><span className={styles.orderId}>{order.id}</span></td>
            <td className={styles.dateCell}>{order.date}</td>
            <td>
                <span className={styles.itemsCount}>
                    {order.items.length} item{order.items.length > 1 ? 's' : ''}
                </span>
            </td>
            <td>
                <span className={styles.totalCell}>Rs {order.total.toLocaleString()}</span>
            </td>
            <td>
                <span className={styles.paymentCell}>
                    {order.payment === 'cod'
                        ? '💵 COD'
                        : order.payment === 'easypaisa'
                        ? '📱 EasyPaisa'
                        : '💳 Card'}
                </span>
            </td>
            <td>
                <StatusBadge status={order.status} />
            </td>
        </tr>

        {/* Expanded Row */}
        {expanded && (
            <tr className={styles.expandedRow}>
                <td colSpan={7} className={styles.expandedCell}>
                    <div className={styles.expandedContent}>

                        {/* LEFT — Delivery Info */}
                        <div className={styles.expandedSection}>
                            <h4 className={styles.expandedTitle}>Delivery Info</h4>
                            <div className={styles.infoList}>
                                <div className={styles.infoItem}>
                                    <MdLocationOn size={16} className={styles.infoIcon} />
                                    <div>
                                        <span className={styles.infoLabel}>Address</span>
                                        <span className={styles.infoValue}>{order.address}</span>
                                    </div>
                                </div>
                                <div className={styles.infoItem}>
                                    <MdPhone size={16} className={styles.infoIcon} />
                                    <div>
                                        <span className={styles.infoLabel}>Phone</span>
                                        <span className={styles.infoValue}>{order.phone}</span>
                                    </div>
                                </div>
                                <div className={styles.infoItem}>
                                    <MdEmail size={16} className={styles.infoIcon} />
                                    <div>
                                        <span className={styles.infoLabel}>Email</span>
                                        <span className={styles.infoValue}>{order.email}</span>
                                    </div>
                                </div>
                                <div className={styles.infoItem}>
                                    <MdPayment size={16} className={styles.infoIcon} />
                                    <div>
                                        <span className={styles.infoLabel}>Payment</span>
                                        <span className={styles.infoValue} style={{ textTransform: 'capitalize' }}>
                                            {order.payment === 'cod'
                                                ? '💵 Cash on Delivery'
                                                : order.payment === 'easypaisa'
                                                ? '📱 EasyPaisa'
                                                : '💳 Card'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Status Tracker or Cancelled banner */}
                            {order.status !== 'Cancelled' ? (
                                <StatusTracker status={order.status} />
                            ) : (
                                <div className={styles.cancelledBanner}>
                                    <MdWarning size={18} />
                                    <div>
                                        <span className={styles.cancelledBannerTitle}>Order Cancelled</span>
                                        {order.cancelReason && (
                                            <span className={styles.cancelledBannerReason}>Reason: {order.cancelReason}</span>
                                        )}
                                        {order.cancelledAt && (
                                            <span className={styles.cancelledBannerDate}>on {order.cancelledAt}</span>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* RIGHT — Order Items */}
                        <div className={styles.expandedSection}>
                            <h4 className={styles.expandedTitle}>Order Items</h4>
                            <div className={styles.itemsList}>
                                {order.items.map((item, idx) => (
                                    <div key={idx} className={styles.expandedItem}>
                                        <img src={item.image} alt={item.name} className={styles.expandedItemImg} />
                                        <div className={styles.expandedItemInfo}>
                                            <p className={styles.expandedItemName}>{item.name}</p>
                                            <p className={styles.expandedItemCat}>{item.category}</p>
                                            <p className={styles.expandedItemPrice}>
                                                Rs {item.price.toLocaleString()} × {item.qty}
                                            </p>
                                        </div>
                                        <span className={styles.expandedItemTotal}>
                                            Rs {(item.price * item.qty).toLocaleString()}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            {/* Grand Total */}
                            <div className={styles.expandedTotal}>
                                <span>Grand Total</span>
                                <span className={styles.expandedTotalAmt}>
                                    Rs {order.total.toLocaleString()}
                                </span>
                            </div>
                        </div>

                    </div>
                </td>
            </tr>
        )}
    </>
);

/* ─────────────────────────────────
   MY ORDERS PAGE
───────────────────────────────── */
const MyOrders = () => {
    const { orders } = useCart();
    const [filter, setFilter]         = useState('All');
    const [expandedId, setExpandedId] = useState(null);

    const filtered = filter === 'All'
        ? orders
        : orders.filter(o => o.status === filter);

    const toggle = (id) => setExpandedId(prev => prev === id ? null : id);

    return (
        <div className={styles.page}>

            {/* Header */}
            <div className={styles.header}>
                <div className={styles.headerLeft}>
                    <MdShoppingBag size={26} className={styles.headerIcon} />
                    <h1 className={styles.title}>My Orders</h1>
                </div>
                <span className={styles.orderCount}>
                    {orders.length} order{orders.length !== 1 ? 's' : ''}
                </span>
            </div>

            {/* Filter Row */}
            <div className={styles.filterRow}>
                <MdFilterList size={18} className={styles.filterIcon} />
                {FILTERS.map(f => (
                    <button
                        key={f}
                        className={`${styles.filterBtn} ${filter === f ? styles.filterBtnActive : ''} ${f !== 'All' ? styles[`filter_${f}`] : ''}`}
                        onClick={() => { setFilter(f); setExpandedId(null); }}
                    >
                        {f !== 'All' && STATUS_CONFIG[f]?.icon}
                        {f}
                        <span className={styles.filterCount}>
                            {f === 'All' ? orders.length : orders.filter(o => o.status === f).length}
                        </span>
                    </button>
                ))}
            </div>

            {/* Empty state */}
            {orders.length === 0 ? (
                <div className={styles.empty}>
                    <MdShoppingBag size={56} className={styles.emptyIcon} />
                    <p className={styles.emptyTitle}>No orders yet</p>
                    <p className={styles.emptySub}>Your orders will appear here after checkout.</p>
                </div>
            ) : filtered.length === 0 ? (
                <div className={styles.empty}>
                    <MdFilterList size={48} className={styles.emptyIcon} />
                    <p className={styles.emptyTitle}>No {filter} orders</p>
                    <p className={styles.emptySub}>Try selecting a different filter.</p>
                </div>
            ) : (
                /* Table */
                <div className={styles.tableWrap}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th style={{ width: '3rem' }}></th>
                                <th>Order ID</th>
                                <th>Date</th>
                                <th>Items</th>
                                <th>Total</th>
                                <th>Payment</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((order, i) => (
                                <OrderRow
                                    key={order.id}
                                    order={order}
                                    index={i}
                                    expanded={expandedId === order.id}
                                    onToggle={() => toggle(order.id)}
                                />
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

        </div>
    );
};

export default MyOrders;