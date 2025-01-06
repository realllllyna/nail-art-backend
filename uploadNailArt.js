const axios = require('axios');

// Nail Art Data
const nailArtList = [
  {
    title: "Mystic Aurora",
    price: 30,
    description: "A beautiful pinky design perfect for spring.",
    imageUrl: "/uploads/image1.jpg",
    artist: "Anna Smith",
    duration: "45 mins",
    colorOptions: "Soft Pink, Pastel Blue, Lavender",
    materials: "Gel polish, Vegan-friendly",
    aftercare: "Avoid water for 24 hours.",
    allergyWarnings: "Contains acrylic; consult if allergic.",
    availability: "Monday - Saturday, 9 AM - 6 PM",
    category: "Gel" 
  },
  {
    title: "Velvet Petals",
    price: 25,
    description: "A soft, luxurious finish with a petal-like smoothness.",
    imageUrl: "/uploads/image2.jpg",
    artist: "Emily Johnson",
    duration: "30 mins",
    colorOptions: "Rose Red, Cream White, Dusty Rose",
    materials: "Acrylic, Hypoallergenic",
    aftercare: "Moisturize cuticles daily.",
    allergyWarnings: "None",
    availability: "Tuesday - Sunday, 10 AM - 5 PM",
    category: "Acrylic"  
  },
  {
    title: "Moonlit Gloss",
    price: 22,
    description: "A subtle sparkle that adds elegance to any style.",
    imageUrl: "/uploads/image3.jpg",
    artist: "Sophia Lee",
    duration: "30 mins",
    colorOptions: "Silver Sparkle, Nude, Champagne",
    materials: "Gel polish, Non-toxic",
    aftercare: "Avoid harsh chemicals for a week.",
    allergyWarnings: "None",
    availability: "Wednesday - Sunday, 9 AM - 7 PM",
    category: "Gel"  
  },
  {
    title: "Iridescent Allure",
    price: 30,
    description: "Captivating colors that shift with every angle.",
    imageUrl: "/uploads/image4.jpg",
    artist: "Mia Zhang",
    duration: "40 mins",
    colorOptions: "Silver Sparkle, Peacock Blue, Emerald Green",
    materials: "Gel polish, Vegan-friendly",
    aftercare: "Avoid direct sunlight for 48 hours.",
    allergyWarnings: "Contains glitter; consult if allergic.",
    availability: "Monday - Friday, 9 AM - 8 PM",
    category: "Gel"  
  },
  {
    title: "Celestial Spark",
    price: 35,
    description: "Cosmic glitter that lights up your nails like stars.",
    imageUrl: "/uploads/image5.jpg",
    artist: "Olivia Brown",
    duration: "50 mins",
    colorOptions: "Galaxy Silver, Starry Night, Nebula Blue",
    materials: "Acrylic, Hypoallergenic",
    aftercare: "Avoid soaking for 24 hours.",
    allergyWarnings: "Contains glitter; consult if allergic.",
    availability: "Monday - Saturday, 10 AM - 6 PM",
    category: "Acrylic"  
  },
  {
    title: "Opal Dream",
    price: 22,
    description: "Soft, pearlescent hues with a dreamy, opalescent glow.",
    imageUrl: "/uploads/image6.jpg",
    artist: "Liam Davis",
    duration: "30 mins",
    colorOptions: "Opal White, Pink Pearl, Icy Blue",
    materials: "Gel polish, Non-toxic",
    aftercare: "Keep nails dry for 24 hours.",
    allergyWarnings: "None",
    availability: "Tuesday - Sunday, 10 AM - 5 PM",
    category: "Gel"  
  },
  {
    title: "Lush Lacquer",
    price: 28,
    description: "Rich, deep colors with a flawless, glossy shine.",
    imageUrl: "/uploads/image7.jpg",
    artist: "Ethan Wilson",
    duration: "40 mins",
    colorOptions: "Burgundy, Deep Blue, Forest Green",
    materials: "Gel polish, Vegan-friendly",
    aftercare: "Avoid nail polish remover for a week.",
    allergyWarnings: "None",
    availability: "Monday - Friday, 9 AM - 8 PM",
    category: "Gel"  
  },
  {
    title: "Ethereal Polish",
    price: 25,
    description: "Delicate, airy shades that feel almost otherworldly.",
    imageUrl: "/uploads/image8.jpg",
    artist: "Ava Martinez",
    duration: "35 mins",
    colorOptions: "Mint Green, Baby Silver, Soft Lilac",
    materials: "Acrylic, Non-toxic",
    aftercare: "Keep away from water for 12 hours.",
    allergyWarnings: "Contains acrylic; consult if allergic.",
    availability: "Wednesday - Sunday, 10 AM - 6 PM",
    category: "Acrylic" 
  },
  {
    title: "Serenity Tips",
    price: 32,
    description: "Calm, soothing tones for an effortlessly chic look.",
    imageUrl: "/uploads/image9.jpg",
    artist: "Isabella Garcia",
    duration: "50 mins",
    colorOptions: "Pale Pink, Seafoam Green, Crystal White",
    materials: "Gel polish, Vegan-friendly",
    aftercare: "Apply cuticle oil daily.",
    allergyWarnings: "None",
    availability: "Monday - Saturday, 9 AM - 6 PM",
    category: "Gel" 
  },
  {
    title: "Blissful Hues",
    price: 30,
    description: "Luxurious and opulent, adorned with crystals.",
    imageUrl: "/uploads/image10.jpg",
    artist: "James Taylor",
    duration: "45 mins",
    colorOptions: "Baby Blue, Mint Green, Rose Gold",
    materials: "Acrylic, Hypoallergenic",
    aftercare: "Avoid heavy lifting for 24 hours.",
    allergyWarnings: "Contains acrylic; consult if allergic.",
    availability: "Tuesday - Sunday, 10 AM - 5 PM",
    category: "Acrylic" 
  }
];

