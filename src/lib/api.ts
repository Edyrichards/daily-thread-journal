
/**
 * Functions for interacting with external APIs
 */

import { Mood } from "./storage";
import { logger } from "./utils"; // Import the logger

// Categorized verses by emotional needs
const versesByMood: Record<Mood, Array<{reference: string, apiReference: string}>> = {
  joyful: [
    { reference: "Philippians 4:4", apiReference: "philippians+4:4" },
    { reference: "Psalm 16:11", apiReference: "psalms+16:11" },
    { reference: "Romans 15:13", apiReference: "romans+15:13" }
  ],
  peaceful: [
    { reference: "John 14:27", apiReference: "john+14:27" },
    { reference: "Philippians 4:6-7", apiReference: "philippians+4:6-7" },
    { reference: "Isaiah 26:3", apiReference: "isaiah+26:3" }
  ],
  hopeful: [
    { reference: "Romans 15:13", apiReference: "romans+15:13" },
    { reference: "Jeremiah 29:11", apiReference: "jeremiah+29:11" },
    { reference: "Isaiah 40:31", apiReference: "isaiah+40:31" }
  ],
  content: [
    { reference: "Philippians 4:11-13", apiReference: "philippians+4:11-13" },
    { reference: "1 Timothy 6:6-8", apiReference: "1timothy+6:6-8" },
    { reference: "Hebrews 13:5", apiReference: "hebrews+13:5" }
  ],
  neutral: [
    { reference: "Psalm 46:10", apiReference: "psalms+46:10" },
    { reference: "Ecclesiastes 3:1-8", apiReference: "ecclesiastes+3:1-8" },
    { reference: "Psalm 119:105", apiReference: "psalms+119:105" }
  ],
  anxious: [
    { reference: "Philippians 4:6-7", apiReference: "philippians+4:6-7" },
    { reference: "1 Peter 5:7", apiReference: "1peter+5:7" },
    { reference: "Matthew 6:25-27", apiReference: "matthew+6:25-27" }
  ],
  sad: [
    { reference: "Psalm 34:18", apiReference: "psalms+34:18" },
    { reference: "Matthew 5:4", apiReference: "matthew+5:4" },
    { reference: "2 Corinthians 1:3-4", apiReference: "2corinthians+1:3-4" }
  ],
  stressed: [
    { reference: "Matthew 11:28-30", apiReference: "matthew+11:28-30" },
    { reference: "Psalm 55:22", apiReference: "psalms+55:22" },
    { reference: "Isaiah 41:10", apiReference: "isaiah+41:10" }
  ],
  angry: [
    { reference: "Ephesians 4:26-27", apiReference: "ephesians+4:26-27" },
    { reference: "James 1:19-20", apiReference: "james+1:19-20" },
    { reference: "Proverbs 15:1", apiReference: "proverbs+15:1" }
  ],
  overwhelmed: [
    { reference: "Isaiah 40:28-31", apiReference: "isaiah+40:28-31" },
    { reference: "Psalm 55:22", apiReference: "psalms+55:22" },
    { reference: "Matthew 11:28-30", apiReference: "matthew+11:28-30" }
  ]
};

// Fetch a random Bible verse from the Bible API
export async function getRandomVerse(): Promise<{ text: string | null; reference: string | null; error?: string }> {
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

    // Format the reference properly to avoid undefined
    const reference = data.reference || `${data.book_name} ${data.chapter}:${data.verse || data.verses}`;

    return {
      text: data.text || "For I know the plans I have for you, declares the LORD, plans to prosper you and not to harm you, plans to give you hope and a future.",
      reference: reference,
    };
  } catch (error) {
    logger.error("Error fetching random Bible verse", error);
    return {
      text: null,
      reference: null,
      error: "Failed to fetch random Bible verse. Please try again later.",
    };
  }
}

