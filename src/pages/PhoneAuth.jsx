import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { validateKenyanPhone, normalizePhoneToE164, formatPhoneDisplay } from '../lib/phoneUtils.js'

export default function PhoneAuth() {
  const { sendOtp, verifyOtp, user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const redirectTo = location.state?.from || '/account'

  const [step, setStep] = useState('phone') // phone | verify
  const [phoneInput, setPhoneInput] = useState('')
  const [normalizedPhone, setNormalizedPhone] = useState('')
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [resendCountdown, setResendCountdown] = useState(0)
  const otpRefs = useRef([])

  // If already logged in with phone, redirect
  useEffect(() => {
    if (user && user.phone) {
      navigate(redirectTo, { replace: true })
    }
  }, [user, navigate, redirectTo])

  // Resend countdown
  useEffect(() => {
    if (resendCountdown <= 0) return
    const id = setTimeout(() => setResendCountdown(c => c - 1), 1000)
    return () => clearTimeout(id)
  }, [resendCountdown])

  const handleSendCode = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    const validation = validateKenyanPhone(phoneInput)
    if (!validation.valid) {
      setError(validation.error)
      return
    }

    setLoading(true)
    try {
      await sendOtp(validation.normalized)
      setNormalizedPhone(validation.normalized)
      setSuccess(`Code sent to ${formatPhoneDisplay(validation.normalized)}`)
      setStep('verify')
      setResendCountdown(60)
      setTimeout(() => otpRefs.current[0]?.focus(), 100)
    } catch (err) {
      // Don't reveal whether phone exists — generic error
      const msg = err.message || 'Failed to send code. Please try again.'
      if (msg.includes('rate')) {
        setError('Too many requests. Please wait a moment and try again.')
      } else {
        setError(msg)
      }
    } finally {
      setLoading(false)
    }
  }

  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return
    const newOtp = [...otp]
    // Handle paste of full code
    if (value.length > 1) {
      const digits = value.replace(/\D/g, '').slice(0, 6).split('')
      digits.forEach((d, i) => {
        if (i < 6) newOtp[i] = d
      })
      setOtp(newOtp)
      const nextEmpty = newOtp.findIndex(v => v === '')
      if (nextEmpty !== -1) otpRefs.current[nextEmpty]?.focus()
      else otpRefs.current[5]?.focus()
      // Auto-verify if all filled
      if (newOtp.every(v => v !== '')) {
        setTimeout(() => handleVerify(newOtp.join('')), 100)
      }
      return
    }
    newOtp[index] = value
    setOtp(newOtp)
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus()
    }
    // Auto-verify when 6 digits filled
    if (newOtp.every(v => v !== '') && newOtp.join('').length === 6) {
      setTimeout(() => handleVerify(newOtp.join('')), 150)
    }
  }

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus()
    }
    if (e.key === 'ArrowLeft' && index > 0) otpRefs.current[index - 1]?.focus()
    if (e.key === 'ArrowRight' && index < 5) otpRefs.current[index + 1]?.focus()
  }

  const handleVerify = async (codeToVerify) => {
    const code = codeToVerify || otp.join('')
    if (code.length !== 6) {
      setError('Enter the 6-digit code')
      return
    }
    setError('')
    setLoading(true)
    try {
      await verifyOtp(normalizedPhone, code)
      setSuccess('Phone verified! Welcome to Velcor.')
      setTimeout(() => navigate(redirectTo, { replace: true }), 500)
    } catch (err) {
      let msg = err.message || 'Invalid code. Please try again.'
      if (msg.includes('expired')) msg = 'Code expired. Please request a new code.'
      if (msg.includes('attempt')) msg = 'Too many attempts. Please request a new code.'
      setError(msg)
      // Clear OTP on error
      setOtp(['', '', '', '', '', ''])
      otpRefs.current[0]?.focus()
    } finally {
      setLoading(false)
    }
  }

  const handleResend = async () => {
    if (resendCountdown > 0) return
    setError('')
    setLoading(true)
    try {
      await sendOtp(normalizedPhone)
      setSuccess('New code sent!')
      setResendCountdown(60)
      setOtp(['', '', '', '', '', ''])
      otpRefs.current[0]?.focus()
    } catch (err) {
      setError(err.message || 'Failed to resend code')
    } finally {
      setLoading(false)
    }
  }

  const handleChangeNumber = () => {
    setStep('phone')
    setOtp(['', '', '', '', '', ''])
    setError('')
    setSuccess('')
    setResendCountdown(0)
  }

  return (
    <div style={{minHeight:'100vh', background:'linear-gradient(135deg, #1a1a1e 0%, #252529 50%, #1a1a1e 100%)', display:'flex', alignItems:'center', justifyContent:'center', padding:16, position:'relative', overflow:'hidden'}}>
      {/* Decorative champagne glow */}
      <div style={{position:'absolute', top:'-20%', right:'-10%', width:600, height:600, background:'radial-gradient(circle, rgba(201,168,106,0.08) 0%, transparent 70%)', pointerEvents:'none'}} />
      <div style={{position:'absolute', bottom:'-20%', left:'-10%', width:500, height:500, background:'radial-gradient(circle, rgba(201,168,106,0.06) 0%, transparent 70%)', pointerEvents:'none'}} />

      <div style={{width:'100%', maxWidth:440, position:'relative', zIndex:1}}>
        {/* Velcor Branding */}
        <div style={{textAlign:'center', marginBottom:24}}>
          <div style={{display:'inline-flex', alignItems:'center', gap:12, marginBottom:16}}>
            <div style={{width:52, height:52, borderRadius:14, background:'linear-gradient(135deg, #c9a86a 0%, #b8944f 100%)', display:'flex', alignItems:'center', justifyContent:'center', color:'#1a1a1e', fontFamily:'Cormorant Garamond', fontWeight:800, fontSize:24, boxShadow:'0 8px 24px rgba(201,168,106,0.25)'}}>V</div>
            <div style={{textAlign:'left'}}>
              <div style={{fontFamily:'Cormorant Garamond', fontWeight:700, fontSize:20, letterSpacing:'-0.02em', color:'white', lineHeight:1}}>VELCOR</div>
              <div style={{fontSize:10, letterSpacing:'0.18em', fontWeight:800, color:'#c9a86a'}}>APPLIANCES</div>
            </div>
          </div>
          <h1 style={{fontFamily:'Cormorant Garamond', fontSize:28, fontWeight:600, color:'white', letterSpacing:'-0.02em'}}>Quality for Every Home</h1>
          <p style={{color:'#a8a8b8', fontSize:13, marginTop:4, fontWeight:400}}>Sign in with your phone number — no password needed</p>
        </div>

        {/* Glass Card */}
        <div style={{
          background:'rgba(255,255,255,0.96)',
          backdropFilter:'blur(24px) saturate(180%)',
          WebkitBackdropFilter:'blur(24px) saturate(180%)',
          border:'1px solid rgba(255,255,255,0.5)',
          borderRadius:24,
          padding:28,
          boxShadow:'0 20px 60px rgba(0,0,0,0.25), 0 0 0 1px rgba(201,168,106,0.08)',
          position:'relative',
          overflow:'hidden'
        }}>
          {/* Champagne accent line */}
          <div style={{position:'absolute', top:0, left:0, right:0, height:3, background:'linear-gradient(90deg, #c9a86a 0%, #e8d5b5 50%, #c9a86a 100%)'}} />

          {step === 'phone' ? (
            <>
              <div style={{marginBottom:20}}>
                <h2 style={{fontSize:20, fontWeight:700, color:'#1a1a1e', fontFamily:'Inter'}}>Enter your phone number</h2>
                <p style={{color:'#6b6b78', fontSize:13, marginTop:6, lineHeight:1.5}}>We’ll send you a 6-digit verification code by SMS. Works with <b style={{color:'#1a1a1e'}}>07</b>, <b style={{color:'#1a1a1e'}}>01</b> and <b style={{color:'#1a1a1e'}}>+254</b> formats.</p>
              </div>

              <form onSubmit={handleSendCode}>
                <label style={{display:'block'}}>
                  <span style={{fontSize:11, fontWeight:800, letterSpacing:'0.08em', color:'#1a1a1e'}}>PHONE NUMBER *</span>
                  <div style={{marginTop:8, display:'flex', gap:8}}>
                    <div style={{
                      display:'flex', alignItems:'center', gap:8,
                      background:'#f5f3ef', border:'1.5px solid #e8e6e1', borderRadius:12,
                      padding:'0 12px', fontWeight:700, fontSize:14, color:'#1a1a1e',
                      flexShrink:0, minWidth:90, justifyContent:'center'
                    }}>
                      <span style={{fontSize:16}}>🇰🇪</span> +254
                    </div>
                    <input
                      type="tel"
                      inputMode="numeric"
                      value={phoneInput}
                      onChange={e=>setPhoneInput(e.target.value.replace(/[^0-9+ ]/g, ''))}
                      placeholder="712 345 678"
                      required
                      autoComplete="tel"
                      autoFocus
                      style={{
                        flex:1, padding:'14px 16px', borderRadius:12, border:'1.5px solid #e8e6e1',
                        background:'white', fontSize:16, fontWeight:500, outline:'none',
                        transition:'border-color 0.2s, box-shadow 0.2s', letterSpacing:'0.02em'
                      }}
                      onFocus={e=>{e.target.style.borderColor='#c9a86a'; e.target.style.boxShadow='0 0 0 4px rgba(201,168,106,0.15)'}}
                      onBlur={e=>{e.target.style.borderColor='#e8e6e1'; e.target.style.boxShadow='none'}}
                    />
                  </div>
                  <div style={{fontSize:11, color:'#9a9ab0', marginTop:6}}>Example: 0712 345 678 or +254 712 345 678 • Safaricom, Airtel, Telkom</div>
                </label>

                {error && <div style={{marginTop:14, background:'#fef2f2', border:'1px solid #fecaca', color:'#991b1b', padding:12, borderRadius:12, fontSize:13, fontWeight:600, display:'flex', gap:8, alignItems:'center'}}><span style={{color:'#e02424'}}>⚠️</span> {error}</div>}
                {success && <div style={{marginTop:14, background:'#dcfce7', border:'1px solid #86efac', color:'#166534', padding:12, borderRadius:12, fontSize:13, fontWeight:600}}>✓ {success}</div>}

                <button type="submit" disabled={loading || !phoneInput.trim()} style={{
                  width:'100%', marginTop:18, padding:'16px', borderRadius:999,
                  background: loading || !phoneInput.trim() ? '#e8e6e1' : 'linear-gradient(135deg, #c9a86a 0%, #b8944f 100%)',
                  color: loading || !phoneInput.trim() ? '#9a9ab0' : '#1a1a1e',
                  fontWeight:800, fontSize:15, border:'none', cursor: loading || !phoneInput.trim() ? 'not-allowed' : 'pointer',
                  boxShadow: loading || !phoneInput.trim() ? 'none' : '0 8px 24px rgba(201,168,106,0.3)',
                  transition:'all 0.2s', display:'flex', alignItems:'center', justifyContent:'center', gap:8,
                  opacity: loading ? 0.8 : 1
                }}>
                  {loading ? (
                    <>
                      <span style={{width:16, height:16, border:'2px solid rgba(26,26,30,0.2)', borderTopColor:'#1a1a1e', borderRadius:'50%', display:'inline-block', animation:'spin 0.8s linear infinite'}} />
                      Sending code...
                    </>
                  ) : 'Send Verification Code'}
                </button>

                <div style={{marginTop:14, textAlign:'center', fontSize:12, color:'#6b6b78'}}>
                  Prefer email? <Link to="/login" style={{color:'#b8944f', fontWeight:700, textDecoration:'none'}}>Sign in with email</Link> <span style={{color:'#c9a86a'}}>•</span> <Link to="/register" style={{color:'#b8944f', fontWeight:700}}>Create account</Link>
                </div>

                <div style={{marginTop:16, background:'#fafaf8', border:'1px solid #e8e6e1', borderRadius:12, padding:12, display:'flex', gap:10, alignItems:'center'}}>
                  <span style={{width:32, height:32, borderRadius:8, background:'#1a1a1e', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, color:'#c9a86a', fontSize:14}}>🔒</span>
                  <div style={{fontSize:11, color:'#6b6b78', lineHeight:1.4}}>
                    <b style={{color:'#1a1a1e'}}>Secure & private.</b> We never share your number. Pay after delivery — no advance payment.
                  </div>
                </div>
              </form>
            </>
          ) : (
            <>
              <div style={{marginBottom:16}}>
                <h2 style={{fontSize:20, fontWeight:700, color:'#1a1a1e'}}>Check your messages</h2>
                <p style={{color:'#6b6b78', fontSize:13, marginTop:6, lineHeight:1.5}}>
                  Code sent to <b style={{color:'#1a1a1e'}}>{formatPhoneDisplay(normalizedPhone)}</b>
                  <button onClick={handleChangeNumber} style={{marginLeft:8, background:'none', border:'none', color:'#b8944f', fontWeight:700, fontSize:12, cursor:'pointer', textDecoration:'underline'}}>Change</button>
                </p>
                <p style={{color:'#9a9ab0', fontSize:12, marginTop:4}}>Enter the 6-digit code • Expires in 60 seconds</p>
              </div>

              <div>
                <label style={{fontSize:11, fontWeight:800, letterSpacing:'0.08em', color:'#1a1a1e'}}>VERIFICATION CODE *</label>
                <div style={{marginTop:10, display:'flex', gap:8, justifyContent:'center'}}>
                  {otp.map((digit, idx) => (
                    <input
                      key={idx}
                      ref={el => otpRefs.current[idx] = el}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={e=>handleOtpChange(idx, e.target.value)}
                      onKeyDown={e=>handleOtpKeyDown(idx, e)}
                      onFocus={e=>{e.target.style.borderColor='#c9a86a'; e.target.style.boxShadow='0 0 0 4px rgba(201,168,106,0.15)'}}
                      onBlur={e=>{e.target.style.borderColor='#e8e6e1'; e.target.style.boxShadow='none'}}
                      style={{
                        width:48, height:56, textAlign:'center', fontSize:22, fontWeight:700, letterSpacing:'0.04em',
                        border:'1.5px solid #e8e6e1', borderRadius:12, background:'white', outline:'none',
                        transition:'all 0.15s', color:'#1a1a1e', caretColor:'#c9a86a'
                      }}
                      aria-label={`Digit ${idx+1}`}
                    />
                  ))}
                </div>

                {error && <div style={{marginTop:14, background:'#fef2f2', border:'1px solid #fecaca', color:'#991b1b', padding:12, borderRadius:12, fontSize:13, fontWeight:600, display:'flex', gap:8, alignItems:'center', justifyContent:'center'}}>⚠️ {error}</div>}
                {success && <div style={{marginTop:14, background:'#dcfce7', border:'1px solid #86efac', color:'#166534', padding:12, borderRadius:12, fontSize:13, fontWeight:600, textAlign:'center'}}>✓ {success}</div>}

                <button onClick={()=>handleVerify()} disabled={loading || otp.join('').length !== 6} style={{
                  width:'100%', marginTop:16, padding:'16px', borderRadius:999,
                  background: otp.join('').length !== 6 ? '#e8e6e1' : 'linear-gradient(135deg, #c9a86a 0%, #b8944f 100%)',
                  color: otp.join('').length !== 6 ? '#9a9ab0' : '#1a1a1e',
                  fontWeight:800, fontSize:15, border:'none', cursor: otp.join('').length !== 6 ? 'not-allowed' : 'pointer',
                  boxShadow: otp.join('').length !== 6 ? 'none' : '0 8px 24px rgba(201,168,106,0.3)', display:'flex', alignItems:'center', justifyContent:'center', gap:8
                }}>
                  {loading ? (
                    <>
                      <span style={{width:16, height:16, border:'2px solid rgba(26,26,30,0.2)', borderTopColor:'#1a1a1e', borderRadius:'50%', display:'inline-block', animation:'spin 0.8s linear infinite'}} />
                      Verifying...
                    </>
                  ) : 'Verify Code'}
                </button>

                <div style={{marginTop:14, textAlign:'center'}}>
                  {resendCountdown > 0 ? (
                    <span style={{fontSize:13, color:'#9a9ab0'}}>Resend code in <b style={{color:'#1a1a1e', fontVariantNumeric:'tabular-nums'}}>{resendCountdown}s</b></span>
                  ) : (
                    <button onClick={handleResend} disabled={loading} style={{background:'none', border:'none', color:'#b8944f', fontWeight:700, fontSize:13, cursor:'pointer', textDecoration:'underline'}}>
                      Resend code
                    </button>
                  )}
                  <span style={{color:'#e8e6e1', margin:'0 8px'}}>|</span>
                  <button onClick={handleChangeNumber} style={{background:'none', border:'none', color:'#6b6b78', fontWeight:600, fontSize:13, cursor:'pointer'}}>Change number</button>
                </div>

                <div style={{marginTop:16, background:'#fafaf8', border:'1px solid #e8e6e1', borderRadius:12, padding:12, display:'flex', gap:10, alignItems:'center'}}>
                  <span style={{fontSize:16}}>💡</span>
                  <div style={{fontSize:11, color:'#6b6b78', lineHeight:1.4}}>Didn’t get SMS? Check DND or try <b style={{color:'#1a1a1e'}}>Resend</b> after countdown. Demo code: <code style={{background:'white', border:'1px solid #e8e6e1', padding:'2px 6px', borderRadius:6, fontWeight:700, color:'#b8944f'}}>123456</code></div>
                </div>
              </div>
            </>
          )}
        </div>

        <div style={{marginTop:16, textAlign:'center', color:'rgba(255,255,255,0.5)', fontSize:11, fontWeight:500}}>
          <span style={{letterSpacing:'0.06em'}}>VELCOR APPLIANCES</span> <span style={{margin:'0 6px', color:'rgba(201,168,106,0.4)'}}>•</span> Nairobi, Kenya <span style={{margin:'0 6px', color:'rgba(201,168,106,0.4)'}}>•</span> Pay after delivery
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } } @media (max-width: 480px) { input[aria-label^="Digit"] { width: 42px !important; height: 50px !important; font-size: 20px !important; } }`}</style>
    </div>
  )
}
