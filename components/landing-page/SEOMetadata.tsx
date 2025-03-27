"use client";

import Head from 'next/head';
import Script from 'next/script';

interface SEOMetadataProps {
  location?: string;
}

export default function SEOMetadata({ location = "India" }: SEOMetadataProps) {
  // Location-specific content
  const locationKeywords = {
    "India": "India, Mumbai, Delhi, Bangalore, Chennai, Hyderabad, Kolkata, Pune, Ahmedabad, medical lead management India, healthcare CRM India, hospital management system India, Indian medical software, ayurveda clinic software, multi-specialty hospital CRM, patient management software Mumbai, medical practice management Delhi, healthcare lead software Bangalore, medical marketing Chennai, hospital CRM Hyderabad, patient acquisition Kolkata, Pune healthcare management, Ahmedabad medical CRM, Gujarat medical software, Karnataka healthcare solutions, Tamil Nadu medical CRM, Maharashtra hospital systems, Jaipur, Lucknow, Chandigarh, Goa, Kochi, Agra, Varanasi, Taj Mahal, Rishikesh, Darjeeling, Shimla, Manali, Kashmir, Gurgaon, Noida, Indore, Bhopal, Amritsar, Golden Temple, Udaipur, Jaisalmer, Kerala, Munnar, Ooty, Mysore, Hampi, Pondicherry, Pushkar, Rajasthan, Uttarakhand, Srinagar, Dehradun, Haridwar, Allahabad, Patna, Bhubaneswar, Raipur, Ranchi, Gangtok, Shillong, Guwahati, Apollo Hospital, Fortis Healthcare, Max Healthcare, AIIMS, PGI, CMC Vellore, Manipal Hospital, Medanta, Kokilaben Hospital, Narayana Health, Wockhardt Hospital, Lilavati Hospital, Ruby Hall Clinic, Seven Hills Hospital, Hinduja Hospital, healthcare tourism India, medical tourism Delhi, plastic surgery India, ayurvedic treatment Kerala, wellness center Rishikesh, multi-specialty hospital Mumbai, healthcare IT solutions Bangalore, doctor appointment system Chennai, hospital software Hyderabad, clinic management Pune, patient care system Jaipur, telemedicine India, healthcare analytics software",
    "USA": "USA, New York, California, Texas, Florida, Chicago, Los Angeles, Houston, Boston, San Francisco, medical practice management Florida, US healthcare lead generation, Texas medical marketing, California healthcare CRM, New York medical lead system, Chicago healthcare software, Los Angeles patient acquisition, Houston medical practice CRM, Atlanta healthcare management, Boston medical lead system, Philadelphia hospital CRM, San Francisco patient engagement, Seattle healthcare workflow, Denver medical scheduling",
    "UK": "UK, London, Manchester, Birmingham, Edinburgh, Glasgow, NHS compatible CRM, UK medical lead management, British healthcare software, London medical marketing, UK GDPR compliant medical CRM, NHS clinic software, Manchester healthcare system, Birmingham patient acquisition, Edinburgh medical practice, Glasgow healthcare management, Leeds medical CRM, Bristol patient engagement, UK medical appointment system, British healthcare scheduling",
    "Australia": "Australia, Sydney, Melbourne, Brisbane, Perth, Adelaide, Australian healthcare CRM, medical lead software Australia, Sydney medical management, Melbourne healthcare system, Brisbane patient acquisition, Perth medical practice software, Adelaide healthcare CRM, Gold Coast medical management, Australian medical compliance, MediHox integrated system",
    "UAE": "UAE, Dubai, Abu Dhabi, Sharjah, Ajman, UAE healthcare system, Dubai medical CRM, Abu Dhabi hospital software, Sharjah medical management, Gulf healthcare solutions, UAE patient acquisition, Dubai clinic software, medical lead generation UAE, healthcare compliance UAE, multilingual medical CRM"
  };

  // Location-specific cities for India with landmarks
  const indianCities = {
    "Mumbai": ["Mumbai", "Bombay", "Marine Drive", "Gateway of India", "Juhu Beach", "Bandra", "Andheri", "Powai", "Worli", "Colaba"],
    "Delhi": ["Delhi", "New Delhi", "India Gate", "Red Fort", "Qutub Minar", "Lotus Temple", "Connaught Place", "South Delhi", "North Delhi"],
    "Bangalore": ["Bangalore", "Bengaluru", "Electronic City", "Whitefield", "MG Road", "Indiranagar", "Koramangala", "HSR Layout", "Jayanagar"],
    "Chennai": ["Chennai", "Madras", "Marina Beach", "T Nagar", "Anna Nagar", "Adyar", "Mylapore", "Besant Nagar", "Velachery"],
    "Hyderabad": ["Hyderabad", "Secunderabad", "Gachibowli", "Banjara Hills", "Jubilee Hills", "HITEC City", "Charminar", "Kukatpally"],
    "Kolkata": ["Kolkata", "Calcutta", "Salt Lake", "Park Street", "Howrah", "New Town", "Rajarhat", "Victoria Memorial"],
    "Pune": ["Pune", "Hinjewadi", "Koregaon Park", "Kharadi", "Baner", "Aundh", "Viman Nagar", "Magarpatta", "Hadapsar"],
    "Jaipur": ["Jaipur", "Pink City", "Hawa Mahal", "Amer Fort", "City Palace", "Jantar Mantar", "Jal Mahal"],
    "Ahmedabad": ["Ahmedabad", "Sabarmati", "Satellite", "Gandhinagar", "Bopal", "SG Highway", "Prahlad Nagar"],
    "Goa": ["Goa", "Panaji", "Calangute", "Baga Beach", "Anjuna", "Candolim", "Vagator", "Palolem"]
  };

  // Get selected Indian city if applicable
  const selectedCity = location.includes("-") ? location.split("-")[1] : "";
  const cityKeywords = selectedCity && indianCities[selectedCity as keyof typeof indianCities] 
    ? indianCities[selectedCity as keyof typeof indianCities].join(", ") 
    : "";

  // Location-specific pricing and currency
  const pricingData = {
    "India": { price: "15000", currency: "INR", periodicity: "monthly" },
    "USA": { price: "199", currency: "USD", periodicity: "monthly" },
    "UK": { price: "159", currency: "GBP", periodicity: "monthly" },
    "Australia": { price: "249", currency: "AUD", periodicity: "monthly" },
    "UAE": { price: "699", currency: "AED", periodicity: "monthly" }
  };

  // Base country
  const baseCountry = location.includes("-") ? location.split("-")[0] : location;
  
  const keywords = location.includes("-") && baseCountry === "India" 
    ? `${cityKeywords}, ${locationKeywords[baseCountry as keyof typeof locationKeywords]}` 
    : locationKeywords[baseCountry as keyof typeof locationKeywords] || locationKeywords["India"];
    
  const pricing = pricingData[baseCountry as keyof typeof pricingData] || pricingData["India"];
  
  // Location-specific title
  const title = location.includes("-") && baseCountry === "India"
    ? `MediHox - #1 Medical Lead Management Software in ${selectedCity}, ${baseCountry} | Healthcare CRM for Clinics & Hospitals`
    : `MediHox - #1 Medical Lead Management Software in ${location} | Healthcare CRM for Clinics & Hospitals`;
  
  // Location-specific description
  const description = location.includes("-") && baseCountry === "India"
    ? `Best-in-class medical lead management system designed specifically for healthcare providers in ${selectedCity}, ${baseCountry}. Boost patient acquisition by 40%, reduce no-shows by 70%. Indian healthcare regulations compliant CRM tailored for hospitals, clinics & medical practices in ${selectedCity}. Trusted by leading healthcare providers in ${selectedCity}.`
    : `Best-in-class medical lead management system designed specifically for healthcare providers in ${location}. Boost patient acquisition by 40%, reduce no-shows by 70%. ${location === "India" ? "Indian healthcare regulations" : location === "UK" ? "UK GDPR" : "local regulation"} compliant CRM tailored for hospitals, clinics & medical practices. Trusted by leading healthcare providers in ${location === "India" ? "Mumbai, Delhi, Bangalore" : location === "USA" ? "New York, California, Texas" : location === "UK" ? "London, Manchester, Birmingham" : location}.`;

  // Add structured data for organization
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "MediHox",
    "url": "https://medihox.com",
    "logo": "https://medihox.com/icon_light.png",
    "sameAs": [
      "https://www.linkedin.com/company/medihox",
      "https://twitter.com/medihox",
      "https://www.facebook.com/medihox"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+91-XXXXXXXXXX",
      "contactType": "customer service",
      "areaServed": location,
      "availableLanguage": ["English", "Hindi"]
    }
  };

  // Add structured data for software application
  const softwareSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "MediHox Medical Lead Management",
    "applicationCategory": "HealthcareApplication",
    "operatingSystem": "Web-based",
    "offers": {
      "@type": "Offer",
      "price": pricing.price,
      "priceCurrency": pricing.currency,
      "availability": "https://schema.org/InStock"
    },
    "description": description,
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "ratingCount": "150"
    }
  };

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="keywords" content={`medical lead management, healthcare CRM, patient acquisition software, clinic management system, hospital lead management, patient conversion, medical practice growth, healthcare lead generation, medical marketing software, patient booking system, healthcare appointment scheduling, medical facility management, doctor appointment system, medical practice automation, healthcare analytics, ${keywords}`} />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={location.includes("-") ? `https://medihox.com/${baseCountry.toLowerCase()}/${selectedCity.toLowerCase()}` : `https://medihox.com/${location !== "India" ? location.toLowerCase() : ""}`} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content="https://medihox.com/og-image.jpg" />
        <meta property="og:locale" content={baseCountry === "India" ? "en_IN" : baseCountry === "USA" ? "en_US" : baseCountry === "UK" ? "en_GB" : baseCountry === "Australia" ? "en_AU" : "en_AE"} />
        
        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={location.includes("-") ? `https://medihox.com/${baseCountry.toLowerCase()}/${selectedCity.toLowerCase()}` : `https://medihox.com/${location !== "India" ? location.toLowerCase() : ""}`} />
        <meta property="twitter:title" content={title} />
        <meta property="twitter:description" content={description} />
        <meta property="twitter:image" content="https://medihox.com/twitter-image.jpg" />
        
        {/* Additional SEO tags */}
        <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
        <meta name="author" content="MediHox" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="canonical" href={location.includes("-") ? `https://medihox.com/${baseCountry.toLowerCase()}/${selectedCity.toLowerCase()}` : `https://medihox.com/${location !== "India" ? location.toLowerCase() : ""}`} />
        
        {/* Location-specific metadata */}
        <meta name="geo.region" content={baseCountry === "India" ? "IN" : baseCountry === "USA" ? "US" : baseCountry === "UK" ? "GB" : baseCountry === "Australia" ? "AU" : "AE"} />
        <meta name="geo.placename" content={location.includes("-") ? selectedCity : location} />
        {location.includes("-") && <meta name="geo.position" content="latitude;longitude" />}
        
        {/* Additional tags for mobile */}
        <meta name="format-detection" content="telephone=no" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="MediHox" />
        
        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </Head>

      {/* Structured Data */}
      <Script
        id="organization-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <Script
        id="software-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }}
      />
    </>
  );
} 