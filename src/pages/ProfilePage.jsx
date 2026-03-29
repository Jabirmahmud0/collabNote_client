import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../hooks/useTheme';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { User, Mail, Lock, Image, Trash2, LogOut, Sun, Moon, ArrowLeft, Shield } from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Modal from '../components/ui/Modal';
import Avatar from '../components/ui/Avatar';

const ProfilePage = () => {
  const navigate = useNavigate();
  const { user, logout, updateUser } = useAuth();
  const { theme, toggleTheme, isDark } = useTheme();

  const [loading, setLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');
  const [formData, setFormData] = useState({ name: '', email: '', currentPassword: '', newPassword: '' });
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (user) setFormData((prev) => ({ ...prev, name: user.name || '', email: user.email || '' }));
  }, [user]);

  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB');
      return;
    }

    const uploadData = new FormData();
    uploadData.append('avatar', file);

    setLoading(true);
    try {
      const res = await api.patch('/api/users/me/avatar', uploadData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      updateUser({ avatar: res.data.data.user.avatar });
      toast.success('Avatar updated successfully');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update avatar');
    } finally {
      setLoading(false);
      // Reset input
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    try { await api.patch('/api/users/me', { name: formData.name }); updateUser({ name: formData.name }); toast.success('Profile updated'); }
    catch { toast.error('Failed to update profile'); }
    finally { setLoading(false); }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!formData.currentPassword || !formData.newPassword) { toast.error('Fill in both password fields'); return; }
    setLoading(true);
    try {
      await api.patch('/api/users/me/password', { currentPassword: formData.currentPassword, newPassword: formData.newPassword });
      toast.success('Password changed');
      setFormData((prev) => ({ ...prev, currentPassword: '', newPassword: '' }));
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to change password'); }
    finally { setLoading(false); }
  };

  const handleDeleteAccount = async () => {
    if (!deletePassword) { toast.error('Enter your password'); return; }
    setLoading(true);
    try { await api.delete('/api/users/me', { data: { password: deletePassword } }); await logout(); navigate('/auth'); toast.success('Account deleted'); }
    catch (err) { toast.error(err.response?.data?.message || 'Failed to delete account'); }
    finally { setLoading(false); setShowDeleteModal(false); setDeletePassword(''); }
  };

  const handleLogout = async () => { await logout(); navigate('/auth'); };

  const Section = ({ children, title, icon: Icon, delay = 0, danger = false, className = '' }) => (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className={`cn-card p-6 ${danger ? 'border-danger/15' : ''} ${className}`}
    >
      <div className="flex items-center gap-2.5 mb-5">
        <Icon className={`w-4 h-4 ${danger ? 'text-danger' : 'text-accent'}`} />
        <h2 className={`text-base font-bold tracking-tight ${danger ? 'text-danger' : 'text-text-primary'}`}>{title}</h2>
      </div>
      {children}
    </motion.section>
  );

  return (
    <div className="min-h-screen bg-bg-primary relative">
      <div className="mesh-bg opacity-15 pointer-events-none" />

      {/* Header */}
      <header className="h-14 bg-bg-primary/60 backdrop-blur-xl border-b border-border flex items-center px-6 sticky top-0 z-20">
        <button onClick={() => navigate('/dashboard')} className="p-2 rounded-lg hover:bg-white/5 text-text-muted hover:text-text-primary transition-all mr-3">
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h1 className="text-lg font-bold tracking-tight text-text-primary">Settings</h1>
        </div>
      </header>

      <div className="max-w-3xl mx-auto p-6 space-y-5 pb-20">
        {/* Profile */}
        <Section title="Profile" icon={User}>
          <div className="flex items-center gap-5 pb-5 mb-5 border-b border-border">
            <div className="relative">
              <Avatar src={user?.avatar} name={user?.name} size="xl" />
              <button 
                onClick={() => fileInputRef.current?.click()}
                disabled={loading}
                className="absolute -bottom-1 -right-1 w-7 h-7 bg-accent text-white rounded-lg flex items-center justify-center text-xs shadow-md hover:scale-110 active:scale-95 transition-transform disabled:opacity-50 disabled:pointer-events-none"
              >
                <Image className="w-3 h-3" />
              </button>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleAvatarUpload} 
                accept="image/*" 
                className="hidden" 
              />
            </div>
            <div>
              <h3 className="font-semibold text-text-primary">{user?.name}</h3>
              <p className="text-sm text-text-muted">{user?.email}</p>
            </div>
          </div>
          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <Input label="Name" value={formData.name} onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))} icon={<User className="w-4 h-4" />} />
              <Input label="Email" value={formData.email} disabled icon={<Mail className="w-4 h-4" />} />
            </div>
            <div className="flex justify-end">
              <Button type="submit" size="sm" loading={loading}>Update Profile</Button>
            </div>
          </form>
        </Section>

        <div className="grid md:grid-cols-2 gap-5">
          {/* Theme */}
          <Section title="Appearance" icon={Sun} delay={0.05}>
            <div className="flex items-center justify-between p-4 rounded-xl bg-bg-tertiary border border-border">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-accent/10 flex items-center justify-center text-accent">
                  {isDark ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                </div>
                <div>
                  <p className="text-sm font-medium text-text-primary">{isDark ? 'Dark' : 'Light'} mode</p>
                  <p className="text-xs text-text-muted">Toggle theme</p>
                </div>
              </div>
              <Button variant="ghost" size="xs" onClick={toggleTheme}>Switch</Button>
            </div>
          </Section>

          {/* Password */}
          <Section title="Security" icon={Shield} delay={0.1}>
            <form onSubmit={handleChangePassword} className="space-y-3">
              <Input label="Current" type="password" placeholder="••••••" value={formData.currentPassword} onChange={(e) => setFormData((p) => ({ ...p, currentPassword: e.target.value }))} />
              <Input label="New" type="password" placeholder="••••••" value={formData.newPassword} onChange={(e) => setFormData((p) => ({ ...p, newPassword: e.target.value }))} />
              <Button type="submit" size="sm" className="w-full" loading={loading}>Change Password</Button>
            </form>
          </Section>
        </div>

        {/* Danger Zone */}
        <Section title="Danger Zone" icon={Trash2} delay={0.15} danger>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 rounded-xl bg-danger/5 border border-danger/10">
              <div>
                <p className="text-sm font-medium text-text-primary">Delete Account</p>
                <p className="text-xs text-text-muted mt-0.5">Permanently delete all data</p>
              </div>
              <Button variant="danger" size="xs" onClick={() => setShowDeleteModal(true)} icon={<Trash2 className="w-3 h-3" />}>
                Delete
              </Button>
            </div>
            <div className="flex items-center justify-between p-4 rounded-xl bg-bg-tertiary border border-border">
              <div>
                <p className="text-sm font-medium text-text-primary">Sign Out</p>
                <p className="text-xs text-text-muted mt-0.5">End current session</p>
              </div>
              <Button variant="ghost" size="xs" onClick={handleLogout} icon={<LogOut className="w-3 h-3" />}>
                Logout
              </Button>
            </div>
          </div>
        </Section>
      </div>

      {/* Delete Modal */}
      <Modal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)} title="Delete Account">
        <div className="space-y-5">
          <p className="text-sm text-text-secondary">This action is permanent and cannot be undone.</p>
          <Input label="Confirm Password" type="password" placeholder="••••••" value={deletePassword} onChange={(e) => setDeletePassword(e.target.value)} />
          <div className="flex gap-3 justify-end pt-2">
            <Button variant="secondary" size="sm" onClick={() => setShowDeleteModal(false)}>Cancel</Button>
            <Button variant="danger" size="sm" onClick={handleDeleteAccount} loading={loading}>Delete Account</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ProfilePage;
