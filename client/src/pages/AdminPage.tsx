import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { SOCIAL_LINKS } from "@/lib/constants";
import VarnoraLogo from "@/components/VarnoraLogo";
import { motion } from "framer-motion";
import { LogOut, Save, Trash2 } from "lucide-react";

export default function AdminPage() {
  const [, setLocation] = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [confirmLogout, setConfirmLogout] = useState(false);
  const [links, setLinks] = useState({ ...SOCIAL_LINKS });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    // Check if user is authenticated
    const isAdmin = localStorage.getItem("varnora_admin") === "true";
    setIsAuthenticated(isAdmin);
    setLoading(false);

    if (!isAdmin) {
      // Redirect to login page if not authenticated
      setLocation("/auth");
    }
  }, [setLocation]);

  const handleLogout = () => {
    localStorage.removeItem("varnora_admin");
    setIsAuthenticated(false);
    toast({
      title: "Logged out",
      description: "You have been logged out successfully",
    });
    setLocation("/");
  };

  const handleSave = () => {
    setSaving(true);
    
    // Simulating an API call to save the links
    setTimeout(() => {
      setSaving(false);
      toast({
        title: "Changes saved",
        description: "Your links have been updated successfully",
      });
    }, 1000);
  };

  const handleLinkChange = (key: keyof typeof SOCIAL_LINKS, value: string) => {
    setLinks(prev => ({
      ...prev,
      [key]: value
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="animate-spin h-8 w-8 border-4 border-t-[#D4AF37] border-white/10 rounded-full"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will be redirected by the useEffect
  }

  return (
    <div className="min-h-screen">
      <header className="border-b border-[#D4AF37]/20 py-4">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center">
            <VarnoraLogo size="sm" animated={false} />
            <h1 className="text-2xl font-bold gold-text ml-4 title-font">Admin Dashboard</h1>
          </div>
          <Button 
            variant="outline" 
            className="border-[#D4AF37]/30 text-white hover:bg-[#D4AF37]/10"
            onClick={() => setConfirmLogout(true)}
          >
            <LogOut size={16} className="mr-2" />
            Logout
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="links" className="w-full">
          <TabsList className="mb-6 bg-black/30 gold-border">
            <TabsTrigger value="links" className="gold-text">Social Links</TabsTrigger>
            <TabsTrigger value="company" className="gold-text">Company Info</TabsTrigger>
            <TabsTrigger value="appearance" className="gold-text">Appearance</TabsTrigger>
          </TabsList>
          
          <TabsContent value="links" className="space-y-6">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card rounded-lg p-6 mb-8"
            >
              <h2 className="text-xl font-bold mb-6 text-white">Social Media & Contact Links</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="whatsapp" className="text-white/80">WhatsApp</Label>
                  <Input 
                    id="whatsapp" 
                    value={links.whatsapp} 
                    onChange={(e) => handleLinkChange('whatsapp', e.target.value)}
                    className="bg-black/50 border-[#D4AF37]/30 text-white"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="website" className="text-white/80">Website</Label>
                  <Input 
                    id="website" 
                    value={links.website} 
                    onChange={(e) => handleLinkChange('website', e.target.value)}
                    className="bg-black/50 border-[#D4AF37]/30 text-white"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="instagram" className="text-white/80">Instagram</Label>
                  <Input 
                    id="instagram" 
                    value={links.instagram} 
                    onChange={(e) => handleLinkChange('instagram', e.target.value)}
                    className="bg-black/50 border-[#D4AF37]/30 text-white"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="linkedin" className="text-white/80">LinkedIn</Label>
                  <Input 
                    id="linkedin" 
                    value={links.linkedin} 
                    onChange={(e) => handleLinkChange('linkedin', e.target.value)}
                    className="bg-black/50 border-[#D4AF37]/30 text-white"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-white/80">Email</Label>
                  <Input 
                    id="email" 
                    value={links.email} 
                    onChange={(e) => handleLinkChange('email', e.target.value)}
                    className="bg-black/50 border-[#D4AF37]/30 text-white"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="location" className="text-white/80">Google Maps Location</Label>
                  <Input 
                    id="location" 
                    value={links.location} 
                    onChange={(e) => handleLinkChange('location', e.target.value)}
                    className="bg-black/50 border-[#D4AF37]/30 text-white"
                  />
                </div>
              </div>
            </motion.div>

            <div className="flex justify-end space-x-4">
              <Button
                variant="outline"
                className="border-destructive text-destructive hover:bg-destructive/10"
              >
                <Trash2 size={16} className="mr-2" />
                Reset
              </Button>
              
              <Button 
                onClick={handleSave}
                className="gold-gradient text-black font-medium btn-3d"
                disabled={saving}
              >
                {saving ? (
                  <>
                    <div className="h-4 w-4 border-2 border-t-transparent border-black rounded-full animate-spin mr-2"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={16} className="mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="company">
            <div className="glass-card rounded-lg p-6">
              <h2 className="text-xl font-bold mb-6 text-white">Company Information</h2>
              <p className="text-white/60">This feature will be available in the next update.</p>
            </div>
          </TabsContent>
          
          <TabsContent value="appearance">
            <div className="glass-card rounded-lg p-6">
              <h2 className="text-xl font-bold mb-6 text-white">Appearance Settings</h2>
              <p className="text-white/60">This feature will be available in the next update.</p>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      <AlertDialog open={confirmLogout} onOpenChange={setConfirmLogout}>
        <AlertDialogContent className="glass-dark text-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="gold-text">Confirm Logout</AlertDialogTitle>
            <AlertDialogDescription className="text-white/60">
              Are you sure you want to logout from the admin dashboard?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-[#D4AF37]/30 text-white hover:bg-[#D4AF37]/10">Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleLogout}
              className="gold-gradient text-black font-medium btn-3d"
            >
              Logout
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Link to="/">
        <div className="fixed bottom-4 right-4 gold-gradient p-2 rounded-full shadow-lg hover:scale-105 transition-transform">
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }}>
            <VarnoraLogo size="sm" animated={false} />
          </motion.div>
        </div>
      </Link>
    </div>
  );
}