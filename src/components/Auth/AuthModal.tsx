import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Lock, User } from 'lucide-react';
import { useAuth } from '../../contexts';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const { user, signIn, signUp, signOut, loading } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    const { error } = isSignUp
      ? await signUp(email, password, name)
      : await signIn(email, password);

    setSubmitting(false);

    if (error) {
      setError(error.message);
    } else {
      setName('');
      setEmail('');
      setPassword('');
      onClose();
    }
  };

  const handleSignOut = async () => {
    await signOut();
    onClose();
  };

  if (loading) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
          }}
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(0, 0, 0, 0.85)',
              backdropFilter: 'blur(20px)',
            }}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 10 }}
            transition={{ type: 'spring', duration: 0.4, bounce: 0.15 }}
            style={{
              position: 'relative',
              width: '100%',
              maxWidth: '400px',
              background: '#0c0c0c',
              borderRadius: '20px',
              border: '1px solid rgba(255, 255, 255, 0.06)',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8)',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '20px 24px',
                borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
              }}
            >
              <h2 style={{ color: '#ffffff', fontSize: '17px', fontWeight: 600 }}>
                {user ? 'Account' : isSignUp ? 'Create Account' : 'Sign In'}
              </h2>
              <button
                type="button"
                onClick={onClose}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '32px',
                  height: '32px',
                  background: 'rgba(255, 255, 255, 0.06)',
                  border: 'none',
                  borderRadius: '50%',
                  color: '#888888',
                  cursor: 'pointer',
                }}
              >
                <X size={16} />
              </button>
            </div>

            <div style={{ padding: '24px' }}>
              {user ? (
                <div>
                  <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                    <div
                      style={{
                        width: '64px',
                        height: '64px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #ff4444, #ff8c00)',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: '12px',
                      }}
                    >
                      <Mail size={28} color="#ffffff" />
                    </div>
                    <p style={{ color: '#ffffff', fontSize: '16px', marginBottom: '4px' }}>
                      {user.email}
                    </p>
                    <p style={{ color: '#666666', fontSize: '13px' }}>
                      Signed in successfully
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleSignOut}
                    style={{
                      width: '100%',
                      padding: '14px',
                      background: 'rgba(255,68,68,0.1)',
                      border: 'none',
                      borderRadius: '12px',
                      color: '#ff4444',
                      fontSize: '14px',
                      fontWeight: 500,
                      cursor: 'pointer',
                    }}
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  {isSignUp && (
                    <div style={{ marginBottom: '16px' }}>
                      <div style={{ position: 'relative' }}>
                        <User
                          size={18}
                          style={{
                            position: 'absolute',
                            left: '16px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            color: '#666666',
                          }}
                        />
                        <input
                          type="text"
                          value={name}
                          onChange={e => setName(e.target.value)}
                          placeholder="Your name"
                          required
                          autoFocus
                          style={{
                            width: '100%',
                            padding: '14px 16px 14px 48px',
                            background: 'rgba(255,255,255,0.06)',
                            border: 'none',
                            borderRadius: '12px',
                            color: '#ffffff',
                            fontSize: '15px',
                            boxSizing: 'border-box',
                          }}
                        />
                      </div>
                    </div>
                  )}
                  <div style={{ marginBottom: '16px' }}>
                    <div style={{ position: 'relative' }}>
                      <Mail
                        size={18}
                        style={{
                          position: 'absolute',
                          left: '16px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          color: '#666666',
                        }}
                      />
                      <input
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="Email"
                        required
                        autoFocus={!isSignUp}
                        style={{
                          width: '100%',
                          padding: '14px 16px 14px 48px',
                          background: 'rgba(255,255,255,0.06)',
                          border: 'none',
                          borderRadius: '12px',
                          color: '#ffffff',
                          fontSize: '15px',
                          boxSizing: 'border-box',
                        }}
                      />
                    </div>
                  </div>

                  <div style={{ marginBottom: '16px' }}>
                    <div style={{ position: 'relative' }}>
                      <Lock
                        size={18}
                        style={{
                          position: 'absolute',
                          left: '16px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          color: '#666666',
                        }}
                      />
                      <input
                        type="password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        placeholder="Password"
                        required
                        minLength={6}
                        style={{
                          width: '100%',
                          padding: '14px 16px 14px 48px',
                          background: 'rgba(255,255,255,0.06)',
                          border: 'none',
                          borderRadius: '12px',
                          color: '#ffffff',
                          fontSize: '15px',
                          boxSizing: 'border-box',
                        }}
                      />
                    </div>
                  </div>

                  {error && (
                    <p style={{ color: '#ff4444', fontSize: '13px', marginBottom: '16px' }}>
                      {error}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={submitting || !email || !password}
                    style={{
                      width: '100%',
                      padding: '14px',
                      background: submitting || !email || !password ? 'rgba(255,255,255,0.1)' : '#ffffff',
                      border: 'none',
                      borderRadius: '12px',
                      color: submitting || !email || !password ? '#666666' : '#000000',
                      fontSize: '15px',
                      fontWeight: 500,
                      cursor: submitting || !email || !password ? 'not-allowed' : 'pointer',
                      marginBottom: '12px',
                    }}
                  >
                    {submitting ? 'Loading...' : isSignUp ? 'Create Account' : 'Sign In'}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setIsSignUp(!isSignUp);
                      setError('');
                    }}
                    style={{
                      width: '100%',
                      padding: '14px',
                      background: 'transparent',
                      border: 'none',
                      color: '#888888',
                      fontSize: '14px',
                      cursor: 'pointer',
                    }}
                  >
                    {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
