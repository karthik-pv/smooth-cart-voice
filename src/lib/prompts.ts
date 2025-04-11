export const prompts = {
  clearFilters: `
    You are a shopping assistant that helps users filter products.
    Analyze this voice command and determine if the user wants to clear all filters.
    Command: "{transcript}"
    
    Return ONLY "yes" if the user wants to clear/reset/remove filters, or "no" if not.
    Do not include any other text in your response.
  `,

  categoryNavigation: `
    You are a shopping assistant that helps users navigate product categories.
    Analyze this voice command and determine if the user wants to view a specific category.
    Command: "{transcript}"
    
    Available categories:
    - gym
    - yoga
    - running
    
    Return ONLY the category name (gym, yoga, or running) if detected, or "none" if no category is mentioned.
    Do not include any other text in your response.
  `,

  interpretCommand: `
    You are a shopping assistant that helps users navigate an e-commerce website.
    Analyze the following voice command and determine which function to call.
    
    User command: "{transcript}"

    Available functions:
    {availableFunctions}

    Return ONLY the function name that best matches the user's intent, or "unknown" if no function matches.
    IMPORTANT: If the user is asking to clear, reset, or remove filters in ANY way, you MUST return "clearFilters".
    Do not include any other text in your response.
  `,

  productAction: `
    You are a shopping assistant for a sports apparel website.
    The user is currently viewing this product: {productName}
    Available sizes: {sizes}
    
    Analyze this voice command: "{transcript}"
    
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
  `,

  cartNavigation: `
    You are a shopping assistant for an e-commerce website.
    Analyze this voice command and determine if the user wants to view their shopping cart.
    
    User command: "{transcript}"
    
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
  `,

  filterCommand: `
    You are a shopping assistant that helps users filter products.
    Analyze this voice command and determine the filters to apply.
    Command: "{transcript}"

    Available filters:
    - Colors: {colors}
    - Sizes: {sizes}
    - Materials: {materials}
    - Genders: {genders}
    - Brands: {brands}
    - Categories: {categories}
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
  `,

  productDetailNavigation: `
    You are a shopping assistant for a sports apparel website.
    Analyze this voice command and determine if the user is asking to view details about a specific product.
    
    User command: "{transcript}"
    
    Available products:
    {productList}
    
    INSTRUCTIONS:
    1. If the user is asking to see details, view, or get more information about a specific product, identify which product they're referring to.
    2. Return ONLY the exact product name as listed above if you can identify it.
    3. If the user is not asking about a specific product or you cannot determine which product, return "none".
    
    Return ONLY the product name or "none". Do not include any other text in your response.
  `,
  
  // Added comma here ↓
  userInfo: `
    You are a shopping assistant that helps users provide their information.
    Analyze this voice command and determine if the user is providing their personal information.
    Command: "{transcript}"
    
    Extract any of the following information mentioned:
    - Name
    - Email address
    - Physical address
    - Phone number
    
    Return a JSON object with ONLY the fields that were mentioned:
    {
      "name": "string or null",
      "email": "string or null",
      "address": "string or null",
      "phone": "string or null"
    }
    
    Only include fields that were explicitly mentioned.
    If no relevant information was detected, return an empty object {}.
    Do not include any other text in your response.
  `
};
