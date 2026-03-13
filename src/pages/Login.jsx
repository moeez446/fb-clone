import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { IoClose } from 'react-icons/io5';
import styles from '../styles/Login.module.scss';

/* ── Signup Modal ── */
const SignupModal = ({ onClose }) => {
    const [form, setForm] = useState({
        firstName: '', lastName: '',
        emailOrPhone: '', password: '',
        day: '', month: '', year: '',
        gender: ''
    });

    const days = Array.from({ length: 31 }, (_, i) => i + 1);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 100 }, (_, i) => currentYear - i);

    const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>

                {/* Header */}
                <div className={styles.modalHeader}>
                    <div>
                        <h2 className={styles.modalTitle}>Create a new account</h2>
                        <p className={styles.modalSub}>It's quick and easy.</p>
                    </div>
                    <button className={styles.closeBtn} onClick={onClose}>
                        <IoClose />
                    </button>
                </div>

                <hr className={styles.modalDivider} />

                {/* Form */}
                <form className={styles.modalForm} onSubmit={(e) => e.preventDefault()}>

                    {/* Name Row */}
                    <div className={styles.nameRow}>
                        <input
                            className={styles.modalInput}
                            type="text"
                            name="firstName"
                            placeholder="First name"
                            value={form.firstName}
                            onChange={handle}
                        />
                        <input
                            className={styles.modalInput}
                            type="text"
                            name="lastName"
                            placeholder="Surname"
                            value={form.lastName}
                            onChange={handle}
                        />
                    </div>

                    {/* Email / Phone */}
                    <input
                        className={styles.modalInput}
                        type="text"
                        name="emailOrPhone"
                        placeholder="Mobile number or email address"
                        value={form.emailOrPhone}
                        onChange={handle}
                    />

                    {/* Password */}
                    <input
                        className={styles.modalInput}
                        type="password"
                        name="password"
                        placeholder="New password"
                        value={form.password}
                        onChange={handle}
                    />

                    {/* Birthday */}
                    <div className={styles.fieldLabel}>
                        Date of birth <span className={styles.infoIcon}>?</span>
                    </div>
                    <div className={styles.dobRow}>
                        <select className={styles.modalSelect} name="day" value={form.day} onChange={handle}>
                            <option value="">Day</option>
                            {days.map(d => <option key={d} value={d}>{d}</option>)}
                        </select>
                        <select className={styles.modalSelect} name="month" value={form.month} onChange={handle}>
                            <option value="">Month</option>
                            {months.map((m, i) => <option key={m} value={i + 1}>{m}</option>)}
                        </select>
                        <select className={styles.modalSelect} name="year" value={form.year} onChange={handle}>
                            <option value="">Year</option>
                            {years.map(y => <option key={y} value={y}>{y}</option>)}
                        </select>
                    </div>

                    {/* Gender */}
                    <div className={styles.fieldLabel}>
                        Gender <span className={styles.infoIcon}>?</span>
                    </div>
                    <div className={styles.genderRow}>
                        {['Female', 'Male', 'Custom'].map(g => (
                            <label key={g} className={styles.genderOption}>
                                <span>{g}</span>
                                <input
                                    type="radio"
                                    name="gender"
                                    value={g}
                                    checked={form.gender === g}
                                    onChange={handle}
                                />
                            </label>
                        ))}
                    </div>

                    {/* Policy */}
                    <p className={styles.policy}>
                        By clicking Sign Up, you agree to our{' '}
                        <a href="#">Terms</a>,{' '}
                        <a href="#">Privacy Policy</a> and{' '}
                        <a href="#">Cookies Policy</a>.
                        You may receive SMS notifications from us and can opt out at any time.
                    </p>

                    {/* Submit */}
                    <button className={styles.signupBtn} type="submit">
                        Sign Up
                    </button>
                </form>

            </div>
        </div>
    );
};

