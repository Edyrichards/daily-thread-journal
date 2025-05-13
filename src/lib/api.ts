
/**
 * Functions for interacting with external APIs
 */

// Fetch a random Bible verse from the Bible API
export async function getRandomVerse(): Promise<{ text: string; reference: string }> {
  const books = [
    "john", "psalms", "proverbs", "romans", "ephesians", 
    "philippians", "isaiah", "matthew", "james", "1corinthians"
  ];
  
  // Select a random book
  const randomBook = books[Math.floor(Math.random() * books.length)];
  
  // For simplicity, we'll use a specific chapter and verse per book
  // In a production app, you might want to have a more sophisticated selection
  const references: Record<string, string> = {
    "john": "3:16",
    "psalms": "23:1",
    "proverbs": "3:5-6",
    "romans": "8:28",
    "ephesians": "2:8-9",
    "philippians": "4:6-7",
    "isaiah": "40:31",
    "matthew": "6:33",
    "james": "1:5",
    "1corinthians": "13:4-7"
  };
  
  try {
    const response = await fetch(`https://bible-api.com/${randomBook}+${references[randomBook]}`);
    
    if (!response.ok) {
      throw new Error("Failed to fetch verse");
    }
    
    const data = await response.json();
    
    return {
      text: data.text,
      reference: `${data.book_name} ${data.chapter}:${data.verse || data.verses}`
    };
  } catch (error) {
    console.error("Error fetching Bible verse:", error);
    
    // Return a fallback verse if API call fails
    return {
      text: "For God so loved the world, that he gave his only Son, that whoever believes in him should not perish but have eternal life.",
      reference: "John 3:16"
    };
  }
}
