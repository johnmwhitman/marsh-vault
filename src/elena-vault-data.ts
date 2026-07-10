/**
 * FICTIONAL DATA — Elena Marsh is not a real person.
 *
 * A synthetic memory vault for the /demo showcase: fifteen years of an
 * invented fractional CFO's career — decisions, meetings, contacts,
 * introductions — written to demonstrate what a personal memory vault
 * feels like to query. Every name, company, and number is invented.
 *
 * This file ships as static data inside the page bundle. Searching it
 * happens entirely in the visitor's browser. That is the point.
 */

export type EntryKind =
  | "decision"
  | "meeting"
  | "note"
  | "contact"
  | "introduction";

export type MemoryEntry = {
  id: string;
  date: string; // ISO, YYYY-MM-DD
  kind: EntryKind;
  text: string;
  tags: string[];
};

export type ShowcaseQuestion = {
  q: string;
  /** extra match terms beyond the question text */
  keywords: string[];
  answer: string;
  sources: string[]; // entry ids
};

export const PERSONA = {
  name: "Elena Marsh",
  line: "Fractional CFO · Marsh Advisory · Pacific Northwest",
  span: "2011–2026 · fifteen years",
} as const;

export const VAULT: MemoryEntry[] = [
  // ——— Halbrook Timber, 2011–2014 ———
  {
    id: "7c21e4a9",
    date: "2011-04-18",
    kind: "note",
    text: "Joined Halbrook Timber Products (Portland, OR) as corporate controller. First role with full ownership of the monthly close across all three mills.",
    tags: ["halbrook", "career", "controller", "portland"],
  },
  {
    id: "b03d91f2",
    date: "2011-09-02",
    kind: "contact",
    text: "Ruth Calloway — CFO of Halbrook Timber. Hired me, then spent three years teaching me the difference between accounting and finance. Mentor ever since.",
    tags: ["ruth calloway", "mentor", "halbrook", "people"],
  },
  {
    id: "4e8a20cd",
    date: "2012-06-14",
    kind: "decision",
    text: "Cut the monthly close from 12 days to 5 by standardizing all three mills on one chart of accounts. Ruth backed me against the mill managers who wanted their own ledgers.",
    tags: ["halbrook", "close", "process", "ruth calloway"],
  },
  {
    id: "d17f53be",
    date: "2012-11-30",
    kind: "meeting",
    text: "First presentation to Halbrook's board audit committee. Ruth's advice beforehand: answer the question asked, then stop talking. It worked; I still follow it.",
    tags: ["halbrook", "board", "audit", "ruth calloway", "advice"],
  },
  {
    id: "92cb07a4",
    date: "2013-05-09",
    kind: "note",
    text: "Fire at the Ridgeline mill. Led the business-interruption insurance claim end to end — recovered $2.1M. Learned more about our cost structure in four months than in two prior years.",
    tags: ["halbrook", "ridgeline", "insurance", "claim", "fire"],
  },
  {
    id: "3f6e18d0",
    date: "2014-02-21",
    kind: "decision",
    text: "Left Halbrook for VP Finance at Northlane Logistics in Seattle. Ruth's send-off: \"You've outgrown the ledger here.\" Hard to leave; right to leave.",
    tags: ["career", "northlane", "halbrook", "ruth calloway", "seattle"],
  },

  // ——— Northlane Logistics, 2014–2018 ———
  {
    id: "a85c3e17",
    date: "2014-08-12",
    kind: "contact",
    text: "Dana Okafor — director of operations at Northlane. We disagree constantly and productively. The single person I've worked with at the most companies since.",
    tags: ["dana okafor", "northlane", "operations", "people"],
  },
  {
    id: "60d94bf3",
    date: "2015-03-19",
    kind: "decision",
    text: "Killed the Spokane cross-dock expansion after the model showed it needed 92% utilization to break even on a 7-year lease. Unpopular for a quarter; vindicated within eighteen months.",
    tags: ["northlane", "spokane", "expansion", "lease", "model"],
  },
  {
    id: "f42a76c8",
    date: "2015-10-06",
    kind: "meeting",
    text: "Renegotiated fuel-surcharge mechanics with our three largest carriers in one week of back-to-backs. Locked a pass-through formula that survived the next diesel spike.",
    tags: ["northlane", "carriers", "fuel", "negotiation"],
  },
  {
    id: "1b9e50da",
    date: "2016-04-27",
    kind: "note",
    text: "Northlane acquired Cascade Freightways. I ran the finance integration workstream — nine months of systems consolidation, one badly surprised ERP vendor.",
    tags: ["northlane", "cascade freightways", "acquisition", "integration"],
  },
  {
    id: "c73f82e5",
    date: "2016-09-15",
    kind: "contact",
    text: "Marcus Yee — partner at Grove & Yee, deal counsel on the Cascade Freightways acquisition. Precise, fast, allergic to drama. Became my go-to attorney for everything since.",
    tags: ["marcus yee", "attorney", "grove & yee", "cascade freightways", "people", "legal"],
  },
  {
    id: "58a1d97b",
    date: "2017-06-08",
    kind: "decision",
    text: "Built Northlane's first rolling 13-week cash forecast and made it the Monday-morning ritual. It has since become my signature tool — installed at every company I've touched.",
    tags: ["northlane", "cash forecast", "13-week", "process", "tool"],
  },

  // ——— Verdant Row Foods, 2018–2022 ———
  {
    id: "e94b26af",
    date: "2018-01-25",
    kind: "decision",
    text: "Took the CFO seat at Verdant Row Foods — organic CPG, Seattle, roughly $40M revenue. First CFO title. Chose it over a bigger company's VP role for the ownership.",
    tags: ["verdant row", "cfo", "career", "seattle", "cpg"],
  },
  {
    id: "27c8f1d6",
    date: "2018-05-16",
    kind: "contact",
    text: "Priya Raghavan — hired her as VP of FP&A at Verdant Row. The sharpest financial modeler I have ever worked with; she finds the broken assumption before the meeting starts.",
    tags: ["priya raghavan", "verdant row", "fp&a", "people", "hire"],
  },
  {
    id: "b6e04a39",
    date: "2018-11-02",
    kind: "meeting",
    text: "Renegotiated the co-packing agreement with Bluebird Foods — moved to a volume-tiered rate card, worth about four points of gross margin at plan volumes.",
    tags: ["verdant row", "bluebird foods", "co-packing", "margin", "negotiation"],
  },
  {
    id: "90f57c2e",
    date: "2019-07-23",
    kind: "decision",
    text: "Led Verdant Row's $12M Series C with Fernbank Capital. Ran the process myself: six weeks of diligence, no surprises in the data room, terms held from the first sheet.",
    tags: ["verdant row", "series c", "fernbank", "fundraise"],
  },
  {
    id: "35da81b7",
    date: "2019-10-11",
    kind: "note",
    text: "Pushed back on the sales team's 40-SKU expansion plan. Complexity is a cost center: we cut it to 12 SKUs with real velocity data behind each. The other 28 would have been landfill.",
    tags: ["verdant row", "sku", "complexity", "discipline"],
  },
  {
    id: "68b3c9f0",
    date: "2020-04-03",
    kind: "decision",
    text: "Pandemic response: moved the 13-week cash forecast to a daily cadence, cut discretionary spend 30%, and committed to zero layoffs. We kept every employee and hit cash-flow breakeven by August.",
    tags: ["verdant row", "pandemic", "cash", "layoffs", "crisis"],
  },
  {
    id: "d20a64e8",
    date: "2020-09-17",
    kind: "note",
    text: "E-commerce went from 8% to 31% of Verdant Row's revenue in six months. Rebuilt margin reporting by channel — the blended number was hiding a fulfillment-cost problem.",
    tags: ["verdant row", "ecommerce", "channel", "margin", "reporting"],
  },
  {
    id: "4a7e93cb",
    date: "2021-06-10",
    kind: "meeting",
    text: "First approach from Hollis Park Partners about acquiring Verdant Row. Told the CEO: entertain it seriously or not at all — half-run processes leak and demoralize.",
    tags: ["verdant row", "hollis park", "acquisition", "pe"],
  },
  {
    id: "813f5d26",
    date: "2021-12-14",
    kind: "note",
    text: "Sale of Verdant Row to Hollis Park Partners closed at 2.4x revenue. Clean process, clean data room. My earn-out fully vested.",
    tags: ["verdant row", "hollis park", "sale", "exit", "pe"],
  },

  // ——— Marsh Advisory, 2022– ———
  {
    id: "f95c072a",
    date: "2022-03-31",
    kind: "decision",
    text: "Left Verdant Row after the PE transition. Declined Hollis Park's platform-CFO offer — more money, none of my time back. Founded Marsh Advisory: fractional CFO work, my calendar, my rules.",
    tags: ["marsh advisory", "career", "fractional", "hollis park", "verdant row", "founding"],
  },
  {
    id: "2d68b4e1",
    date: "2022-04-20",
    kind: "note",
    text: "First Marsh Advisory client: Tidegate Marine in Anacortes — workboat propulsion and service. Came through Dana Okafor, who runs operations there now. Never underestimate a fifteen-year colleague.",
    tags: ["tidegate", "client", "dana okafor", "anacortes", "marsh advisory"],
  },
  {
    id: "7ba9e35f",
    date: "2022-08-09",
    kind: "decision",
    text: "Capped the practice at three concurrent clients, permanently. The fourth client is where quality goes to die. This rule has been tested and has never lost.",
    tags: ["marsh advisory", "three clients", "cap", "rule", "capacity"],
  },
  {
    id: "c14d80b6",
    date: "2022-10-05",
    kind: "decision",
    text: "Took a small office on NW Flanders St in Portland — a landing spot between client visits. Dana argued hard for it: \"clients need somewhere to picture you.\" I was persuadable then.",
    tags: ["portland", "office", "nw flanders", "lease", "dana okafor"],
  },
  {
    id: "5e30f7ad",
    date: "2023-02-16",
    kind: "decision",
    text: "Moved pricing from hourly to a fixed monthly retainer — $9,500 standard — after three months of tracking unbilled scope creep. Revenue predictability beats utilization math, for me and for the client.",
    tags: ["pricing", "retainer", "hourly", "marsh advisory", "9500"],
  },
  {
    id: "ae62c193",
    date: "2023-06-21",
    kind: "note",
    text: "Second client signed: Copperline Brewing in Bend, OR. Introduction came from Marcus Yee, who handles their contracts. Family-owned, great liquid, books held together with enthusiasm.",
    tags: ["copperline", "client", "marcus yee", "bend", "brewing"],
  },
  {
    id: "09d4b7e8",
    date: "2023-09-14",
    kind: "introduction",
    text: "Priya Raghavan introduced me to Sofia Lindqvist, CEO of Meridian Analytics, at the Cascadia CFO Forum dinner in Seattle. Priya joined Meridian as VP Finance six months ago and told Sofia: \"You need my old boss.\"",
    tags: ["meridian", "priya raghavan", "sofia lindqvist", "introduction", "cascadia cfo forum", "deal"],
  },
  {
    id: "6f18a5c2",
    date: "2023-10-02",
    kind: "meeting",
    text: "First working session with Sofia Lindqvist. Meridian's board wants CFO-grade discipline before attempting a Series B next year. Sofia is direct, numerate, and knows exactly what she doesn't know.",
    tags: ["meridian", "sofia lindqvist", "series b", "board"],
  },
  {
    id: "31c7e9d4",
    date: "2023-10-19",
    kind: "decision",
    text: "Signed Meridian Analytics as the third client. Practice is now full under the three-client cap — Tidegate, Copperline, Meridian. Started a waitlist rather than break the rule.",
    tags: ["meridian", "client", "three clients", "cap", "marsh advisory"],
  },
  {
    id: "84f2b06e",
    date: "2024-01-26",
    kind: "note",
    text: "Copperline tripped its fixed-charge coverage covenant — 1.18 against a required 1.25 — after the canning-line purchase hit the same quarter as the hop-contract prepay. Found it before the bank did.",
    tags: ["copperline", "covenant", "bank", "fixed-charge", "breach"],
  },
  {
    id: "db59c3a7",
    date: "2024-02-08",
    kind: "meeting",
    text: "Sat down with Tom Ellery at First Cascade Bank about the Copperline covenant. Negotiated a waiver plus a reset to 1.15 through Q3, in exchange for quarterly reporting I certify personally. Bankers forgive surprises they hear from you first.",
    tags: ["copperline", "tom ellery", "first cascade", "covenant", "waiver", "bank"],
  },
  {
    id: "40e8d61b",
    date: "2024-02-27",
    kind: "contact",
    text: "Tom Ellery — SVP of commercial lending, First Cascade Bank, Bend. Old-school relationship banker; returns calls within the hour. Keep him informed early and he will move mountains at renewal.",
    tags: ["tom ellery", "first cascade", "banker", "people", "bend"],
  },
  {
    id: "9c35fa80",
    date: "2024-03-11",
    kind: "decision",
    text: "Portland office: decided NOT to renew the NW Flanders lease. Marsh Advisory goes fully remote — I used the office eleven days in all of 2023, and the lease ran about $31,000 a year. Dana argued to keep it; I overruled: an office is a story we tell ourselves about being a real firm. The retainers are the real firm.",
    tags: ["portland", "office", "lease", "remote", "nw flanders", "dana okafor", "31000"],
  },
  {
    id: "17ab64f9",
    date: "2024-04-30",
    kind: "note",
    text: "NW Flanders lease expired today. Archives scanned and shredded, furniture donated, keys returned. Ran the numbers one last time out of spite: the decision holds.",
    tags: ["portland", "office", "lease", "moveout"],
  },
  {
    id: "e2709c5d",
    date: "2024-06-13",
    kind: "meeting",
    text: "Meridian board meeting: presented the data-infrastructure spend case and settled the capitalize-vs-expense question with the auditors in the same week. Boards relax when the auditor and the CFO agree in writing.",
    tags: ["meridian", "board", "infrastructure", "auditors", "capitalization"],
  },
  {
    id: "53be18c6",
    date: "2024-09-25",
    kind: "decision",
    text: "Tidegate: flagged $640k of slow-moving legacy propulsion parts. Recommended taking the write-down across two quarters to preserve covenant headroom. The CEO resisted — those parts are 'inventory, not history.' Documented my recommendation in the file.",
    tags: ["tidegate", "inventory", "write-down", "640k", "propulsion", "covenant"],
  },
  {
    id: "b8d0f47e",
    date: "2024-11-07",
    kind: "note",
    text: "Copperline back in covenant compliance — fixed-charge coverage at 1.31. Waiver retired ahead of schedule. Tom Ellery's note: \"Wish all my borrowers had an Elena.\"",
    tags: ["copperline", "covenant", "compliance", "tom ellery", "first cascade"],
  },
  {
    id: "6a94e21c",
    date: "2025-01-16",
    kind: "decision",
    text: "Tidegate write-down taken in full — the whole $640k in Q1 — after the auditors rejected the two-quarter plan. My original recommendation is documented in the file; the covenant headroom held anyway, barely.",
    tags: ["tidegate", "write-down", "640k", "auditors", "inventory"],
  },
  {
    id: "f30c85db",
    date: "2025-03-05",
    kind: "meeting",
    text: "Meridian Series B kickoff. Sofia's standard for the raise, said to me directly: \"If the data room can't answer it in a day, we don't say it on stage.\" Rebuilt the KPI definitions doc that week so every metric has one owner and one formula.",
    tags: ["meridian", "series b", "sofia lindqvist", "data room", "kpi"],
  },
  {
    id: "24d7a9f1",
    date: "2025-05-22",
    kind: "note",
    text: "Meridian Series B closed: $28M led by Larkspur Ventures. Diligence partner's comment: finance function \"unusually clean for company stage.\" Priya carried half of that; she's now on the CFO track there.",
    tags: ["meridian", "series b", "larkspur", "28m", "priya raghavan", "close"],
  },
  {
    id: "8e51c30a",
    date: "2025-07-10",
    kind: "decision",
    text: "Declined Larkspur's offer to take the full-time CFO seat at Meridian. Second time declining a full-time return — Hollis Park in 2022, Larkspur now. The practice IS the career; I'm done auditioning for the old one.",
    tags: ["meridian", "larkspur", "full-time", "career", "declined", "fractional"],
  },
  {
    id: "c690b2ef",
    date: "2025-09-04",
    kind: "decision",
    text: "Moved all three clients onto the same fiscal-planning calendar — October/November — so annual planning concentrates into one intense month instead of smearing across three. The cap makes this possible; a fourth client would break it.",
    tags: ["planning", "calendar", "three clients", "clients", "process"],
  },
  {
    id: "a4783dc5",
    date: "2025-11-20",
    kind: "note",
    text: "Ruth Calloway retired. Spoke at her send-off in Portland: everything I know about closing books I learned from Ruth; everything I know about when to stop talking, too.",
    tags: ["ruth calloway", "retirement", "portland", "mentor"],
  },
  {
    id: "d13e96b0",
    date: "2026-01-29",
    kind: "decision",
    text: "Raised the standard retainer from $9,500 to $11,000 for new engagements; existing clients grandfathered for twelve months. Three years of scope data says the old price was subsidizing complexity.",
    tags: ["pricing", "retainer", "11000", "raise", "marsh advisory"],
  },
  {
    id: "72f5c48a",
    date: "2026-03-17",
    kind: "meeting",
    text: "Copperline is exploring acquiring a Yakima cidery. Early read after one look at the seller's books: they're a shoebox — price the diligence pain into the offer or walk. Marcus Yee engaged for the LOI.",
    tags: ["copperline", "acquisition", "yakima", "cidery", "marcus yee", "diligence"],
  },
  {
    id: "0b8ad672",
    date: "2026-05-08",
    kind: "note",
    text: "Started the practice playbook: every client process documented so nothing lives only in my head. If the practice can't survive me taking a month off, it's a job, not a firm.",
    tags: ["playbook", "process", "succession", "marsh advisory"],
  },
  {
    id: "91e0c7b3",
    date: "2026-06-25",
    kind: "meeting",
    text: "Quarterly review with Sofia: Meridian at 140% net revenue retention, best quarter yet. Flagged AWS spend growing faster than revenue for the second consecutive quarter — the next board deck gets a unit-economics page whether anyone asks or not.",
    tags: ["meridian", "sofia lindqvist", "nrr", "aws", "quarterly", "unit economics"],
  },
];

