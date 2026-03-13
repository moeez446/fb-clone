import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    MdArrowBack, MdStar, MdStarHalf, MdStarBorder,
    MdShoppingCart, MdFavoriteBorder, MdFavorite,
    MdLocalShipping, MdVerified, MdLoop,
    MdAdd, MdRemove, MdShare, MdCheckCircle,
    MdSecurity, MdBolt, MdChevronLeft, MdChevronRight,
} from 'react-icons/md';
import { useProducts } from '../context/ProductContext';
import { useCart } from '../context/CartContext';
import styles from '../styles/ProductDetail.module.scss';

/* ── Stars ── */
const Stars = ({ rating, size = 16 }) => {
    const full  = Math.floor(rating);
    const half  = rating % 1 >= 0.5;
    const empty = 5 - full - (half ? 1 : 0);
    return (
        <span className={styles.stars}>
            {Array(full).fill(0).map((_, i)  => <MdStar key={`f${i}`} size={size} />)}
            {half && <MdStarHalf size={size} />}
            {Array(empty).fill(0).map((_, i) => <MdStarBorder key={`e${i}`} size={size} />)}
        </span>
    );
};

/* ── Related Product Card — matches ProductCard from Products.jsx ── */
const RelatedCard = ({ product, onNavigate }) => {
    const [added, setAdded]   = useState(false);
    const [liked, setLiked]   = useState(false);
    const { addToCart }       = useCart();

    const handleAdd = (e) => {
        e.stopPropagation();
        addToCart(product);
        setAdded(true);
        setTimeout(() => setAdded(false), 1500);
    };

    const handleLike = (e) => {
        e.stopPropagation();
        setLiked(l => !l);
    };

    return (
        <div className={styles.relatedCard} onClick={() => onNavigate(product.id)}>

            {/* Badge */}
            {product.badge && (
                <span className={styles.relatedCardBadge}>{product.badge}</span>
            )}

            {/* Wishlist */}
            <button className={styles.relatedCardWishlist} onClick={handleLike}>
                {liked
                    ? <MdFavorite className={styles.relatedCardWishlistActive} />
                    : <MdFavoriteBorder />}
            </button>

            {/* Image */}
            <div className={styles.relatedCardImgWrap}>
                <img src={product.image} alt={product.name} className={styles.relatedCardImg} />
            </div>

            {/* Info */}
            <div className={styles.relatedCardInfo}>
                <p className={styles.relatedCardCategory}>{product.category}</p>
                <h3 className={styles.relatedCardName}>{product.name}</h3>

                <div className={styles.relatedCardRatingRow}>
                    <Stars rating={product.rating} size={14} />
                    <span className={styles.relatedCardReviews}>({product.reviews})</span>
                </div>

                <div className={styles.relatedCardFooter}>
                    <span className={styles.relatedCardPrice}>Rs {product.price.toLocaleString()}</span>
                    <button
                        className={`${styles.relatedCardAddBtn} ${added ? styles.relatedCardAddBtnAdded : ''}`}
                        onClick={handleAdd}
                    >
                        <MdShoppingCart size={15} />
                        {added ? 'Added!' : 'Add'}
                    </button>
                </div>
            </div>
        </div>
    );
};

