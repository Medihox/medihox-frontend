import { MetadataRoute } from 'next'
import { locations } from '@/data/locations'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://medihox.com'
  
  // Generate routes for all locations
  const routes = [
    // Home page
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    // Country routes
    ...Object.keys(locations).map(country => ({
      url: `${baseUrl}/${country.toLowerCase()}`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.8,
    })),
    // State routes
    ...Object.entries(locations).flatMap(([country, data]) =>
      (data.states || []).map(state => ({
        url: `${baseUrl}/${country.toLowerCase()}/${state.name.toLowerCase().replace(/\s+/g, '-')}`,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: 0.7,
      }))
    ),
    // City routes
    ...Object.entries(locations).flatMap(([country, data]) =>
      (data.states || []).flatMap(state => {
        const cities = state.cities || [];
        return cities.map(city => ({
          url: `${baseUrl}/${country.toLowerCase()}/${state.name.toLowerCase().replace(/\s+/g, '-')}/${city.toLowerCase().replace(/\s+/g, '-')}`,
          lastModified: new Date(),
          changeFrequency: 'daily' as const,
          priority: 0.6,
        }));
      })
    ),
  ]

  return routes
} 