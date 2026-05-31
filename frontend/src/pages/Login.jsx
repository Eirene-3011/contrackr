import { useState, useEffect, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { useAuth } from '../context/AuthContext'
import { Lock, Mail, AlertCircle, Eye, EyeOff, ArrowRight, TrendingUp, Truck, BarChart3, Shield, CheckCircle2, Loader2 } from 'lucide-react'

/* ─── Animated Noise Canvas ─────────────────────────────── */
function NoiseCanvas() {
  const canvasRef = useRef(null)
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let frame
    const draw = () => {
      const { width: w, height: h } = canvas
      const img = ctx.createImageData(w, h)
      for (let i = 0; i < img.data.length; i += 4) {
        const v = (Math.random() * 255) | 0
        img.data[i] = img.data[i+1] = img.data[i+2] = v
        img.data[i+3] = 18
      }
      ctx.putImageData(img, 0, 0)
      frame = setTimeout(draw, 80)
    }
    const resize = () => {
      canvas.width  = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }
    resize()
    draw()
    window.addEventListener('resize', resize)
    return () => { clearTimeout(frame); window.removeEventListener('resize', resize) }
  }, [])
  return <canvas ref={canvasRef} style={{ position:'absolute', inset:0, width:'100%', height:'100%', pointerEvents:'none', zIndex:1 }} />
}

