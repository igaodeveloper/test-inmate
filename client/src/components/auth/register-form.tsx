import { Sparkles } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/hooks/use-auth";
import { registerSchema, type RegisterData } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { toast } from "@/hooks/use-toast";

interface RegisterFormProps {
  onClose: () => void;
  onSwitchToLogin: () => void;
}

export function RegisterForm({ onClose, onSwitchToLogin }: RegisterFormProps) {
  const { register: registerUser, isLoading } = useAuth();
  const { t } = useTranslation();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterData) => {
    // Check if any required fields are empty
    if (!data.username?.trim() || !data.email?.trim() || !data.password) {
      toast({
        title: t('auth.validationError'),
        description: t('auth.fillAllRequiredFields'),
        variant: 'destructive',
      });
      return;
    }

    try {
      await registerUser({
        name: data.username,
        email: data.email,
        password: data.password
      });
      toast({
        title: t('auth.welcomeToCardEx'),
        description: t('auth.registrationSuccess'),
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
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{t('auth.createAccount')}</h2>
        <p className="text-gray-600 dark:text-gray-300">{t('auth.joinCommunity')}</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
        <div>
          <Label htmlFor="username">{t('auth.username')}</Label>
          <Input
            id="username"
            type="text"
            placeholder={t('auth.usernamePlaceholder')}
            {...register("username")}
            className={errors.username ? "border-red-500" : ""}
          />
          {errors.username && (
            <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="email">{t('auth.email')}</Label>
          <Input
            id="email"
            type="email"
            placeholder={t('auth.emailPlaceholder')}
            {...register("email")}
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="password">{t('auth.password')}</Label>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            {...register("password")}
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox id="terms" required />
          <Label htmlFor="terms" className="text-sm">
            {t('auth.agreeTo')}{" "}
            <a href="#" className="text-primary hover:underline">
              {t('auth.termsOfService')}
            </a>{" "}{t('common.and')}{" "}
            <a href="#" className="text-primary hover:underline">
              {t('auth.privacyPolicy')}
            </a>
          </Label>
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={isLoading}
        >
          {isLoading ? <LoadingSpinner size="sm" /> : t('auth.createAccount')}
        </Button>

        <div className="text-center">
          <p className="text-sm text-gray-600 dark:text-gray-300">
            {t('auth.haveAccount')}{" "}
            <button
              type="button"
              onClick={onSwitchToLogin}
              className="font-medium text-primary hover:underline"
            >
              {t('auth.login')}
            </button>
          </p>
        </div>
      </form>
    </div>
  );
}
