import { Sparkles } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/hooks/use-auth";
import { loginSchema, type LoginData } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { toast } from "@/hooks/use-toast";

interface LoginFormProps {
  onClose: () => void;
  onSwitchToRegister: () => void;
}

export function LoginForm({ onClose, onSwitchToRegister }: LoginFormProps) {
  const { login, isLoading } = useAuth();
  const { t } = useTranslation();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginData) => {
    try {
      await login(data);
      toast({
        title: t('auth.welcomeBack'),
        description: t('auth.loginSuccess'),
      });
      onClose();
    } catch (error) {
      // Error is handled by the axios interceptor
    }
  };

  return (
    <div>
      <div className="p-6 text-center border-b border-gray-200 dark:border-gray-700">
        <div className="w-16 h-16 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-4">
          <Sparkles className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{t('auth.welcomeBack')}</h2>
        <p className="text-gray-600 dark:text-gray-300">{t('auth.loginDescription')}</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
        <div>
          <Label htmlFor="email">{t('auth.email')}</Label>
          <Input
            id="email"
            type="email"
            placeholder={t('auth.emailPlaceholder')}
            {...register("email")}
          />
          {errors.email && (
            <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="password">{t('auth.password')}</Label>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            {...register("password")}
            className={errors.password ? "border-red-500" : ""}
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Checkbox id="remember" />
            <Label htmlFor="remember" className="text-sm">{t('auth.rememberMe')}</Label>
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="password">{t('auth.password')}</Label>
            <button
              type="button"
              className="text-sm font-medium text-primary hover:underline"
            >
              {t('auth.forgotPassword')}
            </button>
          </div>
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={isLoading}
        >
          {isLoading ? <LoadingSpinner size="sm" /> : t('auth.login')}
        </Button>

        <div className="text-center">
          <span className="text-gray-600 dark:text-gray-300">{t('auth.dontHaveAccount')} </span>
          <button
            type="button"
            onClick={onSwitchToRegister}
            className="text-primary hover:underline"
          >
            {t('auth.signUp')}
          </button>
        </div>
      </form>
    </div>
  );
}
