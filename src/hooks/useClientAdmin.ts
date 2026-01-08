import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/AuthContext';

interface UserRow {
  id: string;
  client_id: string;
  role: string;
  is_admin: boolean | null;
}

interface UseClientAdminResult {
  isAdmin: boolean;
  loading: boolean;
  userRow: UserRow | null;
}

const ADMIN_ROLES = ['admin', 'client_admin', 'owner', 'manager'];

export function useClientAdmin(): UseClientAdminResult {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userRow, setUserRow] = useState<UserRow | null>(null);

  useEffect(() => {
    if (!user) {
      setIsAdmin(false);
      setUserRow(null);
      setLoading(false);
      return;
    }

    const fetchUserRow = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('users')
          .select('id, client_id, role, is_admin')
          .eq('auth_user_id', user.id)
          .single();

        if (error) {
          console.error('Error fetching user row for admin check:', error);
          setIsAdmin(false);
          setUserRow(null);
        } else if (data) {
          const row: UserRow = {
            id: data.id,
            client_id: data.client_id,
            role: data.role,
            is_admin: data.is_admin,
          };
          setUserRow(row);

          // Check admin status: is_admin = true OR role in admin roles
          const adminByFlag = data.is_admin === true;
          const adminByRole = ADMIN_ROLES.includes(data.role?.toLowerCase() || '');
          setIsAdmin(adminByFlag || adminByRole);
        } else {
          setIsAdmin(false);
          setUserRow(null);
        }
      } catch (err) {
        console.error('Error in useClientAdmin:', err);
        setIsAdmin(false);
        setUserRow(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUserRow();
  }, [user]);

  return { isAdmin, loading, userRow };
}
