import { useState, useEffect } from "react";
import {
  MdStar, MdStarHalf, MdStarBorder,
  MdShoppingCart, MdFavoriteBorder, MdFavorite,
  MdChevronLeft, MdChevronRight,
} from "react-icons/md";
import { PRODUCTS, CATEGORIES } from "../data/Productsdata";
import { useCart } from "../context/CartContext";
import styles from "../styles/Products.module.scss";

const ITEMS_PER_PAGE = 10;

/* ── Cookie helpers ── */
const setCookie = (name, value, days = 30) => {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/`;
};
const getCookie = (name) => {
  const match = document.cookie.match(new RegExp('(?:^|; )' + name + '=([^;]*)'));
  return match ? decodeURIComponent(match[1]) : null;
};

/* ── Like persistence ── */
const loadLikes = () => {
  try {
    const fromLS = localStorage.getItem("product_likes");
    if (fromLS) return new Set(JSON.parse(fromLS));
    const fromCookie = getCookie("product_likes");
    if (fromCookie) return new Set(JSON.parse(fromCookie));
  } catch {}
  return new Set();
};
const saveLikes = (likesSet) => {
  const arr = JSON.stringify([...likesSet]);
  try { localStorage.setItem("product_likes", arr); } catch {}
  setCookie("product_likes", arr);
};

/* ── Star Rating ── */
const Stars = ({ rating }) => {
  const full  = Math.floor(rating);
  const half  = rating % 1 >= 0.5;
  const empty = 5 - full - (half ? 1 : 0);
  return (
    <span className={styles["product__stars"]}>
      {Array(full).fill(0).map((_, i) => <MdStar key={`f${i}`} />)}
      {half && <MdStarHalf />}
      {Array(empty).fill(0).map((_, i) => <MdStarBorder key={`e${i}`} />)}
    </span>
  );
};

/* ── Product Card ── */
const ProductCard = ({ product, liked, onToggleLike }) => {
  const [added, setAdded] = useState(false);
  const { addToCart } = useCart();

  const handleAdd = () => {
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className={styles["product__card"]}>
      {product.badge && (
        <span className={styles["product__badge"]}>{product.badge}</span>
      )}
      <button className={styles["product__wishlist"]} onClick={() => onToggleLike(product.id)}>
        {liked
          ? <MdFavorite className={styles["product__wishlist--active"]} />
          : <MdFavoriteBorder />}
      </button>
      <div className={styles["product__imgWrap"]}>
        <img src={product.image} alt={product.name} className={styles["product__img"]} />
      </div>
      <div className={styles["product__info"]}>
        <p className={styles["product__category"]}>{product.category}</p>
        <h3 className={styles["product__name"]}>{product.name}</h3>
        <div className={styles["product__ratingRow"]}>
          <Stars rating={product.rating} />
          <span className={styles["product__reviews"]}>({product.reviews})</span>
        </div>
        <div className={styles["product__footer"]}>
          <span className={styles["product__price"]}>Rs {product.price.toLocaleString()}</span>
          <button
            className={`${styles["product__addBtn"]} ${added ? styles["product__addBtn--added"] : ""}`}
            onClick={handleAdd}
          >
            <MdShoppingCart size={16} />
            {added ? "Added!" : "Add"}
          </button>
        </div>
      </div>
    </div>
  );
};

/* ── Pagination ── */
const Pagination = ({ current, total, onChange }) => {
  if (total <= 1) return null;

  const pages = [];
  for (let i = 1; i <= total; i++) pages.push(i);

  return (
    <div className={styles["pagination"]}>
      <button
        className={styles["pagination__btn"]}
        onClick={() => onChange(current - 1)}
        disabled={current === 1}
      >
        <MdChevronLeft size={20} />
      </button>

      {pages.map(p => (
        <button
          key={p}
          className={`${styles["pagination__page"]} ${p === current ? styles["pagination__page--active"] : ""}`}
          onClick={() => onChange(p)}
        >
          {p}
        </button>
      ))}

      <button
        className={styles["pagination__btn"]}
        onClick={() => onChange(current + 1)}
        disabled={current === total}
      >
        <MdChevronRight size={20} />
      </button>
    </div>
  );
};

/* ── Products Page ── */
const Products = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch]                 = useState("");
  const [currentPage, setCurrentPage]       = useState(1);
  const [likes, setLikes]                   = useState(() => loadLikes());

  useEffect(() => { saveLikes(likes); }, [likes]);

  // Reset to page 1 when filter/search changes
  useEffect(() => { setCurrentPage(1); }, [activeCategory, search]);

  const toggleLike = (id) => {
    setLikes(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const filtered = PRODUCTS.filter((p) => {
    const matchCat    = activeCategory === "All" || p.category === activeCategory;
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const totalPages  = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const startIdx    = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginated   = filtered.slice(startIdx, startIdx + ITEMS_PER_PAGE);

  const handlePageChange = (p) => {
    setCurrentPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className={styles["products"]}>

      {/* ── Header ── */}
      <div className={styles["products__header"]}>
        <h1 className={styles["products__title"]}>Products</h1>
        <input
          className={styles["products__search"]}
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* ── Category Filter ── */}
      <div className={styles["products__categories"]}>
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            className={`${styles["products__catBtn"]} ${activeCategory === cat ? styles["products__catBtn--active"] : ""}`}
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* ── Results count ── */}
      {filtered.length > 0 && (
        <p className={styles["products__count"]}>
          Showing {startIdx + 1}–{Math.min(startIdx + ITEMS_PER_PAGE, filtered.length)} of {filtered.length} products
        </p>
      )}

      {/* ── Grid ── */}
      {paginated.length > 0 ? (
        <div className={styles["products__grid"]}>
          {paginated.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              liked={likes.has(product.id)}
              onToggleLike={toggleLike}
            />
          ))}
        </div>
      ) : (
        <div className={styles["products__empty"]}>
          <p>No products found for "<strong>{search}</strong>"</p>
        </div>
      )}

      {/* ── Pagination ── */}
      <Pagination
        current={currentPage}
        total={totalPages}
        onChange={handlePageChange}
      />

    </div>
  );
};

export default Products;