// Function to Upload Categories
const uploadCategories = async (categories) => {
  try {
    for (const category of categories) {
      const response = await axios.post('http://localhost:3000/categories', { name: category });
      console.log(`Uploaded Category: ${response.data.name} (ID: ${response.data.id})`);
    }
    console.log("All categories uploaded successfully!");
  } catch (error) {
    console.error("Error uploading categories:", error.message);
  }
};

// Function to Get or Create Category by Name
const getCategoryId = async (categoryName) => {
  try {
    // Get all categories from the database
    const response = await axios.get('http://localhost:3000/categories');
    const categories = response.data;

    // Find if category already exists
    const category = categories.find(cat => cat.name.toLowerCase() === categoryName.toLowerCase());  // Case insensitive match

    if (category) {
      return category.id;  // Return the categoryId if it exists
    } else {
      // If category doesn't exist, create it
      const createResponse = await axios.post('http://localhost:3000/categories', { name: categoryName });
      return createResponse.data.id;
    }
  } catch (error) {
    console.error("Error fetching or creating category:", error.message);
    return null;
  }
};

// Function to Upload Nail Art Data
const uploadData = async () => {
  try {
    // Upload categories first
    const categories = ["Gel", "Acrylic", "Natural"]; // Ensure all categories are included
    await uploadCategories(categories);

    // Upload each nail art entry
    for (const entry of nailArtList) {
      console.log(`Uploading: ${entry.title}...`);

      // Get the categoryId based on the category name
      const categoryId = await getCategoryId(entry.category);

      if (categoryId) {
        // Replace the category name with categoryId
        const entryData = { ...entry, categoryId };
        const response = await axios.post('http://localhost:3000/entries', entryData);
        console.log(`Uploaded: ${response.data.title} (ID: ${response.data.id})`);
      } else {
        console.error(`Error uploading ${entry.title}: Category not found`);
      }
    }
    console.log("All data uploaded successfully!");
  } catch (error) {
    console.error("Error uploading data:", error.message);
  }
};

uploadData();