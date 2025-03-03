"use client";

import { useEffect, useState } from "react";
import { useReportDraftingContext } from "@/contexts/ReportDrafting/ReportDraftingContext";
import { SavedTemplate } from "@/lib/report-drafting/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Heart, Share2, Trash2, Edit, Download, Upload, Copy, Star, Info } from "lucide-react";
import { toast } from "sonner";

interface TemplateCardProps {
  template: SavedTemplate;
  onSelect: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onExport: () => void;
  onToggleFavorite: () => void;
  onToggleShare: () => void;
  onDuplicate: () => void;
  isFavorite: boolean;
}

const TemplateCard = ({ 
  template, 
  onSelect, 
  onEdit, 
  onDelete, 
  onExport, 
  onToggleFavorite, 
  onToggleShare, 
  onDuplicate,
  isFavorite 
}: TemplateCardProps) => {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{template.name}</CardTitle>
          <div className="flex space-x-1">
            <Button 
              variant="ghost" 
              size="icon" 
              className={isFavorite ? "text-red-500" : "text-gray-400"}
              onClick={(e) => {
                e.stopPropagation();
                onToggleFavorite();
              }}
            >
              <Heart className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon"
              className={template.isShared ? "text-blue-500" : "text-gray-400"}
              onClick={(e) => {
                e.stopPropagation();
                onToggleShare();
              }}
            >
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="flex flex-wrap gap-1 mt-1">
          <Badge variant="outline" className="text-xs bg-slate-100">
            {template.category}
          </Badge>
          {template.tags.slice(0, 2).map((tag, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
          {template.tags.length > 2 && (
            <Badge variant="secondary" className="text-xs">
              +{template.tags.length - 2}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-gray-500 line-clamp-3">
          {template.description}
        </p>
        <div className="mt-3 text-xs text-gray-400">
          Last modified: {new Date(template.lastModified).toLocaleDateString()}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between pt-2 border-t">
        <Button variant="default" size="sm" onClick={onSelect}>
          Use Template
        </Button>
        <div className="flex space-x-1">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              onDuplicate();
            }}
          >
            <Copy className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              onExport();
            }}
          >
            <Download className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon"
            className="text-red-400 hover:text-red-600"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

interface CreateTemplateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (template: { name: string; description: string; category: string; tags: string[] }) => void;
  initialValues?: { 
    name: string; 
    description: string; 
    category: string; 
    tags: string[] 
  };
  title?: string;
  actionLabel?: string;
}

const CreateTemplateDialog = ({ 
  open, 
  onOpenChange, 
  onSave, 
  initialValues,
  title = "Create New Template",
  actionLabel = "Create Template"
}: CreateTemplateDialogProps) => {
  const [name, setName] = useState(initialValues?.name || "");
  const [description, setDescription] = useState(initialValues?.description || "");
  const [category, setCategory] = useState(initialValues?.category || "General");
  const [tags, setTags] = useState(initialValues?.tags?.join(", ") || "");

  useEffect(() => {
    if (open && initialValues) {
      setName(initialValues.name);
      setDescription(initialValues.description);
      setCategory(initialValues.category);
      setTags(initialValues.tags.join(", "));
    }
  }, [open, initialValues]);

  const handleSave = () => {
    const tagArray = tags
      .split(",")
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0);
    
    onSave({
      name,
      description,
      category,
      tags: tagArray
    });
    
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            Fill in the details for your template. You can edit this information later.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Template Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter template name"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter template description"
              rows={3}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="category">Category</Label>
            <Input
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="Enter category"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="tags">Tags (comma separated)</Label>
            <Input
              id="tags"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="Enter tags, separated by commas"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!name.trim()}>
            {actionLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

interface DeleteTemplateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  templateName: string;
}

const DeleteTemplateDialog = ({ 
  open, 
  onOpenChange, 
  onConfirm, 
  templateName 
}: DeleteTemplateDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete Template</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete "{templateName}"? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

interface ImportTemplateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImport: (file: File) => void;
}

const ImportTemplateDialog = ({ 
  open, 
  onOpenChange, 
  onImport 
}: ImportTemplateDialogProps) => {
  const [file, setFile] = useState<File | null>(null);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Import Template</DialogTitle>
          <DialogDescription>
            Select a template file (.json) to import.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="file">Template File</Label>
            <Input
              id="file"
              type="file"
              accept=".json"
              onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) {
                  setFile(e.target.files[0]);
                }
              }}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            onClick={() => {
              if (file) {
                onImport(file);
                onOpenChange(false);
              }
            }} 
            disabled={!file}
          >
            Import
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default function TemplateManagement() {
  const {
    isLoading,
    error,
    templateLibrary,
    loadTemplateLibrary,
    updateTemplateDetails,
    deleteTemplateById,
    exportTemplateToFile,
    importTemplateFromFile,
    toggleFavoriteTemplate,
    toggleTemplateSharing,
    createNewTemplateFromBase,
    selectTemplate,
    goToNextStep
  } = useReportDraftingContext();

  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  
  const [selectedTemplateForAction, setSelectedTemplateForAction] = useState<SavedTemplate | null>(null);

  useEffect(() => {
    if (!templateLibrary) {
      loadTemplateLibrary();
    }
  }, [templateLibrary, loadTemplateLibrary]);

  // Filter templates based on active tab and search query
  const getFilteredTemplates = () => {
    if (!templateLibrary) return [];
    
    let templates: SavedTemplate[] = [];
    
    switch (activeTab) {
      case "all":
        templates = [...templateLibrary.personalTemplates];
        break;
      case "favorites":
        templates = templateLibrary.personalTemplates.filter(
          template => templateLibrary.favoriteTemplates.includes(template.id)
        );
        break;
      case "shared":
        templates = templateLibrary.personalTemplates.filter(
          template => template.isShared
        );
        break;
      case "recent":
        const recentIds = templateLibrary.recentlyUsedTemplates.map(t => t.templateId);
        templates = templateLibrary.personalTemplates.filter(
          template => recentIds.includes(template.id)
        );
        // Sort by recent usage
        templates.sort((a, b) => {
          const aIndex = recentIds.indexOf(a.id);
          const bIndex = recentIds.indexOf(b.id);
          return aIndex - bIndex;
        });
        break;
      default:
        templates = [...templateLibrary.personalTemplates];
    }
    
    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      templates = templates.filter(
        template =>
          template.name.toLowerCase().includes(query) ||
          template.description.toLowerCase().includes(query) ||
          template.category.toLowerCase().includes(query) ||
          template.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }
    
    return templates;
  };

  const handleExportTemplate = async (template: SavedTemplate) => {
    try {
      const blob = await exportTemplateToFile(template.id);
      
      if (!blob) {
        toast.error("Failed to export template");
        return;
      }
      
      // Create download link
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${template.name.replace(/\s+/g, '_')}_template.json`;
      document.body.appendChild(a);
      a.click();
      
      // Clean up
      URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast.success("Template exported successfully");
    } catch (err) {
      toast.error("Failed to export template");
      console.error(err);
    }
  };

  const handleImportTemplate = async (file: File) => {
    try {
      const importedTemplate = await importTemplateFromFile(file);
      
      if (!importedTemplate) {
        toast.error("Failed to import template");
        return;
      }
      
      toast.success("Template imported successfully");
    } catch (err) {
      toast.error("Failed to import template");
      console.error(err);
    }
  };

  const handleDeleteTemplate = async () => {
    if (!selectedTemplateForAction) return;
    
    try {
      const success = await deleteTemplateById(selectedTemplateForAction.id);
      
      if (success) {
        toast.success("Template deleted successfully");
      } else {
        toast.error("Failed to delete template");
      }
    } catch (err) {
      toast.error("Failed to delete template");
      console.error(err);
    } finally {
      setDeleteDialogOpen(false);
    }
  };

  const handleUpdateTemplate = async (templateData: { 
    name: string; 
    description: string; 
    category: string; 
    tags: string[] 
  }) => {
    if (!selectedTemplateForAction) return;
    
    try {
      const updatedTemplate = await updateTemplateDetails(
        selectedTemplateForAction.id,
        {
          name: templateData.name,
          description: templateData.description,
          category: templateData.category,
          tags: templateData.tags
        }
      );
      
      if (updatedTemplate) {
        toast.success("Template updated successfully");
      } else {
        toast.error("Failed to update template");
      }
    } catch (err) {
      toast.error("Failed to update template");
      console.error(err);
    }
  };

  const handleToggleFavorite = async (template: SavedTemplate) => {
    if (!templateLibrary) return;
    
    const isFavorite = templateLibrary.favoriteTemplates.includes(template.id);
    
    try {
      const success = await toggleFavoriteTemplate(template.id, !isFavorite);
      
      if (success) {
        toast.success(
          isFavorite 
            ? "Template removed from favorites" 
            : "Template added to favorites"
        );
      } else {
        toast.error("Failed to update favorites");
      }
    } catch (err) {
      toast.error("Failed to update favorites");
      console.error(err);
    }
  };

  const handleToggleSharing = async (template: SavedTemplate) => {
    try {
      const updatedTemplate = await toggleTemplateSharing(
        template.id,
        !template.isShared
      );
      
      if (updatedTemplate) {
        toast.success(
          template.isShared 
            ? "Template is now private" 
            : "Template is now shared"
        );
      } else {
        toast.error("Failed to update sharing status");
      }
    } catch (err) {
      toast.error("Failed to update sharing status");
      console.error(err);
    }
  };

  const handleDuplicateTemplate = async (template: SavedTemplate) => {
    try {
      const newTemplate = await createNewTemplateFromBase(
        template.id,
        `Copy of ${template.name}`
      );
      
      if (newTemplate) {
        toast.success("Template duplicated successfully");
      } else {
        toast.error("Failed to duplicate template");
      }
    } catch (err) {
      toast.error("Failed to duplicate template");
      console.error(err);
    }
  };

  const handleSelectTemplate = async (template: SavedTemplate) => {
    try {
      await selectTemplate(template.id);
      goToNextStep();
    } catch (err) {
      toast.error("Failed to select template");
      console.error(err);
    }
  };

  if (isLoading && !templateLibrary) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="h-6 w-6 animate-spin rounded-full border-b-2 border-blue-600 mr-2"></div>
        <span>Loading templates...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-md text-red-800 flex items-start">
        <Info className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
        <div>
          <h3 className="font-medium">Error loading templates</h3>
          <p className="text-sm mt-1">{error}</p>
          <Button 
            variant="outline" 
            size="sm" 
            className="mt-2"
            onClick={() => loadTemplateLibrary()}
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  const filteredTemplates = getFilteredTemplates();

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h3 className="text-2xl font-semibold text-slate-800">Template Library</h3>
        <div className="flex gap-2">
          <Input
            placeholder="Search templates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="md:w-64"
          />
          <Button onClick={() => setImportDialogOpen(true)}>
            <Upload className="h-4 w-4 mr-2" />
            Import
          </Button>
        </div>
      </div>

      <Tabs 
        defaultValue="all" 
        value={activeTab} 
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All Templates</TabsTrigger>
          <TabsTrigger value="favorites">Favorites</TabsTrigger>
          <TabsTrigger value="shared">Shared</TabsTrigger>
          <TabsTrigger value="recent">Recently Used</TabsTrigger>
        </TabsList>
        
        {["all", "favorites", "shared", "recent"].map((tab) => (
          <TabsContent key={tab} value={tab}>
            {filteredTemplates.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <p className="text-gray-500">
                  {searchQuery
                    ? "No templates match your search criteria"
                    : tab === "favorites"
                    ? "You haven't added any templates to favorites yet"
                    : tab === "shared"
                    ? "You haven't shared any templates yet"
                    : tab === "recent"
                    ? "You haven't used any templates recently"
                    : "No templates available"}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                {filteredTemplates.map((template) => (
                  <TemplateCard
                    key={template.id}
                    template={template}
                    onSelect={() => handleSelectTemplate(template)}
                    onEdit={() => {
                      setSelectedTemplateForAction(template);
                      setEditDialogOpen(true);
                    }}
                    onDelete={() => {
                      setSelectedTemplateForAction(template);
                      setDeleteDialogOpen(true);
                    }}
                    onExport={() => handleExportTemplate(template)}
                    onToggleFavorite={() => handleToggleFavorite(template)}
                    onToggleShare={() => handleToggleSharing(template)}
                    onDuplicate={() => handleDuplicateTemplate(template)}
                    isFavorite={
                      templateLibrary?.favoriteTemplates.includes(template.id) || false
                    }
                  />
                ))}
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>

      {/* Create/Edit Template Dialog */}
      <CreateTemplateDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onSave={handleUpdateTemplate}
        initialValues={selectedTemplateForAction ? {
          name: selectedTemplateForAction.name,
          description: selectedTemplateForAction.description,
          category: selectedTemplateForAction.category,
          tags: selectedTemplateForAction.tags
        } : undefined}
        title="Edit Template"
        actionLabel="Save Changes"
      />

      {/* Delete Template Dialog */}
      <DeleteTemplateDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDeleteTemplate}
        templateName={selectedTemplateForAction?.name || ""}
      />

      {/* Import Template Dialog */}
      <ImportTemplateDialog
        open={importDialogOpen}
        onOpenChange={setImportDialogOpen}
        onImport={handleImportTemplate}
      />
    </div>
  );
}
