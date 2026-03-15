import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
    MdDashboard, MdShoppingBag, MdInventory2,
    MdEdit, MdDelete, MdAdd, MdClose, MdSave,
    MdCheckCircle, MdPending, MdLocalShipping,
    MdKeyboardArrowDown, MdKeyboardArrowUp,
    MdFilterList, MdCancel, MdWarning,
    MdChevronLeft, MdChevronRight,
    MdAttachMoney, MdTrendingUp, MdStorefront,
    MdPhoto, MdLink, MdStar, MdCategory,
    MdBusiness, MdLabel, MdFormatListBulleted,
    MdDescription, MdInventory,
} from 'react-icons/md';
import { useCart } from '../context/CartContext';
import { useProducts } from '../context/ProductContext';
import { CATEGORIES } from '../data/Productsdata';
import styles from '../styles/Dashboard.module.scss';

/* ─────────────────────────────────
   CONFIG
───────────────────────────────── */
const STATUS_CONFIG = {
    Pending:   { icon: <MdPending size={13} />,       cls: 'statusPending',   label: 'Pending'   },
    Shipped:   { icon: <MdLocalShipping size={13} />, cls: 'statusShipped',   label: 'Shipped'   },
    Delivered: { icon: <MdCheckCircle size={13} />,   cls: 'statusDelivered', label: 'Delivered' },
    Cancelled: { icon: <MdCancel size={13} />,        cls: 'statusCancelled', label: 'Cancelled' },
};

const CANCEL_REASONS = [
    'Customer requested cancellation',
    'Item out of stock',
    'Payment issue',
    'Duplicate order',
    'Delivery not possible',
    'Other',
];

const ORDER_FILTERS = ['All', 'Pending', 'Shipped', 'Delivered', 'Cancelled'];
const PAGE_SIZE = 10;

/* ─────────────────────────────────
   HELPERS
───────────────────────────────── */
const StatusBadge = ({ status }) => {
    const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.Pending;
    return (
        <span className={`${styles.statusBadge} ${styles[cfg.cls]}`}>
            {cfg.icon} {cfg.label}
        </span>
    );
};

const Empty = ({ icon, text }) => (
    <div className={styles.empty}>
        <span className={styles.emptyIcon}>{icon}</span>
        <p>{text}</p>
    </div>
);

/* ─────────────────────────────────
   PAGINATION  — sliding window
   Always: [sliding 3] … [last 3]
   page 1  → ← 1 2 3 … 30 31 32 →
   page 2  → ← 2 3 4 … 30 31 32 →
   page 15 → ← 15 16 17 … 30 31 32 →
   page 30 → ← 29 30 31 32 →  (merged)
───────────────────────────────── */
const buildPageItems = (current, total) => {
    if (total <= 6) {
        return Array.from({ length: total }, (_, i) => ({ type: 'page', page: i + 1 }));
    }

    // Left sliding window — starts at current, clamped away from anchor
    const winStart    = Math.min(current, total - 5);
    const winEnd      = winStart + 2;
    const anchorStart = total - 2;
    const anchorEnd   = total;

    const items = [];

    // Sliding group (3 pages)
    for (let p = winStart; p <= winEnd; p++) {
        items.push({ type: 'page', page: p });
    }

    // Static dots separator — only when there is a real gap
    if (anchorStart > winEnd + 1) {
        items.push({ type: 'dots', key: 'dM' });
    }

    // Fixed last-3 (skip pages already shown in sliding window)
    for (let p = anchorStart; p <= anchorEnd; p++) {
        if (p > winEnd) {
            items.push({ type: 'page', page: p });
        }
    }

    return items;
};

const Pagination = ({ total, page, onPage }) => {
    const totalPages = Math.ceil(total / PAGE_SIZE);
    if (totalPages <= 1) return null;

    const items = buildPageItems(page, totalPages);

    return (
        <div className={styles.pagination}>
            <button
                className={styles.pageBtn}
                onClick={() => onPage(page - 1)}
                disabled={page === 1}
            >
                <MdChevronLeft size={20} />
            </button>

            {items.map((item, idx) =>
                item.type === 'dots' ? (
                    <span key={item.key} className={styles.pageDots}>…</span>
                ) : (
                    <button
                        key={item.page}
                        className={`${styles.pageNum} ${item.page === page ? styles.pageNumActive : ''}`}
                        onClick={() => onPage(item.page)}
                    >
                        {item.page}
                    </button>
                )
            )}

            <button
                className={styles.pageBtn}
                onClick={() => onPage(page + 1)}
                disabled={page === totalPages}
            >
                <MdChevronRight size={20} />
            </button>

            <span className={styles.pageInfo}>
                {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, total)} of {total}
            </span>
        </div>
    );
};

