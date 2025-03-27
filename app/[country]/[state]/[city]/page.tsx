import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import LandingPage from '@/components/landing-page/LandingPage';
import { locations } from '@/data/locations';

interface CityPageProps {
  params: {
    country: string;
    state: string;
    city: string;
  };
}

export async function generateMetadata({ params }: CityPageProps): Promise<Metadata> {
  const location = locations[params.country];
  
  if (!location) {
    return {
      title: 'Page Not Found',
      description: 'The requested page could not be found.',
    };
  }

  const state = location.states?.find(s => 
    s.name.toLowerCase().replace(/\s+/g, '-') === params.state
  );
  
  if (!state) {
    return {
      title: 'Page Not Found',
      description: 'The requested page could not be found.',
    };
  }

  // Convert URL-friendly city name back to original format
  const cityName = params.city.split('-').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');

  if (!state.cities?.includes(cityName)) {
    return {
      title: 'Page Not Found',
      description: 'The requested page could not be found.',
    };
  }

  return {
    title: `MediHox - Medical Lead Management Software in ${cityName}, ${state.name}, ${location.name}`,
    description: `Best-in-class medical lead management system designed specifically for healthcare providers in ${cityName}, ${state.name}, ${location.name}. Boost patient acquisition by 40%, reduce no-shows by 70%.`,
    openGraph: {
      title: `MediHox - Medical Lead Management Software in ${cityName}, ${state.name}, ${location.name}`,
      description: `Best-in-class medical lead management system designed specifically for healthcare providers in ${cityName}, ${state.name}, ${location.name}.`,
      locale: location.timezone,
    },
  };
}

export async function generateStaticParams() {
  const params: { country: string; state: string; city: string }[] = [];
  
  Object.entries(locations).forEach(([country, countryData]) => {
    countryData.states?.forEach(state => {
      state.cities?.forEach(city => {
        params.push({ 
          country, 
          state: state.code.toLowerCase(),
          city: city.toLowerCase().replace(/\s+/g, '-')
        });
      });
    });
  });
  
  return params;
}

export default function CityPage({ params }: CityPageProps) {
  const location = locations[params.country];
  
  if (!location) {
    notFound();
  }

  const state = location.states?.find(s => 
    s.name.toLowerCase().replace(/\s+/g, '-') === params.state
  );
  
  if (!state) {
    notFound();
  }

  // Convert URL-friendly city name back to original format
  const cityName = params.city.split('-').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');

  if (!state.cities?.includes(cityName)) {
    notFound();
  }

  return <LandingPage location={`${params.country}-${cityName}`} />;
} 