// Fetch a verse based on the user's mood
export async function getVerseByMood(mood: Mood): Promise<{ text: string | null; reference: string | null; error?: string }> {
  try {
    // Get verses for the specific mood
    const moodVerses = versesByMood[mood];
    
    // Pick a random verse from the mood's selection
    const randomVerse = moodVerses[Math.floor(Math.random() * moodVerses.length)];
    
    const response = await fetch(`https://bible-api.com/${randomVerse.apiReference}`);
    
    if (!response.ok) {
      throw new Error("Failed to fetch verse");
    }
    
    const data = await response.json();
    
    // Make sure we have a properly formatted reference
    return {
      text: data.text || "The LORD is my shepherd, I lack nothing.",
      reference: randomVerse.reference || `${data.book_name} ${data.chapter}:${data.verse || data.verses}`,
    };
  } catch (error) {
    logger.error("Error fetching mood-based verse", error, { mood });
    return {
      text: null,
      reference: null,
      error: "Failed to fetch verse for your mood. Please try again later.",
    };
  }
}

// Get devotional content based on verse
export function getDevotionalContent(reference: string): { 
  title: string; 
  content: string; 
  prayerPoints: string[];
} {
  // This would ideally come from a database or API
  // For now, we'll generate it based on the reference patterns
  
  const devotionals: Record<string, { 
    title: string; 
    content: string; 
    prayerPoints: string[];
  }> = {
    "John 3:16": {
      title: "God's Ultimate Love",
      content: "Perhaps the most famous verse in the Bible, John 3:16 captures the essence of the Gospel in a single sentence. God's love for humanity was so immense that He gave His only Son as a sacrifice. This act of love offers us the gift of eternal life through faith. When we feel unworthy or unloved, this verse reminds us of our infinite value in God's eyes. His love isn't earned—it's freely given.",
      prayerPoints: [
        "Thank God for His unconditional love",
        "Pray for a deeper understanding of Christ's sacrifice",
        "Ask for help to share God's love with others"
      ]
    },
    "Philippians 4:6-7": {
      title: "Finding Peace in Anxious Times",
      content: "Anxiety and worry are common struggles in our fast-paced world. In this passage, Paul offers a practical solution: instead of worrying, bring everything to God in prayer. The promise isn't that all problems will disappear, but rather that God's peace—which exceeds our understanding—will guard our hearts and minds. This peace acts as a sentinel, protecting us from the assault of anxious thoughts.",
      prayerPoints: [
        "Surrender your specific anxieties to God",
        "Thank God for His promise of peace",
        "Ask for awareness of His presence in stressful moments"
      ]
    },
    "Romans 8:28": {
      title: "Purpose in Every Circumstance",
      content: "Life doesn't always make sense, especially during difficult times. This verse assures believers that God works all things together for good. Note that it doesn't say all things are good, but rather that God can weave even painful experiences into a larger purpose. Like a tapestry viewed from the wrong side, our lives may appear chaotic, but God sees the beautiful pattern emerging.",
      prayerPoints: [
        "Trust God with your current challenges",
        "Seek wisdom to recognize God's work in your life",
        "Pray for patience while waiting to see the full picture"
      ]
    },
    "default": {
      title: "Reflecting on God's Word",
      content: "Scripture is alive and active, sharper than any two-edged sword. When we meditate on God's word, we allow its truth to penetrate our hearts and transform our thinking. This verse reminds us that God's wisdom is available to guide us through every circumstance. Take time today to let these words sink deeply into your spirit and observe how God uses them to speak directly to your situation.",
      prayerPoints: [
        "Ask God to reveal new insights through His word",
        "Pray for a teachable heart",
        "Ask for help applying this scripture to your daily life"
      ]
    }
  };
  
  // Get the closest matching devotional or use default
  for (const key in devotionals) {
    if (reference && reference.includes(key)) {
      return devotionals[key];
    }
  }

  logger.info(`No specific devotional found for reference: ${reference}. Returning default.`, { reference });
  return devotionals.default;
}
