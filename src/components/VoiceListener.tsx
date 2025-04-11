import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { products } from "@/data/products";
import { prompts } from "@/lib/prompts";
import { useFilters, FilterState } from "@/context/FilterContext";
import { filterOptions } from "@/data/products";
import { useProduct } from "@/context/ProductContext";
import { useUserInfo } from "@/hooks/useUserInfo";

// Initialize Gemini with Vite environment variable
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || "");

// Add this to the availableFunctions object
interface UserInfo {
  name: string;
  email: string;
  address: string;
  phone: string;
}

const availableFunctions = {
  showGymClothes: {
    name: "showGymClothes",
    description:
      "Execute this function if the user is interested in gym clothes or any related activities or equipment associated with the gym only.",
    parameters: {},
  },
  showYogaEquipment: {
    name: "showYogaEquipment",
    description:
      "Execute this function if the user is interested in any yoga activities or asks about yoga in general.",
    parameters: {},
  },
  navigateToCategory: {
    name: "navigateToCategory",
    description:
      "Navigate to a specific product category (gym, yoga, or running/jogging)",
    parameters: {
      category: {
        type: "string",
        enum: ["gym", "yoga", "running"],
        description: "The category to navigate to",
      },
    },
  },
  goToCart: {
    name: "goToCart",
    description: "Navigate to shopping cart",
    parameters: {},
  },
  checkout: {
    name: "checkout",
    description: "Start checkout process",
    parameters: {},
  },
  showRunningGear: {
    name: "showRunningGear",
    description:
      "Execute this function if the user is interested in running, jogging, or any running-related activities or equipment",
    parameters: {},
  },
  applyFilters: {
    name: "applyFilters",
    description:
      "Apply filters to the product listing page, such as colors, sizes, price ranges, brands, etc.",
    parameters: {},
  },
  clearFilters: {
    name: "clearFilters",
    description: "Clear all applied filters on the product listing page",
    parameters: {},
  },
};

