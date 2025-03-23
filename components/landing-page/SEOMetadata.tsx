"use client";

import Head from 'next/head';

interface SEOMetadataProps {
  location?: string;
}

export default function SEOMetadata({ location = "India" }: SEOMetadataProps) {
  // Location-specific content
  const locationKeywords = {
    "India": "India, Mumbai, Delhi, Bangalore, Chennai, Hyderabad, Kolkata, Pune, Ahmedabad, medical lead management India, healthcare CRM India, hospital management system India, Indian medical software, ayurveda clinic software, multi-specialty hospital CRM, patient management software Mumbai, medical practice management Delhi, healthcare lead software Bangalore, medical marketing Chennai, hospital CRM Hyderabad, patient acquisition Kolkata, Pune healthcare management, Ahmedabad medical CRM, Gujarat medical software, Karnataka healthcare solutions, Tamil Nadu medical CRM, Maharashtra hospital systems, Jaipur, Lucknow, Chandigarh, Goa, Kochi, Agra, Varanasi, Taj Mahal, Rishikesh, Darjeeling, Shimla, Manali, Kashmir, Gurgaon, Noida, Indore, Bhopal, Amritsar, Golden Temple, Udaipur, Jaisalmer, Kerala, Munnar, Ooty, Mysore, Hampi, Pondicherry, Pushkar, Rajasthan, Uttarakhand, Srinagar, Dehradun, Haridwar, Allahabad, Patna, Bhubaneswar, Raipur, Ranchi, Gangtok, Shillong, Guwahati, Apollo Hospital, Fortis Healthcare, Max Healthcare, AIIMS, PGI, CMC Vellore, Manipal Hospital, Medanta, Kokilaben Hospital, Narayana Health, Wockhardt Hospital, Lilavati Hospital, Ruby Hall Clinic, Seven Hills Hospital, Hinduja Hospital, healthcare tourism India, medical tourism Delhi, plastic surgery India, ayurvedic treatment Kerala, wellness center Rishikesh, multi-specialty hospital Mumbai, healthcare IT solutions Bangalore, doctor appointment system Chennai, hospital software Hyderabad, clinic management Pune, patient care system Jaipur, telemedicine India, healthcare analytics software",
    "USA": "USA, New York, California, Texas, Florida, Chicago, Los Angeles, Houston, Boston, San Francisco, HIPAA compliant CRM USA, medical practice management Florida, US healthcare lead generation, Texas medical marketing, California healthcare CRM, New York medical lead system, Chicago healthcare software, Los Angeles patient acquisition, Houston medical practice CRM, Atlanta healthcare management, Boston medical lead system, Philadelphia hospital CRM, San Francisco patient engagement, Seattle healthcare workflow, Denver medical scheduling",
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
    ? `Best-in-class medical lead management system designed specifically for healthcare providers in ${selectedCity}, ${baseCountry}. Boost patient acquisition by 40%, reduce no-shows by 70%. HIPAA & Indian healthcare regulations compliant CRM tailored for hospitals, clinics & medical practices in ${selectedCity}. Trusted by leading healthcare providers in ${selectedCity}.`
    : `Best-in-class medical lead management system designed specifically for healthcare providers in ${location}. Boost patient acquisition by 40%, reduce no-shows by 70%. HIPAA & ${location === "India" ? "Indian healthcare regulations" : location === "UK" ? "UK GDPR" : "local regulation"} compliant CRM tailored for hospitals, clinics & medical practices. Trusted by leading healthcare providers in ${location === "India" ? "Mumbai, Delhi, Bangalore" : location === "USA" ? "New York, California, Texas" : location === "UK" ? "London, Manchester, Birmingham" : location}.`;

  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={`medical lead management, healthcare CRM, patient acquisition software, clinic management system, hospital lead management, patient conversion, medical practice growth, HIPAA compliant CRM, healthcare lead generation, medical marketing software, patient booking system, healthcare appointment scheduling, medical facility management, doctor appointment system, medical practice automation, healthcare analytics, ${keywords}`} />
      
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
      <meta name="theme-color" content="#4CAF50" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      
      {/* Structured data for rich snippets */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": location.includes("-") ? `MediHox Lead Management for ${selectedCity}, ${baseCountry}` : `MediHox Lead Management for ${location}`,
            "applicationCategory": "BusinessApplication",
            "operatingSystem": "Web",
            "offers": {
              "@type": "Offer",
              "price": pricing.price,
              "priceCurrency": pricing.currency,
              "priceValidUntil": new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
              "availability": "https://schema.org/InStock"
            },
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.8",
              "ratingCount": "127",
              "bestRating": "5",
              "worstRating": "1"
            },
            "description": description,
            "applicationSubCategory": "Healthcare Management",
            "releaseNotes": location.includes("-") ? `Latest version includes location-specific features for healthcare providers in ${selectedCity}, ${baseCountry}` : `Latest version includes location-specific features for healthcare providers in ${location}`,
            "featureList": baseCountry === "India" ? 
              "WhatsApp integration, GST billing, Aadhaar verification, Multi-language support" : 
              baseCountry === "USA" ? 
              "HIPAA compliance, Insurance verification, EHR integration, US-based cloud hosting" :
              "Local healthcare regulation compliance, Region-specific integrations",
            "screenshot": "https://medihox.com/screenshots/dashboard.jpg",
            "softwareRequirements": "Web Browser, Internet Connection",
            "supportingData": {
              "@type": "Dataset",
              "name": "Patient Acquisition Statistics",
              "description": location.includes("-") ? `Statistical data on patient acquisition improvements for healthcare providers using MediHox in ${selectedCity}, ${baseCountry}` : `Statistical data on patient acquisition improvements for healthcare providers using MediHox in ${location}`
            },
            "provider": {
              "@type": "Organization",
              "name": "MediHox",
              "sameAs": [
                "https://twitter.com/medihox",
                "https://www.facebook.com/medihox",
                "https://www.linkedin.com/company/medihox"
              ]
            }
          })
        }}
      />
      
      {/* Organization structured data */}
      <script 
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "MediHox",
            "url": "https://medihox.com",
            "logo": "https://medihox.com/logo.png",
            "description": location.includes("-") ? `Leading provider of healthcare lead management software in ${selectedCity}, ${baseCountry}` : `Leading provider of healthcare lead management software in ${location}`,
            "address": {
              "@type": "PostalAddress",
              "addressCountry": baseCountry === "India" ? "IN" : baseCountry === "USA" ? "US" : baseCountry === "UK" ? "GB" : baseCountry === "Australia" ? "AU" : "AE",
              "addressRegion": location.includes("-") ? selectedCity : ""
            },
            "contactPoint": {
              "@type": "ContactPoint",
              "telephone": baseCountry === "India" ? "+91-12345-67890" : baseCountry === "USA" ? "+1-234-567-8900" : baseCountry === "UK" ? "+44-1234-567890" : baseCountry === "Australia" ? "+61-2-3456-7890" : "+971-2-345-6789",
              "contactType": "customer service",
              "availableLanguage": baseCountry === "India" ? ["English", "Hindi"] : ["English"]
            }
          })
        }}
      />
      
      {/* FAQ structured data */}
      <script 
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": location.includes("-") ? `Is MediHox compliant with healthcare regulations in ${selectedCity}, ${baseCountry}?` : `Is MediHox compliant with healthcare regulations in ${location}?`,
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": baseCountry === "India" ? 
                    `Yes, MediHox is fully compliant with all Indian healthcare data regulations and standards applicable in ${location.includes("-") ? selectedCity : "all regions of India"}.` : 
                    baseCountry === "USA" ? 
                    "Yes, MediHox is HIPAA compliant with end-to-end encryption and strict access controls to protect patient information." :
                    baseCountry === "UK" ?
                    "Yes, MediHox is fully compliant with NHS Digital standards, UK GDPR, and the Data Protection Act 2018." :
                    "Yes, MediHox is fully compliant with all local healthcare regulations in your region."
                }
              },
              {
                "@type": "Question",
                "name": location.includes("-") ? `How does MediHox help medical practices in ${selectedCity}, ${baseCountry} increase patient acquisition?` : `How does MediHox help medical practices in ${location} increase patient acquisition?`,
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": location.includes("-") ? `MediHox helps healthcare providers in ${selectedCity}, ${baseCountry} track and convert leads more effectively, resulting in a typical 30-40% increase in patient acquisition. Our system is specifically designed for the healthcare market in ${selectedCity}, with features that address local patient acquisition challenges.` : `MediHox helps healthcare providers in ${location} track and convert leads more effectively, resulting in a typical 30-40% increase in patient acquisition. Our system is specifically designed for the healthcare market in ${location}, with features that address local patient acquisition challenges.`
                }
              }
            ]
          })
        }}
      />
      
      {/* Local Business structured data for city-specific pages */}
      {location.includes("-") && (
        <script 
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              "name": `MediHox ${selectedCity}`,
              "image": "https://medihox.com/local-office.jpg",
              "url": `https://medihox.com/${baseCountry.toLowerCase()}/${selectedCity.toLowerCase()}`,
              "telephone": "+91-12345-67890",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": `123 Healthcare Avenue`,
                "addressLocality": selectedCity,
                "addressRegion": selectedCity,
                "postalCode": "400000",
                "addressCountry": "IN"
              },
              "geo": {
                "@type": "GeoCoordinates",
                "latitude": "18.5204",
                "longitude": "73.8567"
              },
              "openingHoursSpecification": {
                "@type": "OpeningHoursSpecification",
                "dayOfWeek": [
                  "Monday",
                  "Tuesday",
                  "Wednesday",
                  "Thursday",
                  "Friday"
                ],
                "opens": "09:00",
                "closes": "18:00"
              },
              "sameAs": [
                `https://www.facebook.com/medihox.${selectedCity.toLowerCase()}`,
                `https://twitter.com/medihox_${selectedCity.toLowerCase()}`
              ]
            })
          }}
        />
      )}
    </Head>
  );
} 