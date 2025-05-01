import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Loader2, MousePointerClick, Link, Settings, FileText, ExternalLink } from "lucide-react";
import AdminSidebar from "../../components/admin/AdminSidebar";
import { Link as WouterLink } from "wouter";
import VarnoraLogo from "../../components/VarnoraLogo";

export default function DashboardPage() {
  const [links, setLinks] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/links")
      .then((response) => response.json())
      .then((data) => {
        console.log("API Response:", data);
        setLinks(Array.isArray(data) ? data : []); // Ensure it's an array
      })
      .catch((error) => console.error("Error fetching links:", error));
  }, []);

  // Fetch company info
  const { 
    data: companyInfo, 
    isLoading: isLoadingCompanyInfo,
  } = useQuery({
    queryKey: ["/api/companys"],
    queryFn: async () => {
      const response = await fetch("/api/companys");
      if (!response.ok) {
        throw new Error("Failed to fetch company info");
      }
      return response.json();
    }
  });

  // Stats for dashboard
  const totalLinks = links?.length || 0;
  const activeLinks = links?.filter((link: any) => link.active).length || 0;

  const isLoading = isLoadingCompanyInfo;

  if (isLoading) {
    return (
      <div className="flex h-screen">
        <AdminSidebar />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-[#D4AF37]" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen">
      <AdminSidebar />
      <div className="flex-1 p-8 overflow-y-auto bg-black/90">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold gold-text mb-2">Welcome to Your Dashboard</h1>
              <p className="text-gray-400">
                Manage your Varnora links and settings from here.
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <Button 
                className="gold-gradient-btn"
                onClick={() => window.open("/", "_blank")}
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                View Your Page
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="bg-black/60 border-gray-800">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Company</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold gold-text">{companyInfo?.name || "Varnora"}</div>
                <p className="text-gray-400 text-sm mt-1">{companyInfo?.slogan || "Premium Luxury Solutions"}</p>
              </CardContent>
            </Card>
            
            <Card className="bg-black/60 border-gray-800">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Total Links</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold gold-text">{totalLinks}</div>
                <p className="text-gray-400 text-sm mt-1">Links in your profile</p>
              </CardContent>
            </Card>
            
            <Card className="bg-black/60 border-gray-800">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Active Links</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold gold-text">{activeLinks}</div>
                <p className="text-gray-400 text-sm mt-1">Currently visible links</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="bg-black/60 border-gray-800 col-span-1">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>
                  Manage your profile links and settings.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 gap-4">
                <WouterLink href="/admin/links">
                  <Button className="w-full justify-start bg-gray-900 hover:bg-gray-800 border border-gray-700">
                    <Link className="mr-2 h-5 w-5 text-[#D4AF37]" />
                    Manage Links
                  </Button>
                </WouterLink>
                
                <WouterLink href="/admin/company-info">
                  <Button className="w-full justify-start bg-gray-900 hover:bg-gray-800 border border-gray-700">
                    <FileText className="mr-2 h-5 w-5 text-[#D4AF37]" />
                    Update Company Info
                  </Button>
                </WouterLink>
                
                <WouterLink href="/admin/appearance">
                  <Button className="w-full justify-start bg-gray-900 hover:bg-gray-800 border border-gray-700">
                    <Settings className="mr-2 h-5 w-5 text-[#D4AF37]" />
                    Customize Appearance
                  </Button>
                </WouterLink>
                
                <Button 
                  className="w-full justify-start bg-gray-900 hover:bg-gray-800 border border-gray-700"
                  onClick={() => window.open("/", "_blank")}
                >
                  <MousePointerClick className="mr-2 h-5 w-5 text-[#D4AF37]" />
                  View Public Page
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-black/60 border-gray-800 col-span-1">
              <CardHeader>
                <CardTitle>Company Preview</CardTitle>
                <CardDescription>
                  A preview of your company brand.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center justify-center p-8 space-y-4 text-center">
                <VarnoraLogo size="md" />
                <div>
                  <h3 className="text-xl font-bold gold-text">{companyInfo?.name || "Varnora"}</h3>
                  <p className="text-gray-400">{companyInfo?.slogan || "Premium Luxury Solutions"}</p>
                </div>
                <div className="w-full mt-4 pt-4 border-t border-gray-800">
                  <p className="text-sm text-gray-500 mb-2">Contact Information:</p>
                  <p className="text-sm font-medium">{companyInfo?.email || "info@varnora.com"}</p>
                  {companyInfo?.phone && <p className="text-sm font-medium">{companyInfo?.phone}</p>}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}