export const VoiceListener = () => {
  const { updateUserInfo } = useUserInfo();
  const { updateFilters, clearFilters } = useFilters();
  const { setSelectedSize, setQuantity } = useProduct();

  const [transcript, setTranscript] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [lastAction, setLastAction] = useState<string>("");
  const navigate = useNavigate();
  const recognitionRef = useRef<any>(null);

  const startListening = () => {
    if ("webkitSpeechRecognition" in window && !isListening) {
      recognitionRef.current = new (window as any).webkitSpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = false;

      recognitionRef.current.onstart = () => {
        setIsListening(true);
        console.log("Voice recognition activated");
      };

      recognitionRef.current.onresult = async (event: any) => {
        // Temporarily stop listening while processing
        recognitionRef.current.stop();

        const results = Array.from(event.results);
        for (let result of results) {
          const transcript = result[0].transcript.toLowerCase();
          setTranscript(transcript);
          console.log("Processing command:", transcript);

          // Handle voice commands
          await handleVoiceCommand(transcript);
        }

        // Resume listening after processing
        startListening();
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error("Error occurred in recognition:", event.error);

        if (event.error !== "aborted") {
          setIsListening(false);
          recognitionRef.current = null;
          // Restart listening after error
          setTimeout(startListening, 1000);
        }
      };

      recognitionRef.current.onend = () => {
        // Only restart if we're not actively processing a command
        if (isListening) {
          try {
            recognitionRef.current.start();
          } catch (error) {
            console.error("Restart failed:", error);
            setIsListening(false);
            recognitionRef.current = null;
            setTimeout(startListening, 300);
          }
        }
      };

      try {
        recognitionRef.current.start();
      } catch (error) {
        console.error("Failed to start recognition:", error);
        setIsListening(false);
        recognitionRef.current = null;
      }
    }
  };

  // Update the interpretCommand function to better detect clearFilters intent
  const interpretCommand = async (transcript: string) => {
    try {
      // First, directly check for clear filter phrases
      const clearFilterPhrases = [
        "clear filter",
        "reset filter",
        "remove filter",
        "clear all filter",
        "reset all filter",
        "remove all filter",
        "clear the filter",
        "start over",
      ];

      // Check if the transcript contains any clear filter phrases
      for (const phrase of clearFilterPhrases) {
        if (transcript.includes(phrase)) {
          console.log("Direct match for clear filters detected");
          return "clearFilters";
        }
      }

      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const prompt = `
        You are a shopping assistant that helps users navigate an e-commerce website.
        Analyze the following voice command and determine which function to call.
        
        User command: "${transcript}"
  
        Available functions:
        ${Object.values(availableFunctions)
          .map((fn) => `- ${fn.name}: ${fn.description}`)
          .join("\n")}
  
        Return ONLY the function name that best matches the user's intent, or "unknown" if no function matches.
        IMPORTANT: If the user is asking to clear, reset, or remove filters in ANY way, you MUST return "clearFilters".
        Do not include any other text in your response.
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response.text().trim();
      return response;
    } catch (error) {
      console.error("Gemini API error:", error);
      return "unknown";
    }
  };

  // Create a dedicated function for clearing filters
  const handleClearFilters = async (transcript: string) => {
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const prompt = prompts.clearFilters.replace("{transcript}", transcript);
      const result = await model.generateContent(prompt);
      const response = await result.response.text().trim().toLowerCase();

      if (response === "yes") {
        clearFilters();
        console.log("All filters cleared via dedicated function");
        return true;
      }

      return false;
    } catch (error) {
      console.error("Clear filters detection error:", error);
      return false;
    }
  };

  // Add a new function to handle product detail navigation
  const handleProductDetailNavigation = async (transcript: string) => {
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      // Create a list of product names and IDs for reference
      const productList = products.map((p) => ({
        id: p.id,
        name: p.name.toLowerCase(),
        keywords: p.name.toLowerCase().split(" "),
      }));

      const prompt = `
        You are a shopping assistant for a sports apparel website.
        Analyze this voice command and determine if the user is asking to view details about a specific product.
        
        User command: "${transcript}"
        
        Available products:
        ${products
          .map((p) => `- ${p.name}: ${p.description.substring(0, 50)}...`)
          .join("\n")}
        
        INSTRUCTIONS:
        1. If the user is asking to see details, view, or get more information about a specific product, identify which product they're referring to.
        2. Return ONLY the exact product name as listed above if you can identify it.
        3. If the user is not asking about a specific product or you cannot determine which product, return "none".
        
        Return ONLY the product name or "none". Do not include any other text in your response.
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response.text().trim();

      if (response.toLowerCase() !== "none") {
        // Try to find the product by name (case insensitive)
        const productName = response.toLowerCase();

        // First try exact match
        let matchedProduct = products.find(
          (p) => p.name.toLowerCase() === productName
        );

        // If no exact match, try partial match
        if (!matchedProduct) {
          matchedProduct = products.find(
            (p) =>
              p.name.toLowerCase().includes(productName) ||
              productName.includes(p.name.toLowerCase())
          );
        }

        // If still no match, try keyword matching
        if (!matchedProduct) {
          const words = productName.split(" ").filter((w) => w.length > 3);
          for (const word of words) {
            matchedProduct = products.find((p) =>
              p.name.toLowerCase().includes(word)
            );
            if (matchedProduct) break;
          }
        }

        if (matchedProduct) {
          console.log(`Navigating to product: ${matchedProduct.name}`);
          await navigate(`/product/${matchedProduct.id}`);
          return true;
        }
      }

      return false;
    } catch (error) {
      console.error("Product detail navigation error:", error);
      return false;
    }
  };

  // Update the handleVoiceCommand function to check for product detail navigation
  const handleVoiceCommand = async (command: string) => {
    console.log("Processing command:", command);

    // Set the last action to show feedback to the user
    setLastAction(`Processing: "${command}"`);

    // Add this near the start of handleVoiceCommand
    const isUserInfoUpdate = await handleUserInfoUpdate(command);
    if (isUserInfoUpdate) {
      return;
    }

    const isCartNavigation = await handleCartNavigation(command);
    if (isCartNavigation) {
      setLastAction(`Navigating to cart: "${command}"`);
      return;
    }

    const isProductAction = await handleProductActions(command);
    if (isProductAction) {
      setLastAction(`Product action completed: "${command}"`);
      return;
    }

    // First check if this is a product detail navigation command
    const isProductDetailNavigation = await handleProductDetailNavigation(
      command
    );
    if (isProductDetailNavigation) {
      setLastAction(`Navigating to product: "${command}"`);
      return;
    }

    // Then check if this is a category navigation command
    const isCategoryNavigation = await handleCategoryNavigation(command);
    if (isCategoryNavigation) {
      setLastAction(`Navigating to category: "${command}"`);
      return;
    }

    // Then check if this is a clear filters command
    const isFilterCleared = await handleClearFilters(command);
    if (isFilterCleared) {
      setLastAction(`Filters cleared: "${command}"`);
      return;
    }

    // Then check for filter updates
    const filterResult = await interpretFilterCommand(command);
    if (filterResult === "filters_updated") {
      setLastAction(`Filters updated: "${command}"`);
      console.log("Filters updated via voice");
      return;
    }

    // Finally, handle other commands
    const action = await interpretCommand(command);
    console.log("Interpreted action:", action);

    switch (action) {
      case "showGymClothes":
        setLastAction("Navigating to gym products");
        await navigate("/products/gym");
        break;
      case "showYogaEquipment":
        setLastAction("Navigating to yoga products");
        await navigate("/products/yoga");
        break;
      case "goToCart":
        setLastAction("Navigating to cart");
        await navigate("/cart");
        break;
      case "checkout":
        setLastAction("Navigating to checkout");
        await navigate("/payment");
        break;
      case "showRunningGear":
        setLastAction("Navigating to running products");
        await navigate("/products/jogging");
        break;
      case "applyFilters":
        // Already handled by interpretFilterCommand
        break;
      case "clearFilters":
        // Call the clearFilters function from context
        clearFilters();
        setLastAction("All filters cleared");
        console.log("All filters cleared via action handler");
        break;
      default:
        setLastAction(`Command not recognized: "${command}"`);
        console.log("Unknown command:", command);
    }
  };

  // Improve the interpretFilterCommand function to ensure case matching
  const interpretFilterCommand = async (transcript: string) => {
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      // Create reference maps for exact casing
      const colorMap = Object.fromEntries(
        filterOptions.colors.map((c) => [c.toLowerCase(), c])
      );
      const sizeMap = Object.fromEntries(
        filterOptions.sizes.map((s) => [s.toLowerCase(), s])
      );
      const materialMap = Object.fromEntries(
        filterOptions.materials.map((m) => [m.toLowerCase(), m])
      );
      const genderMap = Object.fromEntries(
        filterOptions.genders.map((g) => [g.toLowerCase(), g])
      );
      const brandMap = Object.fromEntries(
        filterOptions.brands.map((b) => [b.toLowerCase(), b])
      );
      const categoryMap = Object.fromEntries(
        filterOptions.subCategories.map((c) => [c.toLowerCase(), c])
      );

      // Update the prompt to emphasize returning lowercase values
      const prompt = `
        You are a shopping assistant that helps users filter products.
        Analyze this voice command and determine the filters to apply.
        Command: "${transcript}"

        Available filters:
        - Colors: ${filterOptions.colors.join(", ")}
        - Sizes: ${filterOptions.sizes.join(", ")}
        - Materials: ${filterOptions.materials.join(", ")}
        - Genders: ${filterOptions.genders.join(", ")}
        - Brands: ${filterOptions.brands.join(", ")}
        - Categories: ${filterOptions.subCategories.join(", ")}
        - Price Range: Any range between 0-200 dollars

        Return a JSON object with ONLY the filters mentioned in the command.
        IMPORTANT: Use EXACTLY these keys in your response:
        {
          "colors": [],
          "sizes": [],
          "materials": [],
          "genders": [],
          "brands": [],
          "subCategories": [],
          "price": [min, max]
        }
        
        Only include filters that were explicitly mentioned. Use empty arrays for filter types not mentioned.
        For price, use the format [min, max] with values between 0-200.
        If no specific filters were detected, return an empty object {}.
        
        CRITICAL: Return all values in lowercase for consistency. For example, if the user mentions "PowerLift", return it as "powerlift".
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response.text();
      const cleanedResponse = response
        .replace("```json", "")
        .replace("```", "");
      console.log(cleanedResponse);

      try {
        const parsedFilters = JSON.parse(cleanedResponse.trim());
        console.log("Detected filters:", parsedFilters);

        // Normalize filter keys to ensure consistency and preserve original casing
        const normalizedFilters: Partial<FilterState> = {};

        // Process each filter type with proper key names and restore original casing
        if (parsedFilters.colors && parsedFilters.colors.length > 0) {
          normalizedFilters.colors = parsedFilters.colors.map(
            (c: string) => colorMap[c.toLowerCase()] || c
          );
          console.log("Normalized colors:", normalizedFilters.colors);
        }

        if (parsedFilters.sizes && parsedFilters.sizes.length > 0) {
          normalizedFilters.sizes = parsedFilters.sizes.map(
            (s: string) => sizeMap[s.toLowerCase()] || s
          );
          console.log("Normalized sizes:", normalizedFilters.sizes);
        }

        if (parsedFilters.materials && parsedFilters.materials.length > 0) {
          normalizedFilters.materials = parsedFilters.materials.map(
            (m: string) => materialMap[m.toLowerCase()] || m
          );
          console.log("Normalized materials:", normalizedFilters.materials);
        }

        if (parsedFilters.genders && parsedFilters.genders.length > 0) {
          normalizedFilters.genders = parsedFilters.genders.map(
            (g: string) => genderMap[g.toLowerCase()] || g
          );
          console.log("Normalized genders:", normalizedFilters.genders);
        }

        if (parsedFilters.brands && parsedFilters.brands.length > 0) {
          normalizedFilters.brands = parsedFilters.brands.map(
            (b: string) => brandMap[b.toLowerCase()] || b
          );
          console.log("Normalized brands:", normalizedFilters.brands);
        }

        if (
          parsedFilters.subCategories &&
          parsedFilters.subCategories.length > 0
        ) {
          normalizedFilters.subCategories = parsedFilters.subCategories.map(
            (c: string) => categoryMap[c.toLowerCase()] || c
          );
          console.log(
            "Normalized categories:",
            normalizedFilters.subCategories
          );
        }

        if (parsedFilters.price) {
          normalizedFilters.price = parsedFilters.price;
          console.log("Normalized price:", normalizedFilters.price);
        }

        if (Object.keys(normalizedFilters).length > 0) {
          // This will add to existing filters rather than replace them
          updateFilters(normalizedFilters);
          return "filters_updated";
        }
      } catch (error) {
        console.error("Error parsing filter JSON:", error);
      }

      return "unknown";
    } catch (error) {
      console.error("Filter interpretation error:", error);
      return "unknown";
    }
  };

  // Move handleCategoryNavigation inside the component
  const handleCategoryNavigation = async (transcript: string) => {
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const prompt = prompts.categoryNavigation.replace(
        "{transcript}",
        transcript
      );
      const result = await model.generateContent(prompt);
      const response = await result.response.text().trim().toLowerCase();

      if (response === "gym") {
        console.log("Navigating to gym category");
        await navigate("/products/gym");
        return true;
      } else if (response === "yoga") {
        console.log("Navigating to yoga category");
        await navigate("/products/yoga");
        return true;
      } else if (response === "running") {
        console.log("Navigating to running category");
        await navigate("/products/jogging");
        return true;
      }

      return false;
    } catch (error) {
      console.error("Category navigation detection error:", error);
      return false;
    }
  };
  const handleProductActions = async (transcript: string) => {
    try {
      // Check if we're on a product page by looking at the URL
      const currentPath = window.location.pathname;
      if (!currentPath.startsWith("/product/")) {
        return false;
      }

      const productId = currentPath.split("/").pop();
      const product = products.find((p) => p.id === productId);

      if (!product) {
        console.error("Product not found:", productId);
        return false;
      }

      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const prompt = `
        You are a shopping assistant for a sports apparel website.
        The user is currently viewing this product: ${product.name}
        Available sizes: ${product.sizes.join(", ")}
        
        Analyze this voice command: "${transcript}"
        
        Determine if the user wants to:
        1. Select a specific size
        2. Change the quantity
        3. Add the product to cart
        
        Return a JSON object with the following structure:
        {
          "action": "size" | "quantity" | "addToCart" | "none",
          "size": "the size mentioned" | null,
          "quantity": number | null
        }
        
        INSTRUCTIONS:
        - For size, return the exact size as listed in available sizes, or null if no size mentioned
        - For quantity, return the number mentioned, or null if no quantity mentioned
        - If the user wants to add to cart, set action to "addToCart"
        - If no relevant action is detected, set action to "none"
        - Return ONLY the JSON object, no other text
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response.text();
      const cleanedResponse = response
        .replace("```json", "")
        .replace("```", "");

      try {
        const parsedAction = JSON.parse(cleanedResponse.trim());
        console.log("Detected product action:", parsedAction);

        if (parsedAction.action === "none") {
          return false;
        }

        // Handle size selection - update to use context
        if (parsedAction.action === "size" && parsedAction.size) {
          // Find the matching size (case-insensitive)
          const matchedSize = product.sizes.find(
            (size) => size.toLowerCase() === parsedAction.size.toLowerCase()
          );

          if (matchedSize) {
            // Update the context with the correct case
            setSelectedSize(matchedSize);
            console.log(`Selected size: ${matchedSize}`);
            return true;
          } else {
            console.log(`Size not found: ${parsedAction.size}`);
          }
        }

        // Handle quantity change - update to use context
        if (parsedAction.action === "quantity" && parsedAction.quantity) {
          const newQuantity = parseInt(parsedAction.quantity);
          if (!isNaN(newQuantity) && newQuantity > 0) {
            setQuantity(newQuantity);
            console.log(`Set quantity to: ${newQuantity}`);
            return true;
          }
        }

        // Handle add to cart - keep DOM manipulation for this action
        if (parsedAction.action === "addToCart") {
          const addToCartButton = document.querySelector(
            'button[data-action="add-to-cart"]'
          ) as HTMLElement;
          if (addToCartButton) {
            addToCartButton.click();
            console.log("Added product to cart");
          } else {
            // Try to find button by text content
            const buttons = document.querySelectorAll("button");
            for (const button of Array.from(buttons)) {
              if (button.textContent?.toLowerCase().includes("add to cart")) {
                (button as HTMLElement).click();
                console.log("Added product to cart");
                break;
              }
            }
          }
        }

        return true;
      } catch (error) {
        console.error("Error parsing product action JSON:", error);
        return false;
      }
    } catch (error) {
      console.error("Product action error:", error);
      return false;
    }
  };

  const handleCartNavigation = async (transcript: string) => {
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const prompt = `
        You are a shopping assistant for an e-commerce website.
        Analyze this voice command and determine if the user wants to view their shopping cart.
        
        User command: "${transcript}"
        
        Examples of cart viewing requests:
        - "Show me my cart"
        - "I want to see my cart"
        - "What's in my cart"
        - "View my shopping cart"
        - "Go to cart"
        - "Take me to my cart"
        - "Show me what I've added"
        - "View items in my cart"
        - "Check my cart"
        
        Return ONLY "yes" if the user wants to view their cart, or "no" if not.
        Do not include any other text in your response.
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response.text().trim().toLowerCase();

      if (response === "yes") {
        console.log("Navigating to cart page");
        await navigate("/cart");
        return true;
      }

      return false;
    } catch (error) {
      console.error("Cart navigation detection error:", error);
      return false;
    }
  };

  const handleUserInfoUpdate = async (transcript: string) => {
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const prompt = prompts.userInfo.replace("{transcript}", transcript);
      const result = await model.generateContent(prompt);
      const response = await result.response.text();
      const updatedResponse = response
        .replace("```json", "")
        .replace("```", "");
      try {
        const parsedInfo = JSON.parse(updatedResponse.trim());
        console.log("Parsed user info:", parsedInfo);

        // Only update if we actually got some information
        if (Object.keys(parsedInfo).length > 0) {
          // Clean up the data before storing
          const cleanedInfo: Partial<UserInfo> = {};

          if (parsedInfo.name) cleanedInfo.name = parsedInfo.name.trim();
          if (parsedInfo.email)
            cleanedInfo.email = parsedInfo.email.trim().toLowerCase();
          if (parsedInfo.address)
            cleanedInfo.address = parsedInfo.address.trim();
          if (parsedInfo.phone) cleanedInfo.phone = parsedInfo.phone.trim();

          // Update the local storage
          updateUserInfo(cleanedInfo);

          // Set feedback message
          const updatedFields = Object.keys(cleanedInfo).join(", ");
          setLastAction(`Updated user information: ${updatedFields}`);
          console.log("Updated user info:", cleanedInfo);
          return true;
        }
      } catch (error) {
        console.error("Error parsing user info:", error);
      }
      return false;
    } catch (error) {
      console.error("User info update error:", error);
      return false;
    }
  };

  useEffect(() => {
    startListening();

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
        recognitionRef.current = null;
      }
    };
  }, []);

  return null;
};
