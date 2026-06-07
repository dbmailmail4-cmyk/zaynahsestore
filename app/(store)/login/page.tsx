'use client';

import React, { useState, useTransition } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Phone, Lock, Eye, EyeOff, Store, ArrowRight } from 'lucide-react';
import { customerLogin } from '@/lib/services/customers';
import { toast } from 'sonner';

export default function LoginPage() {
  const router = useRouter();
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!emailOrPhone.trim()) {
      toast.error('Email or Phone number is required.');
      return;
    }
    if (!password) {
      toast.error('Password is required.');
      return;
    }

    startTransition(async () => {
      const res = await customerLogin({ emailOrPhone, password });
      if (res.success) {
        toast.success(`Welcome back, ${res.customer.name}!`);
        router.push('/account');
        router.refresh();
      } else {
        toast.error(res.error || 'Login failed.');
      }
    });
  };

  return (
    <div className="min-h-[80vh] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-[#0f0f1b]">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#e94560]/10 border border-[#e94560]/20 text-[#e94560]">
            <Store className="h-7 w-7" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-black tracking-tight text-gray-900 dark:text-white">
          Sign in to your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-500 dark:text-gray-400">
          Or{' '}
          <Link href="/signup" className="font-bold text-[#e94560] hover:text-[#d8344e] transition-colors">
            create a new account
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-[#16162a] py-8 px-4 shadow-xl shadow-black/5 rounded-3xl border border-gray-100 dark:border-gray-800/80 sm:px-10">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username/Email/Phone Input */}
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-2">
                Email or Phone Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  type="text"
                  required
                  placeholder="name@example.com or 03001234567"
                  value={emailOrPhone}
                  onChange={(e) => setEmailOrPhone(e.target.value)}
                  disabled={isPending}
                  className="block w-full pl-10 pr-3 py-3 rounded-2xl border border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-[#0f0f1b]/50 text-sm font-medium text-gray-900 dark:text-white placeholder-gray-400 focus:border-[#e94560] focus:bg-white dark:focus:bg-[#16162a] focus:outline-none transition-all"
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isPending}
                  className="block w-full pl-10 pr-10 py-3 rounded-2xl border border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-[#0f0f1b]/50 text-sm font-medium text-gray-900 dark:text-white placeholder-gray-400 focus:border-[#e94560] focus:bg-white dark:focus:bg-[#16162a] focus:outline-none transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isPending}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={isPending}
                className="w-full flex justify-center items-center gap-2 py-3.5 px-4 rounded-2xl bg-[#e94560] hover:bg-[#d8344e] disabled:bg-gray-300 dark:disabled:bg-gray-800 disabled:cursor-not-allowed text-white text-sm font-black transition-all duration-200 shadow-lg shadow-red-500/20 active:scale-98 cursor-pointer"
              >
                {isPending ? (
                  <div className="h-5 w-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                ) : (
                  <>
                    Sign In
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
