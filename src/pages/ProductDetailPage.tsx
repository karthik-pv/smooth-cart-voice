import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { products } from "@/data/products";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Heart,
  Star,
  ShoppingCart,
  ChevronDown,
  ChevronUp,
  Check,
  AlertCircle,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { useCart } from "@/context/CartContext";
import { useProduct } from "@/context/ProductContext"; // Add this import
import { motion } from "framer-motion";

const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { addItem } = useCart();

  // Use the product context
  const {
    selectedSize,
    quantity,
    setSelectedSize,
    setQuantity,
    resetProductState,
  } = useProduct();

  const product = products.find((p) => p.id === id);

  // Keep showError as local state
  const [showError, setShowError] = useState(false);

  // Reset product state when product changes
  useEffect(() => {
    if (product) {
      resetProductState();
      setShowError(false);
    }
  }, [product, resetProductState]);

  const handleAddToCart = () => {
    if (!selectedSize) {
      setShowError(true);
      toast({
        title: "Please select a size",
        description: "You need to select a size before adding to cart",
        variant: "destructive",
      });
      return;
    }

    if (product) {
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        size: selectedSize,
        quantity: quantity,
      });

      toast({
        title: "Added to cart",
        description: `${product.name} (${selectedSize}) x ${quantity} added to your cart`,
        action: (
          <Button variant="outline" onClick={() => navigate("/cart")}>
            View Cart
          </Button>
        ),
      });
    }
  };

  // Make sure we're rendering the UI with the context values
  return (
    <Layout>
      {product ? (
        <div className="container mx-auto px-4 py-8">
          {/* Product details layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Product image */}
            <div className="rounded-lg overflow-hidden">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-auto object-cover"
              />
            </div>

            {/* Product info */}
            <div>
              <h1 className="text-3xl font-bold">{product.name}</h1>
              <div className="flex items-center mt-2">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className="h-5 w-5 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
                <span className="ml-2 text-sm text-gray-500">(42 reviews)</span>
              </div>

              <div className="mt-4">
                <span className="text-2xl font-bold">
                  ${product.price.toFixed(2)}
                </span>
              </div>

              <div className="mt-6">
                <h3 className="text-sm font-medium">Description</h3>
                <p className="mt-2 text-gray-600">{product.description}</p>
              </div>

              {/* Size selection */}
              <div className="mt-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium">Size</h3>
                  {showError && (
                    <span className="text-red-500 text-xs flex items-center">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      Please select a size
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-4 gap-2 mt-2">
                  {product.sizes.map((size) => (
                    <Button
                      key={size}
                      type="button"
                      data-size={size}
                      variant={selectedSize === size ? "default" : "outline"}
                      className={`relative ${
                        selectedSize === size
                          ? "ring-2 ring-offset-2 ring-blue-500"
                          : ""
                      }`}
                      onClick={() => {
                        setSelectedSize(size);
                        setShowError(false);
                      }}
                    >
                      {size}
                      {selectedSize === size && (
                        <Check className="h-3 w-3 absolute top-1 right-1" />
                      )}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Quantity selector */}
              <div className="mt-6">
                <h3 className="text-sm font-medium">Quantity</h3>
                <div className="flex items-center mt-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                  >
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                  <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                    className="w-12 mx-2 text-center border rounded-md"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    <ChevronUp className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Add to cart button */}
              <div className="mt-8 flex space-x-4">
                <Button
                  className="flex-1"
                  data-action="add-to-cart"
                  onClick={handleAddToCart}
                >
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Add to Cart
                </Button>
                <Button variant="outline">
                  <Heart className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="container mx-auto px-4 py-8 text-center">
          <h2 className="text-2xl font-bold">Product not found</h2>
          <Button className="mt-4" onClick={() => navigate("/products")}>
            Back to Products
          </Button>
        </div>
      )}
    </Layout>
  );
};

export default ProductDetailPage;
