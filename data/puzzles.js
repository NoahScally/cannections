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
  }
];