/* ─────────────────────────────────
   DASHBOARD STATS
───────────────────────────────── */
const DashboardStats = ({ orders, products }) => {
    const counts = {
        Pending:   orders.filter(o => o.status === 'Pending').length,
        Shipped:   orders.filter(o => o.status === 'Shipped').length,
        Delivered: orders.filter(o => o.status === 'Delivered').length,
        Cancelled: orders.filter(o => o.status === 'Cancelled').length,
    };
    const revenue = orders.filter(o => o.status !== 'Cancelled').reduce((s, o) => s + o.total, 0);

    const cards = [
        { label: 'Total Orders',   value: orders.length,                   icon: <MdShoppingBag size={22} />,   cls: styles.scTotal     },
        { label: 'Revenue',        value: `Rs ${revenue.toLocaleString()}`, icon: <MdTrendingUp size={22} />,    cls: styles.scRevenue   },
        { label: 'Total Products', value: products.length,                  icon: <MdInventory2 size={22} />,    cls: styles.scProducts  },
        { label: 'Pending',        value: counts.Pending,                   icon: <MdPending size={22} />,       cls: styles.scPending   },
        { label: 'Shipped',        value: counts.Shipped,                   icon: <MdLocalShipping size={22} />, cls: styles.scShipped   },
        { label: 'Delivered',      value: counts.Delivered,                 icon: <MdCheckCircle size={22} />,   cls: styles.scDelivered },
        { label: 'Cancelled',      value: counts.Cancelled,                 icon: <MdCancel size={22} />,        cls: styles.scCancelled },
    ];

    return (
        <div className={styles.statsGrid}>
            {cards.map(card => (
                <div key={card.label} className={`${styles.statCard} ${card.cls}`}>
                    <div className={styles.statIconWrap}>{card.icon}</div>
                    <div className={styles.statInfo}>
                        <span className={styles.statValue}>{card.value}</span>
                        <span className={styles.statLabel}>{card.label}</span>
                    </div>
                </div>
            ))}
        </div>
    );
};