/* ── Forgot Password Modal ── */
const ForgotModal = ({ onClose }) => {
    const [step, setStep] = useState(1); // 1=search 2=found 3=otp
    const [value, setValue] = useState('');
    const [otp, setOtp] = useState(['', '', '', '', '', '']);

    const handleSearch = (e) => {
        e.preventDefault();
        if (value.trim()) setStep(2);
    };

    const handleOtpChange = (i, val) => {
        if (!/^\d?$/.test(val)) return;
        const next = [...otp];
        next[i] = val;
        setOtp(next);
        // auto-focus next box
        if (val && i < 5) {
            document.getElementById(`otp-${i + 1}`)?.focus();
        }
    };

    const handleOtpKeyDown = (i, e) => {
        if (e.key === 'Backspace' && !otp[i] && i > 0) {
            document.getElementById(`otp-${i - 1}`)?.focus();
        }
    };

    const stepTitles = {
        1: 'Find Your Account',
        2: 'Reset Your Password',
        3: 'Enter Confirmation Code',
    };
    const stepSubs = {
        1: 'Please enter your email address or mobile number to search for your account.',
        2: 'How do you want to receive the code to reset your password?',
        3: `Enter the 6-digit code we sent to ${value}`,
    };

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>

                {/* Header */}
                <div className={styles.modalHeader}>
                    <div>
                        <h2 className={styles.modalTitle}>{stepTitles[step]}</h2>
                        <p className={styles.modalSub}>{stepSubs[step]}</p>
                    </div>
                    <button className={styles.closeBtn} onClick={onClose}>
                        <IoClose />
                    </button>
                </div>

                <hr className={styles.modalDivider} />

                {/* ── Step 1 — Search ── */}
                {step === 1 && (
                    <form className={styles.modalForm} onSubmit={handleSearch}>
                        <input
                            className={styles.modalInput}
                            type="text"
                            placeholder="Email address or phone number"
                            value={value}
                            onChange={(e) => setValue(e.target.value)}
                            autoFocus
                        />
                        <div className={styles.forgotActions}>
                            <button type="button" className={styles.forgotCancelBtn} onClick={onClose}>
                                Cancel
                            </button>
                            <button type="submit" className={styles.forgotSearchBtn}>
                                Search
                            </button>
                        </div>
                    </form>
                )}

                {/* ── Step 2 — Account Found ── */}
                {step === 2 && (
                    <div className={styles.modalForm}>
                        <div className={styles.forgotAccount}>
                            <img src="https://i.pravatar.cc/56" alt="Profile" className={styles.forgotAccountAvatar} />
                            <div className={styles.forgotAccountInfo}>
                                <p className={styles.forgotAccountName}>Abdul Moeez</p>
                                <p className={styles.forgotAccountEmail}>{value}</p>
                            </div>
                        </div>

                        <label className={styles.forgotOption}>
                            <div className={styles.forgotOptionInfo}>
                                <p className={styles.forgotOptionTitle}>Send code via email</p>
                                <p className={styles.forgotOptionSub}>{value}</p>
                            </div>
                            <input type="radio" name="resetMethod" defaultChecked />
                        </label>

                        <div className={styles.forgotActions}>
                            <button type="button" className={styles.forgotCancelBtn} onClick={() => setStep(1)}>
                                Not you?
                            </button>
                            <button type="button" className={styles.forgotSearchBtn} onClick={() => setStep(3)}>
                                Continue
                            </button>
                        </div>
                    </div>
                )}

                {/* ── Step 3 — OTP ── */}
                {step === 3 && (
                    <div className={styles.modalForm}>
                        <p className={styles.otpHint}>
                            We sent a 6-digit code to <strong>{value}</strong>. Check your inbox and enter it below.
                        </p>

                        {/* OTP boxes */}
                        <div className={styles.otpRow}>
                            {otp.map((digit, i) => (
                                <input
                                    key={i}
                                    id={`otp-${i}`}
                                    className={styles.otpBox}
                                    type="text"
                                    inputMode="numeric"
                                    maxLength={1}
                                    value={digit}
                                    onChange={(e) => handleOtpChange(i, e.target.value)}
                                    onKeyDown={(e) => handleOtpKeyDown(i, e)}
                                    autoFocus={i === 0}
                                />
                            ))}
                        </div>

                        <p className={styles.otpResend}>
                            Didn't get a code?{' '}
                            <button
                                type="button"
                                className={styles.otpResendBtn}
                                onClick={() => setOtp(['', '', '', '', '', ''])}
                            >
                                Resend code
                            </button>
                        </p>

                        <div className={styles.forgotActions}>
                            <button type="button" className={styles.forgotCancelBtn} onClick={() => setStep(2)}>
                                Back
                            </button>
                            <button
                                type="button"
                                className={styles.forgotSearchBtn}
                                onClick={onClose}
                                disabled={otp.some(d => d === '')}
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};

/* ── Login Page ── */
const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showSignup, setShowSignup] = useState(false);
    const [showForgot, setShowForgot] = useState(false);

    return (
        <div className={styles.page}>

            {/* ── MAIN ── */}
            <div className={styles.main}>

                {/* Left */}
                <div className={styles.left}>
                    <img
                        className={styles.logo}
                        src="https://static.xx.fbcdn.net/rsrc.php/y1/r/4lCu2zih0ca.svg"
                        alt="Facebook"
                    />
                    <p className={styles.tagline}>
                        Facebook helps you connect and share<br />with the people in your life.
                    </p>
                </div>

                {/* Right */}
                <div className={styles.right}>
                    <form className={styles.card} onSubmit={(e) => e.preventDefault()}>
                        <input
                            className={styles.input}
                            type="text"
                            placeholder="Email address or phone number"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            autoComplete="email"
                        />
                        <input
                            className={styles.input}
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            autoComplete="current-password"
                        />
                        <button className={styles.loginBtn} type="submit">
                            Log in
                        </button>

                        <a href="#" className={styles.forgotLink} onClick={(e) => { e.preventDefault(); setShowForgot(true); }}>
                            Forgotten password?
                        </a>

                        <hr className={styles.divider} />

                        {/* ← Opens modal instead of navigating */}
                        <button
                            type="button"
                            className={styles.createBtn}
                            onClick={() => setShowSignup(true)}
                        >
                            Create new account
                        </button>
                    </form>

                    <p className={styles.pageInfo}>
                        <a href="#" className={styles.pageLink}>
                            <strong>Create a Page</strong>
                        </a>
                        {' '}for a celebrity, brand or business.
                    </p>
                </div>
            </div>

            {/* ── FOOTER ── */}
            <footer className={styles.footer}>
                <div className={styles.footerLangs}>
                    {['English (UK)', 'اردو', 'हिन्दी', 'Español', 'Français (France)',
                        '中文(简体)', 'العربية', 'Português (Brasil)', 'Italiano', '한국어', 'Deutsch'
                    ].map(lang => <a key={lang} href="#">{lang}</a>)}
                    <span className={styles.moreBtn}>+</span>
                </div>
                <hr className={styles.footerDivider} />
                <div className={styles.footerNav}>
                    {['Sign Up', 'Log in', 'Messenger', 'Facebook Lite', 'Video', 'Places',
                        'Games', 'Marketplace', 'Meta Pay', 'Meta Store', 'Meta Quest',
                        'Instagram', 'Threads', 'Fundraisers', 'Services',
                        'Voting Information Centre', 'Privacy Policy', 'Privacy Centre',
                        'Groups', 'About', 'Create ad', 'Create Page', 'Developers',
                        'Careers', 'Cookies', 'AdChoices', 'Terms', 'Help',
                        'Contact uploading and non-users', 'Settings', 'Activity log'
                    ].map(item => <a key={item} href="#">{item}</a>)}
                </div>
                <p className={styles.copyright}>Meta © 2025</p>
            </footer>

            {/* ── SIGNUP MODAL ── */}
            {showSignup && <SignupModal onClose={() => setShowSignup(false)} />}

            {/* ── FORGOT MODAL ── */}
            {showForgot && <ForgotModal onClose={() => setShowForgot(false)} />}

        </div>
    );
};

export default Login;