const ProductDetail = () => {
    const { id }        = useParams();
    const navigate      = useNavigate();
    const { products }  = useProducts();
    const { addToCart } = useCart();

    const product = products.find(p => p.id === parseInt(id));

    const [activeImg, setActiveImg] = useState(0);
    const [qty, setQty]             = useState(1);
    const [liked, setLiked]         = useState(false);
    const [addedMsg, setAddedMsg]   = useState(false);
    const [activeTab, setActiveTab] = useState('description');

    // Reset state whenever the product id changes (same route, different product)
    useEffect(() => {
        setActiveImg(0);
        setQty(1);
        setLiked(false);
        setAddedMsg(false);
        setActiveTab('description');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [id]);

    if (!product) return (
        <div className={styles.notFound}>
            <p>Product not found</p>
            <button onClick={() => navigate('/products')}>← Back to Products</button>
        </div>
    );

    const images  = product.images?.length ? product.images : [product.image];
    const related = products
        .filter(p => p.category === product.category && p.id !== product.id)
        .slice(0, 4);

    const handleAdd = () => {
        for (let i = 0; i < qty; i++) addToCart(product);
        setAddedMsg(true);
        setTimeout(() => setAddedMsg(false), 2000);
    };

    const handleRelatedNav = (id) => {
        navigate(`/products/${id}`);
    };

    return (
        <div className={styles.page}>

            {/* ── Breadcrumb / Back ── */}
            <nav className={styles.breadcrumb}>
                <button className={styles.backBtn} onClick={() => navigate(-1)}>
                    <MdArrowBack size={16} />
                    <span>Products</span>
                </button>
                <span className={styles.breadSep}>/</span>
                <span className={styles.breadCat}>{product.category}</span>
                <span className={styles.breadSep}>/</span>
                <span className={styles.breadCurrent}>{product.name}</span>
            </nav>

            {/* ══════════════════════════
                HERO — Gallery + Info
            ══════════════════════════ */}
            <div className={styles.hero}>

                {/* ── LEFT: Gallery ── */}
                <div className={styles.gallery}>
                    <div className={styles.thumbStrip}>
                        {images.map((img, i) => (
                            <button
                                key={i}
                                className={`${styles.thumb} ${activeImg === i ? styles.thumbActive : ''}`}
                                onClick={() => setActiveImg(i)}
                            >
                                <img src={img} alt="" />
                            </button>
                        ))}
                    </div>
                    <div className={styles.mainImgWrap}>
                        {product.badge && (
                            <span className={styles.imgBadge}>{product.badge}</span>
                        )}
                        {product.stock <= 5 && product.stock > 0 && (
                            <span className={styles.lowStockTag}>Only {product.stock} left</span>
                        )}
                        <img
                            key={activeImg}
                            src={images[activeImg]}
                            alt={product.name}
                            className={styles.mainImg}
                        />

                        {/* Prev / Next arrows — only show when multiple images */}
                        {images.length > 1 && (
                            <>
                                <button
                                    className={`${styles.imgArrow} ${styles.imgArrowLeft}`}
                                    onClick={() => setActiveImg(i => (i - 1 + images.length) % images.length)}
                                    aria-label="Previous image"
                                >
                                    <MdChevronLeft size={26} />
                                </button>
                                <button
                                    className={`${styles.imgArrow} ${styles.imgArrowRight}`}
                                    onClick={() => setActiveImg(i => (i + 1) % images.length)}
                                    aria-label="Next image"
                                >
                                    <MdChevronRight size={26} />
                                </button>
                            </>
                        )}
                        <div className={styles.imgDots}>
                            {images.map((_, i) => (
                                <button
                                    key={i}
                                    className={`${styles.dot} ${activeImg === i ? styles.dotActive : ''}`}
                                    onClick={() => setActiveImg(i)}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                {/* ── RIGHT: Info ── */}
                <div className={styles.info}>
                    <div className={styles.metaRow}>
                        {product.brand && <span className={styles.brandTag}>{product.brand}</span>}
                        <span className={styles.catPill}>{product.category}</span>
                    </div>

                    <h1 className={styles.name}>{product.name}</h1>

                    <div className={styles.ratingRow}>
                        <Stars rating={product.rating} size={18} />
                        <span className={styles.ratingVal}>{product.rating}</span>
                        <span className={styles.ratingDivider}>·</span>
                        <span className={styles.reviewLink}>{product.reviews} reviews</span>
                    </div>

                    <div className={styles.priceBlock}>
                        <span className={styles.price}>Rs {product.price.toLocaleString()}</span>
                        <div className={styles.priceRight}>
                            <span className={styles.mrp}>Rs {Math.round(product.price * 1.2).toLocaleString()}</span>
                            <span className={styles.savePill}>Save 20%</span>
                        </div>
                    </div>

                    <p className={styles.shortDesc}>
                        {product.description
                            ? product.description.slice(0, 150) + '…'
                            : 'Premium quality product.'}
                    </p>

                    {product.highlights?.length > 0 && (
                        <div className={styles.pillRow}>
                            {product.highlights.slice(0, 4).map((h, i) => (
                                <span key={i} className={styles.highlightPill}>
                                    <MdCheckCircle size={13} /> {h}
                                </span>
                            ))}
                        </div>
                    )}

                    <div className={styles.sep} />

                    <div className={styles.stockRow}>
                        <span className={`${styles.stockDot} ${product.stock > 0 ? styles.stockDotIn : styles.stockDotOut}`} />
                        <span className={styles.stockText}>
                            {product.stock > 10
                                ? 'In Stock — Ready to ship'
                                : product.stock > 0
                                ? `Only ${product.stock} left in stock!`
                                : 'Out of Stock'}
                        </span>
                    </div>

                    <div className={styles.cartRow}>
                        <div className={styles.qtyBox}>
                            <button className={styles.qtyBtn} onClick={() => setQty(q => Math.max(1, q - 1))} disabled={qty <= 1}>
                                <MdRemove size={17} />
                            </button>
                            <span className={styles.qtyNum}>{qty}</span>
                            <button className={styles.qtyBtn} onClick={() => setQty(q => q + 1)}>
                                <MdAdd size={17} />
                            </button>
                        </div>

                        <button
                            className={`${styles.cartBtn} ${addedMsg ? styles.cartBtnSuccess : ''}`}
                            onClick={handleAdd}
                            disabled={!product.stock}
                        >
                            {addedMsg
                                ? <><MdCheckCircle size={19} /> Added!</>
                                : <><MdShoppingCart size={19} /> Add to Cart</>}
                        </button>

                        <button
                            className={`${styles.iconBtn} ${liked ? styles.iconBtnLiked : ''}`}
                            onClick={() => setLiked(!liked)}
                            title="Wishlist"
                        >
                            {liked ? <MdFavorite size={20} /> : <MdFavoriteBorder size={20} />}
                        </button>

                        <button className={styles.iconBtn} title="Share">
                            <MdShare size={20} />
                        </button>
                    </div>

                    <div className={styles.trustGrid}>
                        <div className={styles.trustItem}>
                            <MdLocalShipping size={20} className={styles.trustIcon} />
                            <div>
                                <p className={styles.trustLabel}>Free Delivery</p>
                                <p className={styles.trustSub}>On orders over Rs 5,000</p>
                            </div>
                        </div>
                        <div className={styles.trustItem}>
                            <MdLoop size={20} className={styles.trustIcon} />
                            <div>
                                <p className={styles.trustLabel}>Easy Returns</p>
                                <p className={styles.trustSub}>7-day return policy</p>
                            </div>
                        </div>
                        <div className={styles.trustItem}>
                            <MdSecurity size={20} className={styles.trustIcon} />
                            <div>
                                <p className={styles.trustLabel}>Secure Payment</p>
                                <p className={styles.trustSub}>100% protected</p>
                            </div>
                        </div>
                        <div className={styles.trustItem}>
                            <MdVerified size={20} className={styles.trustIcon} />
                            <div>
                                <p className={styles.trustLabel}>Authentic</p>
                                <p className={styles.trustSub}>Guaranteed original</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ══════════════════════════
                TABS
            ══════════════════════════ */}
            <div className={styles.tabsWrap}>
                <div className={styles.tabBar}>
                    {['description', 'specifications', 'reviews'].map(t => (
                        <button
                            key={t}
                            className={`${styles.tabBtn} ${activeTab === t ? styles.tabBtnActive : ''}`}
                            onClick={() => setActiveTab(t)}
                        >
                            {t.charAt(0).toUpperCase() + t.slice(1)}
                        </button>
                    ))}
                </div>

                <div className={styles.tabBody}>
                    {activeTab === 'description' && (
                        <div className={styles.descTab}>
                            <p className={styles.descText}>{product.description || 'No description available.'}</p>
                            {product.highlights?.length > 0 && (
                                <div className={styles.hlGrid}>
                                    {product.highlights.map((h, i) => (
                                        <div key={i} className={styles.hlCard}>
                                            <MdBolt size={18} className={styles.hlIcon} />
                                            <span>{h}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'specifications' && (
                        <div className={styles.specsTab}>
                            {product.specs ? (
                                <div className={styles.specsGrid}>
                                    {Object.entries(product.specs).map(([k, v]) => (
                                        <div key={k} className={styles.specRow}>
                                            <span className={styles.specKey}>{k}</span>
                                            <span className={styles.specVal}>{v}</span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className={styles.empty}>No specifications available.</p>
                            )}
                        </div>
                    )}

                    {activeTab === 'reviews' && (
                        <div className={styles.reviewsTab}>
                            <div className={styles.reviewSummary}>
                                <div className={styles.bigRating}>
                                    <span className={styles.bigNum}>{product.rating}</span>
                                    <Stars rating={product.rating} size={22} />
                                    <span className={styles.bigSub}>Based on {product.reviews} reviews</span>
                                </div>
                                <div className={styles.bars}>
                                    {[5,4,3,2,1].map(s => {
                                        const w = s===5?60:s===4?25:s===3?10:s===2?3:2;
                                        return (
                                            <div key={s} className={styles.barRow}>
                                                <span className={styles.barLabel}>{s} ★</span>
                                                <div className={styles.barBg}>
                                                    <div className={styles.barFill} style={{ width:`${w}%` }} />
                                                </div>
                                                <span className={styles.barPct}>{w}%</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                            <div className={styles.reviewList}>
                                {[
                                    { name:'Ali Hassan',  rating:5, date:'2 weeks ago',  text:'Absolutely amazing! Exceeded all expectations. Build quality is top notch and delivery was fast.' },
                                    { name:'Sara Khan',   rating:4, date:'1 month ago',  text:'Great product for the price. Packaging could be better but the product itself is excellent.' },
                                    { name:'Ahmed Malik', rating:5, date:'1 month ago',  text:'Bought as a gift and the recipient loved it. Will definitely buy again from this store.' },
                                ].map((r, i) => (
                                    <div key={i} className={styles.reviewCard}>
                                        <div className={styles.reviewTop}>
                                            <div className={styles.avatar}>{r.name[0]}</div>
                                            <div className={styles.reviewMeta}>
                                                <span className={styles.reviewerName}>{r.name}</span>
                                                <div className={styles.reviewStars}>
                                                    <Stars rating={r.rating} size={13} />
                                                    <span className={styles.reviewDate}>{r.date}</span>
                                                </div>
                                            </div>
                                            <span className={styles.verifiedBadge}>
                                                <MdVerified size={15} /> Verified
                                            </span>
                                        </div>
                                        <p className={styles.reviewText}>{r.text}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* ══════════════════════════
                RELATED PRODUCTS — now uses RelatedCard matching ProductCard
            ══════════════════════════ */}
            {related.length > 0 && (
                <div className={styles.related}>
                    <div className={styles.relatedHeader}>
                        <h2 className={styles.relatedTitle}>You Might Also Like</h2>
                        <button className={styles.relatedAll} onClick={() => navigate('/products')}>
                            View all →
                        </button>
                    </div>

                    {/* Grid uses same card structure as Products page */}
                    <div className={styles.relatedGrid}>
                        {related.map(p => (
                            <RelatedCard
                                key={p.id}
                                product={p}
                                onNavigate={handleRelatedNav}
                            />
                        ))}
                    </div>
                </div>
            )}

        </div>
    );
};

export default ProductDetail;