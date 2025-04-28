import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { useToast } from "../../hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../../components/ui/form";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import { Button } from "../../components/ui/button";
import { Loader2 } from "lucide-react";
import AdminSidebar from "../../components/admin/AdminSidebar";
import { apiRequest, queryClient } from "../../lib/queryClient";

const companyInfoSchema = z.object({
  name: z.string().min(2, "Company name must be at least 2 characters"),
  slogan: z.string().min(2, "Slogan must be at least 2 characters"),
  about: z.string().min(10, "About must be at least 10 characters"),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().optional(),
  address: z.string().optional(),
  website: z.string().url("Please enter a valid URL")
});

type CompanyInfoValues = z.infer<typeof companyInfoSchema>;

export default function CompanyInfoPage() {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);

  // Fetch company info
  const { 
    data: companyInfo, 
    isLoading,
    error,
  } = useQuery({
    queryKey: ["/api/company-info"],
    queryFn: async () => {
      const response = await fetch("/api/company-info");
      if (!response.ok) {
        throw new Error("Failed to fetch company info");
      }
      return response.json();
    }
  });

  // Set up form
  const form = useForm<CompanyInfoValues>({
    resolver: zodResolver(companyInfoSchema),
    defaultValues: {
      name: "",
      slogan: "",
      about: "",
      email: "",
      phone: "",
      address: "",
      website: ""
    },
    values: companyInfo
  });

  // Update company info mutation
  const updateMutation = useMutation({
    mutationFn: async (data: CompanyInfoValues) => {
      const res = await apiRequest("PUT", "/api/company-info", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/company-info"] });
      toast({
        title: "Company information updated",
        description: "Your changes have been saved successfully.",
        variant: "default",
      });
      setIsEditing(false);
    },
    onError: (error) => {
      toast({
        title: "Failed to update",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const onSubmit = (data: CompanyInfoValues) => {
    updateMutation.mutate(data);
  };

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

  if (error) {
    return (
      <div className="flex h-screen">
        <AdminSidebar />
        <div className="flex-1 p-8">
          <Card className="w-full max-w-4xl mx-auto">
            <CardHeader>
              <CardTitle className="text-2xl gold-text">Error</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Failed to load company information. Please try again later.</p>
              <Button 
                onClick={() => queryClient.invalidateQueries({ queryKey: ["/api/company-info"] })}
                className="mt-4"
              >
                Retry
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen">
      <AdminSidebar />
      <div className="flex-1 p-8 overflow-y-auto bg-black/90">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold gold-text mb-6">Company Information</h1>
          <p className="text-gray-400 mb-6">
            Manage your company details that will be displayed on the main page.
          </p>

          <Card className="bg-black/60 border-gray-800">
            <CardHeader>
              <CardTitle>Company Details</CardTitle>
              <CardDescription>
                This information appears on your landing page and in various places throughout the site.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Company Name</FormLabel>
                          <FormControl>
                            <Input
                              disabled={!isEditing}
                              placeholder="Enter company name"
                              {...field}
                              className="bg-black/40 border-gray-700"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="slogan"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Slogan</FormLabel>
                          <FormControl>
                            <Input
                              disabled={!isEditing}
                              placeholder="Enter company slogan"
                              {...field}
                              className="bg-black/40 border-gray-700"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="about"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>About</FormLabel>
                        <FormControl>
                          <Textarea
                            disabled={!isEditing}
                            placeholder="Enter company description"
                            {...field}
                            className="min-h-32 bg-black/40 border-gray-700"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input
                              disabled={!isEditing}
                              placeholder="Enter contact email"
                              {...field}
                              className="bg-black/40 border-gray-700"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone (Optional)</FormLabel>
                          <FormControl>
                            <Input
                              disabled={!isEditing}
                              placeholder="Enter contact phone"
                              {...field}
                              className="bg-black/40 border-gray-700"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Address (Optional)</FormLabel>
                        <FormControl>
                          <Textarea
                            disabled={!isEditing}
                            placeholder="Enter company address"
                            {...field}
                            className="min-h-24 bg-black/40 border-gray-700"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="website"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Website</FormLabel>
                        <FormControl>
                          <Input
                            disabled={!isEditing}
                            placeholder="Enter website URL"
                            {...field}
                            className="bg-black/40 border-gray-700"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-end space-x-4 pt-4">
                    {isEditing ? (
                      <>
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={() => setIsEditing(false)}
                          disabled={updateMutation.isPending}
                        >
                          Cancel
                        </Button>
                        <Button 
                          type="submit"
                          className="gold-gradient-btn"
                          disabled={updateMutation.isPending}
                        >
                          {updateMutation.isPending && (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          )}
                          Save Changes
                        </Button>
                      </>
                    ) : (
                      <Button 
                        type="button" 
                        onClick={() => setIsEditing(true)}
                        className="gold-gradient-btn"
                      >
                        Edit Information
                      </Button>
                    )}
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}