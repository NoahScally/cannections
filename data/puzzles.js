/*
 * CAN-nections puzzle archive
 * ---------------------------
 * Schema mirrors the shape NYT Connections uses, with a couple of additions.
 *
 *   {
 *     id:         number   // stable puzzle number, never reuse
 *     title:      string   // internal nickname, shown on the results card
 *     editor:     string   // credit
 *     categories: [
 *       {
 *         title:      string  // the category name revealed on solve
 *         difficulty: 0..3    // 0 = easiest (wheat), 3 = hardest (maple)
 *         cards:      [string, string, string, string]
 *       }
 *     ]  // exactly 4, listed easiest -> hardest
 *   }
 *
 * Rules for authoring (see README):
 *   - Exactly 4 categories, exactly 4 cards each, 16 unique words total.
 *   - Difficulties 0,1,2,3 used exactly once.
 *   - Plant trap words: entries that plausibly belong to more than one group.
 *   - Keep entries short. Two words max, they have to fit on a phone.
 *
 * Loaded as a plain script (not fetch) so the game also works from file://.
 */
window.CANNECTIONS_PUZZLES = [
  {
    id: 1,
    title: "Double Double",
    editor: "CAN-nections",
    categories: [
      {
        title: "TIM HORTONS ORDER",
        difficulty: 0,
        cards: ["DOUBLE DOUBLE", "TIMBIT", "ICE CAPP", "CRULLER"]
      },
      {
        title: "PARTS OF A HOCKEY RINK",
        difficulty: 1,
        cards: ["BLUE LINE", "CREASE", "FACEOFF", "BOARDS"]
      },
      {
        title: "CANADIAN SITCOMS",
        difficulty: 2,
        cards: ["SCTV", "LETTERKENNY", "CORNER GAS", "SCHITT'S CREEK"]
      },
      {
        title: "CANADIAN CITIES NAMED FOR BRITISH ONES",
        difficulty: 3,
        cards: ["LONDON", "WINDSOR", "CAMBRIDGE", "VICTORIA"]
      }
    ]
  },

  {
    id: 2,
    title: "Sorry Aboot That",
    editor: "CAN-nections",
    categories: [
      {
        title: "CANADIAN-ONLY VOCABULARY",
        difficulty: 0,
        cards: ["TOQUE", "KEENER", "HYDRO", "PENCIL CRAYON"]
      },
      {
        title: "CHOCOLATE BARS YOU CAN'T GET IN THE STATES",
        difficulty: 1,
        cards: ["COFFEE CRISP", "AERO", "SMARTIES", "CRUNCHIE"]
      },
      {
        title: "GROUP OF SEVEN PAINTERS",
        difficulty: 2,
        cards: ["HARRIS", "VARLEY", "LISMER", "CARMICHAEL"]
      },
      {
        title: "SURNAMES OF CANADIAN SINGERS",
        difficulty: 3,
        cards: ["LIGHTFOOT", "TWAIN", "MORISSETTE", "ADAMS"]
      }
    ]
  },

  {
    id: 3,
    title: "The Great White North",
    editor: "CAN-nections",
    categories: [
      {
        title: "CANADIAN SNACKS",
        difficulty: 0,
        cards: ["POUTINE", "NANAIMO BAR", "BEAVERTAIL", "KETCHUP CHIPS"]
      },
      {
        title: "PROVINCES AND TERRITORIES",
        difficulty: 1,
        cards: ["NUNAVUT", "YUKON", "ALBERTA", "MANITOBA"]
      },
      {
        title: "CBC PROGRAMS",
        difficulty: 2,
        cards: ["THE NATIONAL", "DRAGONS' DEN", "MR. DRESSUP", "HOCKEY NIGHT"]
      },
      {
        title: "CANADIAN ___",
        difficulty: 3,
        cards: ["TIRE", "BACON", "SHIELD", "CLUB"]
      }
    ]
  },

  {
    id: 4,
    title: "Bar Down",
    editor: "CAN-nections",
    categories: [
      {
        title: "CANADIAN NHL TEAMS",
        difficulty: 0,
        cards: ["OILERS", "FLAMES", "CANUCKS", "SENATORS"]
      },
      {
        title: "MINOR PENALTIES",
        difficulty: 1,
        cards: ["TRIPPING", "HOOKING", "SLASHING", "BOARDING"]
      },
      {
        title: "HOCKEY LEGENDS",
        difficulty: 2,
        cards: ["GRETZKY", "ORR", "HOWE", "LEMIEUX"]
      },
      {
        title: "RINK SLANG",
        difficulty: 3,
        cards: ["SAUCE", "DANGLE", "CELLY", "CHIRP"]
      }
    ]
  },

  {
    id: 5,
    title: "From Sea to Sea",
    editor: "CAN-nections",
    categories: [
      {
        title: "GREAT LAKES",
        difficulty: 0,
        cards: ["SUPERIOR", "HURON", "ERIE", "MICHIGAN"]
      },
      {
        title: "NATIONAL AND PROVINCIAL PARKS",
        difficulty: 1,
        cards: ["BANFF", "JASPER", "GROS MORNE", "ALGONQUIN"]
      },
      {
        title: "MAJOR CANADIAN RIVERS",
        difficulty: 2,
        cards: ["FRASER", "MACKENZIE", "SASKATCHEWAN", "ST. LAWRENCE"]
      },
      {
        title: "PROVINCIAL CAPITALS THAT AREN'T THE BIGGEST CITY",
        difficulty: 3,
        cards: ["VICTORIA", "FREDERICTON", "QUEBEC CITY", "REGINA"]
      }
    ]
  },

  {
    id: 6,
    title: "Decent",
    editor: "CAN-nections",
    categories: [
      {
        title: "CANADIAN ACTORS",
        difficulty: 0,
        cards: ["CARREY", "SHATNER", "REYNOLDS", "GOSLING"]
      },
      {
        title: "TRAILER PARK BOYS",
        difficulty: 1,
        cards: ["RICKY", "JULIAN", "BUBBLES", "LAHEY"]
      },
      {
        title: "INVENTED IN CANADA",
        difficulty: 2,
        cards: ["INSULIN", "BASKETBALL", "PACEMAKER", "IMAX"]
      },
      {
        title: "CANADIAN BANDS",
        difficulty: 3,
        cards: ["RUSH", "TRIUMPH", "SLOAN", "METRIC"]
      }
    ]
  },

  {
    id: 7,
    title: "Peace, Order, Good Government",
    editor: "CAN-nections",
    categories: [
      {
        title: "PRIME MINISTERS",
        difficulty: 0,
        cards: ["TRUDEAU", "HARPER", "CHRÉTIEN", "MULRONEY"]
      },
      {
        title: "NATIONAL SYMBOLS",
        difficulty: 1,
        cards: ["MAPLE LEAF", "BEAVER", "MOUNTIE", "INUKSHUK"]
      },
      {
        title: "THE FOUR ORIGINAL PROVINCES, 1867",
        difficulty: 2,
        cards: ["ONTARIO", "QUEBEC", "NOVA SCOTIA", "NEW BRUNSWICK"]
      },
      {
        title: "___ CANADA",
        difficulty: 3,
        cards: ["AIR", "PARKS", "ELECTIONS", "HEALTH"]
      }
    ]
  },

  {
    id: 8,
    title: "Whaddayat",
    editor: "CAN-nections",
    categories: [
      {
        title: "CANADIAN SPELLINGS",
        difficulty: 0,
        cards: ["COLOUR", "CENTRE", "DEFENCE", "LITRE"]
      },
      {
        title: "MONTREAL STAPLES",
        difficulty: 1,
        cards: ["BAGEL", "SMOKED MEAT", "PLATEAU", "DEPANNEUR"]
      },
      {
        title: "NEWFOUNDLAND SLANG",
        difficulty: 2,
        cards: ["SCREECH", "JIGGS", "MUMMER", "B'Y"]
      },
      {
        title: "CITY NICKNAMES",
        difficulty: 3,
        cards: ["HOGTOWN", "COWTOWN", "THE PEG", "THE HAMMER"]
      }
    ]
  },

  {
    id: 9,
    title: "The 401",
    editor: "CAN-nections",
    categories: [
      {
        title: "GETTING AROUND CANADA",
        difficulty: 0,
        cards: ["WESTJET", "VIA RAIL", "PORTER", "GO TRAIN"]
      },
      {
        title: "GAS STATIONS",
        difficulty: 1,
        cards: ["PETRO-CANADA", "ESSO", "HUSKY", "IRVING"]
      },
      {
        title: "OLD CANADIAN UNIVERSITIES",
        difficulty: 2,
        cards: ["MCGILL", "QUEEN'S", "DALHOUSIE", "LAVAL"]
      },
      {
        title: "___ BAY",
        difficulty: 3,
        cards: ["HUDSON", "THUNDER", "GEORGIAN", "JAMES"]
      }
    ]
  },

  {
    id: 10,
    title: "Pocket Change",
    editor: "CAN-nections",
    categories: [
      {
        title: "ONE-NAME CANADIAN SINGERS",
        difficulty: 0,
        cards: ["DRAKE", "SHANIA", "CELINE", "BIEBER"]
      },
      {
        title: "CANADIAN ARTS AWARDS",
        difficulty: 1,
        cards: ["JUNO", "GEMINI", "GILLER", "POLARIS"]
      },
      {
        title: "CANADIAN KIDS' TV",
        difficulty: 2,
        cards: ["FRIENDLY GIANT", "FRAGGLE ROCK", "DEGRASSI", "ARTHUR"]
      },
      {
        title: "ANIMALS ON CANADIAN COINS",
        difficulty: 3,
        cards: ["LOON", "BEAVER", "POLAR BEAR", "CARIBOU"]
      }
    ]
  },

  {
    id: 11,
    title: "Minus Forty",
    editor: "CAN-nections",
    categories: [
      {
        title: "CURLING TERMS",
        difficulty: 0,
        cards: ["HOG LINE", "HAMMER", "SWEEP", "HOUSE"]
      },
      {
        title: "SURVIVING A CANADIAN WINTER",
        difficulty: 1,
        cards: ["PARKA", "MUKLUKS", "BLOCK HEATER", "SNOW TIRES"]
      },
      {
        title: "ENVIRONMENT CANADA WARNINGS",
        difficulty: 2,
        cards: ["POLAR VORTEX", "WIND CHILL", "FREEZING RAIN", "ICE FOG"]
      },
      {
        title: "SKI HILLS",
        difficulty: 3,
        cards: ["WHISTLER", "BLUE MOUNTAIN", "TREMBLANT", "BIG WHITE"]
      }
    ]
  },

  {
    id: 12,
    title: "Grocery Run",
    editor: "CAN-nections",
    categories: [
      {
        title: "CANADIAN CANDY BARS",
        difficulty: 0,
        cards: ["CRISPY CRUNCH", "MR. BIG", "WUNDERBAR", "EAT-MORE"]
      },
      {
        title: "REGIONAL DISHES",
        difficulty: 1,
        cards: ["DONAIR", "PEROGIES", "BUTTER TART", "TOURTIÈRE"]
      },
      {
        title: "CANADIAN GROCERY BRANDS",
        difficulty: 2,
        cards: ["NO NAME", "KRAFT DINNER", "CLAMATO", "TENDERFLAKE"]
      },
      {
        title: "CANADIAN BEER",
        difficulty: 3,
        cards: ["MOLSON", "LABATT", "MOOSEHEAD", "KOKANEE"]
      }
    ]
  },

  // Traps: SCOFF reads as a Jiggs dinner course; TRINITY reads as a bay, not a town.
  {
    id: 13,
    title: "Long May Your Big Jib Draw",
    editor: "CAN-nections",
    categories: [
      {
        title: "PULLED FROM THE ATLANTIC",
        difficulty: 0,
        cards: ["COD", "CAPELIN", "SQUID", "LOBSTER"]
      },
      {
        title: "NEWFOUNDLAND COMMUNITIES",
        difficulty: 1,
        cards: ["DILDO", "BONAVISTA", "TWILLINGATE", "TRINITY"]
      },
      {
        title: "ON A JIGGS DINNER PLATE",
        difficulty: 2,
        cards: ["SALT BEEF", "CABBAGE", "TURNIP", "PEASE PUDDING"]
      },
      {
        title: "NEWFOUNDLAND ENGLISH, DIFFERENT MEANING",
        difficulty: 3,
        cards: ["YARN", "SCOFF", "CROOKED", "STUN"]
      }
    ]
  },

  // Traps: TITANIC reads as not-Canadian; LUNENBURG pulls toward the ship that was built there.
  {
    id: 14,
    title: "Bluenose",
    editor: "CAN-nections",
    categories: [
      {
        title: "NOVA SCOTIA TOWNS",
        difficulty: 0,
        cards: ["LUNENBURG", "TRURO", "ANTIGONISH", "YARMOUTH"]
      },
      {
        title: "CAPE BRETON MUSICIANS",
        difficulty: 1,
        cards: ["MACMASTER", "MACISAAC", "RANKIN", "MACNEIL"]
      },
      {
        title: "NOVA SCOTIA ON A PLATE",
        difficulty: 2,
        cards: ["DONAIR", "HODGE PODGE", "SOLOMON GUNDY", "RAPPIE PIE"]
      },
      {
        title: "SHIPS IN NOVA SCOTIA HISTORY",
        difficulty: 3,
        cards: ["BLUENOSE", "MONT-BLANC", "IMO", "TITANIC"]
      }
    ]
  },

  // Traps: MATTHEW and BROWN both read as Fathers of Confederation; MACDONALD reads as a novelist.
  {
    id: 15,
    title: "The Island",
    editor: "CAN-nections",
    categories: [
      {
        title: "PRINCE EDWARD ISLAND",
        difficulty: 0,
        cards: ["POTATOES", "RED SAND", "CAVENDISH", "MUSSELS"]
      },
      {
        title: "ANNE OF GREEN GABLES",
        difficulty: 1,
        cards: ["MARILLA", "MATTHEW", "DIANA", "GILBERT"]
      },
      {
        title: "CANADIAN NOVELISTS",
        difficulty: 2,
        cards: ["ATWOOD", "MUNRO", "ONDAATJE", "RICHLER"]
      },
      {
        title: "FATHERS OF CONFEDERATION",
        difficulty: 3,
        cards: ["MACDONALD", "CARTIER", "BROWN", "TUPPER"]
      }
    ]
  },

  // Traps: POOL and FLY read as ordinary words; MIRAMICHI is both the town and the salmon river.
  {
    id: 16,
    title: "Up the Miramichi",
    editor: "CAN-nections",
    categories: [
      {
        title: "NEW BRUNSWICK TOWNS",
        difficulty: 0,
        cards: ["MONCTON", "SHEDIAC", "SACKVILLE", "MIRAMICHI"]
      },
      {
        title: "SEEN ON THE BAY OF FUNDY",
        difficulty: 1,
        cards: ["TIDES", "MUDFLATS", "WHALES", "HOPEWELL ROCKS"]
      },
      {
        title: "ACADIAN CULTURE",
        difficulty: 2,
        cards: ["TINTAMARRE", "CHIAC", "FRICOT", "EVANGELINE"]
      },
      {
        title: "ATLANTIC SALMON FISHING",
        difficulty: 3,
        cards: ["GRILSE", "POOL", "FLY", "GAFF"]
      }
    ]
  },

  // Traps: JOE LOUIS and MAY WEST read as people; CÉGEP is a French word but belongs with the acronyms.
  {
    id: 17,
    title: "Dep Run",
    editor: "CAN-nections",
    categories: [
      {
        title: "MONTREAL NEIGHBOURHOODS",
        difficulty: 0,
        cards: ["MILE END", "VERDUN", "OUTREMONT", "GRIFFINTOWN"]
      },
      {
        title: "QUÉBEC SNACK CAKES",
        difficulty: 1,
        cards: ["MAY WEST", "JOE LOUIS", "PASSION FLAKIE", "AH CARAMEL"]
      },
      {
        title: "QUÉBEC ACRONYMS",
        difficulty: 2,
        cards: ["SAQ", "SAAQ", "CÉGEP", "STM"]
      },
      {
        title: "FRENCH WORDS MONTREAL ANGLOS USE IN ENGLISH",
        difficulty: 3,
        cards: ["GUICHET", "TERRASSE", "STAGE", "DEP"]
      }
    ]
  },

  // Traps: LIONEL-GROULX is a historian before it is a station; LÉVESQUE names a boulevard too.
  {
    id: 18,
    title: "La Belle Province",
    editor: "CAN-nections",
    categories: [
      {
        title: "MONTREAL FESTIVALS",
        difficulty: 0,
        cards: ["OSHEAGA", "IGLOOFEST", "FRANCOFOLIES", "MUTEK"]
      },
      {
        title: "QUÉBEC CHANSONNIERS",
        difficulty: 1,
        cards: ["VIGNEAULT", "LECLERC", "CHARLEBOIS", "FERLAND"]
      },
      {
        title: "THE QUIET REVOLUTION",
        difficulty: 2,
        cards: ["LESAGE", "LÉVESQUE", "BILL 101", "REFERENDUM"]
      },
      {
        title: "MONTREAL METRO STATIONS",
        difficulty: 3,
        cards: ["BERRI-UQAM", "LIONEL-GROULX", "SNOWDON", "ANGRIGNON"]
      }
    ]
  },

  // Traps: CARIBOU is the carnival drink, not the animal; ST-JEAN reads as the June 24 holiday.
  {
    id: 19,
    title: "Bonhomme",
    editor: "CAN-nections",
    categories: [
      {
        title: "QUÉBEC WINTER CARNIVAL",
        difficulty: 0,
        cards: ["BONHOMME", "CARIBOU", "ICE CANOE", "SNOW BATH"]
      },
      {
        title: "QUÉBEC CITY LANDMARKS",
        difficulty: 1,
        cards: ["FRONTENAC", "CITADELLE", "MONTMORENCY", "DUFFERIN"]
      },
      {
        title: "THE PLAINS OF ABRAHAM, 1759",
        difficulty: 2,
        cards: ["WOLFE", "MONTCALM", "SIEGE", "RAMPARTS"]
      },
      {
        title: "QUÉBEC CITY NEIGHBOURHOODS NAMED FOR SAINTS",
        difficulty: 3,
        cards: ["ST-ROCH", "STE-FOY", "ST-JEAN", "ST-SAUVEUR"]
      }
    ]
  },

  // Traps: CACHE and PORTAGE read as computing and a Winnipeg street; TAPS reads as the bugle call.
  {
    id: 20,
    title: "Voyageur",
    editor: "CAN-nections",
    categories: [
      {
        title: "MAPLE SYRUP SEASON",
        difficulty: 0,
        cards: ["SUGAR SHACK", "TAFFY", "SAP", "TAPS"]
      },
      {
        title: "QUÉBEC PREMIERS",
        difficulty: 1,
        cards: ["DUPLESSIS", "BOURASSA", "PARIZEAU", "LEGAULT"]
      },
      {
        title: "QUÉBEC BRANDS",
        difficulty: 2,
        cards: ["ST-HUBERT", "JEAN COUTU", "COUCHE-TARD", "VACHON"]
      },
      {
        title: "FUR-TRADE FRENCH THAT STUCK IN ENGLISH",
        difficulty: 3,
        cards: ["TOBOGGAN", "PORTAGE", "VOYAGEUR", "CACHE"]
      }
    ]
  },

  // Traps: ELBOW and EYEBROW read as body parts; COMBINE reads as a verb, not a machine.
  {
    id: 21,
    title: "Land of Living Skies",
    editor: "CAN-nections",
    categories: [
      {
        title: "SASKATCHEWAN STAPLES",
        difficulty: 0,
        cards: ["RIDERS", "WHEAT", "POTASH", "WASCANA"]
      },
      {
        title: "HARVEST EQUIPMENT",
        difficulty: 1,
        cards: ["COMBINE", "SWATHER", "AUGER", "GRAIN BIN"]
      },
      {
        title: "RAISED IN SASKATCHEWAN",
        difficulty: 2,
        cards: ["DIEFENBAKER", "DOUGLAS", "HOWE", "MITCHELL"]
      },
      {
        title: "REAL SASKATCHEWAN TOWNS",
        difficulty: 3,
        cards: ["ELBOW", "EYEBROW", "CLIMAX", "LOVE"]
      }
    ]
  },

  // Traps: WINNIPEG is the Bombers' city before it is a lake; AURORA reads as the northern lights.
  {
    id: 22,
    title: "Friendly Manitoba",
    editor: "CAN-nections",
    categories: [
      {
        title: "CFL TEAMS",
        difficulty: 0,
        cards: ["BLUE BOMBERS", "ROUGHRIDERS", "TIGER-CATS", "ARGONAUTS"]
      },
      {
        title: "SEEN AROUND CHURCHILL",
        difficulty: 1,
        cards: ["POLAR BEAR", "BELUGA", "TUNDRA", "AURORA"]
      },
      {
        title: "MÉTIS HISTORY",
        difficulty: 2,
        cards: ["RIEL", "RED RIVER", "SASH", "BATOCHE"]
      },
      {
        title: "MANITOBA LAKES",
        difficulty: 3,
        cards: ["WINNIPEG", "MANITOBA", "DAUPHIN", "WINNIPEGOSIS"]
      }
    ]
  },

  // Traps: CHINOOK reads as an Indigenous place name; HOWDY and HEIDI read as greetings.
  {
    id: 23,
    title: "Wild Rose",
    editor: "CAN-nections",
    categories: [
      {
        title: "ALBERTA ICONS",
        difficulty: 0,
        cards: ["STAMPEDE", "HOODOOS", "ROCKIES", "CHINOOK"]
      },
      {
        title: "THE DRUMHELLER BADLANDS",
        difficulty: 1,
        cards: ["ALBERTOSAURUS", "TYRRELL", "FOSSIL", "BONEBED"]
      },
      {
        title: "THE 1988 CALGARY OLYMPICS",
        difficulty: 2,
        cards: ["HOWDY", "HEIDI", "SADDLEDOME", "NAKISKA"]
      },
      {
        title: "CREE AND BLACKFOOT PLACE NAMES",
        difficulty: 3,
        cards: ["WETASKIWIN", "PONOKA", "ATHABASCA", "KANANASKIS"]
      }
    ]
  },

  // Traps: SOURDOUGH reads as bread; PEEL and PAN read as ordinary words, not a river and a technique.
  {
    id: 24,
    title: "Sixty Degrees North",
    editor: "CAN-nections",
    categories: [
      {
        title: "NORTHERN COMMUNITIES",
        difficulty: 0,
        cards: ["WHITEHORSE", "YELLOWKNIFE", "IQALUIT", "INUVIK"]
      },
      {
        title: "THE KLONDIKE GOLD RUSH",
        difficulty: 1,
        cards: ["DAWSON", "SOURDOUGH", "CHILKOOT", "PAN"]
      },
      {
        title: "INUIT LIFE",
        difficulty: 2,
        cards: ["ULU", "QAMUTIK", "AMAUTI", "IGLU"]
      },
      {
        title: "NORTHERN RIVERS",
        difficulty: 3,
        cards: ["YUKON", "LIARD", "PEEL", "NAHANNI"]
      }
    ]
  },

  // Traps: CHUM and PINK read as a friend and a colour; COAL pulls toward Coal Harbour.
  {
    id: 25,
    title: "Super, Natural",
    editor: "CAN-nections",
    categories: [
      {
        title: "VANCOUVER NEIGHBOURHOODS",
        difficulty: 0,
        cards: ["GASTOWN", "KITSILANO", "YALETOWN", "COMMERCIAL"]
      },
      {
        title: "PACIFIC SALMON",
        difficulty: 1,
        cards: ["SOCKEYE", "COHO", "CHUM", "PINK"]
      },
      {
        title: "BRITISH COLUMBIA EXPORTS",
        difficulty: 2,
        cards: ["LUMBER", "COAL", "CHERRIES", "COPPER"]
      },
      {
        title: "COASTAL FIRST NATIONS",
        difficulty: 3,
        cards: ["HAIDA", "TSIMSHIAN", "HEILTSUK", "NISGA'A"]
      }
    ]
  },

  // Traps: TYEE is also the name for a big spring salmon; SOOKE sounds like a Chinook Jargon word.
  {
    id: 26,
    title: "Skookum",
    editor: "CAN-nections",
    categories: [
      {
        title: "VANCOUVER ISLAND TOWNS",
        difficulty: 0,
        cards: ["TOFINO", "NANAIMO", "SOOKE", "UCLUELET"]
      },
      {
        title: "OKANAGAN WINE COUNTRY",
        difficulty: 1,
        cards: ["KELOWNA", "ICEWINE", "VINEYARD", "PINOT"]
      },
      {
        title: "BRITISH COLUMBIA WILDLIFE",
        difficulty: 2,
        cards: ["SPIRIT BEAR", "ORCA", "MARMOT", "ELK"]
      },
      {
        title: "CHINOOK JARGON WORDS STILL IN USE",
        difficulty: 3,
        cards: ["SKOOKUM", "POTLATCH", "MUCKAMUCK", "TYEE"]
      }
    ]
  },

  // Traps: GROUSE and CYPRESS read as a bird and a tree; PENDER and SEYMOUR are Vancouver streets too.
  {
    id: 27,
    title: "Hollywood North",
    editor: "CAN-nections",
    categories: [
      {
        title: "SHOT IN VANCOUVER",
        difficulty: 0,
        cards: ["X-FILES", "DEADPOOL", "RIVERDALE", "SMALLVILLE"]
      },
      {
        title: "NORTH SHORE MOUNTAINS",
        difficulty: 1,
        cards: ["GROUSE", "CYPRESS", "SEYMOUR", "HOLLYBURN"]
      },
      {
        title: "WHAT EXPO 86 LEFT BEHIND",
        difficulty: 2,
        cards: ["SKYTRAIN", "CANADA PLACE", "SCIENCE WORLD", "BC PLACE"]
      },
      {
        title: "GULF ISLANDS",
        difficulty: 3,
        cards: ["SALT SPRING", "GALIANO", "MAYNE", "PENDER"]
      }
    ]
  },

  // Traps: ALOUETTE is a folk song and a CFL team before it is a satellite; CSA fits the acronyms too.
  {
    id: 28,
    title: "Canadarm",
    editor: "CAN-nections",
    categories: [
      {
        title: "CANADIAN ASTRONAUTS",
        difficulty: 0,
        cards: ["HADFIELD", "GARNEAU", "PAYETTE", "BONDAR"]
      },
      {
        title: "CANADIAN SPACE HARDWARE",
        difficulty: 1,
        cards: ["CANADARM", "ANIK", "ALOUETTE", "RADARSAT"]
      },
      {
        title: "CANADIAN FLOPS",
        difficulty: 2,
        cards: ["AVRO ARROW", "BRE-X", "MIRABEL", "NORTEL"]
      },
      {
        title: "FEDERAL ACRONYMS",
        difficulty: 3,
        cards: ["CSA", "CSIS", "CRTC", "CBSA"]
      }
    ]
  },

  // Traps: MOOSE and CHIPMUNK read as plain wildlife; CREE reads as a language, not a nation.
  {
    id: 29,
    title: "Turtle Island",
    editor: "CAN-nections",
    categories: [
      {
        title: "FIRST NATIONS AND PEOPLES",
        difficulty: 0,
        cards: ["CREE", "DENE", "MI'KMAQ", "ANISHINAABE"]
      },
      {
        title: "INDIGENOUS FOODS",
        difficulty: 1,
        cards: ["BANNOCK", "PEMMICAN", "WILD RICE", "THREE SISTERS"]
      },
      {
        title: "INDIGENOUS MUSICIANS",
        difficulty: 2,
        cards: ["TAGAQ", "DUTCHER", "SAINTE-MARIE", "KASHTIN"]
      },
      {
        title: "ENGLISH WORDS FROM INDIGENOUS LANGUAGES",
        difficulty: 3,
        cards: ["MOOSE", "KAYAK", "MUSKEG", "CHIPMUNK"]
      }
    ]
  },

  // Traps: DISSOLVE, SUMMON and ASSENT read as ordinary verbs; CHARTER reads as a flight.
  {
    id: 30,
    title: "Notwithstanding",
    editor: "CAN-nections",
    categories: [
      {
        title: "FEDERAL PARTIES",
        difficulty: 0,
        cards: ["LIBERAL", "CONSERVATIVE", "NDP", "BLOC"]
      },
      {
        title: "ON PARLIAMENT HILL",
        difficulty: 1,
        cards: ["PEACE TOWER", "CENTRE BLOCK", "SENATE", "MACE"]
      },
      {
        title: "THE CONSTITUTION, 1982",
        difficulty: 2,
        cards: ["PATRIATION", "CHARTER", "NOTWITHSTANDING", "AMENDING FORMULA"]
      },
      {
        title: "WHAT THE GOVERNOR GENERAL DOES",
        difficulty: 3,
        cards: ["PROROGUE", "DISSOLVE", "ASSENT", "SUMMON"]
      }
    ]
  }
];
