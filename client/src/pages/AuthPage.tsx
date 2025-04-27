import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import VarnoraLogo from "@/components/VarnoraLogo";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Form schemas
const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

const registerSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().email("Invalid email address"),
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type LoginFormValues = z.infer<typeof loginSchema>;
type RegisterFormValues = z.infer<typeof registerSchema>;

export default function AuthPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  // Check if user is already logged in
  useEffect(() => {
    const isAdmin = localStorage.getItem("varnora_admin") === "true";
    if (isAdmin) {
      setLocation("/admin");
    }
  }, [setLocation]);

  // Login form
  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  // Register form
  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: "",
      email: "",
      username: "",
      password: "",
      confirmPassword: "",
    },
  });

  // Handle login form submission
  const onLoginSubmit = (data: LoginFormValues) => {
    setIsLoading(true);
    
    // For demo purposes - hardcoded credentials
    // In a real application, this would be an API call
    if (data.username === "admin" && data.password === "varnora2025") {
      setTimeout(() => {
        // Store admin auth in localStorage
        localStorage.setItem("varnora_admin", "true");
        
        toast({
          title: "Login successful",
          description: "Welcome to the admin dashboard",
        });
        
        setLocation("/admin");
        setIsLoading(false);
      }, 1500);
    } else {
      setTimeout(() => {
        toast({
          title: "Login failed",
          description: "Invalid username or password",
          variant: "destructive",
        });
        setIsLoading(false);
      }, 1500);
    }
  };

  // Handle register form submission
  const onRegisterSubmit = (data: RegisterFormValues) => {
    setIsLoading(true);
    
    // Simulate registration process
    setTimeout(() => {
      toast({
        title: "Registration request sent",
        description: "New registrations require admin approval",
      });
      
      setIsLoading(false);
      registerForm.reset();
    }, 1500);
  };

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left side - Auth forms */}
      <div className="w-full md:w-1/2 p-4 md:p-8 flex flex-col justify-center">
        <motion.div
          className="max-w-md mx-auto w-full"
          initial="hidden"
          animate="visible"
          variants={fadeIn}
        >
          <div className="flex justify-center mb-8">
            <VarnoraLogo size="md" />
          </div>
          
          <h1 className="text-3xl font-bold text-center gold-text title-font mb-2">
            Admin Portal
          </h1>
          <p className="text-center text-white/60 mb-8">
            Access the dashboard to manage your Varnora links
          </p>
          
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8 bg-black/30 gold-border">
              <TabsTrigger value="login" className="gold-text">Login</TabsTrigger>
              <TabsTrigger value="register" className="gold-text">Register</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <Card className="glass-dark border-[#D4AF37]/20">
                <CardHeader>
                  <CardTitle className="gold-text">Login</CardTitle>
                  <CardDescription className="text-white/60">
                    Enter your credentials to access the admin dashboard
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...loginForm}>
                    <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                      <FormField
                        control={loginForm.control}
                        name="username"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-white/80">Username</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="admin" 
                                {...field} 
                                className="bg-black/50 border-[#D4AF37]/30 text-white"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={loginForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-white/80">Password</FormLabel>
                            <FormControl>
                              <Input 
                                type="password" 
                                placeholder="••••••••" 
                                {...field} 
                                className="bg-black/50 border-[#D4AF37]/30 text-white"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button 
                        type="submit" 
                        className="w-full gold-gradient-animated text-black font-semibold btn-3d py-6 shadow-lg"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <div className="h-4 w-4 border-2 border-t-transparent border-black rounded-full animate-spin mr-2"></div>
                            Logging in...
                          </>
                        ) : "Sign In"}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="register">
              <Card className="glass-dark border-[#D4AF37]/20">
                <CardHeader>
                  <CardTitle className="gold-text">Create Account</CardTitle>
                  <CardDescription className="text-white/60">
                    Request admin access to manage Varnora links
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...registerForm}>
                    <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
                      <FormField
                        control={registerForm.control}
                        name="fullName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-white/80">Full Name</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="John Doe" 
                                {...field} 
                                className="bg-black/50 border-[#D4AF37]/30 text-white"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={registerForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-white/80">Email</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="your@email.com" 
                                {...field} 
                                className="bg-black/50 border-[#D4AF37]/30 text-white"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={registerForm.control}
                        name="username"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-white/80">Username</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="username" 
                                {...field} 
                                className="bg-black/50 border-[#D4AF37]/30 text-white"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <FormField
                          control={registerForm.control}
                          name="password"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-white/80">Password</FormLabel>
                              <FormControl>
                                <Input 
                                  type="password" 
                                  placeholder="••••••••" 
                                  {...field} 
                                  className="bg-black/50 border-[#D4AF37]/30 text-white"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={registerForm.control}
                          name="confirmPassword"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-white/80">Confirm Password</FormLabel>
                              <FormControl>
                                <Input 
                                  type="password" 
                                  placeholder="••••••••" 
                                  {...field} 
                                  className="bg-black/50 border-[#D4AF37]/30 text-white"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <Button 
                        type="submit" 
                        className="w-full gold-gradient-animated text-black font-semibold btn-3d py-6 shadow-lg"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <div className="h-4 w-4 border-2 border-t-transparent border-black rounded-full animate-spin mr-2"></div>
                            Registering...
                          </>
                        ) : "Register"}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
      
      {/* Right side - Hero section */}
      <div 
        className="w-full md:w-1/2 p-8 flex items-center justify-center bg-gradient-to-br from-black to-black/70 hidden md:flex"
      >
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="mb-8 flex justify-center">
            <VarnoraLogo size="lg" glowEffect={true} />
          </div>
          
          <h2 className="text-4xl font-bold mb-4 gold-text title-font">
            Varnora Links Dashboard
          </h2>
          
          <p className="text-white/70 text-lg max-w-md mx-auto mb-6 body-font">
            Manage all your important links from one elegant dashboard. Update your social media, contact information, and company details with ease.
          </p>
          
          <div className="flex justify-center">
            <div className="h-1 w-24 gold-gradient rounded-full"></div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}