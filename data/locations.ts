export interface Location {
  name: string;
  code: string;
  states?: State[];
  currency: string;
  currencySymbol: string;
  phoneCode: string;
  timezone: string;
}

export interface State {
  name: string;
  code: string;
  cities?: string[];
}

export const locations: Record<string, Location> = {
  india: {
    name: "India",
    code: "IN",
    currency: "INR",
    currencySymbol: "₹",
    phoneCode: "+91",
    timezone: "Asia/Kolkata",
    states: [
      {
        name: "Maharashtra",
        code: "MH",
        cities: ["Mumbai", "Pune", "Nagpur", "Thane", "Nashik", "Aurangabad", "Solapur", "Kolhapur", "Sangli", "Amravati"]
      },
      {
        name: "Delhi",
        code: "DL",
        cities: ["New Delhi", "Noida", "Gurgaon", "Faridabad", "Ghaziabad", "Greater Noida", "Sonipat", "Panipat", "Rohtak", "Meerut"]
      },
      {
        name: "Karnataka",
        code: "KA",
        cities: ["Bangalore", "Mysore", "Hubli", "Mangalore", "Belgaum", "Gulbarga", "Bellary", "Bijapur", "Hassan", "Udupi"]
      },
      {
        name: "Tamil Nadu",
        code: "TN",
        cities: ["Chennai", "Coimbatore", "Madurai", "Salem", "Tiruchirappalli", "Thoothukudi", "Tirunelveli", "Thanjavur", "Tirupur", "Erode"]
      },
      {
        name: "Telangana",
        code: "TG",
        cities: ["Hyderabad", "Warangal", "Nizamabad", "Karimnagar", "Khammam", "Ramagundam", "Mahbubnagar", "Nalgonda", "Adilabad", "Suryapet"]
      },
      {
        name: "Gujarat",
        code: "GJ",
        cities: ["Ahmedabad", "Surat", "Vadodara", "Rajkot", "Bhavnagar", "Jamnagar", "Junagadh", "Anand", "Navsari", "Morbi"]
      },
      {
        name: "Uttar Pradesh",
        code: "UP",
        cities: ["Lucknow", "Kanpur", "Agra", "Varanasi", "Prayagraj", "Noida", "Ghaziabad", "Meerut", "Bareilly", "Aligarh"]
      },
      {
        name: "Rajasthan",
        code: "RJ",
        cities: ["Jaipur", "Jodhpur", "Udaipur", "Kota", "Bikaner", "Ajmer", "Alwar", "Bhilwara", "Bharatpur", "Sri Ganganagar"]
      },
      {
        name: "Kerala",
        code: "KL",
        cities: ["Thiruvananthapuram", "Kochi", "Kozhikode", "Thrissur", "Kollam", "Alappuzha", "Kannur", "Kottayam", "Palakkad", "Kasaragod"]
      },
      {
        name: "Punjab",
        code: "PB",
        cities: ["Chandigarh", "Ludhiana", "Amritsar", "Jalandhar", "Patiala", "Bathinda", "Mohali", "Pathankot", "Hoshiarpur", "Moga"]
      },
      {
        name: "West Bengal",
        code: "WB",
        cities: ["Kolkata", "Howrah", "Durgapur", "Asansol", "Siliguri", "Darjeeling", "Bardhaman", "Malda", "Kharagpur", "Haldia"]
      },
      {
        name: "Bihar",
        code: "BR",
        cities: ["Patna", "Gaya", "Muzaffarpur", "Bhagalpur", "Darbhanga", "Purnia", "Arrah", "Bihar Sharif", "Begusarai", "Katihar"]
      },
      {
        name: "Madhya Pradesh",
        code: "MP",
        cities: ["Bhopal", "Indore", "Jabalpur", "Gwalior", "Ujjain", "Sagar", "Dewas", "Satna", "Ratlam", "Rewa"]
      },
      {
        name: "Haryana",
        code: "HR",
        cities: ["Gurgaon", "Faridabad", "Panipat", "Ambala", "Yamunanagar", "Rohtak", "Hisar", "Karnal", "Sonipat", "Sirsa"]
      },
      {
        name: "Andhra Pradesh",
        code: "AP",
        cities: ["Visakhapatnam", "Vijayawada", "Guntur", "Nellore", "Tirupati", "Kurnool", "Kadapa", "Anantapur", "Kakinada", "Rajahmundry"]
      }
    ]
  },
  usa: {
    name: "United States",
    code: "US",
    currency: "USD",
    currencySymbol: "$",
    phoneCode: "+1",
    timezone: "America/New_York",
    states: [
      {
        name: "California",
        code: "CA",
        cities: ["Los Angeles", "San Francisco", "San Diego", "San Jose"]
      },
      {
        name: "New York",
        code: "NY",
        cities: ["New York City", "Buffalo", "Albany", "Rochester"]
      },
      {
        name: "Texas",
        code: "TX",
        cities: ["Houston", "Dallas", "Austin", "San Antonio"]
      },
      {
        name: "Florida",
        code: "FL",
        cities: ["Miami", "Orlando", "Tampa", "Jacksonville"]
      }
    ]
  },
  uk: {
    name: "United Kingdom",
    code: "GB",
    currency: "GBP",
    currencySymbol: "£",
    phoneCode: "+44",
    timezone: "Europe/London",
    states: [
      {
        name: "England",
        code: "ENG",
        cities: ["London", "Manchester", "Birmingham", "Liverpool"]
      },
      {
        name: "Scotland",
        code: "SCT",
        cities: ["Edinburgh", "Glasgow", "Aberdeen", "Dundee"]
      },
      {
        name: "Wales",
        code: "WLS",
        cities: ["Cardiff", "Swansea", "Newport", "Bangor"]
      }
    ]
  },
  australia: {
    name: "Australia",
    code: "AU",
    currency: "AUD",
    currencySymbol: "A$",
    phoneCode: "+61",
    timezone: "Australia/Sydney",
    states: [
      {
        name: "New South Wales",
        code: "NSW",
        cities: ["Sydney", "Newcastle", "Wollongong", "Parramatta"]
      },
      {
        name: "Victoria",
        code: "VIC",
        cities: ["Melbourne", "Geelong", "Ballarat", "Bendigo"]
      },
      {
        name: "Queensland",
        code: "QLD",
        cities: ["Brisbane", "Gold Coast", "Sunshine Coast", "Townsville"]
      }
    ]
  },
  uae: {
    name: "United Arab Emirates",
    code: "AE",
    currency: "AED",
    currencySymbol: "د.إ",
    phoneCode: "+971",
    timezone: "Asia/Dubai",
    states: [
      {
        name: "Dubai",
        code: "DU",
        cities: ["Dubai City", "Jumeirah", "Bur Dubai", "Deira"]
      },
      {
        name: "Abu Dhabi",
        code: "AZ",
        cities: ["Abu Dhabi City", "Al Ain", "Al Dhafra", "Al Ruwais"]
      },
      {
        name: "Sharjah",
        code: "SH",
        cities: ["Sharjah City", "Al Qasimiya", "Al Nahda", "Al Majaz"]
      }
    ]
  }
};

export function getLocationFromPath(path: string): { country?: string; state?: string; city?: string } {
  const segments = path.split('/').filter(Boolean);
  
  if (segments.length === 0) return {};
  
  const country = segments[0];
  if (!locations[country]) return { country };
  
  if (segments.length === 1) return { country };
  
  const state = segments[1];
  const countryData = locations[country];
  const stateData = countryData.states?.find(s => s.code.toLowerCase() === state);
  
  if (!stateData) return { country };
  
  if (segments.length === 2) return { country, state };
  
  const city = segments[2];
  if (!stateData.cities?.includes(city)) return { country, state };
  
  return { country, state, city };
}

export function generateStaticParams() {
  const params: { country: string; state?: string; city?: string }[] = [];
  
  Object.entries(locations).forEach(([country, countryData]) => {
    // Add country route
    params.push({ country });
    
    // Add state routes
    countryData.states?.forEach(state => {
      params.push({ country, state: state.code.toLowerCase() });
      
      // Add city routes
      state.cities?.forEach(city => {
        params.push({ country, state: state.code.toLowerCase(), city });
      });
    });
  });
  
  return params;
} 