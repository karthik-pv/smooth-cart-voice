
export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  gender: "men" | "women" | "unisex";
  colors: string[];
  sizes: string[];
  materials: string[];
  rating: number;
  reviews: number;
  brand: string;
  subCategory: string;
  isNew?: boolean;
  isBestSeller?: boolean;
};

export const products: Product[] = [
  {
    id: "yoga-mat-premium",
    name: "Premium Yoga Mat",
    description: "High-density cushioning for joint protection and superior grip during practice.",
    price: 69.99,
    image: "https://images.unsplash.com/photo-1592432678016-e910b452f9a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
    category: "yoga",
    gender: "unisex",
    colors: ["purple", "blue", "black", "teal"],
    sizes: ["standard"],
    materials: ["TPE", "eco-friendly"],
    rating: 4.8,
    reviews: 342,
    brand: "ZenFlow",
    subCategory: "equipment",
    isBestSeller: true
  },
  {
    id: "yoga-leggings-flow",
    name: "Flow Yoga Leggings",
    description: "Four-way stretch fabric for maximum mobility during your yoga practice.",
    price: 54.99,
    image: "https://images.unsplash.com/photo-1506629082955-511b1aa562c8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
    category: "yoga",
    gender: "women",
    colors: ["black", "navy", "maroon", "olive"],
    sizes: ["XS", "S", "M", "L", "XL"],
    materials: ["nylon", "spandex"],
    rating: 4.7,
    reviews: 289,
    brand: "Luluma",
    subCategory: "bottoms",
    isNew: true
  },
  {
    id: "yoga-top-breeze",
    name: "Breeze Yoga Top",
    description: "Lightweight, breathable fabric with a relaxed fit for unrestricted movement.",
    price: 39.99,
    image: "https://images.unsplash.com/photo-1567581935884-3349723552ca?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
    category: "yoga",
    gender: "women",
    colors: ["white", "light blue", "blush", "sage"],
    sizes: ["XS", "S", "M", "L", "XL"],
    materials: ["modal", "cotton"],
    rating: 4.5,
    reviews: 210,
    brand: "Luluma",
    subCategory: "tops"
  },
  {
    id: "running-shoes-cloud",
    name: "Cloud Runner Shoes",
    description: "Responsive cushioning and support for long-distance running comfort.",
    price: 129.99,
    image: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
    category: "jogging",
    gender: "unisex",
    colors: ["black/white", "gray/blue", "all black", "navy/orange"],
    sizes: ["7", "8", "9", "10", "11", "12", "13"],
    materials: ["mesh", "rubber"],
    rating: 4.9,
    reviews: 520,
    brand: "SprintForce",
    subCategory: "footwear",
    isBestSeller: true
  },
  {
    id: "running-shorts-swift",
    name: "Swift Running Shorts",
    description: "Lightweight, quick-drying shorts with built-in liner for comfort during runs.",
    price: 44.99,
    image: "https://images.unsplash.com/photo-1510994882435-284bb7ae8cd8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
    category: "jogging",
    gender: "men",
    colors: ["black", "gray", "navy", "olive"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    materials: ["polyester", "spandex"],
    rating: 4.6,
    reviews: 190,
    brand: "SprintForce",
    subCategory: "bottoms"
  },
  {
    id: "running-jacket-breeze",
    name: "Breeze Running Jacket",
    description: "Lightweight, water-resistant jacket for protection during changing weather conditions.",
    price: 89.99,
    image: "https://images.unsplash.com/photo-1578345511858-6a6ad924a9f0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
    category: "jogging",
    gender: "women",
    colors: ["black", "teal", "pink", "silver"],
    sizes: ["XS", "S", "M", "L", "XL"],
    materials: ["nylon", "polyester"],
    rating: 4.7,
    reviews: 156,
    brand: "SprintForce",
    subCategory: "outerwear",
    isNew: true
  },
  {
    id: "running-tights-thermal",
    name: "Thermal Running Tights",
    description: "Warm, moisture-wicking tights for cold-weather running with reflective details.",
    price: 64.99,
    image: "https://images.unsplash.com/photo-1515214457861-3fd1aa3a6fd8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
    category: "jogging",
    gender: "men",
    colors: ["black", "navy", "olive"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    materials: ["polyester", "elastane"],
    rating: 4.8,
    reviews: 230,
    brand: "SprintForce",
    subCategory: "bottoms"
  },
  {
    id: "gym-tank-power",
    name: "Power Gym Tank",
    description: "Moisture-wicking tank with racerback design for maximum mobility during workouts.",
    price: 34.99,
    image: "https://images.unsplash.com/photo-1474367658825-a162eb644bf2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
    category: "gym",
    gender: "women",
    colors: ["black", "white", "red", "blue"],
    sizes: ["XS", "S", "M", "L", "XL"],
    materials: ["polyester", "spandex"],
    rating: 4.6,
    reviews: 178,
    brand: "PowerLift",
    subCategory: "tops"
  },
  {
    id: "gym-shorts-flex",
    name: "Flex Training Shorts",
    description: "Stretchy, durable shorts with moisture management for intense gym sessions.",
    price: 49.99,
    image: "https://images.unsplash.com/photo-1539094560463-1c8a66ffdb0c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
    category: "gym",
    gender: "men",
    colors: ["black", "gray", "navy", "red"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    materials: ["polyester", "elastane"],
    rating: 4.7,
    reviews: 245,
    brand: "PowerLift",
    subCategory: "bottoms",
    isBestSeller: true
  },
  {
    id: "gym-hoodie-element",
    name: "Element Gym Hoodie",
    description: "Soft, breathable hoodie with performance fabric for pre and post-workout comfort.",
    price: 69.99,
    image: "https://images.unsplash.com/photo-1647963945635-8919ff1e90d0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
    category: "gym",
    gender: "unisex",
    colors: ["black", "gray", "navy", "burgundy"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    materials: ["cotton", "polyester"],
    rating: 4.8,
    reviews: 310,
    brand: "PowerLift",
    subCategory: "outerwear"
  },
  {
    id: "gym-gloves-grip",
    name: "Grip Pro Gym Gloves",
    description: "Anti-slip palm grips with wrist support for weightlifting and training.",
    price: 29.99,
    image: "https://images.unsplash.com/photo-1622288432450-277d0fef8a5d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
    category: "gym",
    gender: "unisex",
    colors: ["black", "black/red", "black/blue"],
    sizes: ["S", "M", "L", "XL"],
    materials: ["leather", "neoprene"],
    rating: 4.5,
    reviews: 185,
    brand: "PowerLift",
    subCategory: "accessories",
    isNew: true
  },
  {
    id: "yoga-block-cork",
    name: "Cork Yoga Block",
    description: "Sustainable cork yoga block providing stable support for various yoga poses.",
    price: 19.99,
    image: "https://images.unsplash.com/photo-1603454504899-dfd951b17e5a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
    category: "yoga",
    gender: "unisex",
    colors: ["natural cork"],
    sizes: ["standard"],
    materials: ["cork"],
    rating: 4.9,
    reviews: 120,
    brand: "ZenFlow",
    subCategory: "equipment"
  }
];

export const filterOptions = {
  colors: ["black", "white", "gray", "blue", "red", "navy", "purple", "teal", "olive", "pink", "burgundy"],
  sizes: ["XS", "S", "M", "L", "XL", "XXL", "standard", "7", "8", "9", "10", "11", "12", "13"],
  materials: ["cotton", "polyester", "nylon", "spandex", "elastane", "TPE", "cork", "leather", "rubber", "mesh", "modal"],
  genders: ["men", "women", "unisex"],
  brands: ["ZenFlow", "Luluma", "SprintForce", "PowerLift"],
  categories: [
    { id: "yoga", name: "Yoga" },
    { id: "jogging", name: "Jogging/Running/Walking" },
    { id: "gym", name: "Gym" }
  ],
  subCategories: ["tops", "bottoms", "outerwear", "footwear", "equipment", "accessories"]
};
