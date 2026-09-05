'use client';

import { authService } from '@/@core/auth/auth.service';
import Button from '@/@shared/components/Button';
import Input from '@/@shared/components/Input';
import { auth } from '@/@shared/libs/auth';
import AuthGuard from '@/@shared/layout/AuthGuard';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useState } from "react";

export default function LoginPage() {
  return (
    <AuthGuard guestOnly>
      <LoginForm />
    </AuthGuard>
  );
}

function LoginForm() {
    // Collect data
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{
    email?: string; password?: string }>({});
  
  const loginMutation = useMutation({ // Used to process result to action
    mutationFn: authService.login,

    onSuccess: (res) => {
      auth.setToken(res.accessToken);
      auth.setUser(res.user);
      router.replace('/users');
    },
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Validation
    const newErrors: {
      email?: string;
      password?: string;
    } = {};

    if (!email.trim()) {
      newErrors.email = 'البريد الإلكتروني مطلوب';
    }

    if (!password.trim()) {
      newErrors.password = 'كلمة المرور مطلوبة';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length) {
      return;
    }

    // Fire the function
    loginMutation.mutate({
      email,
      password,
    });
  };


 return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-md p-8">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900">
            تسجيل الدخول
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            أدخل بياناتك للوصول إلى لوحة التحكم
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          <div>
            <Input
              id="email"
              label="البريد الإلكتروني"
              type="email"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
                if (errors.email) {
                  setErrors((prev) => ({
                    ...prev,
                    email: undefined,
                  }));
                }
              }}
              placeholder="example@email.com"
              error={errors.email}
            />
          </div>

          <div>
            <Input
              id="password"
              label="كلمة المرور"
              type="password"
              value={password}
              onChange={(event) => {
                setPassword(event.target.value);
                if (errors.password) {
                  setErrors((prev) => ({
                    ...prev,
                    password: undefined,
                  }));
                }
              }}
              placeholder="••••••••"
              error={errors.password}
            />
          </div>

          {loginMutation.error instanceof Error && (
            <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
              {loginMutation.error.message}
            </div>
          )}

          <Button
            type="submit"
            isLoading={loginMutation.isPending}
            loadingText="جاري تسجيل الدخول..."
            className="w-full"
          >
            تسجيل الدخول
          </Button>
        </form>
      </div>
    </main>
  );
}
