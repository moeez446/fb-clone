import { useState, useRef } from "react";
import styles from "../styles/Feed.module.scss";
import { STORIES, POSTS } from "../data/Feeddata";
import StoryViewer from "../components/Storyviewer";
import CreatePostModal from "../components/Createpostmodal";
import MediaModal from "../components/Mediamodal";
import {
  MdThumbUp, MdOutlineThumbUp,
  MdChatBubbleOutline, MdOutlineShare,
  MdVideoCall, MdAddPhotoAlternate,
  MdSentimentSatisfied, MdMoreHoriz,
  MdPublic, MdPeople, MdLock, MdAdd,
  MdChevronLeft, MdChevronRight,
} from "react-icons/md";

// ── Privacy Icon ──────────────────────────────────────────
const PrivacyIcon = ({ type }) => {
  if (type === "friends")  return <MdPeople size={12} />;
  if (type === "only-me")  return <MdLock   size={12} />;
  return <MdPublic size={12} />;
};

// ── Stories ───────────────────────────────────────────────
function Stories({ onStoryClick }) {
  const scrollRef = useRef(null);
  const [showLeft,  setShowLeft]  = useState(false);
  const [showRight, setShowRight] = useState(true);

  const SCROLL_AMOUNT = 300;

  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setShowLeft(el.scrollLeft > 10);
    setShowRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 10);
  };

  const scrollLeft  = () => scrollRef.current?.scrollBy({ left: -SCROLL_AMOUNT, behavior: "smooth" });
  const scrollRight = () => scrollRef.current?.scrollBy({ left:  SCROLL_AMOUNT, behavior: "smooth" });

  return (
    <div className={styles['stories-wrap']}>

      {showLeft && (
        <button className={`${styles['stories__arrow']} ${styles['stories__arrow--left']}`} onClick={scrollLeft}>
          <MdChevronLeft size={24} />
        </button>
      )}

      <div className={styles['stories']} ref={scrollRef} onScroll={handleScroll}>
        {STORIES.map((s, i) => (
          <div
            className={styles['stories__item']}
            key={s.id}
            onClick={() => !s.isOwn && onStoryClick(i)}
          >
            <div
              className={styles['stories__bg']}
              style={{ backgroundImage: `url(${s.bg || "https://picsum.photos/seed/own/200/350"})` }}
            >
              {s.isOwn ? (
                <div className={styles['stories__add-btn']}>
                  <MdAdd size={22} />
                </div>
              ) : (
                <img src={s.avatar} alt={s.user} className={styles['stories__avatar']} />
              )}
            </div>
            <span className={styles['stories__name']}>{s.user}</span>
          </div>
        ))}
      </div>

      {showRight && (
        <button className={`${styles['stories__arrow']} ${styles['stories__arrow--right']}`} onClick={scrollRight}>
          <MdChevronRight size={24} />
        </button>
      )}

    </div>
  );
}

// ── Create Post ───────────────────────────────────────────
function CreatePost({ onOpenPost, onOpenVideo, onOpenPhoto, onOpenFeeling }) {
  return (
    <div className={styles['create-post']}>
      <div className={styles['create-post__top']}>
        <img src="https://i.pravatar.cc/150?img=3" alt="you" className={styles['create-post__avatar']} />
        <div className={styles['create-post__input']} onClick={onOpenPost}>
          What's on your mind?
        </div>
      </div>
      <div className={styles['create-post__divider']} />
      <div className={styles['create-post__actions']}>
        <button className={styles['create-post__btn']} onClick={onOpenVideo}>
          <MdVideoCall          size={24} color="#f3425f" /><span>Live video</span>
        </button>
        <button className={styles['create-post__btn']} onClick={onOpenPhoto}>
          <MdAddPhotoAlternate  size={24} color="#45bd62" /><span>Photo/video</span>
        </button>
        <button className={styles['create-post__btn']} onClick={onOpenFeeling}>
          <MdSentimentSatisfied size={24} color="#f7b928" /><span>Feeling/activity</span>
        </button>
      </div>
    </div>
  );
}

