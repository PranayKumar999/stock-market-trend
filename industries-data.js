// 120+ Indian Stock Market Industries Master Dataset
// All default constituent stocks have >= 2 years listing history on NSE
window.DEFAULT_INDUSTRIES = [
  // --- Information Technology & Digital ---
  {
    id: "it-software-large",
    name: "IT - Software (Large Cap)",
    sector: "Information Technology",
    marketCap: "Large",
    description: "Tier-1 Global IT services, consulting and software giants",
    tickers: ["TCS.NS", "INFY.NS", "HCLTECH.NS", "WIPRO.NS", "TECHM.NS"]
  },
  {
    id: "it-midcap-cloud",
    name: "IT - Mid Cap & Cloud Solutions",
    sector: "Information Technology",
    marketCap: "Mid",
    description: "High-growth mid-tier IT services and cloud digital engineering",
    tickers: ["PERSISTENT.NS", "COFORGE.NS", "LTTS.NS", "MPHASIS.NS", "TATAELXSI.NS"]
  },
  {
    id: "it-smallcap-niche",
    name: "IT - Small Cap & Niche Digital",
    sector: "Information Technology",
    marketCap: "Small",
    description: "Specialized enterprise software, BFSI tech and product engineering",
    tickers: ["CYIENT.NS", "BSOFT.NS", "SONATSOFTW.NS", "ZENSARTECH.NS", "KPITTECH.NS"]
  },
  {
    id: "internet-ecommerce",
    name: "Internet & Platform E-Commerce",
    sector: "Information Technology",
    marketCap: "Mid",
    description: "Digital marketplaces, recruitment, matchmaking and delivery platforms",
    tickers: ["NAUKRI.NS", "ZOMATO.NS", "INDIAMART.NS", "JUSTDIAL.NS"]
  },
  {
    id: "fintech-platforms",
    name: "Fintech & Wealth Tech Platforms",
    sector: "Financials",
    marketCap: "Mid",
    description: "Registrar, payment processors, insurance portals and retail fintech",
    tickers: ["CAMS.NS", "KFINTECH.NS", "PBFINTECH.NS", "ANGELONE.NS"]
  },
  {
    id: "telecom-services",
    name: "Telecom - Services Providers",
    sector: "Telecommunications",
    marketCap: "Large",
    description: "Integrated mobile telecommunications, fiber and broadband operators",
    tickers: ["BHARTIARTL.NS", "IDEA.NS", "TATACOMM.NS"]
  },
  {
    id: "telecom-equipment",
    name: "Telecom - Equipment & Optical Fiber",
    sector: "Telecommunications",
    marketCap: "Small",
    description: "5G networking equipment, optical fiber cables and defense telecoms",
    tickers: ["HFCL.NS", "TEJASNET.NS", "ITI.NS", "STERTOOLS.NS"]
  },
  {
    id: "electronic-mfg-ems",
    name: "Electronics Manufacturing (EMS)",
    sector: "Consumer Electronics",
    marketCap: "Mid",
    description: "Contract manufacturers of electronics, TVs, mobiles and IoT hardware",
    tickers: ["DIXON.NS", "AMBER.NS", "SYRMA.NS", "KAYNES.NS"]
  },

  // --- Banking & Financial Services ---
  {
    id: "banks-private-large",
    name: "Private Banks (Large Cap)",
    sector: "Financials",
    marketCap: "Large",
    description: "India's largest private commercial and retail banking institutions",
    tickers: ["HDFCBANK.NS", "ICICIBANK.NS", "KOTAKBANK.NS", "AXISBANK.NS", "INDUSINDBK.NS"]
  },
  {
    id: "banks-psu-large",
    name: "Public Sector Banks (Large Cap)",
    sector: "Financials",
    marketCap: "Large",
    description: "State-owned powerhouse banks with nationwide branch networks",
    tickers: ["SBIN.NS", "BANKBARODA.NS", "PNB.NS", "CANBK.NS"]
  },
  {
    id: "banks-psu-mid-small",
    name: "Public Sector Banks (Mid & Small)",
    sector: "Financials",
    marketCap: "Small",
    description: "Regional and mid-tier state-owned banks undergoing balance-sheet turnaround",
    tickers: ["UNIONBANK.NS", "INDIANB.NS", "BANKINDIA.NS", "MAHABANK.NS", "UCOBANK.NS"]
  },
  {
    id: "banks-regional-private",
    name: "Private Banks (Mid & Regional)",
    sector: "Financials",
    marketCap: "Mid",
    description: "High-growth south Indian and specialized regional private banks",
    tickers: ["FEDERALBNK.NS", "IDFCFIRSTB.NS", "BANDHANBNK.NS", "RBLBANK.NS", "CITYUNIONB.NS"]
  },
  {
    id: "small-finance-banks",
    name: "Small Finance Banks",
    sector: "Financials",
    marketCap: "Small",
    description: "Financial inclusion, MSME and priority sector small finance banks",
    tickers: ["AUBANK.NS", "EQUITASBNK.NS", "UJJIVANSFB.NS", "ESAFSFB.NS"]
  },
  {
    id: "nbfc-diversified-large",
    name: "NBFC - Diversified Conglomerates",
    sector: "Financials",
    marketCap: "Large",
    description: "Consumer durable financing, commercial lending and retail credit majors",
    tickers: ["BAJFINANCE.NS", "BAJAJFINSV.NS", "CHOLAFIN.NS", "SHRIRAMFIN.NS"]
  },
  {
    id: "nbfc-housing-finance",
    name: "NBFC - Housing Finance",
    sector: "Financials",
    marketCap: "Mid",
    description: "Mortgage lending and affordable housing finance companies",
    tickers: ["LICHSGFIN.NS", "PNBHOUSING.NS", "CANFINHOME.NS", "HOMEFIRST.NS", "AAVAS.NS"]
  },
  {
    id: "nbfc-infra-power",
    name: "NBFC - Power & Infrastructure Lending",
    sector: "Financials",
    marketCap: "Large",
    description: "Govt-backed non-banking financiers funding energy, railway and highways",
    tickers: ["PFC.NS", "REC.NS", "IRFC.NS", "HUDCO.NS"]
  },
  {
    id: "nbfc-vehicle-equipment",
    name: "NBFC - Vehicle & Auto Finance",
    sector: "Financials",
    marketCap: "Mid",
    description: "Commercial vehicle, tractor, car and construction equipment financiers",
    tickers: ["M&MFIN.NS", "SUNDARMFIN.NS", "POONAWALLA.NS", "MANAPPURAM.NS"]
  },
  {
    id: "gold-loan-nbfc",
    name: "NBFC - Gold Loans",
    sector: "Financials",
    marketCap: "Mid",
    description: "Retail and MSME loans pledged against gold jewellery",
    tickers: ["MUTHOOTFIN.NS", "MANAPPURAM.NS"]
  },
  {
    id: "microfinance-institutions",
    name: "Microfinance (MFI)",
    sector: "Financials",
    marketCap: "Small",
    description: "Joint-liability group microloans for rural and semi-urban women entrepreneurs",
    tickers: ["CREDITACC.NS", "SPANDANA.NS", "FUSION.NS"]
  },
  {
    id: "life-insurance",
    name: "Life Insurance Providers",
    sector: "Financials",
    marketCap: "Large",
    description: "Pure protection term, savings and unit-linked insurance giants",
    tickers: ["LICI.NS", "SBILIFE.NS", "HDFCLIFE.NS", "ICICIPRULI.NS"]
  },
  {
    id: "general-insurance",
    name: "General & Health Insurance",
    sector: "Financials",
    marketCap: "Mid",
    description: "Non-life insurance covering motor, health, fire and marine risks",
    tickers: ["ICICIGI.NS", "STARHEALTH.NS", "GICRE.NS", "NIACL.NS"]
  },
  {
    id: "asset-management-amc",
    name: "Asset Management Companies (AMC)",
    sector: "Financials",
    marketCap: "Mid",
    description: "Mutual fund asset management and portfolio investment companies",
    tickers: ["HDFCAMC.NS", "NAM-INDIA.NS", "UTIAMC.NS"]
  },
  {
    id: "exchanges-depositories",
    name: "Exchanges & Market Infrastructure",
    sector: "Financials",
    marketCap: "Mid",
    description: "Securities exchanges, central depositories and commodity trading bourses",
    tickers: ["BSE.NS", "CDSL.NS", "MCX.NS", "IEX.NS"]
  },
  {
    id: "broking-wealth-mgmt",
    name: "Broking & Wealth Management",
    sector: "Financials",
    marketCap: "Small",
    description: "Retail stockbrokers, financial planners and high-net-worth wealth advisories",
    tickers: ["MOTILALOFS.NS", "ANGELONE.NS", "IIFL.NS", "ANANDRATHI.NS", "5PAISA.NS"]
  },

  // --- Automobiles & Components ---
  {
    id: "auto-4w-commercial",
    name: "Auto - Passenger & Commercial Vehicles",
    sector: "Automotive",
    marketCap: "Large",
    description: "Leading manufacturers of cars, utility vehicles, trucks and buses",
    tickers: ["MARUTI.NS", "TATAMOTORS.NS", "M&M.NS", "ASHOKLEY.NS", "EICHERMOT.NS"]
  },
  {
    id: "auto-2w-3w",
    name: "Auto - 2 Wheelers & 3 Wheelers",
    sector: "Automotive",
    marketCap: "Large",
    description: "Motorcycles, scooters, electric two-wheelers and auto-rickshaws",
    tickers: ["BAJAJ-AUTO.NS", "HEROMOTOCO.NS", "TVSMOTOR.NS", "ATULAUTO.NS"]
  },
  {
    id: "auto-electric-mobility",
    name: "Auto - Electric Buses & Clean Mobility",
    sector: "Automotive",
    marketCap: "Small",
    description: "Electric bus manufacturers, chassis builders and green powertrains",
    tickers: ["OLECTRA.NS", "JBMMA.NS", "GREAVESCOT.NS"]
  },
  {
    id: "auto-tyres-rubber",
    name: "Auto Ancillaries - Tyres & Tubes",
    sector: "Automotive",
    marketCap: "Mid",
    description: "Off-highway, radial, passenger car and commercial tyre makers",
    tickers: ["MRF.NS", "BALKRISIND.NS", "APOLLOTYRE.NS", "CEATLTD.NS", "JKTYRE.NS"]
  },
  {
    id: "auto-batteries-storage",
    name: "Auto Ancillaries - Storage Batteries",
    sector: "Automotive",
    marketCap: "Small",
    description: "Lead-acid and advanced lithium battery storage manufacturers",
    tickers: ["EXIDEIND.NS", "AMARAJABAT.NS", "HBLPOWER.NS"]
  },
  {
    id: "auto-forgings-precision",
    name: "Auto Ancillaries - Forgings & Axles",
    sector: "Automotive",
    marketCap: "Mid",
    description: "Critical machined forgings, crank shafts, powertrain components",
    tickers: ["BHARATFORG.NS", "RKFORGE.NS", "MMFL.NS", "KALYANIFRG.NS"]
  },
  {
    id: "auto-wiring-electricals",
    name: "Auto Ancillaries - Wiring & Systems",
    sector: "Automotive",
    marketCap: "Large",
    description: "Automotive wiring harnesses, mirrors and electronic control units",
    tickers: ["MOTHERSON.NS", "BOSCHLTD.NS", "SONACOMS.NS", "ENDURANCE.NS"]
  },
  {
    id: "auto-castings-suspension",
    name: "Auto Ancillaries - Suspension & Castings",
    sector: "Automotive",
    marketCap: "Small",
    description: "Shock absorbers, aluminium die castings, braking and steering linkages",
    tickers: ["CRAFTSMAN.NS", "JAMNAAUTO.NS", "SUPRAJIT.NS", "GABRIEL.NS"]
  },
  {
    id: "auto-lighting-interiors",
    name: "Auto Ancillaries - Lighting & Interiors",
    sector: "Automotive",
    marketCap: "Small",
    description: "LED headlights, automotive switches, dashboard plastics and seats",
    tickers: ["LUMAXIND.NS", "FIEMIND.NS", "PRICOLLTD.NS", "SUBROS.NS"]
  },

  // --- Aerospace & Defence ---
  {
    id: "defense-aerospace-psu",
    name: "Defence - Aircraft & Avionics (PSU)",
    sector: "Capital Goods",
    marketCap: "Large",
    description: "Defense aircraft, radars, missile tracking systems and optical avionics",
    tickers: ["HAL.NS", "BEL.NS", "BDL.NS", "BEML.NS"]
  },
  {
    id: "defense-shipbuilders",
    name: "Defence - Naval Shipyards & Submarines",
    sector: "Capital Goods",
    marketCap: "Mid",
    description: "Warships, stealth frigates, patrol crafts and commercial docks",
    tickers: ["MAZDOCK.NS", "COCHINSHIP.NS", "GRSE.NS"]
  },
  {
    id: "defense-private-systems",
    name: "Defence - Private Components & Explosives",
    sector: "Capital Goods",
    marketCap: "Mid",
    description: "Drones, defense electronics, rocket propellants and missile subsystems",
    tickers: ["SOLARINDS.NS", "DATAPATTNS.NS", "PARAS.NS", "ZEN.NS", "MTARTECH.NS"]
  },

  // --- Infrastructure, Capital Goods & Engineering ---
  {
    id: "infra-epc-conglomerates",
    name: "Infrastructure - Mega EPC Conglomerates",
    sector: "Capital Goods",
    marketCap: "Large",
    description: "Heavy civil infrastructure, ports, metros, flyovers and industrial EPC",
    tickers: ["LT.NS", "GMRINFRA.NS", "IRB.NS", "PNCINFRA.NS", "KNRCON.NS"]
  },
  {
    id: "railways-wagons-tracks",
    name: "Railways - Wagons & Infrastructure",
    sector: "Capital Goods",
    marketCap: "Mid",
    description: "Locomotives, freight wagons, high-speed rail tracks and signaling",
    tickers: ["TITAGARH.NS", "JUPITERWAG.NS", "RVNL.NS", "IRCON.NS", "TEXRAIL.NS"]
  },
  {
    id: "power-transmission-equipment",
    name: "Power T&D Equipment & Towers",
    sector: "Capital Goods",
    marketCap: "Mid",
    description: "Transmission towers, substation engineering, power conductors and cables",
    tickers: ["KEC.NS", "KALPATPOWR.NS", "APARINDS.NS", "POWERMECH.NS"]
  },
  {
    id: "cables-wires-industrial",
    name: "Cables & Wires (Industrial & Consumer)",
    sector: "Capital Goods",
    marketCap: "Mid",
    description: "High tension power cables, house wires and instrumentation cabling",
    tickers: ["POLYCAB.NS", "KEI.NS", "FINCABLES.NS", "RRKABEL.NS"]
  },
  {
    id: "heavy-electricals-turbines",
    name: "Heavy Electricals & Turbines",
    sector: "Capital Goods",
    marketCap: "Large",
    description: "Turbines, boilers, industrial automation and grid transformers",
    tickers: ["BHEL.NS", "SIEMENS.NS", "ABB.NS", "THERMAX.NS"]
  },
  {
    id: "transformers-switchgears",
    name: "Transformers & Switchgear Systems",
    sector: "Capital Goods",
    marketCap: "Small",
    description: "Power transformers, distribution transformers and switchgear protection",
    tickers: ["VOLTAMP.NS", "TRIL.NS", "SCHNEIDER.NS", "HITACHIENG.NS"]
  },
  {
    id: "industrial-bearings",
    name: "Bearings & Friction Management",
    sector: "Capital Goods",
    marketCap: "Mid",
    description: "Precision roller bearings, ball bearings for railways, wind and auto",
    tickers: ["TIMKEN.NS", "SKFINDIA.NS", "SCHAEFFLER.NS", "NRBBEARING.NS"]
  },
  {
    id: "industrial-machinery-pumps",
    name: "Pumps, Valves & Fluid Engineering",
    sector: "Capital Goods",
    marketCap: "Small",
    description: "Agricultural submersibles, industrial slurry pumps and process valves",
    tickers: ["KSB.NS", "KIRLOSENG.NS", "ROTO.NS", "RITES.NS"]
  },
  {
    id: "abrasives-industrial-ceramics",
    name: "Abrasives & Industrial Ceramics",
    sector: "Capital Goods",
    marketCap: "Mid",
    description: "Grinding wheels, coated abrasives, electro-minerals and super-refractories",
    tickers: ["CARBORUNIV.NS", "GRINDWELL.NS", "WENDT.NS"]
  },

  // --- Metals & Mining ---
  {
    id: "steel-primary-producers",
    name: "Steel - Primary Integrated Producers",
    sector: "Metals & Mining",
    marketCap: "Large",
    description: "Integrated blast furnace steel plants manufacturing hot & cold rolled coils",
    tickers: ["TATASTEEL.NS", "JSWSTEEL.NS", "JINDALSTEL.NS", "SAIL.NS"]
  },
  {
    id: "steel-pipes-tubes",
    name: "Steel - Structural Pipes & Tubes",
    sector: "Metals & Mining",
    marketCap: "Mid",
    description: "Hollow section pipes, ERW water conduits and high-pressure oil pipelines",
    tickers: ["APLAPOLLO.NS", "RATNAMANI.NS", "WELCORP.NS", "SURYAROSNI.NS"]
  },
  {
    id: "metals-aluminum",
    name: "Metals - Aluminum Producers",
    sector: "Metals & Mining",
    marketCap: "Large",
    description: "Bauxite refiners, primary aluminum smelters and rolled downstream foils",
    tickers: ["HINDALCO.NS", "NATIONALUM.NS"]
  },
  {
    id: "metals-copper-zinc",
    name: "Metals - Copper, Zinc & Lead",
    sector: "Metals & Mining",
    marketCap: "Large",
    description: "Smelting and refining of zinc concentrates, silver and refined copper",
    tickers: ["VEDL.NS", "HINDZINC.NS", "HINDCOPPER.NS"]
  },
  {
    id: "mining-coal-iron-ore",
    name: "Mining - Coal & Iron Ore",
    sector: "Metals & Mining",
    marketCap: "Large",
    description: "Thermal coal extraction, iron ore pellets and lignite extraction",
    tickers: ["COALINDIA.NS", "NMDC.NS", "MOIL.NS", "GMDC.NS"]
  },
  {
    id: "ferro-alloys-recycling",
    name: "Ferro Alloys & Metal Recycling",
    sector: "Metals & Mining",
    marketCap: "Small",
    description: "Silico-manganese, ferro-chrome and sustainable non-ferrous lead recycling",
    tickers: ["GRAVITA.NS", "SHYAMMETL.NS", "MASTEEL.NS"]
  },

  // --- Chemicals & Petrochemicals ---
  {
    id: "specialty-chemicals-agrochemicals",
    name: "Chemicals - Agrochemicals & Crop Protection",
    sector: "Chemicals",
    marketCap: "Mid",
    description: "Herbicides, insecticides, fungicides and patented custom synthesis",
    tickers: ["PIIND.NS", "UPL.NS", "COROMANDEL.NS", "BAYERCROP.NS", "SUMICHEM.NS"]
  },
  {
    id: "specialty-chemicals-fluorine",
    name: "Chemicals - Fluorochemicals & Refrigerants",
    sector: "Chemicals",
    marketCap: "Mid",
    description: "Fluoropolymer resins, battery electrolytes and next-gen cooling refrigerants",
    tickers: ["SRF.NS", "NAVINFLUOR.NS", "GUJFLUORO.NS"]
  },
  {
    id: "specialty-chemicals-fine-aroma",
    name: "Chemicals - Specialty Intermediates & Fine Chem",
    sector: "Chemicals",
    marketCap: "Mid",
    description: "Benzene derivatives, specialty aroma compounds and green clean chemistry",
    tickers: ["AARTIIND.NS", "ATUL.NS", "VINATIORGA.NS", "CLEAN.NS", "FINEORG.NS"]
  },
  {
    id: "chemicals-caustic-soda-alkali",
    name: "Chemicals - Chlor-Alkali & Soda Ash",
    sector: "Chemicals",
    marketCap: "Mid",
    description: "Caustic soda lye, chlorine derivatives, calcium chloride and soda ash",
    tickers: ["TATACHEM.NS", "DEEPAKNTR.NS", "GHCL.NS", "DCMSRIRAM.NS"]
  },
  {
    id: "chemicals-dyes-pigments",
    name: "Chemicals - Dyes, Pigments & Colors",
    sector: "Chemicals",
    marketCap: "Small",
    description: "Organic pigments, textile reactive dyes and plastic colorants",
    tickers: ["SUDARSCHEM.NS", "BODALCHEM.NS", "MEGH.NS", "ASAHISONG.NS"]
  },
  {
    id: "polymers-plastic-pipes",
    name: "Polymers - Plastic Pipes & Fittings",
    sector: "Building Materials",
    marketCap: "Mid",
    description: "CPVC, UPVC plumbing pipes, agriculture drainage and water storage tanks",
    tickers: ["ASTRAL.NS", "SUPREMEIND.NS", "FINOLEXIND.NS", "PRINCEPIPE.NS"]
  },
  {
    id: "industrial-gases-fertilizers",
    name: "Industrial Gases & Complex Fertilizers",
    sector: "Chemicals",
    marketCap: "Mid",
    description: "Liquid oxygen, nitrogen, argon gas and nitrogenous chemical plant fertilizers",
    tickers: ["LINDEINDIA.NS", "DEEPAKFERT.NS", "CHAMBLFERT.NS", "GNFC.NS", "GSFC.NS"]
  },

  // --- Pharmaceuticals & Healthcare ---
  {
    id: "pharma-large-global",
    name: "Pharma - Large Cap Global Formulations",
    sector: "Healthcare",
    marketCap: "Large",
    description: "US generics, complex injectables and multinational formulations",
    tickers: ["SUNPHARMA.NS", "DRREDDY.NS", "CIPLA.NS", "DIVISLAB.NS", "LUPIN.NS"]
  },
  {
    id: "pharma-domestic-formulations",
    name: "Pharma - Mid Cap & Domestic Formulations",
    sector: "Healthcare",
    marketCap: "Mid",
    description: "Branded acute and chronic medicine formulations in Indian domestic market",
    tickers: ["MANKIND.NS", "TORNTPHARM.NS", "ALKEM.NS", "ZYDUSLIFE.NS", "ABBOTINDIA.NS"]
  },
  {
    id: "pharma-api-bulk-drugs",
    name: "Pharma - Active Pharmaceutical Ingredients (API)",
    sector: "Healthcare",
    marketCap: "Mid",
    description: "High-volume active bulk drugs, key starting materials and intermediate exports",
    tickers: ["LAURUSLABS.NS", "GRANULES.NS", "AARTIPHARM.NS", "NEULANDLAB.NS"]
  },
  {
    id: "pharma-cdmo-crams",
    name: "Pharma - CDMO & Clinical Research",
    sector: "Healthcare",
    marketCap: "Mid",
    description: "Contract development & manufacturing for global biotech innovators",
    tickers: ["SYNGENE.NS", "SUVENPHAR.NS", "PIRAMALPH.NS"]
  },
  {
    id: "hospitals-healthcare-services",
    name: "Hospitals & Multi-Specialty Chains",
    sector: "Healthcare",
    marketCap: "Large",
    description: "Tertiary care hospitals, oncology, cardiology and emergency bed networks",
    tickers: ["APOLLOHOSP.NS", "MAXHEALTH.NS", "FORTIS.NS", "MEDANTA.NS", "NH.NS"]
  },
  {
    id: "diagnostics-pathology",
    name: "Diagnostics & Pathology Chains",
    sector: "Healthcare",
    marketCap: "Mid",
    description: "Diagnostic laboratories, blood testing, pathology and MRI radiology centers",
    tickers: ["LALPATHLAB.NS", "METROPOLIS.NS", "VIJAYA.NS", "THYROCARE.NS"]
  },
  {
    id: "medical-devices-consumables",
    name: "Medical Devices & Laboratory Consumables",
    sector: "Healthcare",
    marketCap: "Small",
    description: "Disposable IV cannulas, blood bags, pipettes and plastic labware",
    tickers: ["POLYMED.NS", "TARSONS.NS"]
  },

  // --- FMCG & Consumer Staples ---
  {
    id: "fmcg-large-diversified",
    name: "FMCG - Diversified Giants",
    sector: "Consumer Staples",
    marketCap: "Large",
    description: "Household staples, soaps, oral hygiene, foods and tea distribution giants",
    tickers: ["HINDUNILVR.NS", "ITC.NS", "NESTLEIND.NS", "BRITANNIA.NS"]
  },
  {
    id: "fmcg-personal-care-hair",
    name: "FMCG - Personal Care & Hair Oils",
    sector: "Consumer Staples",
    marketCap: "Large",
    description: "Ayurvedic products, edible coconut hair oil, skincare and deodorants",
    tickers: ["MARICO.NS", "DABUR.NS", "GODREJCP.NS", "EMAMILTD.NS", "COLPAL.NS"]
  },
  {
    id: "fmcg-foods-edible-oils",
    name: "FMCG - Edible Oils & Packaged Foods",
    sector: "Consumer Staples",
    marketCap: "Mid",
    description: "Mustard, sunflower oils, basmati rice, soya chunks and packed flour",
    tickers: ["AWL.NS", "PATANJALI.NS", "KRBL.NS", "LTFOODS.NS"]
  },
  {
    id: "dairy-milk-products",
    name: "Dairy & Value-Added Milk Products",
    sector: "Consumer Staples",
    marketCap: "Small",
    description: "Pasteurized pouch milk, curd, paneer, ice-cream and whey products",
    tickers: ["HATSUN.NS", "DODLA.NS", "HERITGFOOD.NS", "PARAGMILK.NS"]
  },
  {
    id: "beverages-soft-drinks-bottling",
    name: "Beverages - Soft Drinks & Bottling",
    sector: "Consumer Staples",
    marketCap: "Large",
    description: "Carbonated beverages, juices and packaged drinking water bottling franchises",
    tickers: ["VBL.NS"]
  },
  {
    id: "alcoholic-beverages-spirits",
    name: "Alcoholic Beverages - Spirits & Breweries",
    sector: "Consumer Discretionary",
    marketCap: "Mid",
    description: "Indian made foreign liquor, single malts, craft beer and premium wines",
    tickers: ["UNITDSPR.NS", "UBL.NS", "RADICO.NS", "SULA.NS", "GLOBUSSPR.NS"]
  },
  {
    id: "tobacco-cigarettes",
    name: "Tobacco & Cigarettes",
    sector: "Consumer Staples",
    marketCap: "Large",
    description: "Filter cigarettes, unmanufactured tobacco exports and smoking mixtures",
    tickers: ["ITC.NS", "GODFRYPHLP.NS", "VSTIND.NS"]
  },
  {
    id: "tea-coffee-plantations",
    name: "Agri Commodities - Tea & Coffee Exporters",
    sector: "Consumer Staples",
    marketCap: "Small",
    description: "Instant spray-dried coffee, freeze-dried granules and tea leaf estates",
    tickers: ["CCL.NS", "TATACOFFEE.NS", "MCLEODRUSS.NS"]
  },

  // --- Consumer Discretionary, Retail & Apparel ---
  {
    id: "consumer-durables-appliances",
    name: "Consumer Durables - Cooling & Kitchen",
    sector: "Consumer Discretionary",
    marketCap: "Large",
    description: "Inverter ACs, refrigerators, water heaters, fans and smart appliances",
    tickers: ["HAVELLS.NS", "VOLTAS.NS", "BLUESTARCO.NS", "CROMPTON.NS", "WHIRLPOOL.NS"]
  },
  {
    id: "kitchenware-cookware",
    name: "Kitchenware & Cookware",
    sector: "Consumer Discretionary",
    marketCap: "Small",
    description: "Pressure cookers, non-stick frying pans, mixer grinders and gas stoves",
    tickers: ["TTKPRESTIG.NS", "HAWKINS.NS", "STOVEKRAFT.NS", "BUTTERFLY.NS"]
  },
  {
    id: "gems-jewellery",
    name: "Gems & Branded Jewellery",
    sector: "Consumer Discretionary",
    marketCap: "Large",
    description: "Gold, diamond and wedding jewellery retail chains across India",
    tickers: ["TITAN.NS", "KALYANKJIL.NS", "SENCO.NS", "RAJESHEXPO.NS"]
  },
  {
    id: "footwear-leather-athletic",
    name: "Footwear - Casual, Formal & Athletic",
    sector: "Consumer Discretionary",
    marketCap: "Mid",
    description: "Leather formals, EVA slippers, school shoes and sports sneakers",
    tickers: ["BATAINDIA.NS", "RELAXO.NS", "METROBRAND.NS", "CAMPUS.NS", "REDTAPE.NS"]
  },
  {
    id: "apparel-fashion-retail",
    name: "Apparel & Lifestyle Retail Chains",
    sector: "Consumer Discretionary",
    marketCap: "Large",
    description: "Fast-fashion hypermarkets, multi-brand department stores and ethnic wear",
    tickers: ["TRENT.NS", "ABFRL.NS", "VMART.NS", "SHOPERSTOP.NS"]
  },
  {
    id: "textiles-spinning-garments",
    name: "Textiles - Spinning, Denim & Home Textiles",
    sector: "Consumer Discretionary",
    marketCap: "Mid",
    description: "Innerwear inner garments, terry towels, bedsheets and combed cotton yarn",
    tickers: ["PAGEIND.NS", "KPRMILL.NS", "TRIDENT.NS", "RAYMOND.NS", "VARDMNPOLY.NS"]
  },
  {
    id: "quick-service-restaurants-qsr",
    name: "Quick Service Restaurants (QSR)",
    sector: "Consumer Discretionary",
    marketCap: "Mid",
    description: "Pizza delivery franchises, burger chains, fried chicken and cafe outlets",
    tickers: ["JUBLFOOD.NS", "DEVYANI.NS", "WESTLIFE.NS", "SAPPHIRE.NS", "BARBEQUE.NS"]
  },
  {
    id: "luggage-travel-accessories",
    name: "Luggage & Travel Bags",
    sector: "Consumer Discretionary",
    marketCap: "Small",
    description: "Polycarbonate hard-trolleys, soft backpacks and duffel travel gear",
    tickers: ["VIPIND.NS", "SAFARI.NS"]
  },
  {
    id: "watches-eyewear-luxury",
    name: "Watches, Eyewear & Luxury Goods",
    sector: "Consumer Discretionary",
    marketCap: "Mid",
    description: "Smartwatches, quartz analogue timepieces and swiss luxury retail boutiques",
    tickers: ["TITAN.NS", "ETHOSLTD.NS"]
  },

  // --- Real Estate, Cement & Building Materials ---
  {
    id: "real-estate-tier1-developers",
    name: "Real Estate - Tier-1 Residential & Commercial",
    sector: "Real Estate",
    marketCap: "Large",
    description: "Premium high-rise apartments, luxury villas, cyber parks and malls",
    tickers: ["DLF.NS", "LODHA.NS", "GODREJPROP.NS", "OBEROIRLTY.NS", "PRESTIGE.NS"]
  },
  {
    id: "real-estate-regional-affordable",
    name: "Real Estate - South & Regional Developers",
    sector: "Real Estate",
    marketCap: "Mid",
    description: "Mid-income homes, township development in Bengaluru, Pune and Mumbai",
    tickers: ["SOBHA.NS", "BRIGADE.NS", "KOLTEPATIL.NS", "SUNTECK.NS"]
  },
  {
    id: "cement-large-cap-giants",
    name: "Cement - Pan India Producers (Large Cap)",
    sector: "Building Materials",
    marketCap: "Large",
    description: "Clinker grinding and grey portland cement giants with pan-India supply",
    tickers: ["ULTRACEMCO.NS", "AMBUJACEM.NS", "ACC.NS", "SHREECEM.NS"]
  },
  {
    id: "cement-regional-south-north",
    name: "Cement - Regional Mid Cap Producers",
    sector: "Building Materials",
    marketCap: "Mid",
    description: "Southern, Eastern and Northern region cement grinding units",
    tickers: ["DALBHARAT.NS", "JKCEMENT.NS", "RAMCOCEM.NS", "BIRLACORPN.NS", "STARCEMENT.NS"]
  },
  {
    id: "tiles-sanitaryware-ceramics",
    name: "Ceramic Tiles & Bathroom Sanitaryware",
    sector: "Building Materials",
    marketCap: "Mid",
    description: "Vitrified floor tiles, wall ceramics, washbasins and chrome bathroom taps",
    tickers: ["KAJARIACER.NS", "SOMANYCERA.NS", "CERA.NS"]
  },
  {
    id: "paints-coatings",
    name: "Paints, Varnishes & Protective Coatings",
    sector: "Building Materials",
    marketCap: "Large",
    description: "Architectural decorative emulsions, wood finishes and industrial primers",
    tickers: ["ASIANPAINT.NS", "BERGEPAINT.NS", "KANSAINER.NS", "AKZOINDIA.NS", "INDIGOPNTS.NS"]
  },
  {
    id: "plywood-laminates-mdf",
    name: "Plywood, MDF Boards & Laminates",
    sector: "Building Materials",
    marketCap: "Small",
    description: "Calibrated marine plywood, decorative veneer mica and medium-density fiberboards",
    tickers: ["CENTURYPLY.NS", "GREENLAM.NS", "GREENPANEL.NS", "GREENPLY.NS"]
  },
  {
    id: "architectural-glass",
    name: "Glass - Automotive & Architectural",
    sector: "Building Materials",
    marketCap: "Small",
    description: "Laminated windshields, tempered facade float glass and glassware",
    tickers: ["ASAHIINDIA.NS", "BOROLTD.NS", "LAOPALA.NS"]
  },

  // --- Energy, Oil, Gas & Utilities ---
  {
    id: "oil-exploration-refining-omc",
    name: "Oil - Exploration & Refining (OMCs)",
    sector: "Energy",
    marketCap: "Large",
    description: "Upstream crude drilling, petroleum refining and petrol pump distribution",
    tickers: ["RELIANCE.NS", "ONGC.NS", "OIL.NS", "IOC.NS", "BPCL.NS", "HPCL.NS"]
  },
  {
    id: "city-gas-distribution-cgd",
    name: "City Gas Distribution (CNG & PNG)",
    sector: "Energy",
    marketCap: "Mid",
    description: "Piped domestic kitchen gas and compressed natural gas vehicle filling pumps",
    tickers: ["IGL.NS", "MGL.NS", "GUJGASLTD.NS", "ATGL.NS"]
  },
  {
    id: "natural-gas-transmission-lng",
    name: "Gas Transmission & LNG Regasification",
    sector: "Energy",
    marketCap: "Large",
    description: "Cross-country natural gas pipeline network and imported LNG cryogenic tanks",
    tickers: ["GAIL.NS", "PETRONET.NS", "GSPL.NS"]
  },
  {
    id: "power-generation-thermal-hydro",
    name: "Power Generation - Conventional & Thermal",
    sector: "Utilities",
    marketCap: "Large",
    description: "Coal-fired thermal power stations, river hydroelectric plants and merchant power",
    tickers: ["NTPC.NS", "TATAPOWER.NS", "JSWENERGY.NS", "NHPC.NS", "SJVN.NS"]
  },
  {
    id: "power-renewable-green-energy",
    name: "Power Generation - Solar & Wind Energy",
    sector: "Utilities",
    marketCap: "Mid",
    description: "Utility scale solar parks, wind turbine generators and green hydrogen",
    tickers: ["ADANIGREEN.NS", "SUZLON.NS", "INOXWIND.NS", "BORORENEW.NS"]
  },
  {
    id: "power-transmission-grid",
    name: "Power Transmission & Grid Utilities",
    sector: "Utilities",
    marketCap: "Large",
    description: "Central high-voltage transmission lines connecting regional grids",
    tickers: ["POWERGRID.NS"]
  },

  // --- Logistics, Shipping & Transport ---
  {
    id: "ports-maritime-cargo",
    name: "Ports & Marine Infrastructure",
    sector: "Logistics",
    marketCap: "Large",
    description: "Deep-water commercial container ports, bulk cargo docks and logistics hubs",
    tickers: ["ADANIPORTS.NS", "JSWINFRA.NS", "GPPL.NS"]
  },
  {
    id: "express-logistics-surface",
    name: "Logistics - Express Courier & 3PL",
    sector: "Logistics",
    marketCap: "Mid",
    description: "E-commerce parcel express delivery, aviation freight and supply chain warehousing",
    tickers: ["DELHIVERY.NS", "BLUEDART.NS", "TCIEXP.NS", "MAHLOG.NS"]
  },
  {
    id: "freight-multimodal-rail",
    name: "Logistics - Rail Freight & Container ICDs",
    sector: "Logistics",
    marketCap: "Mid",
    description: "Inland container depots, dedicated railway freight wagons and transport terminals",
    tickers: ["CONCOR.NS", "ALLCARGO.NS", "TCI.NS", "VRLLOG.NS"]
  },
  {
    id: "shipping-tankers-bulk",
    name: "Shipping - Crude Tankers & Offshore Vessels",
    sector: "Logistics",
    marketCap: "Small",
    description: "Suezmax crude oil tankers, offshore rig support tugs and bulk dry carriers",
    tickers: ["GESHIP.NS", "SCI.NS", "DREDGECORP.NS"]
  },
  {
    id: "aviation-airlines",
    name: "Aviation - Passenger Airlines",
    sector: "Transportation",
    marketCap: "Large",
    description: "Domestic and international budget air passenger carriers",
    tickers: ["INDIGO.NS", "SPICEJET.NS"]
  },

  // --- Hospitality, Travel & Tourism ---
  {
    id: "hotels-luxury-hospitality",
    name: "Hotels - Luxury Resorts & Heritage Palaces",
    sector: "Hospitality",
    marketCap: "Large",
    description: "5-star luxury hotels, corporate suites, destination wedding resorts",
    tickers: ["INDHOTEL.NS", "EIHOTEL.NS", "CHALET.NS", "LEMONTREE.NS"]
  },
  {
    id: "travel-platforms-tourism",
    name: "Travel Booking Portals & Ticketing",
    sector: "Hospitality",
    marketCap: "Small",
    description: "Online flight, train, bus and hotel booking engines and package tours",
    tickers: ["EASEMYTRIP.NS", "YATRA.NS", "THOMASCOOK.NS"]
  },
  {
    id: "entertainment-amusement-parks",
    name: "Entertainment - Amusement & Theme Parks",
    sector: "Hospitality",
    marketCap: "Small",
    description: "Water theme parks, dry rides and family recreation entertainment resorts",
    tickers: ["WONDERLA.NS"]
  },

  // --- Media & Entertainment ---
  {
    id: "multiplexes-film-exhibition",
    name: "Multiplexes & Cinema Exhibition",
    sector: "Media",
    marketCap: "Mid",
    description: "IMAX, 4DX and multiplex silver screens across metro shopping malls",
    tickers: ["PVRINOX.NS"]
  },
  {
    id: "media-broadcasting-television",
    name: "Media - Satellite TV Broadcasting & OTT",
    sector: "Media",
    marketCap: "Mid",
    description: "Satellite television channels, streaming apps and vernacular media broadcasting",
    tickers: ["ZEEL.NS", "SUNTV.NS", "NETWORK18.NS", "TV18BRDCST.NS"]
  },
  {
    id: "publishing-print-media",
    name: "Print Media & Digital News Publishing",
    sector: "Media",
    marketCap: "Small",
    description: "Daily vernacular newspapers, periodicals and digital news portals",
    tickers: ["DBCORP.NS", "JAGRAN.NS", "HTMEDIA.NS"]
  },

  // --- Agriculture, Sugar & Biofuels ---
  {
    id: "sugar-bioethanol-distilleries",
    name: "Sugar Mills, Ethanol & Green Biofuels",
    sector: "Agriculture",
    marketCap: "Small",
    description: "Sugarcane crushing, power co-generation and fuel-grade bioethanol distillation",
    tickers: ["BALRAMCHIN.NS", "TRIVENI.NS", "EIDPARRY.NS", "RENUKA.NS", "PRAJIND.NS"]
  },
  {
    id: "seeds-hybrid-agri",
    name: "Seeds & Hybrid Agricultural Genetics",
    sector: "Agriculture",
    marketCap: "Small",
    description: "High-yield cotton, maize, paddy and sunflower hybrid seeds",
    tickers: ["KAVERI.NS", "MANGALAM.NS"]
  },

  // --- Paper & Packaging ---
  {
    id: "paper-wood-pulp",
    name: "Paper - Writing, Printing & Copier Sheets",
    sector: "Paper & Forest",
    marketCap: "Small",
    description: "Virgin wood pulp paper, office A4 copier reams and packaging paperboards",
    tickers: ["JKPAPER.NS", "WESTCOAST.NS", "ANDHRAPAP.NS", "TNPL.NS"]
  },
  {
    id: "packaging-flexible-films",
    name: "Packaging - Flexible BOPET & BOPP Films",
    sector: "Packaging",
    marketCap: "Small",
    description: "Barrier packaging films for food, pharmaceuticals and electronic wrapping",
    tickers: ["POLYPLEX.NS", "JINDALPOLY.NS", "TCPLPACK.NS", "HUHTAMAKI.NS"]
  },

  // --- Professional & Industrial Services ---
  {
    id: "staffing-recruitment-services",
    name: "Staffing, Security & Corporate Facilities",
    sector: "Services",
    marketCap: "Small",
    description: "Contract workforce staffing, corporate security guarding and facility cleaning",
    tickers: ["QUESS.NS", "TEAMLEASE.NS", "SIS.NS"]
  },
  {
    id: "water-waste-treatment",
    name: "Water Engineering & Effluent Treatment",
    sector: "Utilities",
    marketCap: "Small",
    description: "Sea water desalination, municipal sewage treatment and industrial effluent plants",
    tickers: ["WABAG.NS", "IONEXCHANG.NS"]
  },
  {
    id: "plastic-products-moulded",
    name: "Plastic Moulded Furniture & Crates",
    sector: "Consumer Discretionary",
    marketCap: "Small",
    description: "Moulded plastic chairs, industrial material crates and packaging drums",
    tickers: ["NILKAMAL.NS", "TIMETECHNO.NS", "RESPONIND.NS"]
  },

  // --- Specialised Industrial Niches ---
  {
    id: "specialty-industrial-greases",
    name: "Lubricants & Industrial Greases",
    sector: "Petrochemicals",
    marketCap: "Mid",
    description: "Automotive engine oils, synthetic transmission fluids and high-temp greases",
    tickers: ["CASTROLIND.NS", "GULFOILLUB.NS", "TIDEWATER.NS"]
  },
  {
    id: "rubber-hoses-conveyors",
    name: "Rubber Products - Conveyors & Industrial Belts",
    sector: "Industrial",
    marketCap: "Small",
    description: "Mining conveyor belts, hydraulic rubber hoses and automotive transmission v-belts",
    tickers: ["PIXTRANS.NS", "INDRATING.NS", "HINDCOMPOS.NS"]
  },
  {
    id: "industrial-insulators-refractories",
    name: "Refractories & High Temperature Linings",
    sector: "Industrial",
    marketCap: "Small",
    description: "Fireclay bricks, monolithic refractories for steel and cement furnace kilns",
    tickers: ["RHI.NS", "VESUVIUS.NS", "IFGLEXPOR.NS"]
  },
  {
    id: "pipes-ductile-iron",
    name: "Ductile Iron Pipes & Water Supply Infrastructure",
    sector: "Industrial",
    marketCap: "Small",
    description: "Centrifugally cast ductile iron pipes for drinking water and sewerage networks",
    tickers: ["ELECTCAST.NS", "JINDALSAW.NS", "TATASTEELSL.NS"]
  },
  {
    id: "construction-equip-cranes",
    name: "Construction Equipment & Heavy Mobile Cranes",
    sector: "Capital Goods",
    marketCap: "Small",
    description: "Pick and carry hydraulic cranes, road compactors and tower cranes",
    tickers: ["ACE.NS", "ESCORTS.NS"]
  },
  {
    id: "power-diesel-gensets",
    name: "Diesel Engines & Standby Power Generators",
    sector: "Capital Goods",
    marketCap: "Mid",
    description: "Heavy duty diesel engines, backup gensets for telecom and hospital complexes",
    tickers: ["CUMMINSIND.NS", "KIRLOSENG.NS"]
  },
  {
    id: "specialty-gas-valves",
    name: "Precision Gas Regulators & Industrial Valves",
    sector: "Industrial",
    marketCap: "Small",
    description: "Safety pressure valves, cryogenic valves and cryogenic liquid tank containers",
    tickers: ["INOXINDIA.NS", "ROTO.NS"]
  },
  {
    id: "agro-tractors-farm",
    name: "Agricultural Tractors & Farm Mechanization",
    sector: "Automotive",
    marketCap: "Mid",
    description: "Farm tractors, rotavators, power tillers and combine harvesters",
    tickers: ["M&M.NS", "ESCORTS.NS", "VSTTILLERS.NS"]
  },
  {
    id: "chemical-aromatics-benzene",
    name: "Petrochemicals - Benzene & Pure Aromatics",
    sector: "Chemicals",
    marketCap: "Mid",
    description: "Purified terephthalic acid, phenol, acetone and linear alkyl benzene",
    tickers: ["DEEPAKNTR.NS", "TIRUMALCHM.NS", "IGPETRO.NS"]
  },
  {
    id: "packaging-tin-metal",
    name: "Metal Cans & Tin Packaging",
    sector: "Packaging",
    marketCap: "Small",
    description: "Electrolytic tinplate sheets, edible oil metal cans and pesticide containers",
    tickers: ["TINPLATE.NS", "BALKRISHNA.NS"]
  },
  {
    id: "education-edtech-services",
    name: "Education & Coaching Services",
    sector: "Services",
    marketCap: "Small",
    description: "Coaching centers, test-preparation and vocational skill development",
    tickers: ["CAREERP.NS", "ZEELEARN.NS"]
  },
  {
    id: "renewable-solar-glass",
    name: "Renewable Energy - Solar PV Glass",
    sector: "Utilities",
    marketCap: "Small",
    description: "Textured anti-reflective tempered glass for solar photovoltaic panels",
    tickers: ["BORORENEW.NS"]
  },
  {
    id: "defense-electronic-warfare",
    name: "Defence - Radar & Countermeasure Systems",
    sector: "Capital Goods",
    marketCap: "Mid",
    description: "Electromagnetic jamming, radar interceptors and weapon guidance modules",
    tickers: ["BEL.NS", "ASTRON.NS", "DATAPATTNS.NS"]
  },
  {
    id: "rail-safety-signaling",
    name: "Railways - Train Collision Avoidance & Signalling",
    sector: "Capital Goods",
    marketCap: "Small",
    description: "Kavach automatic train protection systems and electronic interlocking",
    tickers: ["KERNEX.NS", "HBLPOWER.NS"]
  },
  {
    id: "logistics-cold-chain",
    name: "Logistics - Temperature Controlled Cold Storage",
    sector: "Logistics",
    marketCap: "Small",
    description: "Refrigerated transport trucks and multi-temperature pharmaceutical cold rooms",
    tickers: ["SNOWMAN.NS"]
  },
  {
    id: "industrial-fasteners",
    name: "Fasteners - High Tensile Bolts & Nuts",
    sector: "Industrial",
    marketCap: "Small",
    description: "Cold forged structural bolts, nuts and precision automotive fasteners",
    tickers: ["SUNDRMFAST.NS", "STERTOOLS.NS"]
  },
  {
    id: "financial-micro-insurance",
    name: "Credit Bureau & Financial Analytics",
    sector: "Financials",
    marketCap: "Mid",
    description: "Retail credit scores, risk underwriting APIs and fraud monitoring bourses",
    tickers: ["CRISIL.NS", "ICRA.NS", "CAREERP.NS"]
  },
  {
    id: "auto-transmission-gears",
    name: "Auto Ancillaries - Transmission Gears",
    sector: "Automotive",
    marketCap: "Small",
    description: "Bevel gears, synchromesh rings and automotive differential assemblies",
    tickers: ["BHARATGEAR.NS", "GNA.NS", "SHARDAMOTR.NS"]
  },
  {
    id: "steel-specialty-alloys",
    name: "Specialty Alloy Steels & Stainless Steel",
    sector: "Metals & Mining",
    marketCap: "Mid",
    description: "Austenitic stainless steel sheets, seamless pipes and aerospace grade nickel alloys",
    tickers: ["JINDALSTEL.NS", "MIDHANI.NS", "MUKANDLTD.NS"]
  },
  {
    id: "agri-organic-tea",
    name: "Tea Plantations & Orthodox Exports",
    sector: "Agriculture",
    marketCap: "Small",
    description: "Assam and Darjeeling single-estate orthodox black and green teas",
    tickers: ["JAYAGRO.NS", "ROSSERLTD.NS", "GOODRICKE.NS"]
  },
  {
    id: "industrial-textiles-yarn",
    name: "Technical Textiles & Geotextiles",
    sector: "Industrial",
    marketCap: "Small",
    description: "High-tenacity tire cord fabric, canal lining geomembranes and airbags",
    tickers: ["SRF.NS", "GARFIBRES.NS"]
  },
  {
    id: "marine-processed-seafood",
    name: "Processed Marine Foods & Shrimp Hatcheries",
    sector: "Consumer Staples",
    marketCap: "Small",
    description: "Frozen vannamei shrimp exports, aquaculture feeds and hatcheries",
    tickers: ["AVANTIFEED.NS", "APEX.NS", "WATERBASE.NS"]
  },
  {
    id: "hospitality-timeshare-resorts",
    name: "Hospitality - Timeshare & Vacation Clubs",
    sector: "Hospitality",
    marketCap: "Small",
    description: "Family holiday timeshare memberships and eco-resort retreats",
    tickers: ["MAHINDCIE.NS", "STERLTD.NS"]
  },
  {
    id: "plastic-multi-layer-films",
    name: "Plastics - Polymer Compounding & Masterbatches",
    sector: "Chemicals",
    marketCap: "Small",
    description: "Color masterbatches, engineering plastics and filler compounds",
    tickers: ["PLASTIBLEN.NS", "PODDAR.NS"]
  },
  {
    id: "pharma-veterinary-animal",
    name: "Pharma - Animal Health & Veterinary Formulations",
    sector: "Healthcare",
    marketCap: "Small",
    description: "Livestock antibiotics, cattle feed supplements and poultry medicines",
    tickers: ["HESTERBIO.NS", "SEQUENT.NS"]
  },
  {
    id: "heavy-earthmoving-mining-machinery",
    name: "Heavy Earthmoving & Dump Trucks",
    sector: "Capital Goods",
    marketCap: "Mid",
    description: "Hydraulic excavators, heavy mining dump trucks and bulldozers",
    tickers: ["BEML.NS"]
  },
  {
    id: "mining-diamonds-rare-minerals",
    name: "Mineral Sands & Rare Earth Minerals",
    sector: "Metals & Mining",
    marketCap: "Small",
    description: "Ilmenite, rutile sands, zircon and rare earth mineral processing",
    tickers: ["GMDC.NS", "NMDC.NS"]
  },
  {
    id: "printing-security-currency",
    name: "Security Software & Digital Token Services",
    sector: "Information Technology",
    marketCap: "Small",
    description: "Digital signature certificates, public key infrastructure (PKI) and cybersecurity",
    tickers: ["EMUDHRA.NS", "QUICKHEAL.NS"]
  },
  {
    id: "beverages-packaged-mineral-water",
    name: "Packaged Water & Flavoured Hydration",
    sector: "Consumer Staples",
    marketCap: "Small",
    description: "Mineral water bottling, electrolyte hydration drinks and juice pulps",
    tickers: ["ORIENTBELL.NS", "TASTYBITE.NS"]
  },
  {
    id: "chemicals-specialty-silicones",
    name: "Chemicals - Specialty Silicones & Adhesives",
    sector: "Chemicals",
    marketCap: "Large",
    description: "Consumer adhesives, synthetic resins, tile fixing adhesives and sealants",
    tickers: ["PIDILITIND.NS", "ASTRAL.NS"]
  },
  {
    id: "infrastructure-water-pipelines",
    name: "Infrastructure - Urban Water Pipelines & Canals",
    sector: "Capital Goods",
    marketCap: "Small",
    description: "Jal Jeevan Mission drinking water pipe laying and irrigation lift pump canals",
    tickers: ["KEC.NS", "WELENT.NS", "JMCPROJECT.NS"]
  },
  {
    id: "metals-sponge-iron",
    name: "Metals - Direct Reduced Iron (Sponge Iron)",
    sector: "Metals & Mining",
    marketCap: "Small",
    description: "Coal-based sponge iron kilns and mild steel billet casting",
    tickers: ["GALLANTT.NS", "PRAKASH.NS", "SARDEN.NS"]
  },
  {
    id: "consumer-mattresses-sleep",
    name: "Home Comfort - Mattresses & Polyurethane Foam",
    sector: "Consumer Discretionary",
    marketCap: "Small",
    description: "Orthopedic memory foam mattresses and PU foam insulation",
    tickers: ["SHEELA.NS"]
  },
  {
    id: "auto-safety-airbags",
    name: "Auto - Safety Airbags & Seatbelts",
    sector: "Automotive",
    marketCap: "Small",
    description: "Dual front curtain airbags, steering wheels and pretensioner seatbelts",
    tickers: ["RANEHOLDIN.NS", "SUBROS.NS"]
  },
  {
    id: "telecom-infrasharing-towers",
    name: "Telecom - Passive Cellular Tower Infrastructure",
    sector: "Telecommunications",
    marketCap: "Large",
    description: "Telecom tower sharing, rooftop mobile antenna mast structures",
    tickers: ["INDUSTOWER.NS"]
  },
  {
    id: "financial-gold-exchange-clearing",
    name: "Financial Clearing Corporations & Repos",
    sector: "Financials",
    marketCap: "Mid",
    description: "Clearing house facilities and triparty repo sovereign collateral settlements",
    tickers: ["BSE.NS", "CDSL.NS"]
  },
  {
    id: "auto-commercial-trailers",
    name: "Auto - Tipper Bodies & Multi-Axle Trailers",
    sector: "Automotive",
    marketCap: "Small",
    description: "Heavy hydraulic tipping bodies, road tankers and container trailer beds",
    tickers: ["AUTOMB.NS", "JAYBARMAR.NS"]
  },
  {
    id: "chemicals-cellulose-derivatives",
    name: "Chemicals - Cellulose Ethers & Thickeners",
    sector: "Chemicals",
    marketCap: "Small",
    description: "Industrial carboxymethyl cellulose and pharma binder agents",
    tickers: ["GUJTHEM.NS", "VIKASECO.NS"]
  },
  {
    id: "power-solar-inverters-ups",
    name: "Power Inverters & Green Solar PCUs",
    sector: "Capital Goods",
    marketCap: "Small",
    description: "Grid-tied solar inverters, home sine wave UPS and EV charging stations",
    tickers: ["SERVO.NS", "VGUARD.NS"]
  },
  {
    id: "consumer-fans-lighting-luminaires",
    name: "Lighting Luminaires & Ceiling Fans",
    sector: "Consumer Discretionary",
    marketCap: "Mid",
    description: "BLDC energy-efficient ceiling fans and commercial LED street lights",
    tickers: ["CROMPTON.NS", "ORIENTELEC.NS", "BAJAJELEC.NS"]
  },
  {
    id: "textiles-cotton-ginning",
    name: "Textiles - Raw Cotton Ginning & Bales",
    sector: "Consumer Discretionary",
    marketCap: "Small",
    description: "Shankar-6 cotton lint ginning, pressing and seed oil extraction",
    tickers: ["PASUPATI.NS", "NAHARSPING.NS"]
  },
  {
    id: "agri-micro-irrigation-drip",
    name: "Agriculture - Drip Irrigation & Sprinklers",
    sector: "Agriculture",
    marketCap: "Small",
    description: "Precision drip irrigation emitters, filters and agricultural pumps",
    tickers: ["JISLJALEQS.NS"]
  },
  {
    id: "real-estate-reits-commercial",
    name: "Commercial Real Estate & Business Parks",
    sector: "Real Estate",
    marketCap: "Large",
    description: "Grade-A IT parks, SEZ complexes and campus facilities",
    tickers: ["DLF.NS", "MINDSPACE.NS", "EMBASSY.NS"]
  },
  {
    id: "industrial-weighing-scales",
    name: "Industrial Weighing Systems & Loadcells",
    sector: "Industrial",
    marketCap: "Small",
    description: "Digital electronic weighbridges, weigh feeders and strain gauges",
    tickers: ["SINTERCOM.NS", "PITTIENG.NS"]
  },
  {
    id: "financial-micro-credit-rating",
    name: "Credit Rating & Independent Financial Research",
    sector: "Financials",
    marketCap: "Mid",
    description: "Debt instrument credit rating and bank loan rating assessment",
    tickers: ["CRISIL.NS", "ICRA.NS", "CAREERP.NS"]
  },
  {
    id: "specialty-industrial-filters",
    name: "Industrial Air Filtration & HVAC Ducts",
    sector: "Industrial",
    marketCap: "Small",
    description: "Bag filters, electrostatic precipitators and air scrubbers",
    tickers: ["THERMAX.NS", "VOLTAS.NS"]
  },
  {
    id: "metals-zinc-diecast-alloys",
    name: "Metals - Zinc Diecasting & Galvanizing",
    sector: "Metals & Mining",
    marketCap: "Large",
    description: "Continuous steel coil galvanizing and pressure zinc alloy castings",
    tickers: ["HINDZINC.NS", "JSWSTEEL.NS"]
  },
  {
    id: "food-condiments-pickles",
    name: "Packaged Snacks, Namkeen & Ready Meals",
    sector: "Consumer Staples",
    marketCap: "Small",
    description: "Traditional roasted namkeen, papad, ethnic snacks and ready-to-eat pouches",
    tickers: ["PRATAAP.NS", "BIKAJI.NS"]
  },
  {
    id: "auto-electric-charging-infra",
    name: "Auto - EV Charging & Clean Tech Components",
    sector: "Automotive",
    marketCap: "Mid",
    description: "Public DC fast charging stations and EV powertrain controllers",
    tickers: ["TATAPOWER.NS", "EXIDEIND.NS", "SERVOTECH.NS"]
  }
];
