'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/use-auth';
import { useAuthStore } from '@/store/use-auth-store';
import { UserLoginData, UserRegisterData } from '@/types/user';
import {
  EyeIcon,
  EyeOffIcon,
  LockIcon,
  MailIcon,
  UserIcon,
} from 'lucide-react';
import { useRouter } from 'next/navigation';

import { useState } from 'react';

export default function LoginPage() {
  const router = useRouter();

  if (useAuthStore.getState().isAuthenticated) {
    router.push('/');
  }
  // Password visibility states
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Auth hooks
  const { login, register, isLoading, error, clearError, isAuthenticated } =
    useAuth();

  // Form states
  const [loginForm, setLoginForm] = useState<UserLoginData>({
    username: '',
    password: '',
  });

  const [registerForm, setRegisterForm] = useState<UserRegisterData>({
    username: '',
    email: '',
    password: '',
  });

  const [confirmPassword, setConfirmPassword] = useState('');
  const [registerError, setRegisterError] = useState('');

  // Handle login form changes
  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginForm(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle registration form changes
  const handleRegisterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'confirmPassword') {
      setConfirmPassword(value);
    } else {
      setRegisterForm(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // Handle login submission
  const handleLogin = async () => {
    clearError();
    await login(loginForm);

    // Redirect if successful
    if (isAuthenticated) {
      router.push('/');
    }
  };

  // Handle registration submission
  const handleRegister = async () => {
    clearError();
    setRegisterError('');

    // Validate password confirmation
    if (registerForm.password !== confirmPassword) {
      setRegisterError('两次输入的密码不一致');
      return;
    }

    // Validate email format
    if (!registerForm.email || !registerForm.email.includes('@')) {
      setRegisterError('请输入有效的邮箱地址');
      return;
    }

    await register(registerForm);

    // Redirect if successful
    if (isAuthenticated) {
      router.push('/');
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-gradient-to-b from-background p-4">
      <div className="w-full max-w-md">
        <h1 className="mb-6 text-center text-3xl font-bold text-black">
          登录和注册
        </h1>

        <div className="rounded-lg border border-border bg-card p-6 shadow-lg">
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="mb-6 grid w-full grid-cols-2">
              <TabsTrigger value="login" className="text-black">
                登录
              </TabsTrigger>
              <TabsTrigger value="register" className="text-black">
                注册
              </TabsTrigger>
            </TabsList>

            {/* Login Tab */}
            <TabsContent value="login" className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <MailIcon className="h-5 w-5 text-black" />
                  <Input
                    name="username"
                    placeholder="邮箱"
                    className="border-border text-black focus-visible:ring-primary"
                    value={loginForm.username}
                    onChange={handleLoginChange}
                  />
                </div>

                <div className="relative flex items-center space-x-2">
                  <LockIcon className="h-5 w-5 text-black" />
                  <Input
                    name="password"
                    type={showLoginPassword ? 'text' : 'password'}
                    placeholder="密码"
                    className="border-border pr-10 text-black focus-visible:ring-primary"
                    value={loginForm.password}
                    onChange={handleLoginChange}
                  />
                  <button
                    type="button"
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                    className="absolute right-2 p-1 text-black hover:text-gray-600"
                  >
                    {showLoginPassword ? (
                      <EyeOffIcon className="h-4 w-4" />
                    ) : (
                      <EyeIcon className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {error && (
                <div className="rounded bg-destructive/10 p-2 text-sm text-destructive">
                  {error}
                </div>
              )}

              <Button
                className="w-full bg-primary text-black hover:bg-primary/90"
                onClick={handleLogin}
                disabled={isLoading}
              >
                {isLoading ? '登录中...' : '登录'}
              </Button>
            </TabsContent>

            {/* Register Tab */}
            <TabsContent value="register" className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <UserIcon className="h-5 w-5 text-black" />
                  <Input
                    name="username"
                    placeholder="用户名"
                    className="border-border text-black focus-visible:ring-primary"
                    value={registerForm.username}
                    onChange={handleRegisterChange}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <MailIcon className="h-5 w-5 text-black" />
                  <Input
                    name="email"
                    placeholder="邮箱"
                    className="border-border text-black focus-visible:ring-primary"
                    value={registerForm.email}
                    onChange={handleRegisterChange}
                  />
                </div>

                <div className="relative flex items-center space-x-2">
                  <LockIcon className="h-5 w-5 text-black" />
                  <Input
                    name="password"
                    type={showRegisterPassword ? 'text' : 'password'}
                    placeholder="密码"
                    className="border-border pr-10 text-black focus-visible:ring-primary"
                    value={registerForm.password}
                    onChange={handleRegisterChange}
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setShowRegisterPassword(!showRegisterPassword)
                    }
                    className="absolute right-2 p-1 text-black hover:text-gray-600"
                  >
                    {showRegisterPassword ? (
                      <EyeOffIcon className="h-4 w-4" />
                    ) : (
                      <EyeIcon className="h-4 w-4" />
                    )}
                  </button>
                </div>

                <div className="relative flex items-center space-x-2">
                  <LockIcon className="h-5 w-5 text-black" />
                  <Input
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="确认密码"
                    className="border-border pr-10 text-black focus-visible:ring-primary"
                    value={confirmPassword}
                    onChange={handleRegisterChange}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-2 p-1 text-black hover:text-gray-600"
                  >
                    {showConfirmPassword ? (
                      <EyeOffIcon className="h-4 w-4" />
                    ) : (
                      <EyeIcon className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {(registerError || error) && (
                <div className="rounded bg-destructive/10 p-2 text-sm text-destructive">
                  {registerError || error}
                </div>
              )}

              <Button
                className="w-full bg-primary text-black hover:bg-primary/90"
                onClick={handleRegister}
                disabled={isLoading}
              >
                {isLoading ? '注册中...' : '注册'}
              </Button>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
