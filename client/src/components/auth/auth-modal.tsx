import { useState } from "react";
import { X } from "lucide-react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { LoginForm } from "./login-form";
import { RegisterForm } from "./register-form";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: "login" | "register";
}

export function AuthModal({ isOpen, onClose, initialMode = "login" }: AuthModalProps) {
  const [mode, setMode] = useState<"login" | "register">(initialMode);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogTitle className="sr-only">
          {mode === "login" ? "Sign In" : "Create Account"}
        </DialogTitle>
        <DialogDescription className="sr-only">
          {mode === "login" ? "Sign in to your CardEx account" : "Create a new CardEx account"}
        </DialogDescription>
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
        </button>

        {mode === "login" ? (
          <LoginForm onClose={onClose} onSwitchToRegister={() => setMode("register")} />
        ) : (
          <RegisterForm onClose={onClose} onSwitchToLogin={() => setMode("login")} />
        )}
      </DialogContent>
    </Dialog>
  );
}
