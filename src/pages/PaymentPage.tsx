
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { CreditCard, PaypalIcon, AppleIcon, GooglePayIcon } from '@/components/PaymentIcons';
import { ShoppingBag, ArrowRight, Lock } from 'lucide-react';
import { motion } from 'framer-motion';

const PaymentPage = () => {
  const { items, subtotal, clearCart } = useCart();
  const navigate = useNavigate();
  
  const [paymentMethod, setPaymentMethod] = useState('credit-card');
  const [isProcessing, setIsProcessing] = useState(false);
  
  const shippingCost = subtotal > 50 ? 0 : 5.99;
  const tax = subtotal * 0.07; // 7% tax
  const total = subtotal + shippingCost + tax;
  
  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      clearCart();
      navigate('/confirmation');
    }, 2000);
  };
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Checkout</h1>
          <p className="text-gray-600">Complete your purchase</p>
        </div>
        
        <div className="lg:grid lg:grid-cols-3 lg:gap-12">
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-8"
            >
              <h2 className="text-xl font-bold mb-4">Shipping Information</h2>
              
              <form className="space-y-4 mb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" placeholder="John" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" placeholder="Doe" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" placeholder="john.doe@example.com" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="address">Street Address</Label>
                  <Input id="address" placeholder="123 Main St" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="apartment">Apartment, suite, etc. (optional)</Label>
                  <Input id="apartment" placeholder="Apt 4B" />
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="space-y-2 col-span-2 md:col-span-1">
                    <Label htmlFor="city">City</Label>
                    <Input id="city" placeholder="San Francisco" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="state">State/Province</Label>
                    <Select defaultValue="ca">
                      <SelectTrigger id="state">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ca">California</SelectItem>
                        <SelectItem value="ny">New York</SelectItem>
                        <SelectItem value="tx">Texas</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="zipCode">ZIP / Postal Code</Label>
                    <Input id="zipCode" placeholder="94103" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" placeholder="(123) 456-7890" />
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox id="save-info" />
                  <label
                    htmlFor="save-info"
                    className="text-sm font-medium leading-none cursor-pointer"
                  >
                    Save this information for next time
                  </label>
                </div>
              </form>
              
              <Separator className="my-8" />
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <h2 className="text-xl font-bold mb-4">Payment Method</h2>
                
                <Tabs 
                  value={paymentMethod} 
                  onValueChange={setPaymentMethod}
                  className="mb-8"
                >
                  <TabsList className="grid grid-cols-4 mb-4">
                    <TabsTrigger value="credit-card" className="flex flex-col items-center py-3">
                      <CreditCard className="h-6 w-6 mb-1" />
                      <span className="text-xs">Card</span>
                    </TabsTrigger>
                    <TabsTrigger value="paypal" className="flex flex-col items-center py-3">
                      <PaypalIcon className="h-6 w-6 mb-1" />
                      <span className="text-xs">PayPal</span>
                    </TabsTrigger>
                    <TabsTrigger value="apple-pay" className="flex flex-col items-center py-3">
                      <AppleIcon className="h-6 w-6 mb-1" />
                      <span className="text-xs">Apple Pay</span>
                    </TabsTrigger>
                    <TabsTrigger value="google-pay" className="flex flex-col items-center py-3">
                      <GooglePayIcon className="h-6 w-6 mb-1" />
                      <span className="text-xs">Google Pay</span>
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="credit-card">
                    <form className="space-y-4" onSubmit={handlePayment}>
                      <div className="space-y-2">
                        <Label htmlFor="cardName">Name on Card</Label>
                        <Input id="cardName" placeholder="John Doe" />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="cardNumber">Card Number</Label>
                        <Input id="cardNumber" placeholder="1234 5678 9012 3456" />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="expiryDate">Expiry Date</Label>
                          <Input id="expiryDate" placeholder="MM/YY" />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="cvv">CVV</Label>
                          <Input id="cvv" placeholder="123" />
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Checkbox id="save-card" />
                        <label
                          htmlFor="save-card"
                          className="text-sm font-medium leading-none cursor-pointer"
                        >
                          Save this card for future purchases
                        </label>
                      </div>
                      
                      <div className="pt-4">
                        <Button 
                          type="submit"
                          className="w-full"
                          disabled={isProcessing}
                        >
                          {isProcessing ? (
                            <>Processing...</>
                          ) : (
                            <>
                              Complete Purchase <ArrowRight className="ml-2 h-4 w-4" />
                            </>
                          )}
                        </Button>
                      </div>
                      
                      <div className="text-center text-xs text-gray-500 flex items-center justify-center mt-2">
                        <Lock className="h-3 w-3 mr-1" />
                        Secure payment processing
                      </div>
                    </form>
                  </TabsContent>
                  
                  <TabsContent value="paypal">
                    <div className="text-center p-8 space-y-4">
                      <PaypalIcon className="h-16 w-16 mx-auto text-[#003087]" />
                      <p className="text-gray-600">
                        Click the button below to complete your purchase with PayPal.
                      </p>
                      <Button 
                        className="bg-[#0070ba] hover:bg-[#003087]"
                        onClick={handlePayment}
                        disabled={isProcessing}
                      >
                        {isProcessing ? 'Processing...' : 'Pay with PayPal'}
                      </Button>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="apple-pay">
                    <div className="text-center p-8 space-y-4">
                      <AppleIcon className="h-16 w-16 mx-auto" />
                      <p className="text-gray-600">
                        Click the button below to complete your purchase with Apple Pay.
                      </p>
                      <Button 
                        className="bg-black hover:bg-gray-800"
                        onClick={handlePayment}
                        disabled={isProcessing}
                      >
                        {isProcessing ? 'Processing...' : 'Pay with Apple Pay'}
                      </Button>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="google-pay">
                    <div className="text-center p-8 space-y-4">
                      <GooglePayIcon className="h-16 w-16 mx-auto" />
                      <p className="text-gray-600">
                        Click the button below to complete your purchase with Google Pay.
                      </p>
                      <Button 
                        className="bg-white text-black hover:bg-gray-100 border border-gray-300"
                        onClick={handlePayment}
                        disabled={isProcessing}
                      >
                        {isProcessing ? 'Processing...' : 'Pay with Google Pay'}
                      </Button>
                    </div>
                  </TabsContent>
                </Tabs>
              </motion.div>
            </motion.div>
          </div>
          
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="sticky top-24 rounded-lg border p-6 bg-background"
            >
              <h2 className="text-lg font-bold mb-4 flex items-center">
                <ShoppingBag className="h-5 w-5 mr-2" />
                Order Summary
              </h2>
              
              <div className="mb-4 max-h-48 overflow-auto">
                {items.map((item) => (
                  <div key={`${item.id}-${item.size}`} className="flex py-2">
                    <div className="w-12 h-12 flex-shrink-0 rounded overflow-hidden bg-gray-100 mr-3">
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{item.name}</p>
                      {item.size && (
                        <p className="text-xs text-gray-500">Size: {item.size}</p>
                      )}
                      <div className="flex justify-between mt-1">
                        <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                        <p className="text-sm">${(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <Separator className="mb-4" />
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span>
                    {shippingCost === 0 
                      ? "Free" 
                      : `$${shippingCost.toFixed(2)}`
                    }
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Estimated Tax</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
              </div>
              
              <Separator className="my-4" />
              
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PaymentPage;
