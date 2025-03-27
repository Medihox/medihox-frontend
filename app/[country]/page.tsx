import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import LandingPage from '@/components/landing-page/LandingPage';
import { locations, getLocationFromPath } from '@/data/locations';

interface CountryPageProps {
  params: {
    country: string;
  };
}

export async function generateMetadata({ params }: CountryPageProps): Promise<Metadata> {
  const location = locations[params.country];
  
  if (!location) {
    return {
      title: 'Page Not Found',
      description: 'The requested page could not be found.',
    };
  }

  return {
    title: `MediHox - Medical Lead Management Software in ${location.name}`,
    description: `Best-in-class medical lead management system designed specifically for healthcare providers in ${location.name}. Boost patient acquisition by 40%, reduce no-shows by 70%.`,
    openGraph: {
      title: `MediHox - Medical Lead Management Software in ${location.name}`,
      description: `Best-in-class medical lead management system designed specifically for healthcare providers in ${location.name}.`,
      locale: location.timezone,
    },
  };
}

export async function generateStaticParams() {
  return Object.keys(locations).map((country) => ({
    country,
  }));
}

export default function CountryPage({ params }: CountryPageProps) {
  const location = locations[params.country];
  
  if (!location) {
    notFound();
  }

  return <LandingPage location={location.name} />;
} 