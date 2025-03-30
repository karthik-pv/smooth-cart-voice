
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { products } from '@/data/products';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, Star, ShoppingCart, ChevronDown, ChevronUp, Check, AlertCircle } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { useCart } from '@/context/CartContext';
import { motion } from 'framer-motion';

const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { addItem } = useCart();
  
  const product = products.find(p => p.id === id);
  
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [showError, setShowError] = useState(false);
  
  useEffect(() => {
    if (product) {
      setSelectedSize('');
      setQuantity(1);
      setShowError(false);
    }
  }, [product]);
  
  if (!product) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <AlertCircle className="mx-auto h-16 w-16 text-gray-400 mb-4" />
          <h2 className="text-2xl font-bold mb-2">Product Not Found</h2>
          <p className="text-gray-600 mb-6">
            We couldn't find the product you're looking for.
          </p>
          <Button onClick={() => navigate('/products/all')}>
            Continue Shopping
          </Button>
        </div>
      </Layout>
    );
  }
  
  const increaseQuantity = () => {
    setQuantity(prev => prev + 1);
  };
  
  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };
  
  const handleAddToCart = () => {
    if (!selectedSize && product.category !== 'equipment') {
      setShowError(true);
      return;
    }
    
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      size: selectedSize,
      color: product.colors[0],
      quantity: quantity
    });
    
    toast({
      title: "Added to Cart",
      description: `${product.name} has been added to your cart.`,
    });
    
    navigate('/cart');
  };
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {/* Product Images */}
          <div>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="sticky top-24"
            >
              <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="mt-4 grid grid-cols-4 gap-2">
                <div className="aspect-square rounded bg-gray-100 overflow-hidden border-2 border-primary">
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                {/* Placeholder for additional images */}
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="aspect-square rounded bg-gray-100"></div>
                ))}
              </div>
            </motion.div>
          </div>
          
          {/* Product Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="flex flex-wrap gap-2 mb-2">
              <Badge variant="outline" className="text-xs font-normal">
                {product.brand}
              </Badge>
              <Badge variant="outline" className="text-xs font-normal capitalize">
                {product.category}
              </Badge>
              {product.isNew && (
                <Badge className="bg-primary text-xs font-normal">
                  New Arrival
                </Badge>
              )}
              {product.isBestSeller && (
                <Badge className="bg-amber-500 text-xs font-normal">
                  Best Seller
                </Badge>
              )}
            </div>
            
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            
            <div className="flex items-center gap-2 mb-4">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < Math.floor(product.rating)
                        ? 'text-amber-500 fill-amber-500'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm">{product.rating}</span>
              <span className="text-sm text-gray-500">({product.reviews} reviews)</span>
            </div>
            
            <p className="text-2xl font-bold mb-6">${product.price.toFixed(2)}</p>
            
            <p className="text-gray-700 mb-6">{product.description}</p>
            
            <Separator className="my-6" />
            
            {/* Size Selection */}
            {product.category !== 'equipment' && (
              <div className="mb-6">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-medium">
                    Size: <span className="font-normal">{selectedSize || 'Select Size'}</span>
                  </h3>
                  <Button variant="link" className="p-0 h-auto text-sm">
                    Size Guide
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map(size => (
                    <Button
                      key={size}
                      variant={selectedSize === size ? "default" : "outline"}
                      className={`w-12 h-12 rounded-md ${
                        selectedSize === size ? 'bg-primary text-white' : ''
                      }`}
                      onClick={() => {
                        setSelectedSize(size);
                        setShowError(false);
                      }}
                    >
                      {size}
                    </Button>
                  ))}
                </div>
                {showError && (
                  <p className="text-red-500 text-sm mt-2">
                    Please select a size
                  </p>
                )}
              </div>
            )}
            
            {/* Quantity Selector */}
            <div className="mb-6">
              <h3 className="font-medium mb-3">Quantity</h3>
              <div className="flex">
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-r-none"
                  onClick={decreaseQuantity}
                  disabled={quantity <= 1}
                >
                  <ChevronDown className="h-4 w-4" />
                </Button>
                <div className="w-16 flex items-center justify-center border-y">
                  {quantity}
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-l-none"
                  onClick={increaseQuantity}
                >
                  <ChevronUp className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex gap-4 mb-8">
              <Button
                className="flex-1 py-6"
                onClick={handleAddToCart}
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                Add to Cart
              </Button>
              <Button variant="outline" size="icon" className="w-14 h-14">
                <Heart className="h-5 w-5" />
              </Button>
            </div>
            
            <Separator className="my-6" />
            
            {/* Product Details Tabs */}
            <Tabs defaultValue="details">
              <TabsList className="w-full">
                <TabsTrigger value="details" className="flex-1">Details</TabsTrigger>
                <TabsTrigger value="shipping" className="flex-1">Shipping</TabsTrigger>
                <TabsTrigger value="returns" className="flex-1">Returns</TabsTrigger>
              </TabsList>
              <TabsContent value="details" className="pt-4">
                <div className="space-y-3">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-gray-600">Brand</div>
                    <div className="col-span-2">{product.brand}</div>
                  </div>
                  <Separator />
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-gray-600">Material</div>
                    <div className="col-span-2 capitalize">{product.materials.join(', ')}</div>
                  </div>
                  <Separator />
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-gray-600">Type</div>
                    <div className="col-span-2 capitalize">{product.subCategory}</div>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="shipping" className="pt-4">
                <div className="space-y-4">
                  <p className="text-gray-700">Free standard shipping on all orders over $50.</p>
                  <p className="text-gray-700">
                    Estimated delivery time: 3-5 business days.
                  </p>
                  <p className="text-gray-700">
                    Express shipping available at checkout for an additional fee.
                  </p>
                </div>
              </TabsContent>
              <TabsContent value="returns" className="pt-4">
                <div className="space-y-4">
                  <p className="text-gray-700">
                    We accept returns within 30 days of delivery.
                  </p>
                  <p className="text-gray-700">
                    Items must be unworn, unwashed, and with the original tags attached.
                  </p>
                  <p className="text-gray-700">
                    See our full return policy for more details.
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default ProductDetailPage;