// ── Post Card ─────────────────────────────────────────────
function PostCard({ post }) {
  const [liked,     setLiked]     = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes);

  const handleLike = () => {
    setLiked(!liked);
    setLikeCount((prev) => (liked ? prev - 1 : prev + 1));
  };

  const fmt = (n) => n >= 1000 ? (n / 1000).toFixed(1) + "K" : n;

  return (
    <div className={styles['post']}>

      <div className={styles['post__header']}>
        <img src={post.avatar} alt={post.user} className={styles['post__avatar']} />
        <div className={styles['post__meta']}>
          <span className={styles['post__name']}>{post.user}</span>
          <div className={styles['post__info']}>
            <span className={styles['post__time']}>{post.time}</span>
            <span className={styles['post__dot']}>·</span>
            <span className={styles['post__privacy']}><PrivacyIcon type={post.privacy} /></span>
          </div>
        </div>
        <button className={styles['post__menu']}><MdMoreHoriz size={20} /></button>
      </div>

      {post.text && (
        <div className={styles['post__body']}>
          <p className={styles['post__text']}>{post.text}</p>
        </div>
      )}

      {post.image && (
        <img src={post.image} alt="post" className={styles['post__image']} />
      )}

      <div className={styles['post__stats']}>
        <span className={styles['post__reactions']}>
          <span className={styles['post__reaction-icons']}>
            <span className={styles['post__reaction-icon']}>👍</span>
            <span className={styles['post__reaction-icon']}>❤️</span>
            <span className={styles['post__reaction-icon']}>😂</span>
          </span>
          <span className={styles['post__reaction-count']}>{fmt(likeCount)}</span>
        </span>
        <span className={styles['post__engagement']}>
          <span>{post.comments} comments</span>
          <span>{post.shares} shares</span>
        </span>
      </div>

      <div className={styles['post__divider']} />

      <div className={styles['post__actions']}>
        <button
          className={`${styles['post__action']} ${liked ? styles['post__action--liked'] : ''}`}
          onClick={handleLike}
        >
          <span className={styles['post__action-icon']}>
            {liked ? <MdThumbUp size={20} /> : <MdOutlineThumbUp size={20} />}
          </span>
          <span>Like</span>
        </button>
        <button className={styles['post__action']}>
          <span className={styles['post__action-icon']}><MdChatBubbleOutline size={20} /></span>
          <span>Comment</span>
        </button>
        <button className={styles['post__action']}>
          <span className={styles['post__action-icon']}><MdOutlineShare size={20} /></span>
          <span>Share</span>
        </button>
      </div>

    </div>
  );
}

// ── Feed ──────────────────────────────────────────────────
export default function Feed() {
  const [storyIndex,    setStoryIndex]    = useState(null);
  const [showPostModal, setShowPostModal] = useState(false);
  const [mediaMode,     setMediaMode]     = useState(null);

  // isOwn wali story filter ke baad sahi index
  const filteredStories = STORIES.filter(s => !s.isOwn);

  const handleStoryClick = (i) => {
    const clickedStory = STORIES[i];
    const filteredIndex = filteredStories.findIndex(s => s.id === clickedStory.id);
    if (filteredIndex !== -1) setStoryIndex(filteredIndex);
  };

  return (
    <div className={styles['feed']}>

      <Stories onStoryClick={handleStoryClick} />

      <CreatePost
        onOpenPost={()    => setShowPostModal(true)}
        onOpenVideo={()   => setMediaMode('video')}
        onOpenPhoto={()   => setMediaMode('photo')}
        onOpenFeeling={()  => setMediaMode('feeling')}
      />

      {POSTS.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}

      {/* ── Modals ── */}
      {storyIndex !== null && (
        <StoryViewer
          stories={filteredStories}
          startIndex={storyIndex}
          onClose={() => setStoryIndex(null)}
        />
      )}

      {showPostModal && (
        <CreatePostModal onClose={() => setShowPostModal(false)} />
      )}

      {mediaMode && (
        <MediaModal mode={mediaMode} onClose={() => setMediaMode(null)} />
      )}

    </div>
  );
}