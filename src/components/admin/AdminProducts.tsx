import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/sonner";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Edit,
  Image,
  Loader2,
  Package,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import { useState } from "react";

// Define predefined categories
const ITEM_CATEGORIES = ["Figuras", "Remeras", "Tazas", "Items", "TCG"];

const CAFE_CATEGORIES = [
  "Café de Especialidad",
  "Café Frio",
  "Bebidas Especiales",
  "Panaderia Dulce",
  "Panaderia Salado",
];

type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  stock: number;
  model_3d?: string;
  is_item?: boolean; // Add is_item field
};

const fetchProducts = async (): Promise<Product[]> => {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("category", { ascending: true });

  if (error) throw error;
  return data || [];
};

const AdminProducts = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: 0,
    category: "",
    image: "",
    stock: 0,
    model_3d: "",
    is_item: false, // Add is_item field with default value
  });
  const [modelFile, setModelFile] = useState<File | null>(null);

  // Fetch products from Supabase
  const {
    data: products = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
  });

  const createProductMutation = useMutation({
    mutationFn: async (newProduct: Omit<Product, "id">) => {
      const { data, error } = await supabase
        .from("products")
        .insert([newProduct])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Producto agregado correctamente");
      setIsDialogOpen(false);
    },
    onError: (error) => {
      console.error("Error creating product:", error);
      toast.error("Error al crear producto");
    },
  });

  const updateProductMutation = useMutation({
    mutationFn: async ({ id, ...updates }: Product) => {
      const { data, error } = await supabase
        .from("products")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Producto actualizado correctamente");
      setIsDialogOpen(false);
    },
    onError: (error) => {
      console.error("Error updating product:", error);
      toast.error("Error al actualizar producto");
    },
  });

  const deleteProductMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("products").delete().eq("id", id);

      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Producto eliminado correctamente");
    },
    onError: (error) => {
      console.error("Error deleting product:", error);
      toast.error("Error al eliminar producto");
    },
  });

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddEdit = (product: Product | null) => {
    if (product) {
      setFormData({
        name: product.name,
        description: product.description || "",
        price: product.price,
        category: product.category,
        image: product.image,
        stock: product.stock || 0,
        model_3d: product.model_3d || "",
        is_item: product.is_item || false, // Set is_item from product or default to false
      });
      setCurrentProduct(product);
    } else {
      setFormData({
        name: "",
        description: "",
        price: 0,
        category: "",
        image: "",
        stock: 0,
        model_3d: "",
        is_item: false, // Default to false for new products
      });
      setCurrentProduct(null);
    }
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("¿Estás seguro de que deseas eliminar este producto?")) {
      deleteProductMutation.mutate(id);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "price" || name === "stock" ? Number(value) : value,
    });
  };

  const handleCategoryChange = (value: string) => {
    setFormData({
      ...formData,
      category: value,
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setModelFile(e.target.files[0]);
    }
  };

  const handleIsItemChange = (checked: boolean) => {
    // Reset category when changing is_item to avoid invalid category selections
    setFormData({
      ...formData,
      is_item: checked,
      category: "",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let modelUrl = formData.model_3d;

    // Si hay un archivo seleccionado, súbelo a Supabase Storage
    if (modelFile) {
      try {
        const filename = `${Date.now()}-${modelFile.name}`;
        const { data, error } = await supabase.storage
          .from("models")
          .upload(filename, modelFile);

        if (error) throw error;

        // Obtén la URL pública del archivo
        const { data: urlData } = supabase.storage
          .from("models")
          .getPublicUrl(filename);

        modelUrl = urlData.publicUrl;
      } catch (error) {
        console.error("Error uploading file:", error);
        toast.error("Error al subir el archivo 3D");
        return;
      }
    }

    // Continúa con la lógica existente pero usa modelUrl
    const productData = {
      ...formData,
      model_3d: modelUrl,
    };

    if (!formData.name || !formData.category || !formData.image) {
      toast.error("Por favor completa todos los campos requeridos");
      return;
    }

    if (currentProduct) {
      // Update existing product
      updateProductMutation.mutate({
        id: currentProduct.id,
        ...productData,
      });
    } else {
      // Create new product
      createProductMutation.mutate(productData);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 text-[#2851a3] animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10 bg-white rounded-lg shadow">
        <p className="text-red-500 font-playfair">
          Error al cargar productos. Por favor intenta de nuevo.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 font-playfair">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="relative w-full md:w-1/3">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Buscar productos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 font-playfair"
          />
        </div>
        <Button
          onClick={() => handleAddEdit(null)}
          className="bg-[#2851a3] hover:bg-[#1a3e7e] text-white rounded-lg shadow-sm transition-colors duration-200 font-playfair"
        >
          <Plus className="h-4 w-4 mr-2" /> Nuevo Producto
        </Button>
      </div>

      {filteredProducts.length === 0 ? (
        <div className="text-center py-10 bg-white rounded-lg shadow">
          <p className="text-gray-500 font-playfair">
            No hay productos que coincidan con tu búsqueda
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">Imagen</TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead>Categoría</TableHead>
                <TableHead>Precio</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <div className="h-12 w-12 rounded overflow-hidden">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell>${product.price}</TableCell>
                  <TableCell>
                    <span
                      className={`${
                        product.stock <= 5 ? "text-red-600 font-medium" : ""
                      }`}
                    >
                      {product.stock}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleAddEdit(product)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(product.id)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md font-playfair">
          <DialogHeader>
            <DialogTitle className="font-playfair">
              {currentProduct ? "Editar Producto" : "Agregar Producto"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Nombre
                </Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="col-span-3"
                  required
                />
              </div>

              {/* Add is_item toggle */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="is_item" className="text-right">
                  ¿Es Item?
                </Label>
                <div className="flex items-center space-x-2 col-span-3">
                  <Switch
                    id="is_item"
                    checked={formData.is_item}
                    onCheckedChange={handleIsItemChange}
                  />
                  <Label htmlFor="is_item" className="text-sm text-gray-500">
                    {formData.is_item ? "Si" : "No"}
                  </Label>
                </div>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">
                  Descripción
                </Label>
                <Input
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="price" className="text-right">
                  Precio
                </Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  value={formData.price}
                  onChange={handleInputChange}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="stock" className="text-right">
                  Stock
                </Label>
                <div className="col-span-3 flex items-center">
                  <Input
                    id="stock"
                    name="stock"
                    type="number"
                    value={formData.stock}
                    onChange={handleInputChange}
                    className="flex-1"
                    min="0"
                    required
                  />
                  <Package className="ml-2 h-5 w-5 text-gray-400" />
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="category" className="text-right">
                  Categoría
                </Label>
                <div className="col-span-3">
                  <Select
                    value={formData.category}
                    onValueChange={handleCategoryChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar categoría" />
                    </SelectTrigger>
                    <SelectContent>
                      {/* Show categories based on is_item toggle */}
                      {(formData.is_item
                        ? ITEM_CATEGORIES
                        : CAFE_CATEGORIES
                      ).map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="image" className="text-right">
                  URL Imagen
                </Label>
                <div className="col-span-3 relative">
                  <Input
                    id="image"
                    name="image"
                    value={formData.image}
                    onChange={handleInputChange}
                    className="pr-10"
                    required
                  />
                  <Image className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                </div>
              </div>

              {/* Add 3D model field - only show if it's an item */}
              {formData.is_item && (
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="model_3d" className="text-right">
                    Modelo 3D (GLB)
                  </Label>
                  <div className="col-span-3">
                    <div className="flex gap-2">
                      <Input
                        type="file"
                        id="model_3d_file"
                        accept=".glb"
                        onChange={handleFileChange}
                        className="flex-1"
                      />
                      {formData.model_3d && (
                        <div className="text-xs text-muted-foreground mt-1">
                          Archivo actual: {formData.model_3d.split("/").pop()}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
                className="font-playfair"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={
                  createProductMutation.isPending ||
                  updateProductMutation.isPending
                }
                className="font-playfair"
              >
                {createProductMutation.isPending ||
                updateProductMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Guardando...
                  </>
                ) : (
                  "Guardar"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminProducts;
