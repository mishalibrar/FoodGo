/**
 * Calculate the distance between two coordinates using the Haversine formula
 * @param {number} lat1 - Latitude of first point
 * @param {number} lon1 - Longitude of first point
 * @param {number} lat2 - Latitude of second point
 * @param {number} lon2 - Longitude of second point
 * @returns {number} Distance in kilometers
 */
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in kilometers
  
  return distance;
};

/**
 * Convert degrees to radians
 * @param {number} degrees
 * @returns {number} Radians
 */
const toRad = (degrees) => {
  return (degrees * Math.PI) / 180;
};

/**
 * Geocode an address to get coordinates and city using OpenWeatherMap API
 * @param {string} address - Address string to geocode
 * @returns {Promise<Object|null>} Object with latitude, longitude, and city, or null if failed
 */
export const geocodeAddress = async (address) => {
  if (!address || typeof address !== 'string') {
    return null;
  }

  try {
    const apiKey = 'a9e69cf557ecfe6ddbf4e72af2e21b2a';
    const url = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(address)}&limit=1&appid=${apiKey}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      console.error('[Geocoding] HTTP error! status:', response.status);
      return null;
    }

    const data = await response.json();
    
    if (data && data.length > 0) {
      const locationData = data[0];
      // Extract city name - prefer English name from local_names, fallback to name
      const city = locationData.local_names?.en || locationData.name || '';
      
      return {
        latitude: locationData.lat,
        longitude: locationData.lon,
        city: city,
      };
    }
    
    return null;
  } catch (error) {
    console.error('[Geocoding] Error geocoding address:', error.message);
    return null;
  }
};

/**
 * Filter restaurants by distance from user location or same city
 * @param {Array} restaurants - Array of restaurant objects
 * @param {Object} userLocation - User location object with latitude, longitude, and optionally city
 * @param {number} maxDistanceKm - Maximum distance in kilometers (default: 30km)
 * @returns {Array} Filtered array of restaurants within the specified distance or same city
 */
export const filterRestaurantsByDistance = (restaurants, userLocation, maxDistanceKm = 30) => {
  if (!userLocation || !userLocation.latitude || !userLocation.longitude) {
    // If no user location, return all restaurants
    return restaurants;
  }

  const userCity = userLocation.city ? userLocation.city.toLowerCase().trim() : null;

  return restaurants.filter(restaurant => {
    // Check if restaurant has coordinates
    if (
      restaurant.latitude &&
      restaurant.longitude &&
      typeof restaurant.latitude === 'number' &&
      typeof restaurant.longitude === 'number'
    ) {
      const distance = calculateDistance(
        userLocation.latitude,
        userLocation.longitude,
        restaurant.latitude,
        restaurant.longitude
      );
      
      // Add distance to restaurant object for display
      restaurant.distance = distance;
      
      // Include if within max distance
      if (distance <= maxDistanceKm) {
        return true;
      }
      
      // Also include if in the same city (even if beyond max distance)
      if (userCity && restaurant.city) {
        const restaurantCity = restaurant.city.toLowerCase().trim();
        if (restaurantCity === userCity) {
          return true;
        }
      }
      
      return false;
    }
    
    // If restaurant doesn't have coordinates but has city, check city match
    if (userCity && restaurant.city) {
      const restaurantCity = restaurant.city.toLowerCase().trim();
      if (restaurantCity === userCity) {
        return true;
      }
    }
    
    // Exclude restaurants without coordinates or city info
    return false;
  }).sort((a, b) => {
    // Sort by distance (closest first)
    if (a.distance && b.distance) {
      return a.distance - b.distance;
    }
    // If one has distance and other doesn't, prioritize the one with distance
    if (a.distance && !b.distance) return -1;
    if (!a.distance && b.distance) return 1;
    return 0;
  });
};