export const SHOWCASE: ShowcaseQuestion[] = [
  {
    q: "What did Elena decide about the Portland office?",
    keywords: ["portland", "office", "lease", "flanders", "renew", "remote"],
    answer:
      "On 11 March 2024 she decided not to renew the NW Flanders lease and took Marsh Advisory fully remote. The numbers made the call: eleven in-person days in all of 2023 against roughly $31,000 a year in rent. Dana Okafor — who had originally talked her into the office in 2022 — argued to keep it; Elena overruled him with the line she still quotes: \"An office is a story we tell ourselves about being a real firm. The retainers are the real firm.\" The lease ran out that April, and a spiteful final re-run of the numbers confirmed the decision.",
    sources: ["9c35fa80", "c14d80b6", "17ab64f9"],
  },
  {
    q: "Who introduced her to the Meridian deal?",
    keywords: ["meridian", "introduced", "introduction", "deal", "met", "sofia"],
    answer:
      "Priya Raghavan — Elena's former VP of FP&A at Verdant Row, and the sharpest modeler she ever hired — made the introduction. Priya had joined Meridian Analytics as VP Finance, and at the Cascadia CFO Forum dinner in Seattle (14 September 2023) she introduced Elena to CEO Sofia Lindqvist with the words \"You need my old boss.\" Elena signed Meridian as her third and final client five weeks later, filling the practice to its cap.",
    sources: ["09d4b7e8", "27c8f1d6", "31c7e9d4"],
  },
  {
    q: "What happened with Copperline's bank covenant?",
    keywords: ["copperline", "covenant", "bank", "waiver", "breach", "first cascade"],
    answer:
      "In January 2024 Copperline tripped its fixed-charge coverage covenant — 1.18 against a required 1.25 — after a canning-line purchase landed in the same quarter as a hop-contract prepay. Elena caught it before the bank did, then sat down with Tom Ellery at First Cascade and negotiated a waiver with a reset to 1.15 through Q3, in exchange for quarterly reporting she certifies personally. By November 2024 coverage was back to 1.31 and the waiver was retired early. Her operating rule from the episode: bankers forgive surprises they hear from you first.",
    sources: ["84f2b06e", "db59c3a7", "b8d0f47e"],
  },
  {
    q: "Why did Elena leave Verdant Row?",
    keywords: ["verdant", "left", "leave", "quit", "hollis", "exit"],
    answer:
      "Verdant Row was sold to Hollis Park Partners at 2.4x revenue in December 2021, and Elena's earn-out fully vested. Hollis Park offered her the platform-CFO role — more money, none of her time back — and she declined it, leaving in March 2022 to found Marsh Advisory. The pattern repeated in 2025 when she also turned down Larkspur's full-time CFO offer at Meridian: as she put it, the practice IS the career.",
    sources: ["813f5d26", "f95c072a", "8e51c30a"],
  },
  {
    q: "How does Elena price her work?",
    keywords: ["price", "pricing", "retainer", "charge", "rate", "hourly", "fee"],
    answer:
      "Fixed monthly retainer, not hourly. She made the switch in February 2023 after three months of tracking unbilled scope creep, setting the standard at $9,500 a month — her reasoning: revenue predictability beats utilization math, for her and the client. In January 2026 she raised it to $11,000 for new engagements (existing clients grandfathered for twelve months), on the strength of three years of scope data showing the old price was subsidizing complexity.",
    sources: ["5e30f7ad", "d13e96b0"],
  },
  {
    q: "Who is Ruth Calloway to Elena?",
    keywords: ["ruth", "calloway", "mentor", "halbrook", "taught"],
    answer:
      "Her mentor. Ruth was CFO of Halbrook Timber, hired Elena as controller in 2011, and spent three years teaching her — in Elena's words — the difference between accounting and finance. Ruth backed Elena's fight to standardize the mills on one chart of accounts, coached her first board presentation (\"answer the question asked, then stop talking\"), and sent her off to Northlane in 2014 with \"You've outgrown the ledger here.\" When Ruth retired in November 2025, Elena spoke at her send-off in Portland.",
    sources: ["b03d91f2", "d17f53be", "3f6e18d0", "a4783dc5"],
  },
  {
    q: "What went wrong at Tidegate with inventory?",
    keywords: ["tidegate", "inventory", "write-down", "writedown", "parts", "640"],
    answer:
      "In September 2024 Elena flagged $640k of slow-moving legacy propulsion parts and recommended writing them down across two quarters to preserve covenant headroom. Tidegate's CEO resisted — \"inventory, not history\" — and the auditors ultimately rejected the two-quarter plan, forcing the full $640k into Q1 2025. The covenant headroom held, barely. Elena had documented her original recommendation in the file, which is exactly why she documents recommendations in the file.",
    sources: ["53be18c6", "6a94e21c"],
  },
  {
    q: "Why does Elena cap her practice at three clients?",
    keywords: ["cap", "three", "clients", "capacity", "fourth", "waitlist"],
    answer:
      "\"The fourth client is where quality goes to die.\" She set the three-client cap in August 2022, a few months into the practice, and calls it a rule that has been tested and has never lost. When Meridian signed in October 2023 the practice was full — Tidegate, Copperline, Meridian — so she started a waitlist rather than break it. The cap also pays structural dividends: in 2025 it let her move all three clients onto one October–November planning calendar.",
    sources: ["7ba9e35f", "31c7e9d4", "c690b2ef"],
  },
  {
    q: "Who is Elena's attorney, and where did she meet him?",
    keywords: ["attorney", "lawyer", "marcus", "yee", "legal", "counsel"],
    answer:
      "Marcus Yee, partner at Grove & Yee — precise, fast, allergic to drama, in her own notes. They met in 2016 when he was deal counsel across the table on Northlane's acquisition of Cascade Freightways, and he has been her go-to attorney ever since. He has also been a source of business: the Copperline Brewing engagement came through his introduction in 2023, and he's engaged again on Copperline's 2026 cidery LOI.",
    sources: ["c73f82e5", "ae62c193", "72f5c48a"],
  },
  {
    q: "Did Elena ever consider going back to a full-time seat?",
    keywords: ["full-time", "fulltime", "return", "seat", "offer", "declined", "larkspur"],
    answer:
      "Twice offered, twice declined. Hollis Park Partners offered her the platform-CFO role after acquiring Verdant Row in 2022 — more money, none of her time back — and she left to found Marsh Advisory instead. In July 2025, after Meridian's $28M Series B, lead investor Larkspur Ventures offered her the full-time CFO seat there; she declined again. Her note from that day: \"The practice IS the career; I'm done auditioning for the old one.\"",
    sources: ["f95c072a", "8e51c30a", "24d7a9f1"],
  },
];
