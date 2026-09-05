'use client';

import { useEffect, useSyncExternalStore } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { auth } from '../libs/auth';

interface AuthGuardProps {
  children: React.ReactNode;
  guestOnly?: boolean;
}

function subscribe(onChange: () => void) {
  window.addEventListener('storage', onChange);
  window.addEventListener('pageshow', onChange);
  window.addEventListener('auth-change', onChange);
  return () => {
    window.removeEventListener('storage', onChange);
    window.removeEventListener('pageshow', onChange);
    window.removeEventListener('auth-change', onChange);
  };
}

const getSnapshot = () => auth.isAuthenticated();
const getServerSnapshot = () => null;

export default function AuthGuard({ children, guestOnly = false }: AuthGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const authenticated = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const allowed = authenticated !== null && (guestOnly ? !authenticated : authenticated);

  useEffect(() => {
    if (authenticated !== null && !allowed) {
      router.replace(guestOnly ? '/users' : '/login');
    }
  }, [authenticated, allowed, guestOnly, pathname, router]);

  if (!allowed) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        جاري التحميل...
      </div>
    );
  }

  return <>{children}</>;
}