export default function Login() {
  const { login } = useAuth()
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm()
  const [error, setError]     = useState('')
  const [showPw, setShowPw]   = useState(false)
  const [focused, setFocused] = useState(null)

  const onSubmit = async (data) => {
    setError('')
    try { 
      await login(data.email, data.password) 
    } catch (err) { 
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.') 
    }
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Outfit:wght@300;400;500;600;700&display=swap');

        *, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }
        html, body, #root { height:100%; }

        :root {
          --or:  #FF8C00;
          --or2: #FFA033;
          --bg0: #07090c;
          --bg1: #0b0f14;
          --bg2: #111820;
          --bg3: #161e28;
          --t1:  #f4f6f8;
          --t2:  #7a8fa3;
          --t3:  #3a4a5a;
          --radius: 14px;
          --transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        body {
          font-family: 'Outfit', sans-serif;
          background: var(--bg0);
          min-height: 100vh;
          -webkit-font-smoothing: antialiased;
          color: var(--t1);
        }

        .page {
          display: flex;
          min-height: 100vh;
          align-items: stretch;
        }

        /* ══ LEFT ══════════════════════════════════════ */
        .left {
          position: relative;
          width: 52%;
          flex-shrink: 0;
          background: var(--bg1);
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .left-grid {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(255,140,0,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,140,0,0.04) 1px, transparent 1px);
          background-size: 56px 56px;
          z-index: 0;
        }

        .left-slash {
          position: absolute;
          top: -10%; right: -8%;
          width: 420px; height: 420px;
          background: conic-gradient(from 220deg at 50% 50%, transparent 0deg, rgba(255,140,0,0.06) 40deg, transparent 80deg);
          border-radius: 50%;
          z-index: 0;
        }

        .left-grad {
          position: absolute;
          bottom: 0; left: 0; right: 0;
          height: 50%;
          background: linear-gradient(to top, var(--bg0) 0%, transparent 100%);
          z-index: 2;
        }

        .left-bar {
          position: absolute;
          right: 0; top: 0; bottom: 0;
          width: 1px;
          background: linear-gradient(180deg,
            transparent 0%,
            rgba(255,140,0,0.5) 35%,
            rgba(255,140,0,0.8) 50%,
            rgba(255,140,0,0.5) 65%,
            transparent 100%);
          z-index: 10;
        }

        .left-inner {
          position: relative;
          z-index: 5;
          display: flex;
          flex-direction: column;
          height: 100%;
          padding: 56px 56px 48px;
        }

        .brand {
          display: flex;
          align-items: center;
          gap: 14px;
          opacity: 0;
          animation: fadeUp 0.7s 0.1s ease forwards;
        }

        .brand-logo {
          width: 48px; height: 48px;
          object-fit: contain;
          filter: drop-shadow(0 0 12px rgba(255,140,0,0.4));
        }

        .brand-name {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 28px;
          letter-spacing: 3px;
          color: var(--t1);
          line-height: 1;
        }

        .brand-name span { color: var(--or); }

        .brand-dot {
          width: 6px; height: 6px;
          background: var(--or);
          border-radius: 50%;
          box-shadow: 0 0 10px var(--or);
          animation: blink 2s ease-in-out infinite;
          flex-shrink: 0;
        }

        .hero {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 32px 0;
        }

        .hero-tag {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 5px 12px 5px 8px;
          background: rgba(255,140,0,0.08);
          border: 1px solid rgba(255,140,0,0.18);
          border-radius: 100px;
          margin-bottom: 28px;
          width: fit-content;
          opacity: 0;
          animation: fadeUp 0.7s 0.2s ease forwards;
        }

        .hero-tag-dot {
          width: 7px; height: 7px;
          border-radius: 50%;
          background: var(--or);
          box-shadow: 0 0 8px var(--or);
          animation: blink 1.8s ease-in-out infinite;
        }

        .hero-tag-text {
          font-size: 10.5px;
          font-weight: 600;
          letter-spacing: 1.8px;
          text-transform: uppercase;
          color: var(--or);
        }

        .hero-h1 {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(52px, 6vw, 82px);
          letter-spacing: 4px;
          line-height: 0.92;
          color: var(--t1);
          margin-bottom: 24px;
          opacity: 0;
          animation: fadeUp 0.8s 0.3s ease forwards;
        }

        .hero-h1 .stroke {
          -webkit-text-stroke: 1.5px rgba(255,255,255,0.18);
          color: transparent;
        }

        .hero-h1 .or { color: var(--or); }

        .hero-sub {
          font-size: 14px;
          font-weight: 400;
          color: var(--t2);
          line-height: 1.7;
          max-width: 380px;
          margin-bottom: 44px;
          opacity: 0;
          animation: fadeUp 0.8s 0.4s ease forwards;
        }

        .pills {
          display: flex;
          flex-direction: column;
          gap: 12px;
          opacity: 0;
          animation: fadeUp 0.8s 0.55s ease forwards;
          margin-top: 28px;
        }

        .pill {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          border: 1px solid rgba(255,255,255,0.05);
          border-radius: 12px;
          background: rgba(255,255,255,0.02);
          transition: var(--transition);
          cursor: default;
        }

        .pill:hover {
          border-color: rgba(255,140,0,0.3);
          background: rgba(255,140,0,0.08);
          transform: translateX(8px);
        }

        .pill-check { color: var(--or); flex-shrink: 0; }

        .pill-icon {
          width: 32px; height: 32px;
          border-radius: 8px;
          background: rgba(255,140,0,0.1);
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
          transition: var(--transition);
        }

        .pill:hover .pill-icon {
          background: var(--or);
        }

        .pill:hover .pill-icon svg {
          color: var(--bg0);
        }

        .pill-icon svg { width: 14px; height: 14px; color: var(--or); transition: var(--transition); }

        .pill-text {
          font-size: 14px;
          font-weight: 400;
          color: var(--t2);
          letter-spacing: 0.2px;
          transition: var(--transition);
        }

        .pill:hover .pill-text {
          color: var(--t1);
        }

        .left-foot {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-top: auto;
          opacity: 0;
          animation: fadeUp 0.8s 0.65s ease forwards;
        }

        .left-foot-line { flex:1; height:1px; background: rgba(255,255,255,0.05); }

        .left-foot-text {
          font-size: 10px;
          font-weight: 500;
          letter-spacing: 1px;
          text-transform: uppercase;
          color: var(--t3);
          white-space: nowrap;
        }

        /* ══ RIGHT ══════════════════════════════════════ */
        .right {
          flex: 1;
          background: var(--bg0);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 48px 56px;
          position: relative;
          overflow: hidden;
        }

        .right::before {
          content: '';
          position: absolute;
          width: 600px; height: 600px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(255,140,0,0.04) 0%, transparent 65%);
          top: 50%; left: 50%;
          transform: translate(-50%, -50%);
          pointer-events: none;
        }

        .form-card {
          position: relative;
          width: 100%;
          max-width: 400px;
          opacity: 0;
          animation: fadeUp 0.8s 0.25s ease forwards;
        }

        .fc-eyebrow {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 16px;
        }

        .fc-eyebrow-bar {
          width: 28px; height: 2.5px;
          background: var(--or);
          border-radius: 2px;
          box-shadow: 0 0 8px rgba(255,140,0,0.5);
        }

        .fc-eyebrow-text {
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 2.5px;
          text-transform: uppercase;
          color: var(--or);
        }

        .fc-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 46px;
          letter-spacing: 3px;
          color: var(--t1);
          line-height: 1;
          margin-bottom: 6px;
        }

        .fc-sub {
          font-size: 13.5px;
          color: var(--t2);
          font-weight: 400;
          margin-bottom: 36px;
          line-height: 1.5;
        }

        .err-box {
          display: flex;
          gap: 12px;
          align-items: flex-start;
          padding: 14px 16px;
          background: rgba(239,68,68,0.08);
          border: 1px solid rgba(239,68,68,0.2);
          border-radius: 12px;
          margin-bottom: 24px;
          animation: shake 0.4s cubic-bezier(.36,.07,.19,.97) both;
        }
        .err-box svg { color:#ef4444; flex-shrink:0; margin-top:1px; }
        .err-msg { color:#fca5a5; font-size:13px; font-weight:500; line-height:1.4; }

        @keyframes shake {
          10%, 90% { transform: translate3d(-1px, 0, 0); }
          20%, 80% { transform: translate3d(2px, 0, 0); }
          30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
          40%, 60% { transform: translate3d(4px, 0, 0); }
        }

        .field { margin-bottom: 20px; }

        .field-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
        }

        .field-label {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          color: var(--t2);
          transition: var(--transition);
        }

        .input-shell.focused .field-label {
          color: var(--or);
        }

        .input-shell {
          position: relative;
          display: flex;
          align-items: center;
        }

        .input-shell::before {
          content: '';
          position: absolute;
          left: 0; top: 50%;
          transform: translateY(-50%);
          width: 3px; height: 0;
          background: var(--or);
          border-radius: var(--radius) 0 0 var(--radius);
          box-shadow: 0 0 10px var(--or);
          transition: height 0.3s ease;
          z-index: 2;
        }

        .input-shell.focused::before { height: 100%; }

        .inp {
          width: 100%;
          padding: 14px 46px 14px 48px;
          background: var(--bg2);
          border: 1.5px solid rgba(255,255,255,0.05);
          border-radius: var(--radius);
          font-family: 'Outfit', sans-serif;
          font-size: 14px;
          font-weight: 400;
          color: var(--t1);
          transition: var(--transition);
          letter-spacing: 0.3px;
        }

        .inp::placeholder { color: var(--t3); font-weight: 300; }

        .inp:focus {
          outline: none;
          border-color: rgba(255,140,0,0.4);
          background: var(--bg3);
          box-shadow:
            0 0 0 4px rgba(255,140,0,0.06),
            0 4px 20px rgba(0,0,0,0.3);
        }

        .inp-icon {
          position: absolute;
          left: 15px;
          pointer-events: none;
          color: var(--t3);
          transition: var(--transition);
          display: flex;
        }

        .input-shell.focused .inp-icon { color: var(--or); transform: scale(1.1); }

        .pw-toggle {
          position: absolute;
          right: 14px;
          background: none;
          border: none;
          cursor: pointer;
          color: var(--t3);
          padding: 4px;
          display: flex;
          align-items: center;
          border-radius: 6px;
          transition: var(--transition);
        }

        .pw-toggle:hover { color: var(--or); background: rgba(255,140,0,0.1); }

        .field-err {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 11.5px;
          color: #f87171;
          font-weight: 500;
          margin-top: 7px;
          animation: fadeUp 0.2s ease;
        }

        .opts {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 28px;
        }

        .check-wrap {
          display: flex;
          align-items: center;
          gap: 9px;
          cursor: pointer;
          user-select: none;
        }

        .check-box {
          appearance: none;
          -webkit-appearance: none;
          width: 18px; height: 18px;
          border: 1.5px solid rgba(255,255,255,0.12);
          border-radius: 5px;
          background: var(--bg2);
          cursor: pointer;
          position: relative;
          transition: var(--transition);
          flex-shrink: 0;
        }

        .check-box:checked {
          background: var(--or);
          border-color: var(--or);
          box-shadow: 0 0 12px rgba(255,140,0,0.4);
        }

        .check-box:checked::after {
          content: '';
          position: absolute;
          left: 5px; top: 2px;
          width: 5px; height: 9px;
          border: 2px solid #fff;
          border-top: none; border-left: none;
          transform: rotate(45deg);
        }

        .check-label {
          font-size: 13px;
          color: var(--t2);
          cursor: pointer;
          font-weight: 400;
          transition: var(--transition);
        }

        .check-wrap:hover .check-label { color: var(--t1); }
        .check-wrap:hover .check-box { border-color: rgba(255,140,0,0.4); }

        .btn {
          width: 100%;
          padding: 16px 24px;
          background: var(--or);
          border: none;
          border-radius: var(--radius);
          font-family: 'Bebas Neue', sans-serif;
          font-size: 18px;
          letter-spacing: 3px;
          color: var(--bg0);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          transition: var(--transition);
          position: relative;
          overflow: hidden;
          box-shadow:
            0 8px 32px rgba(255,140,0,0.25),
            inset 0 1px 0 rgba(255,255,255,0.2);
        }

        .btn::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(105deg,
            transparent 30%,
            rgba(255,255,255,0.25) 50%,
            transparent 70%);
          transform: translateX(-100%);
          transition: transform 0.6s ease;
        }

        .btn:hover:not(:disabled) {
          background: var(--or2);
          transform: translateY(-3px);
          box-shadow:
            0 16px 48px rgba(255,140,0,0.35),
            inset 0 1px 0 rgba(255,255,255,0.3);
        }

        .btn:hover:not(:disabled)::after { transform: translateX(100%); }
        .btn:active:not(:disabled) { transform: translateY(-1px); }
        .btn:disabled { opacity: 0.6; cursor: not-allowed; }

        .divider {
          display: flex;
          align-items: center;
          gap: 14px;
          margin: 32px 0 24px;
        }
        .divider-line { flex:1; height:1px; background: rgba(255,255,255,0.06); }
        .divider-text {
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          color: var(--t3);
        }

        .form-foot { text-align: center; }

        .form-foot-top {
          font-size: 11px;
          color: var(--t3);
          font-weight: 500;
          letter-spacing: 0.5px;
          line-height: 1.7;
        }

        .form-foot-top strong { color: rgba(255,140,0,0.6); font-weight: 600; }

        .shield-badge {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          margin: 20px auto 0;
          padding: 8px 16px;
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.04);
          border-radius: 100px;
          width: fit-content;
          transition: var(--transition);
        }

        .shield-badge:hover {
          background: rgba(255,255,255,0.04);
          border-color: rgba(255,140,0,0.2);
        }

        .shield-badge svg { color: var(--t3); width: 12px; height: 12px; transition: var(--transition); }
        .shield-badge:hover svg { color: var(--or); }
        .shield-badge-text { font-size: 10px; color: var(--t3); font-weight: 500; letter-spacing: 0.8px; }

        @keyframes spin { to { transform: rotate(360deg); } }
        .spin { animation: spin 0.8s linear infinite; }

        @keyframes fadeUp {
          from { opacity:0; transform: translateY(15px); }
          to   { opacity:1; transform: translateY(0); }
        }

        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }

        @media (max-width: 1024px) {
          .left { width: 45%; }
        }

        @media (max-width: 900px) {
          .page { flex-direction: column; }
          .left { width: 100%; min-height: auto; }
          .left-bar { display: none; }
          .left-inner { padding: 48px 40px 40px; }
          .hero-h1 { font-size: 64px; }
          .pills { display: none; }
          .right { padding: 48px 40px; }
          .form-card { max-width: 100%; }
        }

        @media (max-width: 480px) {
          .left-inner { padding: 40px 24px 32px; }
          .right { padding: 40px 24px; }
          .fc-title { font-size: 38px; }
          .hero-h1 { font-size: 48px; }
          .hero { padding: 24px 0; }
        }
      `}</style>

      <div className="page">

        {/* ════ LEFT PANEL ════ */}
        <div className="left">
          <div className="left-grid" />
          <div className="left-slash" />
          <NoiseCanvas />
          <div className="left-grad" />
          <div className="left-bar" />

          <div className="left-inner">
            <div className="brand">
              <img src="/logo.png" alt="logo" className="brand-logo" />
              <div className="brand-name">Con<span>Trackr</span></div>
              <div className="brand-dot" />
            </div>

            <div className="hero">
              <div className="hero-tag">
                <div className="hero-tag-dot" />
                <span className="hero-tag-text">Construction OS · v2.0</span>
              </div>

              <h1 className="hero-h1">
                BUILD<br />
                <span className="stroke">SMARTER</span><br />
                <span className="or">DELIVER</span><br />
                FASTER
              </h1>

              <p className="hero-sub">
                Enterprise-grade inventory management and delivery monitoring for construction teams that demand precision.
              </p>

              <div className="pills">
                {[
                  { icon: <TrendingUp />, text: 'Real-time inventory tracking' },
                  { icon: <Truck />,      text: 'Delivery & logistics monitoring' },
                  { icon: <BarChart3 />,  text: 'Advanced analytics & reporting' },
                ].map((p, i) => (
                  <div className="pill" key={i}>
                    <CheckCircle2 className="pill-check" size={14} />
                    <div className="pill-icon">{p.icon}</div>
                    <span className="pill-text">{p.text}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="left-foot">
              <div className="left-foot-line" />
              <span className="left-foot-text">CENG 116 · CavSU BSCE 4-2 · Group 2</span>
              <div className="left-foot-line" />
            </div>
          </div>
        </div>

        {/* ════ RIGHT PANEL ════ */}
        <div className="right">
          <div className="form-card">
            <div className="fc-eyebrow">
              <div className="fc-eyebrow-bar" />
              <span className="fc-eyebrow-text">Secure Portal</span>
            </div>
            <h1 className="fc-title">Sign In</h1>
            <p className="fc-sub">Enter your credentials to access the platform</p>

            {error && (
              <div className="err-box">
                <AlertCircle size={16} />
                <span className="err-msg">{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="field">
                <div className="field-top">
                  <label className="field-label">Email Address</label>
                </div>
                <div className={`input-shell${focused === 'email' ? ' focused' : ''}`}>
                  <span className="inp-icon"><Mail size={16} /></span>
                  <input
                    {...register('email', {
                      required: 'Email is required',
                      pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: 'Invalid email address' }
                    })}
                    type="email"
                    placeholder="you@example.com"
                    className="inp"
                    onFocus={() => setFocused('email')}
                    onBlur={() => setFocused(null)}
                  />
                </div>
                {errors.email && <div className="field-err"><AlertCircle size={11} />{errors.email.message}</div>}
              </div>

              <div className="field">
                <div className="field-top">
                  <label className="field-label">Password</label>
                </div>
                <div className={`input-shell${focused === 'pw' ? ' focused' : ''}`}>
                  <span className="inp-icon"><Lock size={16} /></span>
                  <input
                    {...register('password', {
                      required: 'Password is required',
                      minLength: { value: 6, message: 'Minimum 6 characters' }
                    })}
                    type={showPw ? 'text' : 'password'}
                    placeholder="••••••••"
                    className="inp"
                    onFocus={() => setFocused('pw')}
                    onBlur={() => setFocused(null)}
                  />
                  <button type="button" className="pw-toggle" onClick={() => setShowPw(!showPw)} aria-label="Toggle password visibility">
                    {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {errors.password && <div className="field-err"><AlertCircle size={11} />{errors.password.message}</div>}
              </div>

              <div className="opts">
                <label className="check-wrap">
                  <input type="checkbox" className="check-box" />
                  <span className="check-label">Remember me</span>
                </label>
              </div>

              <button type="submit" disabled={isSubmitting} className="btn">
                {isSubmitting ? (
                  <>
                    <Loader2 className="spin" size={18} />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign In
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>

            <div className="divider">
              <div className="divider-line" />
              <span className="divider-text">Database Management in Construction</span>
              <div className="divider-line" />
            </div>

            <div className="form-foot">
              <div className="form-foot-top">
                <strong>CENG 116</strong> · CavSU BSCE 4-2 · Group 2
              </div>
              <div className="shield-badge">
                <Shield />
                <span className="shield-badge-text">256-bit encrypted connection</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </>
  )
}