import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  AuthService,
  UserLoginData,
  UserRegisterData,
} from '@/lib/auth-service';
import { useState } from 'react';

const LoginButton = () => {
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // 添加登录表单状态
  const [loginForm, setLoginForm] = useState<UserLoginData>({
    username: '',
    password: '',
  });

  // 添加注册表单状态
  const [registerForm, setRegisterForm] = useState<UserRegisterData>({
    username: '',
    email: '',
    password: '',
  });

  // 添加确认密码状态
  const [confirmPassword, setConfirmPassword] = useState('');

  // 添加加载状态和错误信息
  const [isLoginLoading, setIsLoginLoading] = useState(false);
  const [isRegisterLoading, setIsRegisterLoading] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [registerError, setRegisterError] = useState('');

  // 处理登录表单变化
  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setLoginForm(prev => ({
      ...prev,
      [id === 'login-password' ? 'password' : 'username']: value,
    }));
  };

  // 处理注册表单变化
  const handleRegisterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    if (id === 'confirm-password') {
      setConfirmPassword(value);
    } else {
      setRegisterForm(prev => ({
        ...prev,
        [id === 'signup-password'
          ? 'password'
          : id === 'email'
            ? 'email'
            : 'username']: value,
      }));
    }
  };

  // 处理登录请求
  const handleLogin = async () => {
    setLoginError('');
    setIsLoginLoading(true);

    try {
      const response = await AuthService.login(loginForm);

      if (response.error) {
        setLoginError(response.error);
      } else {
        // 登录成功，可以关闭对话框或跳转页面

        window.location.reload(); // 简单处理：刷新页面
      }
    } catch (error) {
      setLoginError('登录失败，请稍后重试');
    } finally {
      setIsLoginLoading(false);
    }
  };

  // 处理注册请求
  const handleRegister = async () => {
    setRegisterError('');

    // 验证密码
    if (registerForm.password !== confirmPassword) {
      setRegisterError('两次输入的密码不一致');
      return;
    }

    // 验证邮箱
    if (!registerForm.email || !registerForm.email.includes('@')) {
      setRegisterError('请输入有效的邮箱地址');
      return;
    }

    setIsRegisterLoading(true);

    try {
      const response = await AuthService.register(registerForm);

      if (response.error) {
        setRegisterError(response.error);
      } else {
        // 注册成功，自动登录
        const loginResponse = await AuthService.login({
          username: registerForm.username,
          password: registerForm.password,
        });

        if (loginResponse.error) {
          setRegisterError('注册成功，但登录失败，请手动登录');
        } else {
          // 登录成功，可以关闭对话框或跳转页面

          window.location.reload(); // 简单处理：刷新页面
        }
      }
    } catch (error) {
      setRegisterError('注册失败，请稍后重试');
    } finally {
      setIsRegisterLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="h-full w-9 rounded-xl bg-gray-600 bg-opacity-0 p-1 transition-all duration-300 hover:bg-opacity-30">
          <NoAccountIcon />
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle>登陆/注册</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">登陆</TabsTrigger>
            <TabsTrigger value="signup">注册</TabsTrigger>
          </TabsList>
          <TabsContent value="login">
            <Card>
              <CardHeader>
                <CardTitle>登陆</CardTitle>
                <CardDescription>输入账号和密码</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="inline-flex w-full items-center justify-center gap-1 rounded-lg border-2 p-1">
                  <UserIcon />
                  <input
                    id="account"
                    placeholder="账号/邮箱"
                    className="w-full border-none bg-transparent outline-none"
                    value={loginForm.username}
                    onChange={handleLoginChange}
                  />
                </div>
                <div className="inline-flex w-full items-center justify-center gap-1 rounded-lg border-2 p-1">
                  <LockIcon />
                  <input
                    id="login-password"
                    placeholder="密码"
                    type={showLoginPassword ? 'text' : 'password'}
                    className="w-full border-none bg-transparent outline-none"
                    value={loginForm.password}
                    onChange={handleLoginChange}
                  />
                  <button
                    type="button"
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                    className="px-2 hover:opacity-70"
                  >
                    {showLoginPassword ? <EyeOpenIcon /> : <EyeCloseIcon />}
                  </button>
                </div>
              </CardContent>
              <CardFooter>
                {loginError && (
                  <div className="mb-2 w-full text-sm text-red-500">
                    {loginError}
                  </div>
                )}
                <Button
                  className="w-full"
                  onClick={handleLogin}
                  disabled={isLoginLoading}
                >
                  {isLoginLoading ? '登录中...' : '登陆'}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          <TabsContent value="signup">
            <Card>
              <CardHeader>
                <CardTitle>注册</CardTitle>
                <CardDescription>使用邮箱/手机号注册</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="inline-flex w-full items-center justify-center gap-1 rounded-lg border-2 p-1">
                  <UserIcon />
                  <input
                    id="account"
                    placeholder="账号/邮箱"
                    className="w-full border-none bg-transparent outline-none"
                    value={registerForm.username}
                    onChange={handleRegisterChange}
                  />
                </div>

                <div className="inline-flex w-full items-center justify-center gap-1 rounded-lg border-2 p-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="24px"
                    viewBox="0 -960 960 960"
                    width="24px"
                    className="fill-gray-500"
                  >
                    <path d="M160-160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h640q33 0 56.5 23.5T880-720v480q0 33-23.5 56.5T720-160H160Zm320-280L160-640v400h640v-400L480-440Zm0-80 320-200H160l320 200ZM160-640v-80 480-400Z" />
                  </svg>
                  <input
                    id="email"
                    placeholder="邮箱"
                    className="w-full border-none bg-transparent outline-none"
                    value={registerForm.email}
                    onChange={handleRegisterChange}
                  />
                </div>

                <div className="inline-flex w-full items-center justify-center gap-1 rounded-lg border-2 p-1">
                  <LockIcon />
                  <input
                    id="signup-password"
                    placeholder="密码"
                    type={showSignupPassword ? 'text' : 'password'}
                    className="w-full border-none bg-transparent outline-none"
                    value={registerForm.password}
                    onChange={handleRegisterChange}
                  />
                  <button
                    type="button"
                    onClick={() => setShowSignupPassword(!showSignupPassword)}
                    className="px-2 hover:opacity-70"
                  >
                    {showSignupPassword ? <EyeOpenIcon /> : <EyeCloseIcon />}
                  </button>
                </div>

                <div className="inline-flex w-full items-center justify-center gap-1 rounded-lg border-2 p-1">
                  <LockIcon />
                  <input
                    id="confirm-password"
                    placeholder="确认密码"
                    type={showConfirmPassword ? 'text' : 'password'}
                    className="w-full border-none bg-transparent outline-none"
                    value={confirmPassword}
                    onChange={handleRegisterChange}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="px-2 hover:opacity-70"
                  >
                    {showConfirmPassword ? <EyeOpenIcon /> : <EyeCloseIcon />}
                  </button>
                </div>

                {/* <div className="inline-flex w-full items-center justify-between space-x-2">
                  <InputOTP
                    maxLength={6}
                    value={verificationCode}
                    onChange={handleVerificationChange}
                  >
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                  <Button
                    variant="secondary"
                    onClick={handleSendVerification}
                    disabled={isVerificationLoading || isVerificationSent}
                  >
                    {isVerificationLoading
                      ? '发送中...'
                      : isVerificationSent
                        ? `${countdown}秒`
                        : '发送验证码'}
                  </Button>
                </div> */}
              </CardContent>
              <CardFooter className="flex flex-col gap-2">
                {registerError && (
                  <div className="w-full text-sm text-red-500">
                    {registerError}
                  </div>
                )}
                <Button
                  className="w-full"
                  onClick={handleRegister}
                  disabled={isRegisterLoading}
                >
                  {isRegisterLoading ? '注册中...' : '注册'}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
        {/* <DialogFooter>footer</DialogFooter> */}
      </DialogContent>
    </Dialog>
  );
};

