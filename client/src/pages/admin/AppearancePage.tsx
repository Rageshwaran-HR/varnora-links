import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Loader2 } from "lucide-react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const appearanceSchema = z.object({
  primaryColor: z.string().regex(/^#[0-9A-F]{6}$/i, "Must be a valid hex color"),
  secondaryColor: z.string().regex(/^#[0-9A-F]{6}$/i, "Must be a valid hex color"),
  backgroundColor: z.string().regex(/^#[0-9A-F]{6}$/i, "Must be a valid hex color"),
  textColor: z.string().regex(/^#[0-9A-F]{6}$/i, "Must be a valid hex color"),
  fontFamily: z.string().min(1, "Font family is required"),
  animationEnabled: z.boolean(),
  particlesEnabled: z.boolean()
});

type AppearanceValues = z.infer<typeof appearanceSchema>;

export default function AppearancePage() {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);

  const fontOptions = [
    { value: "Cinzel", label: "Cinzel (Default)" },
    { value: "Raleway", label: "Raleway" },
    { value: "Playfair Display", label: "Playfair Display" },
    { value: "Montserrat", label: "Montserrat" },
    { value: "Roboto", label: "Roboto" },
    { value: "Poppins", label: "Poppins" }
  ];

  // Fetch appearance settings
  const { 
    data: appearance, 
    isLoading,
    error,
  } = useQuery({
    queryKey: ["/api/appearance"],
    queryFn: async () => {
      const response = await fetch("/api/appearance");
      if (!response.ok) {
        throw new Error("Failed to fetch appearance settings");
      }
      return response.json();
    }
  });

  // Set up form
  const form = useForm<AppearanceValues>({
    resolver: zodResolver(appearanceSchema),
    defaultValues: {
      primaryColor: "#D4AF37",
      secondaryColor: "#B8860B",
      backgroundColor: "#000000",
      textColor: "#FFFFFF",
      fontFamily: "Cinzel",
      animationEnabled: true,
      particlesEnabled: true
    },
    values: appearance
  });

  // Update appearance settings mutation
  const updateMutation = useMutation({
    mutationFn: async (data: AppearanceValues) => {
      const res = await apiRequest("PUT", "/api/appearance", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/appearance"] });
      toast({
        title: "Appearance settings updated",
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

  const onSubmit = (data: AppearanceValues) => {
    updateMutation.mutate(data);
  };

  // Preview styles based on form values
  const getPreviewStyle = () => {
    const values = form.getValues();
    return {
      backgroundColor: values.backgroundColor,
      color: values.textColor,
      fontFamily: values.fontFamily,
      border: `1px solid ${values.primaryColor}40`,
      padding: "20px",
      borderRadius: "8px",
    };
  };

  const getButtonPreviewStyle = () => {
    const values = form.getValues();
    return {
      background: `linear-gradient(to right, ${values.primaryColor}, ${values.secondaryColor})`,
      color: values.textColor,
      fontFamily: values.fontFamily,
      padding: "10px 20px",
      borderRadius: "6px",
      border: "none",
      cursor: "pointer",
      transition: "all 0.3s ease",
    };
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
              <p>Failed to load appearance settings. Please try again later.</p>
              <Button 
                onClick={() => queryClient.invalidateQueries({ queryKey: ["/api/appearance"] })}
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
          <h1 className="text-3xl font-bold gold-text mb-6">Appearance Settings</h1>
          <p className="text-gray-400 mb-6">
            Customize the look and feel of your website.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <Card className="bg-black/60 border-gray-800">
              <CardHeader>
                <CardTitle>Theme Settings</CardTitle>
                <CardDescription>
                  Customize colors, fonts, and animations.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Colors</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="primaryColor"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Primary Color</FormLabel>
                              <div className="flex items-center gap-2">
                                <div 
                                  className="w-8 h-8 rounded border border-gray-700" 
                                  style={{ backgroundColor: field.value }}
                                />
                                <FormControl>
                                  <Input
                                    disabled={!isEditing}
                                    {...field}
                                    className="bg-black/40 border-gray-700"
                                  />
                                </FormControl>
                              </div>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="secondaryColor"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Secondary Color</FormLabel>
                              <div className="flex items-center gap-2">
                                <div 
                                  className="w-8 h-8 rounded border border-gray-700" 
                                  style={{ backgroundColor: field.value }}
                                />
                                <FormControl>
                                  <Input
                                    disabled={!isEditing}
                                    {...field}
                                    className="bg-black/40 border-gray-700"
                                  />
                                </FormControl>
                              </div>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="backgroundColor"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Background Color</FormLabel>
                              <div className="flex items-center gap-2">
                                <div 
                                  className="w-8 h-8 rounded border border-gray-700" 
                                  style={{ backgroundColor: field.value }}
                                />
                                <FormControl>
                                  <Input
                                    disabled={!isEditing}
                                    {...field}
                                    className="bg-black/40 border-gray-700"
                                  />
                                </FormControl>
                              </div>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="textColor"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Text Color</FormLabel>
                              <div className="flex items-center gap-2">
                                <div 
                                  className="w-8 h-8 rounded border border-gray-700" 
                                  style={{ backgroundColor: field.value }}
                                />
                                <FormControl>
                                  <Input
                                    disabled={!isEditing}
                                    {...field}
                                    className="bg-black/40 border-gray-700"
                                  />
                                </FormControl>
                              </div>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Typography</h3>
                      <FormField
                        control={form.control}
                        name="fontFamily"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Font Family</FormLabel>
                            <Select
                              disabled={!isEditing}
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger className="bg-black/40 border-gray-700">
                                  <SelectValue placeholder="Select a font" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {fontOptions.map((font) => (
                                  <SelectItem key={font.value} value={font.value}>
                                    {font.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Effects</h3>
                      <FormField
                        control={form.control}
                        name="animationEnabled"
                        render={({ field }) => (
                          <FormItem className="flex items-center justify-between">
                            <div className="space-y-0.5">
                              <FormLabel>Enable Animations</FormLabel>
                              <FormDescription className="text-xs text-gray-500">
                                Toggle to enable or disable animations site-wide.
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                disabled={!isEditing}
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="particlesEnabled"
                        render={({ field }) => (
                          <FormItem className="flex items-center justify-between">
                            <div className="space-y-0.5">
                              <FormLabel>Enable Particles</FormLabel>
                              <FormDescription className="text-xs text-gray-500">
                                Toggle to enable or disable background particles effect.
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                disabled={!isEditing}
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

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
                          Edit Appearance
                        </Button>
                      )}
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>

            <Card className="bg-black/60 border-gray-800">
              <CardHeader>
                <CardTitle>Live Preview</CardTitle>
                <CardDescription>
                  See how your changes will look on the website.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div style={getPreviewStyle()} className="flex flex-col space-y-4">
                    <h3 style={{ color: form.getValues().primaryColor }}>Content Example</h3>
                    <p>This is what your text content will look like with the selected settings.</p>
                    <div className="flex flex-wrap gap-2">
                      <button style={getButtonPreviewStyle()}>Primary Button</button>
                    </div>
                  </div>
                  
                  <div className="bg-black/20 p-4 rounded-lg border border-gray-800">
                    <h3 className="text-sm font-medium mb-2">Current Settings</h3>
                    <div className="space-y-2 text-xs text-gray-400">
                      <div className="flex justify-between">
                        <span>Primary Color:</span>
                        <span>{form.getValues().primaryColor}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Secondary Color:</span>
                        <span>{form.getValues().secondaryColor}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Font Family:</span>
                        <span>{form.getValues().fontFamily}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Animations:</span>
                        <span>{form.getValues().animationEnabled ? "Enabled" : "Disabled"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Particles Effect:</span>
                        <span>{form.getValues().particlesEnabled ? "Enabled" : "Disabled"}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}