import { useEffect } from 'react';
import { MdCheckCircle, MdClose } from 'react-icons/md';
import styles from '../styles/Toast.module.scss';

const Toast = ({ toasts, removeToast }) => {
    return (
        <div className={styles.container}>
            {toasts.map(toast => (
                <ToastItem key={toast.id} toast={toast} onRemove={removeToast} />
            ))}
        </div>
    );
};

const ToastItem = ({ toast, onRemove }) => {
    useEffect(() => {
        const timer = setTimeout(() => onRemove(toast.id), 3000);
        return () => clearTimeout(timer);
    }, [toast.id, onRemove]);

    return (
        <div className={styles.toast}>
            <div className={styles.iconWrap}>
                <MdCheckCircle size={20} />
            </div>
            <div className={styles.content}>
                <p className={styles.title}>Added to Cart!</p>
                <p className={styles.sub}>{toast.name}</p>
            </div>
            <button className={styles.closeBtn} onClick={() => onRemove(toast.id)}>
                <MdClose size={16} />
            </button>
            <div className={styles.progress} />
        </div>
    );
};

export default Toast;