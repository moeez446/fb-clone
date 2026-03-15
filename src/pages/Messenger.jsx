import { useState, useRef, useEffect } from 'react';
import {
    MdSearch, MdEdit, MdMoreHoriz, MdSend,
    MdAttachFile, MdEmojiEmotions, MdPhone,
    MdVideocam, MdInfo, MdClose,
} from 'react-icons/md';
import { FaFacebookMessenger } from 'react-icons/fa6';
import { CONTACTS, MESSAGES } from '../data/MessengerData';
import styles from '../styles/Messenger.module.scss';

/* ── Online dot ── */
const OnlineDot = ({ online, cls }) =>
    online ? <span className={cls || styles.onlineDot} /> : null;

/* ── Info Panel (right) ── */
const InfoPanel = ({ contact, onClose }) => (
    <div className={styles.infoPanel}>
        <div className={styles.infoPanelHeader}>
            <span className={styles.infoPanelTitle}>Conversation Info</span>
            <button className={styles.infoPanelClose} onClick={onClose}>
                <MdClose size={20} />
            </button>
        </div>

        <div className={styles.infoPanelProfile}>
            <div className={styles.infoPanelAvatarWrap}>
                <img src={contact.avatar} alt={contact.name} className={styles.infoPanelAvatar} />
                {contact.online && <span className={styles.infoPanelDot} />}
            </div>
            <h3 className={styles.infoPanelName}>{contact.name}</h3>
            <p className={styles.infoPanelStatus}>
                {contact.online ? '🟢 Active now' : '⚫ Offline'}
            </p>
            <div className={styles.infoPanelActions}>
                <button className={styles.infoPanelActionBtn}>
                    <MdPhone size={18} /><span>Audio</span>
                </button>
                <button className={styles.infoPanelActionBtn}>
                    <MdVideocam size={18} /><span>Video</span>
                </button>
                <button className={styles.infoPanelActionBtn}>
                    <MdEdit size={18} /><span>Profile</span>
                </button>
            </div>
        </div>

        <hr className={styles.infoDivider} />

        <div className={styles.infoSection}>
            <h4 className={styles.infoSectionTitle}>Shared Media</h4>
            <div className={styles.sharedGrid}>
                {[11,22,33,44,55,66].map(n => (
                    <img key={n} src={`https://picsum.photos/80/80?random=${n}`} alt="" className={styles.sharedImg} />
                ))}
            </div>
        </div>

        <hr className={styles.infoDivider} />

        <div className={styles.infoSection}>
            <h4 className={styles.infoSectionTitle}>Privacy & Support</h4>
            {['Mute notifications', 'Block', 'Report', 'Delete chat'].map((item, i) => (
                <button key={item} className={`${styles.infoMenuItem} ${i === 3 ? styles.infoMenuItemDanger : ''}`}>
                    {item}
                </button>
            ))}
        </div>
    </div>
);

