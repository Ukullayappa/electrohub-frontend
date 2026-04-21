import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

export function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';

  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form.email, form.password);
      toast.success('Welcome back!');
      navigate(redirect);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--gray-6)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 1rem' }}>
      <div style={{ width: '100%', maxWidth: 440 }}>
        {/* Brand */}
        <div className="text-center mb-4">
          <Link to="/" style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: 800, color: 'var(--dark)', textDecoration: 'none' }}>
            Electro<span style={{ color: 'var(--primary)' }}>Hub</span>
          </Link>
          <p style={{ color: 'var(--gray-2)', marginTop: '0.25rem', fontSize: '0.875rem' }}>Sign in to your account</p>
        </div>

        <div style={{ background: 'var(--white)', borderRadius: 'var(--radius-xl)', padding: '2.5rem', boxShadow: 'var(--shadow-xl)', border: '1px solid var(--gray-4)' }}>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Email Address</label>
              <div className="position-relative">
                <i className="bi bi-envelope" style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--gray-3)' }}></i>
                <input
                  type="email"
                  className="form-control"
                  placeholder="you@example.com"
                  style={{ paddingLeft: '2.5rem' }}
                  value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  required
                />
              </div>
            </div>

            <div className="mb-4">
              <div className="d-flex justify-content-between">
                <label className="form-label">Password</label>
                <Link to="/forgot-password" style={{ fontSize: '0.8rem', color: 'var(--primary)', textDecoration: 'none' }}>Forgot password?</Link>
              </div>
              <div className="position-relative">
                <i className="bi bi-lock" style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--gray-3)' }}></i>
                <input
                  type={showPass ? 'text' : 'password'}
                  className="form-control"
                  placeholder="••••••••"
                  style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem' }}
                  value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  required
                />
                <button type="button" onClick={() => setShowPass(!showPass)} style={{ position: 'absolute', right: '0.875rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--gray-3)', cursor: 'pointer', padding: 0 }}>
                  <i className={`bi ${showPass ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                </button>
              </div>
            </div>

            <button type="submit" className="btn btn-primary w-100" style={{ padding: '0.875rem', fontSize: '1rem' }} disabled={loading}>
              {loading ? <><span className="spinner-border spinner-border-sm me-2"></span>Signing in...</> : 'Sign In'}
            </button>
          </form>

          <div className="mt-4 text-center">
            <span style={{ color: 'var(--gray-2)', fontSize: '0.875rem' }}>
              Don't have an account? <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' }}>Create one</Link>
            </span>
          </div>

          {/* Demo credentials */}
          <div style={{ background: 'var(--primary-light)', borderRadius: 'var(--radius-md)', padding: '1rem', marginTop: '1.5rem', fontSize: '0.8rem' }}>
            <div style={{ fontWeight: 700, color: 'var(--primary)', marginBottom: '0.35rem' }}>Demo Credentials</div>
            <div style={{ color: 'var(--gray-1)' }}>
              <div>Admin: <strong>admin@electrohub.com</strong> / <strong>password</strong></div>
              <div>User: <strong>john@example.com</strong> / <strong>password</strong></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '', phone: '' });
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (form.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    try {
      await register({ name: form.name, email: form.email, password: form.password, phone: form.phone });
      toast.success('Account created successfully!');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--gray-6)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 1rem' }}>
      <div style={{ width: '100%', maxWidth: 480 }}>
        <div className="text-center mb-4">
          <Link to="/" style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: 800, color: 'var(--dark)', textDecoration: 'none' }}>
            Electro<span style={{ color: 'var(--primary)' }}>Hub</span>
          </Link>
          <p style={{ color: 'var(--gray-2)', marginTop: '0.25rem', fontSize: '0.875rem' }}>Create your account</p>
        </div>

        <div style={{ background: 'var(--white)', borderRadius: 'var(--radius-xl)', padding: '2.5rem', boxShadow: 'var(--shadow-xl)', border: '1px solid var(--gray-4)' }}>
          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-12">
                <label className="form-label">Full Name</label>
                <input className="form-control" placeholder="John Doe" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
              </div>
              <div className="col-md-6">
                <label className="form-label">Email Address</label>
                <input type="email" className="form-control" placeholder="you@example.com" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required />
              </div>
              <div className="col-md-6">
                <label className="form-label">Phone (optional)</label>
                <input type="tel" className="form-control" placeholder="+91 9876543210" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
              </div>
              <div className="col-md-6">
                <label className="form-label">Password</label>
                <div className="position-relative">
                  <input
                    type={showPass ? 'text' : 'password'}
                    className="form-control"
                    placeholder="Min. 6 characters"
                    value={form.password}
                    onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                    required
                  />
                  <button type="button" onClick={() => setShowPass(!showPass)} style={{ position: 'absolute', right: '0.875rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--gray-3)', cursor: 'pointer', padding: 0 }}>
                    <i className={`bi ${showPass ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                  </button>
                </div>
              </div>
              <div className="col-md-6">
                <label className="form-label">Confirm Password</label>
                <input type="password" className="form-control" placeholder="Repeat password" value={form.confirmPassword} onChange={e => setForm(f => ({ ...f, confirmPassword: e.target.value }))} required />
              </div>
            </div>

            <div className="mt-3 mb-4">
              <label style={{ display: 'flex', gap: '0.6rem', cursor: 'pointer', fontSize: '0.85rem', color: 'var(--gray-1)' }}>
                <input type="checkbox" required /> I agree to the <Link to="/terms" style={{ color: 'var(--primary)' }}>Terms of Service</Link> and <Link to="/privacy" style={{ color: 'var(--primary)' }}>Privacy Policy</Link>
              </label>
            </div>

            <button type="submit" className="btn btn-primary w-100" style={{ padding: '0.875rem', fontSize: '1rem' }} disabled={loading}>
              {loading ? <><span className="spinner-border spinner-border-sm me-2"></span>Creating Account...</> : 'Create Account'}
            </button>
          </form>

          <div className="mt-4 text-center">
            <span style={{ color: 'var(--gray-2)', fontSize: '0.875rem' }}>
              Already have an account? <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' }}>Sign in</Link>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
