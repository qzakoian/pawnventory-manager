
export const mapToAvailableCategory = (detectedCategory: string, availableCategories: string[]): string => {
  // First, try to match directly
  const directMatch = availableCategories.find(
    c => c.toLowerCase() === detectedCategory.toLowerCase()
  );
  
  if (directMatch) return directMatch;
  
  // If no direct match, try to find partial matches
  const lowerDetected = detectedCategory.toLowerCase();
  
  // Define some common mappings for detected categories
  const categoryMappings: Record<string, string[]> = {
    'smartphone': ['phone', 'mobile', 'cell'],
    'tablet': ['ipad', 'tab'],
    'laptop': ['notebook', 'computer', 'pc'],
    'watch': ['smartwatch', 'wearable'],
  };
  
  // Check if any of our available categories contains the detected term
  for (const category of availableCategories) {
    const lowerCategory = category.toLowerCase();
    
    // Direct partial match
    if (lowerCategory.includes(lowerDetected) || lowerDetected.includes(lowerCategory)) {
      return category;
    }
    
    // Check against mappings
    for (const [key, synonyms] of Object.entries(categoryMappings)) {
      if (synonyms.some(s => lowerDetected.includes(s)) && lowerCategory.includes(key)) {
        return category;
      }
    }
  }
  
  // If all else fails, return the first category if available
  return availableCategories.length > 0 ? availableCategories[0] : "";
};