/* ─────────────────────────────────
   CANCEL MODAL
───────────────────────────────── */
const CancelModal = ({ order, onConfirm, onClose }) => {
    const [reason, setReason] = useState(CANCEL_REASONS[0]);
    const [custom, setCustom] = useState('');
    const handleConfirm = () => {
        onConfirm(order.id, reason === 'Other' ? (custom || 'Other') : reason);
        onClose();
    };
    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.cancelModal} onClick={e => e.stopPropagation()}>
                <div className={styles.cancelModalIcon}><MdCancel size={40} /></div>
                <h3 className={styles.cancelModalTitle}>Cancel Order?</h3>
                <p className={styles.cancelModalSub}>Order <strong>{order.id}</strong></p>
                <div className={styles.fieldGroup} style={{ width: '100%', textAlign: 'left' }}>
                    <label>Select Reason</label>
                    <select value={reason} onChange={e => setReason(e.target.value)}>
                        {CANCEL_REASONS.map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                </div>
                {reason === 'Other' && (
                    <div className={styles.fieldGroup} style={{ width: '100%', textAlign: 'left' }}>
                        <label>Describe reason</label>
                        <input placeholder="Enter custom reason..." value={custom} onChange={e => setCustom(e.target.value)} />
                    </div>
                )}
                <div className={styles.cancelModalActions}>
                    <button className={styles.cancelBtn} onClick={onClose}>Keep Order</button>
                    <button className={styles.confirmCancelBtn} onClick={handleConfirm}>
                        <MdCancel size={16} /> Confirm Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

/* ─────────────────────────────────
   ORDERS TAB
───────────────────────────────── */
const OrdersTab = ({ orders }) => {
    const { updateOrderStatus, cancelOrder, deleteOrder } = useCart();
    const [searchParams, setSearchParams] = useSearchParams();
    const [expandedId, setExpandedId]     = useState(null);
    const [cancelTarget, setCancelTarget] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);

    const filter  = searchParams.get('filter') || 'All';
    const page    = parseInt(searchParams.get('opage') || '1', 10);

    const setFilter = (f) => setSearchParams(p => {
        p.set('tab', 'orders');
        if (f === 'All') p.delete('filter'); else p.set('filter', f);
        p.set('opage', '1');
        return p;
    });
    const setPage = (n) => setSearchParams(p => { p.set('opage', String(n)); return p; });

    const filtered  = filter === 'All' ? orders : orders.filter(o => o.status === filter);
    const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
    const toggle    = id => setExpandedId(prev => prev === id ? null : id);

    if (orders.length === 0)
        return <Empty icon={<MdShoppingBag size={48} />} text="No orders yet. Complete a checkout to see orders here." />;

    return (
        <div>
            <div className={styles.filterRow}>
                <MdFilterList size={18} className={styles.filterIcon} />
                {ORDER_FILTERS.map(f => (
                    <button
                        key={f}
                        className={`${styles.filterBtn} ${filter === f ? styles.filterBtnActive : ''} ${f !== 'All' ? styles[`filter_${f}`] : ''}`}
                        onClick={() => setFilter(f)}
                    >
                        {f !== 'All' && STATUS_CONFIG[f]?.icon}
                        {f}
                        <span className={styles.filterCount}>
                            {f === 'All' ? orders.length : orders.filter(o => o.status === f).length}
                        </span>
                    </button>
                ))}
            </div>

            {filtered.length === 0 ? (
                <Empty icon={<MdFilterList size={40} />} text={`No ${filter} orders.`} />
            ) : (
                <>
                    <div className={styles.tableWrap}>
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th style={{ width: '3rem' }}></th>
                                    <th>Order ID</th><th>Customer</th><th>Date</th>
                                    <th>Items</th><th>Total</th><th>Payment</th>
                                    <th>Status</th><th>Update</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginated.map((order, i) => (
                                    <OrderRow
                                        key={order.id}
                                        order={order}
                                        index={i}
                                        expanded={expandedId === order.id}
                                        onToggle={() => toggle(order.id)}
                                        onStatusChange={s => updateOrderStatus(order.id, s)}
                                        onCancel={() => setCancelTarget(order)}
                                        onDelete={() => setDeleteTarget(order)}
                                    />
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <Pagination total={filtered.length} page={page} onPage={setPage} />
                </>
            )}

            {cancelTarget && (
                <CancelModal order={cancelTarget} onConfirm={cancelOrder} onClose={() => setCancelTarget(null)} />
            )}

            {deleteTarget && (
                <div className={styles.overlay} onClick={() => setDeleteTarget(null)}>
                    <div className={styles.confirmModal} onClick={e => e.stopPropagation()}>
                        <MdDelete size={40} className={styles.confirmIcon} />
                        <h3>Delete Order?</h3>
                        <p>Order <strong style={{ color: '#1877f2', fontFamily: 'monospace' }}>{deleteTarget.id}</strong> will be permanently removed.</p>
                        <div className={styles.confirmActions}>
                            <button className={styles.cancelBtn} onClick={() => setDeleteTarget(null)}>Keep It</button>
                            <button className={styles.confirmDeleteBtn} onClick={() => { deleteOrder(deleteTarget.id); setDeleteTarget(null); }}>
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

/* ─────────────────────────────────
   ORDER ROW
───────────────────────────────── */
const OrderRow = ({ order, index, expanded, onToggle, onStatusChange, onCancel, onDelete }) => (
    <>
        <tr
            className={`${index % 2 === 0 ? styles.trEven : styles.trOdd} ${styles.trClickable} ${expanded ? styles.trExpanded : ''}`}
            onClick={onToggle}
        >
            <td className={styles.arrowCell}>
                {expanded ? <MdKeyboardArrowUp size={20} /> : <MdKeyboardArrowDown size={20} />}
            </td>
            <td><span className={styles.orderId}>{order.id}</span></td>
            <td>
                <p className={styles.customerName}>{order.customer}</p>
                <p className={styles.customerEmail}>{order.email}</p>
            </td>
            <td className={styles.dateCell}>{order.date}</td>
            <td><span className={styles.itemsCount}>{order.items.length} item{order.items.length > 1 ? 's' : ''}</span></td>
            <td><span className={styles.totalCell}>Rs {order.total.toLocaleString()}</span></td>
            <td>
                <span className={styles.paymentCell}>
                    {order.payment === 'cod' ? '💵 COD' : order.payment === 'easypaisa' ? '📱 EasyPaisa' : '💳 Card'}
                </span>
            </td>
            <td onClick={e => e.stopPropagation()}><StatusBadge status={order.status} /></td>
            <td onClick={e => e.stopPropagation()}>
                <div className={styles.statusBtns}>
                    {order.status !== 'Cancelled' ? (
                        <>
                            {['Pending', 'Shipped', 'Delivered'].map(s => (
                                <button key={s}
                                    className={`${styles.statusUpdateBtn} ${order.status === s ? styles[`statusUpdateBtn_${s}`] : ''}`}
                                    onClick={() => onStatusChange(s)} title={s}>
                                    {STATUS_CONFIG[s].icon}
                                </button>
                            ))}
                            <button className={`${styles.statusUpdateBtn} ${styles.cancelOrderBtn}`} onClick={onCancel} title="Cancel Order">
                                <MdCancel size={13} />
                            </button>
                        </>
                    ) : (
                        <button
                            className={styles.deleteOrderBtn}
                            onClick={e => { e.stopPropagation(); onDelete(); }}
                            title="Delete Order"
                        >
                            <MdDelete size={14} /> Delete
                        </button>
                    )}
                </div>
            </td>
        </tr>

        {expanded && (
            <tr className={styles.expandedRow}>
                <td colSpan={9} className={styles.expandedCell}>
                    <div className={styles.expandedContent}>
                        <div className={styles.expandedSection}>
                            <h4 className={styles.expandedTitle}>Customer Info</h4>
                            <div className={styles.infoGrid}>
                                <div className={styles.infoItem}>
                                    <span className={styles.infoLabel}>Phone</span>
                                    <span className={styles.infoValue}>{order.phone}</span>
                                </div>
                                <div className={styles.infoItem}>
                                    <span className={styles.infoLabel}>Email</span>
                                    <span className={styles.infoValue}>{order.email}</span>
                                </div>
                                <div className={`${styles.infoItem} ${styles.infoFull}`}>
                                    <span className={styles.infoLabel}>Address</span>
                                    <span className={styles.infoValue}>{order.address}</span>
                                </div>
                            </div>
                        </div>
                        <div className={styles.expandedSection}>
                            <h4 className={styles.expandedTitle}>Order Items</h4>
                            <div className={styles.itemsList}>
                                {order.items.map((item, idx) => (
                                    <div key={idx} className={styles.expandedItem}>
                                        <img src={item.image} alt={item.name} className={styles.expandedItemImg} />
                                        <div className={styles.expandedItemInfo}>
                                            <p className={styles.expandedItemName}>{item.name}</p>
                                            <p className={styles.expandedItemCat}>{item.category}</p>
                                        </div>
                                        <div className={styles.expandedItemRight}>
                                            <span className={styles.expandedItemQty}>× {item.qty}</span>
                                            <span className={styles.expandedItemPrice}>Rs {(item.price * item.qty).toLocaleString()}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            {order.status === 'Cancelled' && (
                                <div className={styles.cancelReasonBox}>
                                    <MdWarning size={16} />
                                    <div>
                                        <span className={styles.cancelReasonLabel}>Cancellation Reason</span>
                                        <span className={styles.cancelReasonText}>{order.cancelReason}</span>
                                        {order.cancelledAt && <span className={styles.cancelledAt}>Cancelled on: {order.cancelledAt}</span>}
                                    </div>
                                </div>
                            )}
                            <div className={styles.expandedTotal}>
                                <span>Grand Total</span>
                                <span className={styles.expandedTotalAmt}>Rs {order.total.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>
                </td>
            </tr>
        )}
    </>
);

/* ─────────────────────────────────
   PRODUCT MODAL
───────────────────────────────── */
const REQUIRED_FIELDS = [
    { key: 'name',        label: 'Product Name',   section: 'basic'   },
    { key: 'price',       label: 'Price',          section: 'basic'   },
    { key: 'brand',       label: 'Brand',          section: 'basic'   },
    { key: 'image',       label: 'Main Image URL', section: 'media'   },
    { key: 'description', label: 'Description',    section: 'details' },
    { key: 'stock',       label: 'Stock Quantity', section: 'stock'   },
];

const ProductModal = ({ product, onSave, onClose }) => {
    const isEdit = Boolean(product);
    const [activeSection, setActiveSection] = useState('basic');
    const [errors, setErrors]               = useState({});
    const [showBanner, setShowBanner]       = useState(false);

    const [form, setForm] = useState({
        name:        product?.name        || '',
        price:       product?.price       || '',
        category:    product?.category    || CATEGORIES[1],
        brand:       product?.brand       || '',
        image:       product?.image       || '',
        images:      product?.images?.join('\n') || '',
        badge:       product?.badge       || '',
        rating:      product?.rating      || '4.0',
        reviews:     product?.reviews     || '0',
        stock:       product?.stock       || '0',
        description: product?.description || '',
        highlights:  product?.highlights?.join('\n') || '',
    });

    const handle = e => {
        const { name, value } = e.target;
        setForm(f => ({ ...f, [name]: value }));
        if (errors[name]) setErrors(prev => { const n = { ...prev }; delete n[name]; return n; });
    };

    const validate = () => {
        const newErrors = {};
        REQUIRED_FIELDS.forEach(({ key, label }) => {
            const val = String(form[key] ?? '').trim();
            if (!val || val === '0') newErrors[key] = `${label} is required`;
        });
        if (form.price && Number(form.price) <= 0) newErrors.price = 'Price must be greater than 0';
        return newErrors;
    };

    const handleSubmit = e => {
        e.preventDefault();
        const newErrors = validate();
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            setShowBanner(true);
            const firstErrSection = REQUIRED_FIELDS.find(f => newErrors[f.key])?.section;
            if (firstErrSection) setActiveSection(firstErrSection);
            return;
        }
        onSave({
            ...form,
            images:     form.images     ? form.images.split('\n').map(s => s.trim()).filter(Boolean) : [form.image],
            highlights: form.highlights ? form.highlights.split('\n').map(s => s.trim()).filter(Boolean) : [],
            stock:      parseInt(form.stock) || 0,
        });
        onClose();
    };

    const SECTIONS = [
        { id: 'basic',   label: 'Basic',   icon: <MdStorefront size={15} />, hasError: ['name','price','brand'].some(k => errors[k])        },
        { id: 'media',   label: 'Media',   icon: <MdPhoto size={15} />,      hasError: ['image'].some(k => errors[k])                        },
        { id: 'details', label: 'Details', icon: <MdDescription size={15} />,hasError: ['description'].some(k => errors[k])                  },
        { id: 'stock',   label: 'Stock',   icon: <MdInventory size={15} />,  hasError: ['stock'].some(k => errors[k])                        },
    ];
    const currentIdx = SECTIONS.findIndex(s => s.id === activeSection);

    return (
        <div className={styles.overlay}>
            <div className={styles.productModalNew}>

                <div className={styles.productModalHeader}>
                    <div className={styles.productModalHeaderLeft}>
                        <div className={styles.productModalHeaderIcon}>
                            {isEdit ? <MdEdit size={20} /> : <MdAdd size={20} />}
                        </div>
                        <div>
                            <h3 className={styles.productModalTitle}>{isEdit ? 'Edit Product' : 'Add New Product'}</h3>
                            <p className={styles.productModalSubtitle}>{isEdit ? 'Update product details' : 'Fill in details to list a new product'}</p>
                        </div>
                    </div>
                    <button type="button" className={styles.modalClose} onClick={onClose}><MdClose size={22} /></button>
                </div>

                <div className={styles.sectionNav}>
                    {SECTIONS.map((s, idx) => (
                        <button key={s.id} type="button"
                            className={`${styles.sectionNavBtn} ${activeSection === s.id ? styles.sectionNavBtnActive : ''} ${s.hasError ? styles.sectionNavBtnError : ''}`}
                            onClick={() => setActiveSection(s.id)}>
                            <span className={`${styles.sectionNavStep} ${activeSection === s.id ? styles.sectionNavStepActive : ''} ${s.hasError ? styles.sectionNavStepError : ''}`}>
                                {s.hasError ? '!' : idx + 1}
                            </span>
                            {s.icon} {s.label}
                            {s.hasError && <span className={styles.sectionNavErrDot} />}
                        </button>
                    ))}
                </div>

                <form onSubmit={handleSubmit} className={styles.productModalForm}>
                    <div className={styles.productModalBody}>

                        {showBanner && Object.keys(errors).length > 0 && (
                            <div className={styles.errorBanner}>
                                <MdWarning size={18} />
                                <div>
                                    <strong>Please fix the following before saving:</strong>
                                    <ul className={styles.errorList}>
                                        {REQUIRED_FIELDS.filter(f => errors[f.key]).map(f => (
                                            <li key={f.key}>{errors[f.key]}</li>
                                        ))}
                                    </ul>
                                </div>
                                <button type="button" className={styles.bannerClose} onClick={e => { e.stopPropagation(); setShowBanner(false); }}><MdClose size={16} /></button>
                            </div>
                        )}

                        {activeSection === 'basic' && (
                            <div className={styles.sectionContent}>
                                <div className={styles.sectionTitle}><MdStorefront size={17} /> Basic Information</div>
                                <div className={styles.formGrid2}>
                                    <div className={`${styles.fieldGroupNew} ${styles.fieldFull}`}>
                                        <label><MdLabel size={13} /> Product Name *</label>
                                        <input name="name" value={form.name} onChange={handle} placeholder="e.g. Wireless Noise-Cancelling Headphones" className={errors.name ? styles.inputError : ''} />
                                        {errors.name && <span className={styles.fieldError}>{errors.name}</span>}
                                    </div>
                                    <div className={styles.fieldGroupNew}>
                                        <label><MdAttachMoney size={13} /> Price (Rs) *</label>
                                        <div className={`${styles.inputWithPrefix} ${errors.price ? styles.inputWithPrefixError : ''}`}>
                                            <span className={styles.inputPrefix}>Rs</span>
                                            <input name="price" type="number" value={form.price} onChange={handle} placeholder="12500" />
                                        </div>
                                        {errors.price && <span className={styles.fieldError}>{errors.price}</span>}
                                    </div>
                                    <div className={styles.fieldGroupNew}>
                                        <label><MdBusiness size={13} /> Brand *</label>
                                        <input name="brand" value={form.brand} onChange={handle} placeholder="e.g. SoundPro" className={errors.brand ? styles.inputError : ''} />
                                        {errors.brand && <span className={styles.fieldError}>{errors.brand}</span>}
                                    </div>
                                    <div className={styles.fieldGroupNew}>
                                        <label><MdCategory size={13} /> Category *</label>
                                        <select name="category" value={form.category} onChange={handle}>
                                            {CATEGORIES.filter(c => c !== 'All').map(c => (
                                                <option key={c} value={c}>{c}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className={styles.fieldGroupNew}>
                                        <label><MdLabel size={13} /> Badge <span className={styles.optionalTag}>optional</span></label>
                                        <input name="badge" value={form.badge} onChange={handle} placeholder="e.g. New, Best Seller, Hot" />
                                        {form.badge && (
                                            <div className={styles.badgePreview}>Preview: <span className={styles.badge}>{form.badge}</span></div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeSection === 'media' && (
                            <div className={styles.sectionContent}>
                                <div className={styles.sectionTitle}><MdPhoto size={17} /> Product Media</div>
                                <div className={styles.mediaLayout}>
                                    <div className={styles.mediaPreviewBox}>
                                        {form.image ? (
                                            <img src={form.image} alt="preview" className={styles.mediaPreviewImg} onError={e => e.target.style.display = 'none'} />
                                        ) : (
                                            <div className={`${styles.mediaPreviewEmpty} ${errors.image ? styles.mediaPreviewEmptyError : ''}`}><MdPhoto size={44} /><p>Image preview</p></div>
                                        )}
                                        <div className={styles.mediaPreviewLabel}>Main Image</div>
                                    </div>
                                    <div className={styles.mediaFields}>
                                        <div className={styles.fieldGroupNew}>
                                            <label><MdLink size={13} /> Main Image URL *</label>
                                            <input name="image" value={form.image} onChange={handle} placeholder="https://example.com/image.jpg" className={errors.image ? styles.inputError : ''} />
                                            {errors.image && <span className={styles.fieldError}>{errors.image}</span>}
                                        </div>
                                        <div className={styles.fieldGroupNew}>
                                            <label><MdLink size={13} /> Additional Images <span className={styles.optionalTag}>optional</span></label>
                                            <p className={styles.fieldHint}>One URL per line</p>
                                            <textarea name="images" value={form.images} onChange={handle} placeholder={"https://img1.jpg\nhttps://img2.jpg"} rows={4} className={styles.textareaNew} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeSection === 'details' && (
                            <div className={styles.sectionContent}>
                                <div className={styles.sectionTitle}><MdDescription size={17} /> Product Details</div>
                                <div className={styles.formGrid2}>
                                    <div className={styles.fieldGroupNew}>
                                        <label><MdStar size={13} /> Rating (0–5)</label>
                                        <div className={styles.ratingInput}>
                                            <input name="rating" type="number" step="0.1" min="0" max="5" value={form.rating} onChange={handle} />
                                            <div className={styles.ratingStars}>
                                                {[1,2,3,4,5].map(n => (
                                                    <span key={n} style={{ color: n <= Math.round(parseFloat(form.rating)) ? '#f59e0b' : '#e4e6eb' }}>★</span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    <div className={styles.fieldGroupNew}>
                                        <label><MdFormatListBulleted size={13} /> Reviews Count</label>
                                        <input name="reviews" type="number" value={form.reviews} onChange={handle} placeholder="e.g. 124" />
                                    </div>
                                </div>
                                <div className={styles.fieldGroupNew}>
                                    <label><MdDescription size={13} /> Description *</label>
                                    <textarea name="description" value={form.description} onChange={handle} placeholder="Full product description..." rows={3} className={`${styles.textareaNew} ${errors.description ? styles.inputError : ''}`} />
                                    {errors.description && <span className={styles.fieldError}>{errors.description}</span>}
                                    <p className={styles.charCount}>{form.description.length} characters</p>
                                </div>
                                <div className={styles.fieldGroupNew}>
                                    <label><MdFormatListBulleted size={13} /> Highlights <span className={styles.optionalTag}>optional</span></label>
                                    <p className={styles.fieldHint}>One feature per line</p>
                                    <textarea name="highlights" value={form.highlights} onChange={handle} placeholder={"40-hour battery life\nBluetooth 5.2\nFoldable design"} rows={3} className={styles.textareaNew} />
                                    {form.highlights && (
                                        <div className={styles.highlightPreview}>
                                            {form.highlights.split('\n').filter(Boolean).map((h, i) => (
                                                <div key={i} className={styles.highlightPreviewItem}><span className={styles.highlightDot}>✓</span> {h}</div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {activeSection === 'stock' && (
                            <div className={styles.sectionContent}>
                                <div className={styles.sectionTitle}><MdInventory size={17} /> Stock & Summary</div>
                                <div className={styles.fieldGroupNew}>
                                    <label><MdInventory size={13} /> Stock Quantity *</label>
                                    <div className={styles.stockInputRow}>
                                        <button type="button" className={styles.stockBtn}
                                            onClick={() => setForm(f => ({ ...f, stock: Math.max(0, parseInt(f.stock || 0) - 1) }))}>−</button>
                                        <input name="stock" type="number" value={form.stock} onChange={handle} className={`${styles.stockInput} ${errors.stock ? styles.inputError : ''}`} />
                                        <button type="button" className={styles.stockBtn}
                                            onClick={() => setForm(f => ({ ...f, stock: parseInt(f.stock || 0) + 1 }))}>+</button>
                                    </div>
                                    {errors.stock && <span className={styles.fieldError}>{errors.stock}</span>}
                                    <div className={styles.stockStatus}>
                                        {parseInt(form.stock) === 0   && <span className={styles.stockOut}>Out of Stock</span>}
                                        {parseInt(form.stock) > 0 && parseInt(form.stock) <= 10 && <span className={styles.stockLow}>Low Stock</span>}
                                        {parseInt(form.stock) > 10    && <span className={styles.stockGood}>In Stock</span>}
                                    </div>
                                </div>
                                <div className={styles.summaryCard}>
                                    <div className={styles.summaryTitle}>Product Summary</div>
                                    {form.image && <img src={form.image} alt="" className={styles.summaryImg} onError={e => e.target.style.display = 'none'} />}
                                    <div className={styles.summaryRows}>
                                        <div className={styles.summaryRow}><span>Name</span><strong>{form.name || <span className={styles.missingVal}>— Missing</span>}</strong></div>
                                        <div className={styles.summaryRow}><span>Price</span><strong>{form.price ? `Rs ${Number(form.price).toLocaleString()}` : <span className={styles.missingVal}>— Missing</span>}</strong></div>
                                        <div className={styles.summaryRow}><span>Category</span><strong>{form.category || '—'}</strong></div>
                                        <div className={styles.summaryRow}><span>Brand</span><strong>{form.brand || <span className={styles.missingVal}>— Missing</span>}</strong></div>
                                        <div className={styles.summaryRow}><span>Stock</span><strong>{form.stock || '0'} units</strong></div>
                                        {form.badge && <div className={styles.summaryRow}><span>Badge</span><span className={styles.badge}>{form.badge}</span></div>}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className={styles.productModalFooter}>
                        <div className={styles.footerNav}>
                            {currentIdx > 0 && (
                                <button type="button" className={styles.footerPrev}
                                    onClick={() => setActiveSection(SECTIONS[currentIdx - 1].id)}>
                                    <MdChevronLeft size={18} /> Back
                                </button>
                            )}
                        </div>
                        <div className={styles.footerActions}>
                            <button type="button" className={styles.cancelBtn} onClick={onClose}>Cancel</button>
                            {currentIdx < SECTIONS.length - 1 ? (
                                <button type="button" className={styles.saveBtn}
                                    onClick={() => setActiveSection(SECTIONS[currentIdx + 1].id)}>
                                    Next <MdChevronRight size={16} />
                                </button>
                            ) : (
                                <button type="submit" className={styles.saveBtn}>
                                    <MdSave size={16} /> {isEdit ? 'Save Changes' : 'Add Product'}
                                </button>
                            )}
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

/* ─────────────────────────────────
   PRODUCTS TAB
───────────────────────────────── */
const ProductsTab = () => {
    const { products, addProduct, updateProduct, deleteProduct } = useProducts();
    const [searchParams, setSearchParams] = useSearchParams();
    const [modal, setModal]               = useState(null);
    const [deleteId, setDeleteId]         = useState(null);

    const page    = parseInt(searchParams.get('ppage') || '1', 10);
    const setPage = (n) => setSearchParams(p => { p.set('ppage', String(n)); return p; });

    const paginated = products.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    const handleSave = form => {
        if (modal === 'add') addProduct(form);
        else updateProduct(modal.id, form);
    };

    return (
        <div>
            <div className={styles.toolbar}>
                <p className={styles.productCount}>{products.length} products</p>
                <button className={styles.addBtn} onClick={() => setModal('add')}>
                    <MdAdd size={18} /> Add Product
                </button>
            </div>

            <div className={styles.tableWrap}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Product</th><th>Category</th><th>Price</th>
                            <th>Rating</th><th>Badge</th><th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginated.map((p, i) => (
                            <tr key={p.id} className={i % 2 === 0 ? styles.trEven : styles.trOdd}>
                                <td>
                                    <div className={styles.productCell}>
                                        <img src={p.image} alt={p.name} className={styles.productThumb} />
                                        <span className={styles.productName}>{p.name}</span>
                                    </div>
                                </td>
                                <td><span className={styles.categoryTag}>{p.category}</span></td>
                                <td className={styles.priceCell}>Rs {p.price.toLocaleString()}</td>
                                <td className={styles.ratingCell}>⭐ {p.rating} <span>({p.reviews})</span></td>
                                <td>{p.badge ? <span className={styles.badge}>{p.badge}</span> : <span className={styles.noBadge}>—</span>}</td>
                                <td>
                                    <div className={styles.actionBtns}>
                                        <button className={styles.editBtn} onClick={() => setModal(p)} title="Edit"><MdEdit size={16} /></button>
                                        <button className={styles.deleteBtn} onClick={() => setDeleteId(p.id)} title="Delete"><MdDelete size={16} /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <Pagination total={products.length} page={page} onPage={setPage} />

            {modal && (
                <ProductModal product={modal === 'add' ? null : modal} onSave={handleSave} onClose={() => setModal(null)} />
            )}

            {deleteId && (
                <div className={styles.overlay} onClick={() => setDeleteId(null)}>
                    <div className={styles.confirmModal} onClick={e => e.stopPropagation()}>
                        <MdDelete size={40} className={styles.confirmIcon} />
                        <h3>Delete Product?</h3>
                        <p>This will remove the product from the store. This cannot be undone.</p>
                        <div className={styles.confirmActions}>
                            <button className={styles.cancelBtn} onClick={() => setDeleteId(null)}>Cancel</button>
                            <button className={styles.confirmDeleteBtn} onClick={() => { deleteProduct(deleteId); setDeleteId(null); }}>Delete</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

/* ─────────────────────────────────
   DASHBOARD PAGE
───────────────────────────────── */
const Dashboard = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const { orders }   = useCart();
    const { products } = useProducts();

    const activeTab    = searchParams.get('tab') || 'orders';
    const setActiveTab = (tab) => setSearchParams(p => {
        p.set('tab', tab);
        p.delete('filter');
        p.delete('opage');
        p.delete('ppage');
        return p;
    });

    return (
        <div className={styles.page}>
            <div className={styles.header}>
                <div className={styles.headerLeft}>
                    <MdDashboard size={28} className={styles.headerIcon} />
                    <h1 className={styles.title}>Dashboard</h1>
                </div>
            </div>

            <DashboardStats orders={orders} products={products} />

            <div className={styles.tabs}>
                <button className={`${styles.tab} ${activeTab === 'orders' ? styles.tabActive : ''}`} onClick={() => setActiveTab('orders')}>
                    <MdShoppingBag size={18} /> Orders
                    {orders.length > 0 && <span className={styles.tabBadge}>{orders.length}</span>}
                </button>
                <button className={`${styles.tab} ${activeTab === 'products' ? styles.tabActive : ''}`} onClick={() => setActiveTab('products')}>
                    <MdInventory2 size={18} /> Products
                    <span className={styles.tabBadge}>{products.length}</span>
                </button>
            </div>

            <div className={styles.content}>
                {activeTab === 'orders'   && <OrdersTab orders={orders} />}
                {activeTab === 'products' && <ProductsTab />}
            </div>
        </div>
    );
};

export default Dashboard;