// Destination images using Unsplash for high-quality, free photos
const DESTINATION_IMAGES = {
  japan: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&q=80',
  tokyo: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&q=80',
  
  greece: 'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=800&q=80',
  athens: 'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=800&q=80',
  santorini: 'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=800&q=80',
  
  england: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&q=80',
  london: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&q=80',
  'united kingdom': 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&q=80',
  uk: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&q=80',
  
  spain: 'https://images.unsplash.com/photo-1543783207-ec64e4d95325?w=800&q=80',
  barcelona: 'https://images.unsplash.com/photo-1543783207-ec64e4d95325?w=800&q=80',
  madrid: 'https://images.unsplash.com/photo-1543783207-ec64e4d95325?w=800&q=80',
  
  italy: 'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=800&q=80',
  rome: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800&q=80',
  venice: 'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=800&q=80',
  florence: 'https://images.unsplash.com/photo-1543783207-ec64e4d95325?w=800&q=80',
  
  paris: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&q=80',
  france: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&q=80',
  
  germany: 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=800&q=80',
  berlin: 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=800&q=80',
  munich: 'https://images.unsplash.com/photo-1595867818082-083862f3d630?w=800&q=80',
  
  usa: 'https://images.unsplash.com/photo-1485738422979-f5c462d49f74?w=800&q=80',
  'united states': 'https://images.unsplash.com/photo-1485738422979-f5c462d49f74?w=800&q=80',
  america: 'https://images.unsplash.com/photo-1485738422979-f5c462d49f74?w=800&q=80',
  'new york': 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800&q=80',
  nyc: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800&q=80',
  'los angeles': 'https://images.unsplash.com/photo-1534190239940-9ba8944ea261?w=800&q=80',
  'san francisco': 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800&q=80',
  
  china: 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=800&q=80',
  beijing: 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=800&q=80',
  shanghai: 'https://images.unsplash.com/photo-1537981138073-f0b3e1cdfd97?w=800&q=80',
  
  australia: 'https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?w=800&q=80',
  sydney: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=800&q=80',
  melbourne: 'https://images.unsplash.com/photo-1514395462725-fb4566210144?w=800&q=80',
};

// Fallback image for destinations not in the list
const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&q=80';

/**
 * Get the appropriate image for a destination
 * @param {string} destination - The destination name
 * @returns {string} - The image URL
 */
export const getDestinationImage = (destination) => {
  if (!destination) return FALLBACK_IMAGE;
  
  // Normalize the destination string for matching
  const normalizedDestination = destination.toLowerCase().trim();
  
  // Try exact match first
  if (DESTINATION_IMAGES[normalizedDestination]) {
    return DESTINATION_IMAGES[normalizedDestination];
  }
  
  // Try to find a partial match (e.g., "Paris, France" matches "paris")
  for (const [key, imageUrl] of Object.entries(DESTINATION_IMAGES)) {
    if (normalizedDestination.includes(key) || key.includes(normalizedDestination)) {
      return imageUrl;
    }
  }
  
  // Return fallback if no match found
  return FALLBACK_IMAGE;
};

/**
 * Preload an image to ensure it's ready when needed
 * @param {string} src - The image URL
 * @returns {Promise} - Resolves when image is loaded
 */
export const preloadImage = (src) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(src);
    img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
    img.src = src;
  });
};

