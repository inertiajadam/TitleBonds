import type { StateFaq } from "@/lib/states";

/** The short FAQ set surfaced on the homepage. */
export const homepageFaqs: StateFaq[] = [
  {
    q: "What does a title bond cost?",
    a: [
      "A title bond usually costs 1.5% of the bond amount required. The bond amount required is based on the value of your vehicle, according to your local DMV or a nationally recognized agency.",
    ],
  },
  {
    q: "Can I get a title bond with bad credit?",
    a: ["Yes, you can get a title bond with bad credit."],
  },
  {
    q: "Who needs a title bond?",
    a: [
      "Title bonds verify that you own your vehicle and they give you the right to insure, register and sell it. Some common situations where you may require a bonded title include:",
      [
        "Your original vehicle title was lost, stolen or damaged",
        "You have a custom made vehicle",
        "Your vehicle is an antique and doesn't have a title",
      ],
    ],
  },
  {
    q: "Do I need a credit check to get a title bond?",
    a: ["Title bonds under $30,000 do not require a credit check."],
  },
  {
    q: "How do I get a title bond?",
    a: [
      "To apply for your title bond, you will need the following information:",
      [
        "Your name and address",
        "Year, make and model of vehicle",
        "Vehicle VIN # or serial #",
      ],
    ],
  },
];

/**
 * The long-form FAQ set published at /frequently-asked-questions — a URL the
 * legacy site ranked for, so it is preserved exactly.
 */
export const fullFaqs: StateFaq[] = [
  {
    q: "What is a title bond?",
    a: [
      "A title for your vehicle, boat, trailer, etc. provides proof of ownership to entities that require it (like insurance companies and state governing bodies). In the case of your state, the title is generally required to register your vehicle (or boat, trailer, etc.).",
      "If your original title has become lost, stolen, damaged or defective, you may be required to obtain a Certificate of Title Bond in lieu of the original title.",
    ],
  },
  {
    q: "Who needs a title bond?",
    a: [
      "You may need a title bond if:",
      [
        "You purchased a vehicle but did not receive a proper title.",
        "Your original title was lost, stolen or damaged, and you cannot obtain a replacement.",
        "The seller did not sign the title properly or failed to provide ownership documentation.",
        "You purchased a vehicle from a private seller or auction without a valid title.",
      ],
      "If you're unsure whether you need a bonded title, check with your state's Department of Motor Vehicles (DMV) or Department of Revenue.",
    ],
  },
  {
    q: "How does a title bond work?",
    a: [
      [
        "Apply for a bonded title with your state's DMV or equivalent agency. They will determine if you are eligible.",
        "Obtain a title bond from a licensed surety bond provider based on the vehicle's value.",
        "Submit the bond to the DMV to receive a bonded title.",
        "Wait for the bond period (usually 3-5 years). If no ownership disputes arise, you can apply for a regular title once the bond expires.",
      ],
      "If someone proves they are the rightful owner during the bond period, the surety company may be responsible for financial compensation.",
    ],
  },
  {
    q: "How much does a title bond cost?",
    a: [
      "The cost of a title bond depends on:",
      [
        "The value of your vehicle (most states require the bond to match or exceed the appraised value).",
        "State regulations (bond amounts and pricing structures vary by state).",
        "Your credit score (some surety companies consider credit history when determining the premium).",
      ],
      "Typical cost range: $100 to $500 for most vehicles. However, high-value vehicles may require a higher bond amount.",
    ],
  },
  {
    q: "How long does a title bond last?",
    a: [
      "Most title bonds last 3 to 5 years, depending on the state. If no claims are made against the bond during this period, you may be eligible to receive a standard vehicle title.",
    ],
  },
  {
    q: "How do I apply for a title bond?",
    a: [
      "The process may vary by state, but generally you'll need to:",
      [
        "Contact your state's DMV to confirm eligibility and determine the required bond amount.",
        "Get a vehicle appraisal (some states require an appraisal to establish the bond amount).",
        "Purchase a title bond from a licensed surety bond provider.",
        "Submit the bond and required documents to your state's DMV.",
        "Receive your bonded title and complete any additional registration requirements.",
      ],
    ],
  },
  {
    q: "How is a title bond different from a regular title?",
    a: [
      "A bonded title is a temporary title issued when ownership is uncertain or lacks proper documentation. A regular title is issued when ownership is fully verified.",
      "Once the bond period expires with no ownership disputes, you may apply for a regular title.",
    ],
  },
  {
    q: "What happens if someone claims ownership of my vehicle?",
    a: [
      "If another party disputes your ownership during the bond period, they may file a claim with the surety company. The surety will investigate, and if the claim is valid, the bond may compensate the claimant. You may be required to return the vehicle or pay damages.",
      "This is why title bonds only provide a pathway to legal ownership but do not override legitimate claims.",
    ],
  },
  {
    q: "Where can I get a title bond?",
    a: [
      "You can purchase a title bond from a licensed surety bond provider. It's best to compare quotes and ensure the provider is licensed in your state. Our team writes title bonds in every state we serve and can confirm your requirements before you pay.",
    ],
  },
];

/** The bond-type comparison table published on the FAQ page. */
export const bondComparison = [
  {
    type: "Title Bond",
    purpose: "Proves vehicle ownership when title is missing",
    who: "Buyers with lost or missing titles",
  },
  {
    type: "Lienholder Bond",
    purpose: "Protects lenders who finance vehicle purchases",
    who: "Auto lenders & financial institutions",
  },
  {
    type: "Registration Bond",
    purpose: "Ensures compliance with registration laws",
    who: "Commercial vehicle owners & dealers",
  },
];
