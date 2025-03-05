"use client";

const SEOMetadata = () => {
  return (
    <>
      <title>Clinic Management System - Streamline Your Healthcare Practice</title>
      <meta 
        name="description" 
        content="Boost efficiency and patient satisfaction with our all-in-one Clinic Management System. Features include appointment scheduling, billing, EHR, and more." 
      />
      <meta 
        name="keywords" 
        content="clinic management, healthcare software, medical practice software, patient management, appointment scheduling, EHR, electronic health records" 
      />
      {/* Schema.org markup for rich snippets */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "Clinic Management System",
            "applicationCategory": "Healthcare Application",
            "offers": {
              "@type": "Offer",
              "price": "15000",
              "priceCurrency": "INR"
            },
            "operatingSystem": "Web-based"
          })
        }}
      />
    </>
  );
};

export default SEOMetadata; 