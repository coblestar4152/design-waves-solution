import { useState, type FormEvent } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

export default function AdminAccountPage() {
  const { user, signOut } = useAuth();
  const [newPassword, setNewPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [saving, setSaving] = useState(false);

  async function handleChangePassword(e: FormEvent) {
    e.preventDefault();
    if (newPassword.length < 8) return toast.error('Password must be at least 8 characters');
    if (newPassword !== confirm) return toast.error('Passwords do not match');
    setSaving(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    setSaving(false);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success('Password updated');
      setNewPassword('');
      setConfirm('');
    }
  }

  return (
    <div className="max-w-md">
      <h1 className="text-2xl font-bold mb-6">Admin Account</h1>

      <Card hover={false} className="mb-5">
        <p className="text-xs opacity-60">Signed in as</p>
        <p className="font-semibold mt-1">{user?.email}</p>
      </Card>

      <Card hover={false}>
        <h2 className="font-semibold text-sm mb-4">Change Password</h2>
        <form onSubmit={handleChangePassword} className="space-y-4">
          <div>
            <label className="text-xs opacity-70 mb-1 block">New Password</label>
            <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} minLength={8} required
              className="w-full px-3 py-2 rounded-dw bg-white/5 border border-white/10 text-sm outline-none focus:border-[var(--dw-primary)]" />
          </div>
          <div>
            <label className="text-xs opacity-70 mb-1 block">Confirm Password</label>
            <input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} minLength={8} required
              className="w-full px-3 py-2 rounded-dw bg-white/5 border border-white/10 text-sm outline-none focus:border-[var(--dw-primary)]" />
          </div>
          <Button type="submit" disabled={saving}>{saving ? 'Updating…' : 'Update Password'}</Button>
        </form>
      </Card>

      <Button variant="outline" onClick={signOut} className="mt-6">Sign Out</Button>
    </div>
  );
}
