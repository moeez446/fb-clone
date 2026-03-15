import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  MdStar, MdStarHalf, MdStarBorder,
  MdShoppingCart, MdFavoriteBorder, MdFavorite,
  MdChevronLeft, MdChevronRight,
} from "react-icons/md";
import { CATEGORIES } from "../data/Productsdata";
import { useProducts } from "../context/ProductContext";
import { useCart } from "../context/CartContext";
import styles from "../styles/Products.module.scss";

const ITEMS_PER_PAGE = 8;

/* ── Cookie helpers ── */
const setCookie = (name, value, days = 30) => {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/`;
};
const getCookie = (name) => {
  const match = document.cookie.match(new RegExp("(?:^|; )" + name + "=([^;]*)"));
  return match ? decodeURIComponent(match[1]) : null;
};

/* ── Like persistence ── */
const loadLikes = () => {
  try {
    const fromLS = localStorage.getItem("product_likes");
    if (fromLS) return new Set(JSON.parse(fromLS));
    const fromCookie = getCookie("product_likes");
    if (fromCookie) return new Set(JSON.parse(fromCookie));
  } catch { }
  return new Set();
};
const saveLikes = (likesSet) => {
  const arr = JSON.stringify([...likesSet]);
  try { localStorage.setItem("product_likes", arr); } catch { }
  setCookie("product_likes", arr);
};

/* ── Stars ── */
const Stars = ({ rating }) => {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
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
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  const handleAdd = (e) => {
    e.stopPropagation();
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div
      className={styles["product__card"]}
      onClick={() => navigate(`/products/${product.id}`)}
    >
      {product.badge && (
        <span className={styles["product__badge"]}>{product.badge}</span>
      )}

      <button
        className={styles["product__wishlist"]}
        onClick={(e) => { e.stopPropagation(); onToggleLike(product.id); }}
      >
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

/* ── Pagination ─────────────────────────────────────────────────────
   Always: [sliding 3] … [last 3]
   The left group slides with current. The right group is always fixed.
   Dots only appear when there is a real gap between the two groups.

   page 1  → ←  1  2  3  …  30 31 32  →
   page 2  → ←  2  3  4  …  30 31 32  →
   page 3  → ←  3  4  5  …  30 31 32  →
   page 30 → ←  …  29 30 31 32  →   (groups merge, no dots)
   page 32 → ←  …  30 31 32  →
   ─────────────────────────────────────────────────────────────────── */
const buildPageItems = (current, total) => {
  if (total <= 6) {
    return Array.from({ length: total }, (_, i) => ({ type: "page", page: i + 1 }));
  }

  // Left sliding window: current, current+1, current+2 (clamped so it doesn't overlap last-3)
  const winStart = Math.min(current, total - 5);
  const winEnd = winStart + 2;

  // Right fixed anchor: always last 3
  const anchorStart = total - 2;
  const anchorEnd = total;

  const items = [];

  // Sliding group
  for (let p = winStart; p <= winEnd; p++) {
    items.push({ type: "page", page: p });
  }

  // Dots only if there is a real gap
  if (anchorStart > winEnd + 1) {
    items.push({ type: "dots", from: winEnd + 1, to: anchorStart - 1, key: "dM" });
  } else if (anchorStart === winEnd + 1) {
    // No gap — groups are adjacent, just continue
  }

  // Fixed last-3 (skip any already in sliding window)
  for (let p = anchorStart; p <= anchorEnd; p++) {
    if (p > winEnd) {
      items.push({ type: "page", page: p });
    }
  }

  return items;
};

/* Dots — static separator, no hover popup */
const Dots = () => (
  <span className={styles["pagination__dots"]}>…</span>
);

const Pagination = ({ current, total, onChange }) => {
  if (total <= 1) return null;
  const items = buildPageItems(current, total);
  return (
    <div className={styles["pagination"]}>
      <button
        className={styles["pagination__btn"]}
        onClick={() => onChange(current - 1)}
        disabled={current === 1}
      ><MdChevronLeft size={20} /></button>

      {items.map(item =>
        item.type === "dots" ? (
          <Dots key={item.key} />
        ) : (
          <button
            key={item.page}
            className={`${styles["pagination__page"]} ${item.page === current ? styles["pagination__page--active"] : ""}`}
            onClick={() => onChange(item.page)}
          >{item.page}</button>
        )
      )}

      <button
        className={styles["pagination__btn"]}
        onClick={() => onChange(current + 1)}
        disabled={current === total}
      ><MdChevronRight size={20} /></button>
    </div>
  );
};

/* ── Products Page ── */
const Products = () => {
  const { products: PRODUCTS } = useProducts();
  const [searchParams, setSearchParams] = useSearchParams();
  const [likes, setLikes] = useState(() => loadLikes());

  const activeCategory = searchParams.get("cat") || "All";
  const search = searchParams.get("q") || "";
  const currentPage = parseInt(searchParams.get("page") || "1", 10);

  const setActiveCategory = (cat) => {
    setSearchParams(p => { p.set("cat", cat); p.set("page", "1"); p.delete("q"); return p; });
  };
  const setSearch = (val) => {
    setSearchParams(p => { if (val) p.set("q", val); else p.delete("q"); p.set("page", "1"); return p; });
  };
  const setCurrentPage = (num) => {
    setSearchParams(p => { p.set("page", String(num)); return p; });
  };

  useEffect(() => { saveLikes(likes); }, [likes]);

  const toggleLike = (id) => {
    setLikes(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const filtered = PRODUCTS.filter(p => {
    const matchCat = activeCategory === "All" || p.category === activeCategory;
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginated = filtered.slice(startIdx, startIdx + ITEMS_PER_PAGE);

  const handlePageChange = (p) => {
    setCurrentPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className={styles["products"]}>

      <div className={styles["products__header"]}>
        <h1 className={styles["products__title"]}>Products</h1>
        <input
          className={styles["products__search"]}
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      <div className={styles["products__categories"]}>
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            className={`${styles["products__catBtn"]} ${activeCategory === cat ? styles["products__catBtn--active"] : ""}`}
            onClick={() => setActiveCategory(cat)}
          >{cat}</button>
        ))}
      </div>

      {filtered.length > 0 && (
        <p className={styles["products__count"]}>
          Showing {startIdx + 1}–{Math.min(startIdx + ITEMS_PER_PAGE, filtered.length)} of {filtered.length} products
        </p>
      )}

      {paginated.length > 0 ? (
        <div className={styles["products__grid"]}>
          {paginated.map(product => (
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

      <Pagination current={currentPage} total={totalPages} onChange={handlePageChange} />

    </div>
  );
};

export default Products;