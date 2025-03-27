import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import LandingPage from '@/components/landing-page/LandingPage';
import { locations } from '@/data/locations';

interface StatePageProps {
  params: {
    country: string;
    state: string;
  };
}

export async function generateMetadata({ params }: StatePageProps): Promise<Metadata> {
  const location = locations[params.country];
  
  if (!location) {
    return {
      title: 'Page Not Found',
      description: 'The requested page could not be found.',
    };
  }

  // Convert URL-friendly state name back to original format
  const stateName = params.state.split('-').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');

  const state = location.states?.find(s => 
    s.name.toLowerCase().replace(/\s+/g, '-') === params.state
  );
  
  if (!state) {
    return {
      title: 'Page Not Found',
      description: 'The requested page could not be found.',
    };
  }

  return {
    title: `MediHox - Medical Lead Management Software in ${state.name}, ${location.name}`,
    description: `Best-in-class medical lead management system designed specifically for healthcare providers in ${state.name}, ${location.name}. Boost patient acquisition by 40%, reduce no-shows by 70%.`,
    openGraph: {
      title: `MediHox - Medical Lead Management Software in ${state.name}, ${location.name}`,
      description: `Best-in-class medical lead management system designed specifically for healthcare providers in ${state.name}, ${location.name}.`,
      locale: location.timezone,
    },
  };
}

export async function generateStaticParams() {
  const params: { country: string; state: string }[] = [];
  
  Object.entries(locations).forEach(([country, countryData]) => {
    countryData.states?.forEach(state => {
      params.push({ country, state: state.code.toLowerCase() });
    });
  });
  
  return params;
}

export default function StatePage({ params }: StatePageProps) {
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

  return <LandingPage location={`${params.country}-${state.name}`} />;
} 