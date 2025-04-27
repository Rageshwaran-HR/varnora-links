import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";

const formSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

type FormSchema = z.infer<typeof formSchema>;

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AdminLoginModal({ isOpen, onClose }: AdminLoginModalProps) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = async (data: FormSchema) => {
    setLoading(true);
    
    // For demo purposes, hardcoded admin credentials
    // In a real app, this would call an authentication API endpoint
    if (data.username === "admin" && data.password === "varnora2025") {
      setTimeout(() => {
        setLoading(false);
        
        // Store admin auth in localStorage
        localStorage.setItem("varnora_admin", "true");
        
        toast({
          title: "Login successful",
          description: "Welcome to the admin dashboard",
          variant: "default",
        });
        
        window.location.href = "/admin";
      }, 1000);
    } else {
      setLoading(false);
      
      toast({
        title: "Authentication failed",
        description: "Invalid username or password",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="glass-dark text-white sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-xl gold-text title-font">
            Admin Login
          </DialogTitle>
          <DialogDescription className="text-center text-gray-400">
            Enter your credentials to access the dashboard
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username" className="text-white/80">
              Username
            </Label>
            <Input
              id="username"
              placeholder="admin"
              className="bg-black/50 border-[#D4AF37]/30 text-white focus:border-[#D4AF37]"
              {...form.register("username")}
            />
            {form.formState.errors.username && (
              <p className="text-sm text-red-500">
                {form.formState.errors.username.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-white/80">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              className="bg-black/50 border-[#D4AF37]/30 text-white focus:border-[#D4AF37]"
              {...form.register("password")}
            />
            {form.formState.errors.password && (
              <p className="text-sm text-red-500">
                {form.formState.errors.password.message}
              </p>
            )}
          </div>

          <DialogFooter className="flex flex-col sm:flex-row sm:justify-center sm:space-x-2">
            <Button
              type="button"
              variant="outline"
              className="mb-2 sm:mb-0 border-[#D4AF37]/50 text-[#D4AF37] hover:bg-[#D4AF37]/10 py-6 px-6"
              disabled={loading}
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="gold-gradient-animated text-black font-semibold btn-3d py-6 px-6 shadow-lg"
              disabled={loading}
            >
              {loading ? (
                <motion.div
                  className="h-6 w-6 rounded-full border-2 border-t-transparent border-black animate-spin"
                />
              ) : (
                "Sign In"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}