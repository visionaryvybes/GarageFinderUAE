export interface CarBrand {
  id: string;
  name: string;
  query: string;
  color: string;
  textColor: string;
  initial: string;
}

export const CAR_BRANDS: CarBrand[] = [
  { id: "bmw",          name: "BMW",          query: "BMW specialist repair",          color: "#0066CC", textColor: "#fff",    initial: "B" },
  { id: "mercedes-benz",name: "Mercedes",     query: "Mercedes-Benz service repair",   color: "#222222", textColor: "#C0C0C0", initial: "M" },
  { id: "audi",         name: "Audi",         query: "Audi specialist repair",         color: "#BB0A0A", textColor: "#fff",    initial: "A" },
  { id: "volkswagen",   name: "VW",           query: "Volkswagen repair mechanic",     color: "#001E50", textColor: "#fff",    initial: "V" },
  { id: "porsche",      name: "Porsche",      query: "Porsche service specialist",     color: "#2D2D2D", textColor: "#B2960C", initial: "P" },
  { id: "toyota",       name: "Toyota",       query: "Toyota repair mechanic",         color: "#EB0A1E", textColor: "#fff",    initial: "T" },
  { id: "honda",        name: "Honda",        query: "Honda mechanic repair",          color: "#CC0000", textColor: "#fff",    initial: "H" },
  { id: "ford",         name: "Ford",         query: "Ford repair service",            color: "#003087", textColor: "#fff",    initial: "F" },
  { id: "chevrolet",    name: "Chevrolet",    query: "Chevrolet Chevy repair",         color: "#C5A028", textColor: "#fff",    initial: "C" },
  { id: "tesla",        name: "Tesla",        query: "Tesla service repair",           color: "#E82127", textColor: "#fff",    initial: "T" },
  { id: "nissan",       name: "Nissan",       query: "Nissan mechanic repair",         color: "#C3002F", textColor: "#fff",    initial: "N" },
  { id: "hyundai",      name: "Hyundai",      query: "Hyundai repair service",         color: "#002C5F", textColor: "#fff",    initial: "H" },
  { id: "kia",          name: "Kia",          query: "Kia service mechanic",           color: "#05141F", textColor: "#fff",    initial: "K" },
  { id: "mazda",        name: "Mazda",        query: "Mazda specialist repair",        color: "#92000A", textColor: "#fff",    initial: "M" },
  { id: "subaru",       name: "Subaru",       query: "Subaru mechanic repair",         color: "#003087", textColor: "#fff",    initial: "S" },
  { id: "lexus",        name: "Lexus",        query: "Lexus service repair",           color: "#1A1A1A", textColor: "#CCAA44", initial: "L" },
  { id: "jaguar",       name: "Jaguar",       query: "Jaguar specialist repair",       color: "#1C2A39", textColor: "#C4A265", initial: "J" },
  { id: "land-rover",   name: "Land Rover",   query: "Land Rover service repair",      color: "#005A2B", textColor: "#fff",    initial: "L" },
  { id: "volvo",        name: "Volvo",        query: "Volvo mechanic service",         color: "#003057", textColor: "#fff",    initial: "V" },
  { id: "mini",         name: "MINI",         query: "MINI Cooper repair service",     color: "#1B1B1B", textColor: "#E9221D", initial: "M" },
  { id: "jeep",         name: "Jeep",         query: "Jeep repair mechanic",           color: "#1D2D44", textColor: "#fff",    initial: "J" },
  { id: "dodge",        name: "Dodge",        query: "Dodge mechanic repair",          color: "#CC0000", textColor: "#fff",    initial: "D" },
  { id: "ram",          name: "RAM",          query: "RAM truck repair service",       color: "#1A1A1A", textColor: "#CC0000", initial: "R" },
  { id: "cadillac",     name: "Cadillac",     query: "Cadillac service repair",        color: "#1A1A1A", textColor: "#9B7E47", initial: "C" },
  { id: "infiniti",     name: "Infiniti",     query: "Infiniti mechanic repair",       color: "#1A1A1A", textColor: "#E8C97A", initial: "I" },
  { id: "acura",        name: "Acura",        query: "Acura repair service",           color: "#C8102E", textColor: "#fff",    initial: "A" },
  { id: "genesis",      name: "Genesis",      query: "Genesis service repair",         color: "#1A1A1A", textColor: "#C8A95A", initial: "G" },
  { id: "alfa-romeo",   name: "Alfa Romeo",   query: "Alfa Romeo specialist repair",   color: "#9A0A14", textColor: "#fff",    initial: "A" },
  { id: "maserati",     name: "Maserati",     query: "Maserati service repair",        color: "#002855", textColor: "#C4A265", initial: "M" },
  { id: "bentley",      name: "Bentley",      query: "Bentley service specialist",     color: "#1A2C41", textColor: "#C4A265", initial: "B" },
  { id: "rolls-royce",  name: "Rolls-Royce",  query: "Rolls-Royce service repair",     color: "#1A1A2E", textColor: "#C4A265", initial: "R" },
  { id: "lamborghini",  name: "Lamborghini",  query: "Lamborghini specialist",         color: "#1A1A1A", textColor: "#CCB900", initial: "L" },
  { id: "ferrari",      name: "Ferrari",      query: "Ferrari specialist repair",      color: "#CC0000", textColor: "#CCB900", initial: "F" },
  { id: "mitsubishi",   name: "Mitsubishi",   query: "Mitsubishi repair mechanic",     color: "#CC0000", textColor: "#fff",    initial: "M" },
  { id: "peugeot",      name: "Peugeot",      query: "Peugeot service repair",         color: "#1A1A1A", textColor: "#fff",    initial: "P" },
  { id: "renault",      name: "Renault",      query: "Renault mechanic repair",        color: "#FFCC00", textColor: "#1A1A1A", initial: "R" },
  { id: "fiat",         name: "FIAT",         query: "FIAT repair service",            color: "#8B0000", textColor: "#fff",    initial: "F" },
  { id: "gmc",          name: "GMC",          query: "GMC truck repair service",       color: "#CC0000", textColor: "#fff",    initial: "G" },
  { id: "lincoln",      name: "Lincoln",      query: "Lincoln service repair",         color: "#1A1A1A", textColor: "#9B7E47", initial: "L" },
  { id: "buick",        name: "Buick",        query: "Buick repair service",           color: "#1A1A1A", textColor: "#9B7E47", initial: "B" },
  { id: "chrysler",     name: "Chrysler",     query: "Chrysler repair mechanic",       color: "#1A1A1A", textColor: "#fff",    initial: "C" },
];