/* ══════════════════════════
   MESSENGER PAGE
══════════════════════════ */
const Messenger = () => {
    const [activeId, setActiveId]       = useState(1);
    const [search, setSearch]           = useState('');
    const [message, setMessage]         = useState('');
    const [chats, setChats]             = useState(MESSAGES);
    const [showInfo, setShowInfo]       = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const bottomRef = useRef(null);

    const activeContact = CONTACTS.find(c => c.id === activeId);
    const messages      = chats[activeId] || [];
    const filtered      = CONTACTS.filter(c =>
        c.name.toLowerCase().includes(search.toLowerCase())
    );

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [activeId, chats]);

    const handleSend = () => {
        const text = message.trim();
        if (!text) return;
        setChats(prev => ({
            ...prev,
            [activeId]: [...(prev[activeId] || []), {
                id: Date.now(),
                from: 'me',
                text,
                time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
            }],
        }));
        setMessage('');
    };

    const handleKeyDown = e => {
        if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
    };

    const selectContact = (id) => {
        setActiveId(id);
        setShowInfo(false);
        // On mobile hide sidebar after selecting
        if (window.innerWidth < 768) setSidebarOpen(false);
    };

    return (
        <div className={styles.page}>

            {/* ══════════════
                LEFT — Contacts
            ══════════════ */}
            <div className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : styles.sidebarHidden}`}>

                <div className={styles.sidebarHeader}>
                    <div className={styles.sidebarTitleRow}>
                        <div className={styles.sidebarTitleLeft}>
                            <FaFacebookMessenger size={24} className={styles.messengerLogo} />
                            <h2 className={styles.sidebarTitle}>Chats</h2>
                        </div>
                        <div className={styles.sidebarIcons}>
                            <button className={styles.sidebarIconBtn}><MdEdit size={18} /></button>
                            <button className={styles.sidebarIconBtn}><MdMoreHoriz size={18} /></button>
                        </div>
                    </div>

                    <div className={styles.searchBox}>
                        <MdSearch size={17} className={styles.searchIcon} />
                        <input
                            type="text"
                            placeholder="Search"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className={styles.searchInput}
                        />
                    </div>
                </div>

                <div className={styles.contactList}>
                    {filtered.map(contact => (
                        <div
                            key={contact.id}
                            className={`${styles.contactItem} ${activeId === contact.id ? styles.contactItemActive : ''}`}
                            onClick={() => selectContact(contact.id)}
                        >
                            <div className={styles.contactAvatarWrap}>
                                <img src={contact.avatar} alt={contact.name} className={styles.contactAvatar} />
                                <OnlineDot online={contact.online} />
                            </div>
                            <div className={styles.contactInfo}>
                                <div className={styles.contactRow1}>
                                    <span className={`${styles.contactName} ${contact.unread ? styles.contactNameBold : ''}`}>
                                        {contact.name}
                                    </span>
                                    <span className={styles.contactTime}>{contact.lastTime}</span>
                                </div>
                                <div className={styles.contactRow2}>
                                    <span className={`${styles.contactLastMsg} ${contact.unread ? styles.contactLastMsgBold : ''}`}>
                                        {contact.lastMsg}
                                    </span>
                                    {contact.unread > 0 && (
                                        <span className={styles.unreadBadge}>{contact.unread}</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* ══════════════
                CENTER — Chat
            ══════════════ */}
            <div className={styles.chatArea}>

                {/* Chat Header */}
                <div className={styles.chatHeader}>
                    {/* Mobile back to contacts */}
                    <button
                        className={styles.chatBackBtn}
                        onClick={() => setSidebarOpen(true)}
                        title="Contacts"
                    >
                        <FaFacebookMessenger size={18} />
                    </button>

                    <div className={styles.chatHeaderLeft}>
                        <div className={styles.chatHeaderAvatarWrap}>
                            <img src={activeContact?.avatar} alt="" className={styles.chatHeaderAvatar} />
                            {activeContact?.online && <span className={styles.chatHeaderDot} />}
                        </div>
                        <div className={styles.chatHeaderInfo}>
                            <span className={styles.chatHeaderName}>{activeContact?.name}</span>
                            <span className={styles.chatHeaderStatus}>
                                {activeContact?.online ? 'Active now' : 'Offline'}
                            </span>
                        </div>
                    </div>

                    <div className={styles.chatHeaderActions}>
                        <button className={styles.chatActionBtn} title="Audio call">
                            <MdPhone size={20} />
                        </button>
                        <button className={styles.chatActionBtn} title="Video call">
                            <MdVideocam size={20} />
                        </button>
                        <button
                            className={`${styles.chatActionBtn} ${showInfo ? styles.chatActionBtnActive : ''}`}
                            onClick={() => setShowInfo(p => !p)}
                            title="Info"
                        >
                            <MdInfo size={20} />
                        </button>
                    </div>
                </div>

                {/* Messages */}
                <div className={styles.messages}>
                    <div className={styles.chatContactTop}>
                        <div className={styles.chatContactTopAvatarWrap}>
                            <img src={activeContact?.avatar} alt="" className={styles.chatContactTopAvatar} />
                            {activeContact?.online && <span className={styles.chatContactTopDot} />}
                        </div>
                        <h3 className={styles.chatContactTopName}>{activeContact?.name}</h3>
                        <p className={styles.chatContactTopSub}>
                            {activeContact?.online ? '🟢 Active now' : 'Facebook Friends'}
                        </p>
                    </div>

                    {messages.map((msg, i) => {
                        const isMe    = msg.from === 'me';
                        const prev    = messages[i - 1];
                        const next    = messages[i + 1];
                        const showAvatar = !isMe && (!next || next.from === 'me');
                        const isFirst = !prev || prev.from !== msg.from;
                        const isLast  = !next  || next.from  !== msg.from;

                        return (
                            <div key={msg.id} className={`${styles.msgRow} ${isMe ? styles.msgRowMe : styles.msgRowThem}`}>
                                <div className={styles.msgAvatarSlot}>
                                    {!isMe && showAvatar && (
                                        <img src={activeContact?.avatar} alt="" className={styles.msgAvatar} />
                                    )}
                                </div>
                                <div className={styles.msgBubbleWrap}>
                                    <div className={`
                                        ${styles.msgBubble}
                                        ${isMe ? styles.msgBubbleMe : styles.msgBubbleThem}
                                        ${isFirst ? (isMe ? styles.bubbleFirstMe : styles.bubbleFirstThem) : ''}
                                        ${isLast  ? (isMe ? styles.bubbleLastMe  : styles.bubbleLastThem)  : ''}
                                    `}>
                                        {msg.text}
                                    </div>
                                </div>
                            </div>
                        );
                    })}

                    {/* Timestamp after last message */}
                    {messages.length > 0 && (
                        <div className={styles.lastMsgTime}>
                            {messages[messages.length - 1].time}
                        </div>
                    )}

                    <div ref={bottomRef} />
                </div>

                {/* Input */}
                <div className={styles.inputArea}>
                    <button className={styles.inputIconBtn} title="Attach">
                        <MdAttachFile size={20} />
                    </button>
                    <button className={styles.inputIconBtn} title="Emoji">
                        <MdEmojiEmotions size={20} />
                    </button>
                    <div className={styles.inputWrap}>
                        <input
                            type="text"
                            placeholder="Aa"
                            value={message}
                            onChange={e => setMessage(e.target.value)}
                            onKeyDown={handleKeyDown}
                            className={styles.inputField}
                        />
                    </div>
                    <button
                        className={`${styles.sendBtn} ${message.trim() ? styles.sendBtnActive : ''}`}
                        onClick={handleSend}
                        disabled={!message.trim()}
                    >
                        <MdSend size={20} />
                    </button>
                </div>
            </div>

            {/* ══════════════
                RIGHT — Info Panel
            ══════════════ */}
            {showInfo && (
                <InfoPanel contact={activeContact} onClose={() => setShowInfo(false)} />
            )}

        </div>
    );
};

export default Messenger;