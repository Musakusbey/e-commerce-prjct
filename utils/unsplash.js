import axios from 'axios';

// Ürün adına göre resim ara
export async function getProductImage(productName) {
  try {
    const response = await axios.get(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(productName)}&per_page=1&orientation=squarish`,
      {
        headers: {
          'Authorization': `Client-ID ${process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY}`
        }
      }
    );

    if (response.data.errors) {
      console.error('Unsplash API error:', response.data.errors[0]);
      return null;
    }

    // İlk resmin URL'sini döndür
    return response.data.results[0]?.urls?.regular || null;
  } catch (error) {
    console.error('Error fetching image:', error);
    return null;
  }
}