export default LoginButton;

const NoAccountIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="24px"
      viewBox="0 -960 960 960"
      width="24px"
      className="h-full w-full"
    >
      <path d="M608-522 422-708q14-6 28.5-9t29.5-3q59 0 99.5 40.5T620-580q0 15-3 29.5t-9 28.5ZM234-276q51-39 114-61.5T480-360q18 0 34.5 1.5T549-354l-88-88q-47-6-80.5-39.5T341-562L227-676q-32 41-49.5 90.5T160-480q0 59 19.5 111t54.5 93Zm498-8q32-41 50-90.5T800-480q0-133-93.5-226.5T480-800q-56 0-105.5 18T284-732l448 448ZM480-80q-82 0-155-31.5t-127.5-86Q143-252 111.5-325T80-480q0-83 31.5-155.5t86-127Q252-817 325-848.5T480-880q83 0 155.5 31.5t127 86q54.5 54.5 86 127T880-480q0 82-31.5 155t-86 127.5q-54.5 54.5-127 86T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z" />
    </svg>
  );
};

const AccountIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="24px"
      viewBox="0 -960 960 960"
      width="24px"
      className="h-full w-full"
    >
      <path d="M234-276q51-39 114-61.5T480-360q69 0 132 22.5T726-276q35-41 54.5-93T800-480q0-133-93.5-226.5T480-800q-133 0-226.5 93.5T160-480q0 59 19.5 111t54.5 93Zm246-164q-59 0-99.5-40.5T340-580q0-59 40.5-99.5T480-720q59 0 99.5 40.5T620-580q0 59-40.5 99.5T480-440Zm0 360q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q53 0 100-15.5t86-44.5q-39-29-86-44.5T480-280q-53 0-100 15.5T294-220q39 29 86 44.5T480-160Zm0-360q26 0 43-17t17-43q0-26-17-43t-43-17q-26 0-43 17t-17 43q0 26 17 43t43 17Zm0-60Zm0 360Z" />
    </svg>
  );
};
const UserIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="24px"
      viewBox="0 -960 960 960"
      width="24px"
      className="fill-gray-500"
    >
      <path d="M480-480q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47Zm0-80q33 0 56.5-23.5T560-640q0-33-23.5-56.5T480-720q-33 0-56.5 23.5T400-640q0 33 23.5 56.5T480-560ZM160-160v-112q0-34 17.5-62.5T224-378q62-31 126-46.5T480-440q66 0 130 15.5T736-378q29 15 46.5 43.5T800-272v112H160Zm80-80h480v-32q0-11-5.5-20T700-306q-54-27-109-40.5T480-360q-56 0-111 13.5T260-306q-9 5-14.5 14t-5.5 20v32Zm240-320Zm0 320Z" />
    </svg>
  );
};
const LockIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="24px"
      viewBox="0 -960 960 960"
      width="24px"
      className="fill-gray-500"
    >
      <path d="M240-80q-33 0-56.5-23.5T160-160v-400q0-33 23.5-56.5T240-640h40v-80q0-83 58.5-141.5T480-920q83 0 141.5 58.5T680-720v80h40q33 0 56.5 23.5T800-560v400q0 33-23.5 56.5T720-80H240Zm0-80h480v-400H240v400Zm240-120q33 0 56.5-23.5T560-360q0-33-23.5-56.5T480-440q-33 0-56.5 23.5T400-360q0 33 23.5 56.5T480-280ZM360-640h240v-80q0-50-35-85t-85-35q-50 0-85 35t-35 85v80ZM240-160v-400 400Z" />
    </svg>
  );
};
const EyeOpenIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="24px"
      viewBox="0 -960 960 960"
      width="24px"
      className="fill-gray-500"
    >
      <path d="M480-320q75 0 127.5-52.5T660-500q0-75-52.5-127.5T480-680q-75 0-127.5 52.5T300-500q0 75 52.5 127.5T480-320Zm0-72q-45 0-76.5-31.5T372-500q0-45 31.5-76.5T480-608q45 0 76.5 31.5T588-500q0 45-31.5 76.5T480-392Zm0 192q-146 0-266-81.5T40-500q54-137 174-218.5T480-800q146 0 266 81.5T920-500q-54 137-174 218.5T480-200Zm0-300Zm0 220q113 0 207.5-59.5T832-500q-50-101-144.5-160.5T480-720q-113 0-207.5 59.5T128-500q50 101 144.5 160.5T480-280Z" />
    </svg>
  );
};
const EyeCloseIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="24px"
      viewBox="0 -960 960 960"
      width="24px"
      className="fill-gray-500"
    >
      <path d="m644-428-58-58q9-47-27-83t-83-27l-58-58q17-8 34.5-12t37.5-4q75 0 127.5 52.5T660-490q0 20-4 37.5T644-428Zm128 126-58-56q38-29 67.5-63.5T832-490q-50-101-143.5-160.5T480-710q-29 0-57 4t-55 12l-62-62q41-17 84-25.5t90-8.5q151 0 269 83.5T920-490q-23 59-60.5 109.5T772-302Zm20 246L624-222q-35 11-70.5 16.5T480-200q-151 0-269-83.5T40-500q21-53 53-98.5t73-81.5L56-792l56-56 736 736-56 56ZM222-624q-29 26-53 57t-41 67q50 101 143.5 160.5T480-280q20 0 39-2.5t39-5.5l-36-38q-11 3-21 4.5t-21 1.5q-75 0-127.5-52.5T300-500q0-11 1.5-21t4.5-21l-84-82Zm319 93Zm-151 75Z" />
    </svg>
  );
};
