import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Loader2, Plus, Trash2, Edit, ExternalLink, ArrowUp, ArrowDown } from "lucide-react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import * as Icons from 'react-icons/fa';

const linkSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  url: z.string().url("Please enter a valid URL"),
  description: z.string().min(5, "Description must be at least 5 characters"),
  icon: z.string().min(1, "Icon is required"),
  iconBgColor: z.string().min(1, "Icon background color is required"),
  order: z.number().int().positive(),
  active: z.boolean()
});

type LinkFormValues = z.infer<typeof linkSchema>;

export default function LinksPage() {
  const { toast } = useToast();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedLink, setSelectedLink] = useState<any>(null);

  // Available icons
  const iconOptions = [
    { value: 'FaInstagram', label: 'Instagram' },
    { value: 'FaWhatsapp', label: 'WhatsApp' },
    { value: 'FaFacebook', label: 'Facebook' },
    { value: 'FaTwitter', label: 'Twitter' },
    { value: 'FaLinkedin', label: 'LinkedIn' },
    { value: 'FaYoutube', label: 'YouTube' },
    { value: 'FaTiktok', label: 'TikTok' },
    { value: 'FaPinterest', label: 'Pinterest' },
    { value: 'FaSnapchat', label: 'Snapchat' },
    { value: 'FaGlobe', label: 'Website' },
    { value: 'FaEnvelope', label: 'Email' },
    { value: 'FaPhone', label: 'Phone' },
    { value: 'FaMapMarkerAlt', label: 'Location' },
    { value: 'FaStore', label: 'Store' },
    { value: 'FaBookOpen', label: 'Catalog' },
    { value: 'FaShoppingCart', label: 'Shopping' }
  ];

  // Background color options
  const bgColorOptions = [
    { value: 'bg-gradient-to-r from-purple-500 to-pink-500', label: 'Instagram' },
    { value: 'bg-gradient-to-r from-green-500 to-emerald-400', label: 'WhatsApp' },
    { value: 'bg-gradient-to-r from-blue-600 to-blue-500', label: 'Facebook' },
    { value: 'bg-gradient-to-r from-blue-400 to-cyan-300', label: 'Twitter' },
    { value: 'bg-gradient-to-r from-blue-700 to-blue-600', label: 'LinkedIn' },
    { value: 'bg-gradient-to-r from-red-600 to-red-500', label: 'YouTube' },
    { value: 'bg-gradient-to-r from-black to-gray-800', label: 'TikTok' },
    { value: 'bg-gradient-to-r from-red-500 to-rose-400', label: 'Pinterest' },
    { value: 'bg-gradient-to-r from-yellow-400 to-yellow-300', label: 'Snapchat' },
    { value: 'bg-gradient-to-r from-blue-500 to-teal-400', label: 'Website' },
    { value: 'bg-gradient-to-r from-indigo-500 to-purple-500', label: 'Custom 1' },
    { value: 'bg-gradient-to-r from-amber-500 to-orange-400', label: 'Custom 2' },
    { value: 'bg-gradient-to-r from-green-600 to-lime-500', label: 'Custom 3' },
    { value: 'bg-gradient-to-r from-slate-600 to-slate-500', label: 'Custom 4' },
    { value: 'bg-gradient-to-r from-rose-500 to-pink-500', label: 'Custom 5' },
    { value: 'bg-gradient-to-r from-amber-600 to-yellow-500', label: 'Gold' }
  ];

  // Fetch links
  const { 
    data: links, 
    isLoading,
    error
  } = useQuery({
    queryKey: ["/api/links"],
    queryFn: async () => {
      const response = await fetch("/api/links");
      if (!response.ok) {
        throw new Error("Failed to fetch links");
      }
      return response.json();
    }
  });

  // Set up forms
  const addForm = useForm<LinkFormValues>({
    resolver: zodResolver(linkSchema),
    defaultValues: {
      title: "",
      url: "",
      description: "",
      icon: "FaGlobe",
      iconBgColor: "bg-gradient-to-r from-blue-500 to-teal-400",
      order: links?.length ? links.length + 1 : 1,
      active: true
    }
  });

  const editForm = useForm<LinkFormValues>({
    resolver: zodResolver(linkSchema),
    defaultValues: {
      title: "",
      url: "",
      description: "",
      icon: "FaGlobe",
      iconBgColor: "bg-gradient-to-r from-blue-500 to-teal-400",
      order: 1,
      active: true
    }
  });

  // Create link mutation
  const createMutation = useMutation({
    mutationFn: async (data: LinkFormValues) => {
      const res = await apiRequest("POST", "/api/links", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/links"] });
      toast({
        title: "Link created",
        description: "Your new link has been added successfully.",
        variant: "default",
      });
      setIsAddDialogOpen(false);
      addForm.reset();
    },
    onError: (error) => {
      toast({
        title: "Failed to create link",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  // Update link mutation
  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number, data: LinkFormValues }) => {
      const res = await apiRequest("PUT", `/api/links/${id}`, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/links"] });
      toast({
        title: "Link updated",
        description: "Your changes have been saved successfully.",
        variant: "default",
      });
      setIsEditDialogOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Failed to update link",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  // Delete link mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/links/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/links"] });
      toast({
        title: "Link deleted",
        description: "The link has been removed.",
        variant: "default",
      });
      setIsDeleteDialogOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Failed to delete link",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  // Change link order mutations
  const moveUpMutation = useMutation({
    mutationFn: async (link: any) => {
      const prevLink = links.find((l: any) => l.order === link.order - 1);
      if (!prevLink) return;
      
      await Promise.all([
        apiRequest("PUT", `/api/links/${link.id}`, { ...link, order: link.order - 1 }),
        apiRequest("PUT", `/api/links/${prevLink.id}`, { ...prevLink, order: prevLink.order + 1 })
      ]);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/links"] });
    },
    onError: (error) => {
      toast({
        title: "Failed to reorder links",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const moveDownMutation = useMutation({
    mutationFn: async (link: any) => {
      const nextLink = links.find((l: any) => l.order === link.order + 1);
      if (!nextLink) return;
      
      await Promise.all([
        apiRequest("PUT", `/api/links/${link.id}`, { ...link, order: link.order + 1 }),
        apiRequest("PUT", `/api/links/${nextLink.id}`, { ...nextLink, order: nextLink.order - 1 })
      ]);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/links"] });
    },
    onError: (error) => {
      toast({
        title: "Failed to reorder links",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  // Form submission handlers
  const onAddSubmit = (data: LinkFormValues) => {
    createMutation.mutate(data);
  };

  const onEditSubmit = (data: LinkFormValues) => {
    if (!selectedLink) return;
    updateMutation.mutate({ id: selectedLink.id, data });
  };

  const handleEdit = (link: any) => {
    setSelectedLink(link);
    editForm.reset(link);
    setIsEditDialogOpen(true);
  };

  const handleDelete = (link: any) => {
    setSelectedLink(link);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (!selectedLink) return;
    deleteMutation.mutate(selectedLink.id);
  };

  // Helper function to get icon component
  const getIconComponent = (iconName: string) => {
    // @ts-ignore
    const IconComponent = Icons[iconName];
    return IconComponent ? <IconComponent className="h-5 w-5" /> : null;
  };

  // Render icon preview
  const renderIconPreview = (iconName: string, bgColor: string) => {
    // @ts-ignore
    const IconComponent = Icons[iconName];
    
    if (!IconComponent) return null;
    
    return (
      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${bgColor}`}>
        <IconComponent className="h-5 w-5 text-white" />
      </div>
    );
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
              <p>Failed to load links. Please try again later.</p>
              <Button 
                onClick={() => queryClient.invalidateQueries({ queryKey: ["/api/links"] })}
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
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold gold-text">Manage Links</h1>
              <p className="text-gray-400 mt-1">
                Add, edit, or remove links that appear on your landing page.
              </p>
            </div>
            <Button 
              onClick={() => setIsAddDialogOpen(true)}
              className="gold-gradient-btn"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add New Link
            </Button>
          </div>

          <Card className="bg-black/60 border-gray-800">
            <CardHeader>
              <CardTitle>Social Links</CardTitle>
              <CardDescription>
                Manage your social media and other important links.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {links && links.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">Order</TableHead>
                      <TableHead>Link</TableHead>
                      <TableHead>URL</TableHead>
                      <TableHead className="w-20">Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {links.map((link: any) => (
                      <TableRow key={link.id}>
                        <TableCell className="text-center">
                          <div className="flex flex-col items-center space-y-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              disabled={link.order === 1}
                              onClick={() => moveUpMutation.mutate(link)}
                            >
                              <ArrowUp className="h-3 w-3" />
                            </Button>
                            <span>{link.order}</span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              disabled={link.order === links.length}
                              onClick={() => moveDownMutation.mutate(link)}
                            >
                              <ArrowDown className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${link.iconBgColor}`}>
                              {getIconComponent(link.icon)}
                            </div>
                            <div>
                              <div className="font-medium">{link.title}</div>
                              <div className="text-sm text-gray-500">{link.description}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-blue-400 hover:underline">
                          <a 
                            href={link.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center"
                          >
                            {link.url.length > 30 ? `${link.url.substring(0, 30)}...` : link.url}
                            <ExternalLink className="ml-1 h-3 w-3" />
                          </a>
                        </TableCell>
                        <TableCell>
                          <Badge variant={link.active ? "default" : "secondary"}>
                            {link.active ? "Active" : "Inactive"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEdit(link)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDelete(link)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-400 mb-4">No links have been added yet.</p>
                  <Button 
                    onClick={() => setIsAddDialogOpen(true)}
                    className="gold-gradient-btn"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Your First Link
                  </Button>
                </div>
              )}
            </CardContent>
            <CardFooter className="border-t border-gray-800 pt-4 flex justify-between">
              <div className="text-sm text-gray-400">
                Total links: {links ? links.length : 0}
              </div>
              <div className="text-sm text-gray-400">
                Active links: {links ? links.filter((link: any) => link.active).length : 0}
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>

      {/* Add Link Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="bg-black/90 border-gray-800 max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add New Link</DialogTitle>
            <DialogDescription>
              Add a new link to your profile page.
            </DialogDescription>
          </DialogHeader>
          
          <Form {...addForm}>
            <form onSubmit={addForm.handleSubmit(onAddSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={addForm.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g. Instagram, WhatsApp"
                          {...field}
                          className="bg-black/40 border-gray-700"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={addForm.control}
                  name="url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>URL</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="https://..."
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
                control={addForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter a short description"
                        {...field}
                        className="min-h-20 bg-black/40 border-gray-700"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={addForm.control}
                  name="icon"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Icon</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="bg-black/40 border-gray-700">
                            <SelectValue placeholder="Select an icon" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {iconOptions.map((icon) => (
                            <SelectItem key={icon.value} value={icon.value}>
                              <div className="flex items-center">
                                {getIconComponent(icon.value)}
                                <span className="ml-2">{icon.label}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={addForm.control}
                  name="iconBgColor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Icon Background</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="bg-black/40 border-gray-700">
                            <SelectValue placeholder="Select a color" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {bgColorOptions.map((color) => (
                            <SelectItem key={color.value} value={color.value}>
                              <div className="flex items-center">
                                <div className={`w-4 h-4 rounded-full ${color.value}`}></div>
                                <span className="ml-2">{color.label}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={addForm.control}
                  name="order"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Display Order</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value))}
                          className="bg-black/40 border-gray-700"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={addForm.control}
                  name="active"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between space-y-0 pt-8">
                      <FormLabel>Active</FormLabel>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Separator className="my-4" />

              <div className="flex flex-col space-y-4">
                <div className="text-sm font-medium">Link Preview</div>
                <div className="border border-gray-800 rounded-lg p-4 bg-black/20">
                  <div className="flex items-center space-x-3">
                    {renderIconPreview(
                      addForm.watch("icon"), 
                      addForm.watch("iconBgColor")
                    )}
                    <div>
                      <div className="font-medium">{addForm.watch("title") || "Link Title"}</div>
                      <div className="text-sm text-gray-500">{addForm.watch("description") || "Link description"}</div>
                    </div>
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsAddDialogOpen(false)}
                  disabled={createMutation.isPending}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="gold-gradient-btn"
                  disabled={createMutation.isPending}
                >
                  {createMutation.isPending && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Add Link
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Edit Link Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="bg-black/90 border-gray-800 max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Link</DialogTitle>
            <DialogDescription>
              Update the details of this link.
            </DialogDescription>
          </DialogHeader>
          
          <Form {...editForm}>
            <form onSubmit={editForm.handleSubmit(onEditSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={editForm.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g. Instagram, WhatsApp"
                          {...field}
                          className="bg-black/40 border-gray-700"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={editForm.control}
                  name="url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>URL</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="https://..."
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
                control={editForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter a short description"
                        {...field}
                        className="min-h-20 bg-black/40 border-gray-700"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={editForm.control}
                  name="icon"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Icon</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="bg-black/40 border-gray-700">
                            <SelectValue placeholder="Select an icon" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {iconOptions.map((icon) => (
                            <SelectItem key={icon.value} value={icon.value}>
                              <div className="flex items-center">
                                {getIconComponent(icon.value)}
                                <span className="ml-2">{icon.label}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={editForm.control}
                  name="iconBgColor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Icon Background</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="bg-black/40 border-gray-700">
                            <SelectValue placeholder="Select a color" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {bgColorOptions.map((color) => (
                            <SelectItem key={color.value} value={color.value}>
                              <div className="flex items-center">
                                <div className={`w-4 h-4 rounded-full ${color.value}`}></div>
                                <span className="ml-2">{color.label}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={editForm.control}
                  name="order"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Display Order</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value))}
                          className="bg-black/40 border-gray-700"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={editForm.control}
                  name="active"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between space-y-0 pt-8">
                      <FormLabel>Active</FormLabel>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Separator className="my-4" />

              <div className="flex flex-col space-y-4">
                <div className="text-sm font-medium">Link Preview</div>
                <div className="border border-gray-800 rounded-lg p-4 bg-black/20">
                  <div className="flex items-center space-x-3">
                    {renderIconPreview(
                      editForm.watch("icon"), 
                      editForm.watch("iconBgColor")
                    )}
                    <div>
                      <div className="font-medium">{editForm.watch("title") || "Link Title"}</div>
                      <div className="text-sm text-gray-500">{editForm.watch("description") || "Link description"}</div>
                    </div>
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsEditDialogOpen(false)}
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
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete Link Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="bg-black/90 border-gray-800">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the "{selectedLink?.title}" link.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700"
              onClick={confirmDelete}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}