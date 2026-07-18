// ────────────────────────────────────────────────────────────────
//  Library data — the portfolio organized into Wings (issue #46).
//  Shape consumed by ShelfPanel (spines) and OpenBook (TOC + reading):
//    wings[]  → { id, title, position, accent, theme, books[] }
//    position → 'top' (career rail) | 'left' | 'right' (personal Wings)
//    accent   → fixed accent colour per Wing, so colour carries meaning
//    theme    → per-Wing aesthetic: 'career' | 'workshop' | 'cyber' |
//               'greenhouse' | 'soundstage' (drives the bookcase styling)
//    book     → { id, title, subtitle, coverColor, chapters[] }
//    chapter  → { id, title, pages[] }
//    page     → { id, content (inline HTML), shots?[], audio?[] }
//  A book with an empty chapters[] renders as "still being written".
// ────────────────────────────────────────────────────────────────

export const wings = [
  {
    id: "wing-professional",
    title: "Career of Robert Gregory",
    position: "top",
    accent: "#5ef2e8",
    theme: "career",
    books: [
      {
        id: "book-brinker",
        title: "Brinker Capital",
        subtitle: "Feb 2021 – Present",
        coverColor: "#1A2A3A",
        chapters: [
          {
            id: "ch-brinker-workflow",
            title: "Workflow Design & Process Automation",
            pages: [
              {
                id: "pg-brinker-workflow-1",
                content: "Mapped Brinker's full multi-sleeve UMA trade-execution workflow across its four regulated platforms — Wealthscape, Eclipse, Orion, and Docupace — capturing every handoff, trigger, and failure point, then used that map to build the firm's first trading KPI dashboard in Power BI from a seven-field event-log API feed, stood up in a week."
              },
              {
                id: "pg-brinker-workflow-2",
                content: "That rollout was credited by Orion's COO with cutting Docupace processing time 25%+ firm-wide. Designed the pre-trade validation checks and standardized operating procedures that catch problems before they reach execution, and wrote the exception-tracking protocols that keep a growing multi-trader desk running consistently."
              }
            ]
          },
          {
            id: "ch-brinker-execution",
            title: "Trade Execution & Risk Control",
            pages: [
              {
                id: "pg-brinker-execution-1",
                content: "Executes daily equity trades across multi-sleeve UMA portfolios against subscribed model allocations under a 24-hour SLA — rebalancing, liquidity events, model delivery, tax-sensitive transitions, full liquidations, and custom blends for high-net-worth accounts ($1M+ minimums)."
              },
              {
                id: "pg-brinker-execution-2",
                content: "Leads block-order execution for proprietary fund holdings via auction, and serves as the desk's escalation point for reconciliation breaks, drift exceptions, and liquidity constraints — partnering across Compliance, Operations, and Technology. While covering the Director of Trading's desk, caught a $500M share-quantity error at the auction stage that had cleared every upstream check."
              }
            ]
          },
          {
            id: "ch-brinker-scaling",
            title: "Scaling & Cross-Training",
            pages: [
              {
                id: "pg-brinker-scaling-1",
                content: "Originated and solo-traded the Core Select UMA queue at launch, then designed and ran the cross-training program that moved four single-sleeve traders into full multi-sleeve UMA execution — scaling the desk from one UMA trader to five."
              },
              {
                id: "pg-brinker-scaling-2",
                content: "Onboarded a sixth trader to Wealth Advisory UMAs, extending coverage to Brinker's highest-AUM, highest-complexity book."
              }
            ]
          },
          {
            id: "ch-brinker-analytics",
            title: "Operational Analytics & AI-Agent Oversight",
            pages: [
              {
                id: "pg-brinker-analytics-1",
                content: "Built the analytical model behind the desk's KPI dashboard independently — request-type segmentation, 90th-percentile queue-time SLAs, trade-flow views by sub-desk, and staffing-capacity analysis that now informs leadership's headcount and workload decisions."
              },
              {
                id: "pg-brinker-analytics-2",
                content: "Now extending that dashboard into a real-time monitoring layer for AI-agent-driven workflow automation — watching for bottlenecks and exceptions as the firm scales agentic tooling on the trading desk."
              }
            ]
          }
        ]
      },
      {
        id: "book-pnc-wm",
        title: "PNC Wealth Management",
        subtitle: "2019 – 2021",
        coverColor: "#2A3B4C",
        chapters: [
          {
            id: "ch-pnc-trust",
            title: "Portfolio & Trust Administrator, Irrevocable Trust Specialty Group",
            pages: [
              {
                id: "pg-pnc-trust-1",
                content: "Administered trust portfolios through tax-loss harvesting, liquidity management, and Reg 9 compliance workflows, and presented Reg 9 exceptions biannually to the Investment Committee in support of regulatory and internal-risk assessments."
              },
              {
                id: "pg-pnc-trust-2",
                content: "Produced ad hoc performance reporting and asset-allocation analysis to support portfolio reviews."
              }
            ]
          }
        ]
      },
      {
        id: "book-pnc-bank",
        title: "PNC Bank",
        subtitle: "2017 – 2019",
        coverColor: "#3A4B5C",
        chapters: [
          {
            id: "ch-pnc-branch",
            title: "Financial Services Associate, Branch Banking",
            pages: [
              {
                id: "pg-pnc-branch-1",
                content: "Supported advisors across personal banking, lending, and account maintenance at a high-volume retail branch, partnering with Mortgage, Investments, Business Banking, and Wealth Management on integrated client financial plans."
              }
            ]
          }
        ]
      },
      {
        id: "book-eddie-bauer",
        title: "Eddie Bauer",
        subtitle: "2013 – 2017",
        coverColor: "#4A3B2C",
        chapters: [
          {
            id: "ch-eb-visual",
            title: "Visual Merchandising",
            pages: [
              {
                id: "pg-eb-visual-1",
                content: "Ran visual merchandising at the King of Prussia store — one of the highest-volume locations in the country — translating corporate directives onto the floor every month and working with payroll to execute each reset on time and to a standard high enough to make the store a proving ground for others.",
                shots: [
                  {
                    src: "/images/eddiebauer/chase-the-horizon-window.jpeg",
                    cap: "“Chase the Horizon” window",
                    wide: true
                  },
                  {
                    src: "/images/eddiebauer/guide-pro-window.jpeg",
                    cap: "“Guide Pro” window"
                  },
                  {
                    src: "/images/eddiebauer/live-for-summer-window.jpeg",
                    cap: "“Live for Summer” window"
                  },
                  {
                    src: "/images/eddiebauer/limited-edition-table.jpeg",
                    cap: "Limited-edition feature table"
                  },
                  {
                    src: "/images/eddiebauer/lifestyle-wall.jpeg",
                    cap: "Lifestyle wall & denim floor set",
                    wide: true
                  }
                ]
              }
            ]
          },
          {
            id: "ch-eb-team",
            title: "Team Leadership & Training",
            pages: [
              {
                id: "pg-eb-team-1",
                content: "Hired and trained a visual team from the ground up, building the bench needed to hit a demanding monthly reset cycle without letting the standard slip."
              }
            ]
          },
          {
            id: "ch-eb-expansion",
            title: "Store Openings & Expansion",
            pages: [
              {
                id: "pg-eb-expansion-1",
                content: "Helped open two additional stores, then relocated to Montgomeryville to close the outgoing location and help open its replacement — carrying the same visual standard into a new build from day one."
              }
            ]
          },
          {
            id: "ch-eb-sales",
            title: "Sales Performance",
            pages: [
              {
                id: "pg-eb-sales-1",
                content: "Closed out one year as the top salesperson in the Northeast region, on the way to promotion into assistant manager."
              }
            ]
          }
        ]
      },
      {
        id: "book-education",
        title: "Education & Licensing",
        subtitle: "The credentials underneath the work",
        coverColor: "#3E3A4C",
        chapters: [
          {
            id: "ch-edu-creds",
            title: "Education & Licensing",
            pages: [
              {
                id: "pg-edu-creds-1",
                content: "A Bachelor of Science in Accounting, magna cum laude, from Maryville University (St. Louis, May 2021) — the foundation for a career that turned out to be less about the numbers themselves and more about the systems that produce them."
              },
              {
                id: "pg-edu-creds-2",
                content: "Series 65 licensed, with a Python in Excel certificate (LinkedIn) and working Python built through continued self-study."
              }
            ]
          }
        ]
      },
      {
        id: "book-skillset",
        title: "Skillset & Technologies",
        subtitle: "The skills behind the work",
        coverColor: "#33404A",
        chapters: [
          {
            id: "ch-skill-workflow",
            title: "Workflow & Automation",
            pages: [
              {
                id: "pg-skill-workflow-1",
                content: "Mapping a process end to end — every handoff, every trigger, every place it can fail — before building the standard operating procedures, validation checks, and automation that make it repeatable."
              }
            ]
          },
          {
            id: "ch-skill-analytics",
            title: "Analytics & Oversight",
            pages: [
              {
                id: "pg-skill-analytics-1",
                content: "Turning raw operational data into decision-ready dashboards: Power BI built from live API feeds, Tableau, advanced Excel and Python in Excel, and the KPI architecture that ties it all to a business question worth answering."
              }
            ]
          },
          {
            id: "ch-skill-execution",
            title: "Trade Execution",
            pages: [
              {
                id: "pg-skill-execution-1",
                content: "The mechanics of moving client assets correctly — multi-sleeve rebalancing, model alignment, tax-aware liquidations, and block-order auction trading — under service-level windows that don't move."
              }
            ]
          },
          {
            id: "ch-skill-risk",
            title: "Risk & Compliance",
            pages: [
              {
                id: "pg-skill-risk-1",
                content: "The guardrails around execution: Reg 9, trade suitability, audit preparation, SLA management, and the escalation judgment to know when something needs a second set of eyes."
              }
            ]
          },
          {
            id: "ch-skill-platforms",
            title: "Platforms & Tools",
            pages: [
              {
                id: "pg-skill-platforms-1",
                content: "Wealthscape, Eclipse, Orion, and Docupace for execution; Salesforce, Bloomberg Terminal, FactSet, and Morningstar for everything around it."
              }
            ]
          }
        ]
      },
      {
        id: "book-phs",
        title: "Pennsylvania Horticultural Society",
        subtitle: "PHS Flower Show",
        coverColor: "#5C4A2A",
        chapters: [
          {
            id: "ch-phs-flowershow",
            title: "PHS Flower Show",
            pages: [
              {
                id: "pg-phs-flowershow-1",
                content: "Volunteers each year at the PHS Flower Show, the Society's flagship public event and one of the largest horticultural exhibitions in the country — direct, hands-on support for the organization behind the city's tree-planting and greening work."
              }
            ]
          }
        ]
      },
      {
        id: "book-composting",
        title: "Community Composting",
        subtitle: "Growing Together Community Garden",
        coverColor: "#3A4A2A",
        chapters: [
          {
            id: "ch-compost-program",
            title: "Growing Together Community Garden",
            pages: [
              {
                id: "pg-compost-program-1",
                content: "Composting for Growing Together, a South Philadelphia community garden — turning neighborhood food scraps into finished compost for the beds, run as a standing program rather than one-off volunteering."
              },
              {
                id: "pg-compost-program-2",
                content: "Serves on the garden's Composting Committee, part of the wider Farm Philly community-composting network, keeping the collection, education, and signage systems running at neighborhood scale."
              }
            ]
          },
          {
            id: "ch-compost-systems",
            title: "Collection & Processing",
            pages: [
              {
                id: "pg-compost-systems-1",
                content: "The work behind the pile: taking in food scraps, balancing greens against browns to the right recipe, and building and turning the pile so it heats, breaks down, and comes back out as finished compost for the beds."
              },
              {
                id: "pg-compost-systems-2",
                content: "Keeping it running is its own discipline — staying on top of moisture and the turn schedule, and managing the pile so it stays active and doesn't invite pests."
              }
            ]
          },
          {
            id: "ch-compost-signage",
            title: "Signage",
            pages: [
              {
                id: "pg-compost-signage-1",
                content: "A shared bin only works if people sort it right, so the program leans on clear signage — simple what-goes-in, what-stays-out guides at the point of drop-off — to let the bin do its own teaching instead of a volunteer standing over it."
              }
            ]
          },
          {
            id: "ch-compost-training",
            title: "Training & Handouts",
            pages: [
              {
                id: "pg-compost-training-1",
                content: "Onboarding and education for new contributors and committee members — the plain-language guidance that turns “please sort correctly” into something people can actually follow, and keeps a shared neighborhood system consistent as volunteers come and go."
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: "wing-physical",
    title: "Physical Archive",
    position: "left",
    accent: "#ff8a2b",
    theme: "workshop",
    books: [
      {
        id: "book-woodworking",
        title: "Woodworking",
        subtitle: "Working in matter",
        coverColor: "#4A2C1C",
        chapters: [
          {
            id: "ch-wood-furniture",
            title: "Furniture",
            pages: [
              {
                id: "pg-wood-furniture-1",
                content: "A tall, narrow desk built to fill an awkward niche — the first real furniture build — and a fold-down wall-mounted Murphy desk with LED-framed interior and dual monitors, designed once the fundamentals clicked."
              }
            ]
          },
          {
            id: "ch-wood-restorations",
            title: "Restorations",
            pages: [
              {
                id: "pg-wood-restorations-1",
                content: "A marketplace curio cabinet torn down, stripped, conditioned, and re-stained to match the kitchen cabinetry — mirror backing swapped for a wallpapered panel, with grow lights and circulation fans built in."
              }
            ]
          },
          {
            id: "ch-wood-builtins",
            title: "Built-Ins",
            pages: [
              {
                id: "pg-wood-builtins-1",
                content: "A basement studio build-out — framing new stud walls and a paneled bump-out to mount monitors and a desk, turning an unfinished corner into a working studio."
              }
            ]
          },
          {
            id: "ch-wood-renovations",
            title: "Renovations",
            pages: [
              {
                id: "pg-wood-renovations-1",
                content: "A powder-room renovation — stripping decades-old wallpaper to bare wall, skim coating, and rebuilding the fixtures, art, and door — plus a round of front-of-house exterior fixes."
              }
            ]
          },
          {
            id: "ch-wood-outdoor",
            title: "Outdoor",
            pages: [
              {
                id: "pg-wood-outdoor-1",
                content: "A pair of pressure-treated trash-can enclosures built from scratch — slatted siding, a drained slat roof, and hinged doors made to weather the outdoors for years."
              }
            ]
          },
          {
            id: "ch-wood-enclosure",
            title: "Building a Weatherproof Outdoor Enclosure",
            pages: [
              {
                id: "pg-wood-enclosure-1",
                content: "A step-by-step walkthrough for framing, siding, and finishing a weatherproof outdoor enclosure — from cut list to the final coat of sealant."
              }
            ]
          },
          {
            id: "ch-wood-pony-wall",
            title: "Building a Pony Wall",
            pages: [
              {
                id: "pg-wood-pony-wall-1",
                content: "A pony wall is a short, non-load-bearing half wall — knee- to counter-height — and it frames up like any stud wall, just lower. You need 2x4s for the top and bottom plates and the studs, drywall if you're finishing it, and either wood screws for a subfloor or Tapcon masonry screws for concrete to anchor the bottom plate."
              },
              {
                id: "pg-wood-pony-wall-2",
                content: "Lay it out first: mark the wall's line on the floor, square to the existing walls, then mark studs 16 inches on-center on both plates. Build the frame flat on the ground — studs screwed to the top and bottom plates, toe-screwed for grip — then stand it up and anchor the bottom plate every 16–24 inches, shimming until it's dead level."
              },
              {
                id: "pg-wood-pony-wall-3",
                content: "Because it's freestanding at one end, bracing is the whole game: tie the end stud to the nearest wall with L-brackets, add a 45° diagonal brace inside the frame, or run a post up to the ceiling — whatever the spot allows."
              },
              {
                id: "pg-wood-pony-wall-4",
                content: "Finish it like any wall — half-inch drywall, then tape, mud, and sand two or three coats to a seamless face, prime and paint, and trim the base to match the room. Or skip the drywall and cap it with a 1x6 or 2x6 plank for a warmer, furniture-like top."
              }
            ]
          },
          {
            id: "ch-wood-non-load-bearing-wall",
            title: "Building a Non-Load-Bearing Wall",
            pages: [
              {
                id: "pg-wood-non-load-bearing-wall-1",
                content: "A non-load-bearing partition carries nothing but itself, so you can put up a full-height one without touching the structure — the trick is anchoring it top and bottom without tearing anything up. Find the ceiling joists for the top plate, and bond the floor plate down with heavy-duty VHB tape instead of drilling a finished floor."
              },
              {
                id: "pg-wood-non-load-bearing-wall-2",
                content: "Set the plates first: cut the top plate to length, level and shim it, and screw it into the joists; clean the floor with alcohol, tape the bottom plate, and press it in directly under the top one. Then measure between the plates, cut the studs a hair short so they drop in, and fasten them with angled or pocket screws."
              },
              {
                id: "pg-wood-non-load-bearing-wall-3",
                content: "Stability comes from bracing — L-brackets tying the partition to the existing wall at top, middle, and bottom, plus 45° diagonal blocks between studs. From there it's drywall on both faces, screws into every stud at 12 inches, then joint compound over the seams and screw heads."
              },
              {
                id: "pg-wood-non-load-bearing-wall-4",
                content: "Finishing is patience: two coats of compound with a sanding in between, feathered flat, then prime, paint, and base molding to match the room. Done right, a wall that holds nothing up looks exactly like one that does."
              }
            ]
          },
          {
            id: "ch-wood-route-edges",
            title: "Routing a Finished Edge",
            pages: [
              {
                id: "pg-wood-route-edges-1",
                content: "A router turns a raw sawn edge into a finished one, and the whole job is choosing a bit and moving in the right direction. A roundover bit softens the edge to a curve; a bevel bit cuts a clean angle. Set the depth to match the bit's radius or angle, and clamp the workpiece down with room for the router base to ride flat."
              },
              {
                id: "pg-wood-route-edges-2",
                content: "If you've got a scrap of the same stock, test on it first. Then let the router reach full speed before it touches the wood and move in one steady, continuous pass, keeping the base flat the whole way."
              },
              {
                id: "pg-wood-route-edges-3",
                content: "The one rule that saves you: move against the spin of the bit — counter-clockwise around the outside of a piece — so the router pulls into the work instead of skating and digging in. Flip the board and repeat so every visible edge matches."
              },
              {
                id: "pg-wood-route-edges-4",
                content: "Finish with a light pass of fine-grit sandpaper to knock down any burrs, then vacuum the dust off before the next step. It's a small operation that's the difference between an edge that looks built and one that looks cut."
              }
            ]
          },
          {
            id: "ch-wood-ottoman-table",
            title: "Building a C-Shaped Ottoman Table",
            pages: [
              {
                id: "pg-wood-ottoman-table-1",
                content: "A C-shaped ottoman table is a small hardwood piece that slides in over a couch or bed — a flat top on two side panels, open on one side like the letter C, on casters or a rail so it rolls in and out. The build is all in the joinery: one-inch hardwood for the top and sides, joined with glued dowels rather than visible fasteners."
              },
              {
                id: "pg-wood-ottoman-table-2",
                content: "Cut clean — a 40.5 by 20-inch top and two 18-inch sides on the table saw — and rout the edges if you want them softened. Then mark and drill the dowel holes with a jig and a stop collar so every hole lands at the same depth and the panels pull up square."
              },
              {
                id: "pg-wood-ottoman-table-3",
                content: "Dry-fit the whole thing before any glue touches it: assemble it dry to confirm the fit, then glue the dowels and holes, tap it together with a rubber mallet, and clamp it until it sets. Skipping the dry fit is how you end up clamping a mistake."
              },
              {
                id: "pg-wood-ottoman-table-4",
                content: "Finish by sanding up through the grits, wiping clean, and laying on polyurethane a coat at a time with a light sanding between. Add casters or a track underneath and felt pads to save the floor, and it slides where you need it and disappears when you don't."
              }
            ]
          },
          {
            id: "ch-wood-drywall-repair",
            title: "Stripping, Repairing & Repainting Drywall",
            pages: [
              {
                id: "pg-wood-drywall-repair-1",
                content: "Stripped wallpaper leaves a wall that looks wrecked — torn paper face, old adhesive, ragged edges — and the repair is less about patching holes than getting back to a flat, sealed, paintable surface. First strip everything loose; for stubborn glue, a spray of one-part vinegar to two-parts boiling water, left to sit, scrapes right off. Feather any sharp ridges with 80–120 grit until the wall is flat to the touch.",
                shots: [
                  {
                    src: "/images/woodworking/powder-room-drywall.jpeg",
                    cap: "Powder room — wallpaper stripped to bare drywall",
                    wide: true
                  }
                ]
              },
              {
                id: "pg-wood-drywall-repair-2",
                content: "The step people skip is sealing. A coat of a clear problem-surface sealer (Zinsser Gardz) locks down the fuzzy torn paper and old adhesive so your joint compound doesn't blister and the old surface doesn't flash through the paint. It rolls on milky and dries clear in half an hour."
              },
              {
                id: "pg-wood-drywall-repair-3",
                content: "Then you skim-coat: all-purpose joint compound thinned with a little water to a pourable, pancake-batter consistency, rolled on thick with a high-nap roller and immediately pulled flat with a wide taping knife held at a low angle. The move that makes it seamless is feathering — two-thirds of the knife over the mud, one-third on bare wall, all the pressure on the bare side, dragging the edge paper-thin."
              },
              {
                id: "pg-wood-drywall-repair-4",
                content: "Let each coat dry fully — a day in winter — then a second, lighter coat and a final sanding until, eyes closed and hand on the wall, you can't feel an edge or a dip. Prime, paint, and it reads like the damage was never there."
              }
            ]
          }
        ]
      },
      {
        id: "book-upholstery",
        title: "Upholstery",
        subtitle: "Reworking what we sit on",
        coverColor: "#4A2C33",
        chapters: []
      }
    ]
  },
  {
    id: "wing-digital",
    title: "Digital Atelier",
    position: "left",
    accent: "#43b6ff",
    theme: "cyber",
    books: [
      {
        id: "book-technology",
        title: "Technology",
        subtitle: "Hardware, electronics & builds",
        coverColor: "#4A3520",
        chapters: [
          {
            id: "ch-tech-builds",
            title: "Builds",
            pages: [
              {
                id: "pg-tech-builds-1",
                content: "Prince Charming, a high-performance desktop built from parts — specced, assembled, cable-managed, and tuned as a daily driver for everything from music production to local AI work."
              }
            ]
          },
          {
            id: "ch-tech-repairs",
            title: "Repairs & Mods",
            pages: [
              {
                id: "pg-tech-repairs-1",
                content: "PS5 controller modding — TMR joysticks, clicky bumpers, and button swaps, which meant learning to desolder fourteen joints per stick through solder with a higher melting point than the board can safely take. Plus a Raspberry Pi smart mirror built from a salvaged monitor."
              }
            ]
          },
          {
            id: "ch-tech-homelab",
            title: "Home Lab",
            pages: [
              {
                id: "pg-tech-homelab-1",
                content: "A local network-attached storage box to back up years of photos outside the cloud, and a Home Assistant smart-home buildout pulling lighting, sound, TVs, consoles, and computers into one control layer."
              }
            ]
          },
          {
            id: "ch-tech-apps",
            title: "Apps",
            pages: [
              {
                id: "pg-tech-apps-1",
                content: "A concert-tracker app that watches local venues for artist announcements matching my music library, and a utility app ecosystem — calendar, to-do, and reminders — designed around how I actually think."
              }
            ]
          },
          {
            id: "ch-tech-data",
            title: "Data",
            pages: [
              {
                id: "pg-tech-data-1",
                content: "Turning raw data into actionable insight end to end — API-driven pipelines, cleaning and rules logic to filter noise without over-filtering, KPI development and metric tracking, and clear visualizations built on the 3-30-300 principle."
              }
            ]
          },
          {
            id: "ch-tech-router-hardening",
            title: "Hardening a Home Router",
            pages: [
              {
                id: "pg-tech-router-hardening-1",
                content: "A plain-language walkthrough for locking down a home WiFi router — the settings that matter, why they matter, and the order to change them in."
              }
            ]
          },
          {
            id: "ch-tech-android-dev",
            title: "A Path Into Android Development",
            pages: [
              {
                id: "pg-tech-android-dev-1",
                content: "A project-based path into Android app development from zero — what to build first and the order that keeps a beginner moving instead of stuck."
              }
            ]
          },
          {
            id: "ch-tech-data-privacy",
            title: "A Practical Guide to Data Privacy",
            pages: [
              {
                id: "pg-tech-data-privacy-1",
                content: "Start from the uncomfortable premise: if a service is free, you're usually what's being sold. Every day, ordinary tech collects a startling amount about you — not just your name and contacts, but a device fingerprint (IP, screen size, fonts, battery, OS, browser) precise enough that no two setups look alike, plus a running log of where you go, what you click, what you watch, and what you buy."
              },
              {
                id: "pg-tech-data-privacy-2",
                content: "Don't be reassured by the word &ldquo;anonymous.&rdquo; Stripped of your name, data can still be matched back to you — a few points like where you sleep and where you work are usually enough. Researchers have re-identified real people from &ldquo;anonymized&rdquo; movie ratings and location sets that were supposed to be safe to release."
              },
              {
                id: "pg-tech-data-privacy-3",
                content: "And it doesn't sit still — it's bought and sold. A whole broker industry stitches app data, purchases, and public records into detailed profiles and sells them to advertisers, insurers, and, increasingly, the government. Once a copy is out there you've lost control of it: more copies mean more breaches, more exposure, and decisions made about you from a profile you never saw."
              },
              {
                id: "pg-tech-data-privacy-4",
                content: "You can't opt out of all of it, but the floor is higher than most people think. Harden your home router — change the DNS, kill the default admin login, disable remote access, isolate smart devices on their own band. Use a password manager with long, unique passwords. Audit app permissions; that game doesn't need your microphone. Block trackers in your browser. And delete the accounts you stopped using: you stopped using it, it didn't stop using you."
              },
              {
                id: "pg-tech-data-privacy-5",
                content: "You have rights too, though in the US they're a patchwork. Several states let you see, download, delete, and stop the sale of your data, and tools like SimpleOptOut and JustDeleteMe make the requests less painful. Pennsylvania has no broad law yet — one's been proposed — so for now it's federal protections plus breach-notification rules. None of this means going off-grid. It just means refusing to hand everything over by default."
              },
              {
                id: "pg-tech-data-privacy-6",
                content: "<em>General information, not legal advice.</em>"
              }
            ]
          }
        ]
      },
      {
        id: "book-stromboli",
        title: "Stromboli",
        subtitle: "Self-hosted, self-owned",
        coverColor: "#1F3A4C",
        chapters: []
      },
      {
        id: "book-windows-recovery",
        title: "Windows Data Recovery",
        subtitle: "Getting it back",
        coverColor: "#26364A",
        chapters: []
      },
      {
        id: "book-linux",
        title: "Linux",
        subtitle: "Leaving the walled garden",
        coverColor: "#2A3340",
        chapters: []
      }
    ]
  },
  {
    id: "wing-cognitive",
    title: "Cognitive Greenhouse",
    position: "right",
    accent: "#5ef2a0",
    theme: "greenhouse",
    books: [
      {
        id: "book-arboriculture",
        title: "Arboriculture",
        subtitle: "Tending the urban canopy",
        coverColor: "#2D4A2A",
        chapters: [
          {
            id: "ch-arbor-treetenders",
            title: "PHL Tree Tenders",
            pages: [
              {
                id: "pg-arbor-treetenders-1",
                content: "Volunteering with the city's tree-tending community — planting and caring for street trees to strengthen the urban canopy."
              },
              {
                id: "pg-arbor-treetenders-2",
                content: "Volunteers with PHS Tree Tenders, planting and establishing street trees as part of the citywide effort to grow Philadelphia's urban canopy. It's civic work with a documented return: a growing body of urban research ties expanded tree cover to measurably safer, more stable blocks, alongside the more familiar gains in air quality, cooler streets, and stormwater management."
              }
            ]
          },
          {
            id: "ch-arbor-bareroot",
            title: "Bare Root",
            pages: [
              {
                id: "pg-arbor-bareroot-1",
                content: "Planting bare-root trees — handling, positioning, and establishing young trees while they're dormant."
              }
            ]
          },
          {
            id: "ch-arbor-treecare",
            title: "Tree Care",
            pages: [
              {
                id: "pg-arbor-treecare-1",
                content: "The ongoing work of keeping trees healthy — mulching, watering, structural pruning, and monitoring young plantings through their first seasons."
              }
            ]
          },
          {
            id: "ch-arbor-righttree",
            title: "Right Tree, Right Place",
            pages: [
              {
                id: "pg-arbor-righttree-1",
                content: "Matching species to site — choosing trees whose mature size, roots, and needs fit the space, so they thrive instead of fighting the location."
              }
            ]
          }
        ]
      },
      {
        id: "book-horticulture",
        title: "Horticulture",
        subtitle: "Growing with intention",
        coverColor: "#3D5A3A",
        chapters: [
          {
            id: "ch-hort-tropicals",
            title: "Tropicals",
            pages: [
              {
                id: "pg-hort-tropicals-1",
                content: "Philly Plant Dads is a home-run nursery specializing in tropical aroids — propagating, converting, and selling plants alongside a small vending operation at local farmers markets."
              }
            ]
          },
          {
            id: "ch-hort-composting",
            title: "Composting",
            pages: [
              {
                id: "pg-hort-composting-1",
                content: "Volunteer composting for a South Philadelphia community garden — processing food scraps into finished compost for the beds, and building the signage and training materials that keep contributions sorted right."
              }
            ]
          },
          {
            id: "ch-hort-gardening",
            title: "Gardening",
            pages: [
              {
                id: "pg-hort-gardening-1",
                content: "Two plots at a community garden a block from home, and the seasonal rhythm of planting, tending, and harvesting that keeps the beds productive."
              }
            ]
          },
          {
            id: "ch-hort-nutrition",
            title: "Nutrition",
            pages: [
              {
                id: "pg-hort-nutrition-1",
                content: "Feeding plants in a soil-free system — reading the substrate, dialing nutrient solutions, and keeping pon-grown plants fed without over-fertilizing."
              }
            ]
          },
          {
            id: "ch-hort-climbing",
            title: "Climbing",
            pages: [
              {
                id: "pg-hort-climbing-1",
                content: "Training vines upward, intentionally and aesthetically — moss poles and custom climbing apparatus that give aroids something to grip as they mature."
              }
            ]
          },
          {
            id: "ch-hort-builds",
            title: "Build Projects",
            pages: [
              {
                id: "pg-hort-builds-1",
                content: "Physical builds for growing — custom hydroponic planters, a climbing apparatus, and a planted wall installation pairing a grass wall with mounted planted tanks, glow accents, and roses."
              }
            ]
          },
          {
            id: "ch-hort-digs",
            title: "DIGS — Dig Into Gardening Series",
            pages: [
              {
                id: "pg-hort-digs-1",
                content: "Completed DIGS, a six-part Penn State Extension series covering garden science, vegetables, entomology and pollinators, weeds and invasives, native plants, and landscape design — a focused run through the science behind the growing."
              },
              {
                id: "pg-hort-digs-2",
                content: "It draws on topics from the Master Gardener curriculum but is <em>not</em> the Master Gardener program, which is a separate year-long commitment with its own depth and volunteering requirements."
              }
            ]
          }
        ]
      },
      {
        id: "book-hydroponics",
        title: "Hydroponics",
        subtitle: "Growing without soil",
        coverColor: "#1F4A4C",
        chapters: [
          {
            id: "ch-hydro-hydroponics",
            title: "Hydroponics",
            pages: [
              {
                id: "pg-hydro-hydroponics-1",
                content: "Semi-hydroponic growing in pon, a soil-free stone substrate — plus a hydroponic installation for vining aroids built from scratch, with custom planters in a format that doesn't exist off the shelf, tuned for constant water access without the mess of soil."
              }
            ]
          },
          {
            id: "ch-hydro-planting-in-pon",
            title: "Planting in Pon",
            pages: [
              {
                id: "pg-hydro-planting-in-pon-1",
                content: "A step-by-step conversion guide for moving a plant from soil into pon, a soil-free stone substrate — written in plain language for someone doing it for the first time."
              }
            ]
          },
          {
            id: "ch-hydro-why-pon-works",
            title: "Why Pon Works",
            pages: [
              {
                id: "pg-hydro-why-pon-works-1",
                content: "A deeper dive into the science of semi-hydroponics — what pon actually does at the root, why it works, and how to reason about water and nutrients in a soil-free system."
              }
            ]
          }
        ]
      },
      {
        id: "book-cognitive-playbook",
        title: "Cognitive Playbook",
        subtitle: "Tending the mind",
        coverColor: "#26402A",
        chapters: []
      },
      {
        id: "book-philosophy",
        title: "Philosophy",
        subtitle: "First principles",
        coverColor: "#243A2E",
        chapters: []
      },
      {
        id: "book-alices-guide",
        title: "Alice's Guide",
        subtitle: "A field guide",
        coverColor: "#2E4030",
        chapters: []
      },
      {
        id: "book-master-watershed",
        title: "Master Watershed",
        subtitle: "Stewarding the water",
        coverColor: "#1F4A44",
        chapters: []
      },
      {
        id: "book-seeds",
        title: "Seeds",
        subtitle: "Starting from scratch",
        coverColor: "#33402A",
        chapters: []
      }
    ]
  },
  {
    id: "wing-social",
    title: "Social Soundstage",
    position: "right",
    accent: "#ff2d78",
    theme: "soundstage",
    books: [
      {
        id: "book-music",
        title: "Music & Audio Production",
        subtitle: "Each track a design problem",
        coverColor: "#3A2A4C",
        chapters: [
          {
            id: "ch-music-discography",
            title: "Discography",
            pages: [
              {
                id: "pg-music-discography-1",
                content: "Four albums, self-produced: Daytime Dreams (learning to narrate through music), Drifting Awake (a three-part concept album), Wide Eyed (finished but unreleased — finding home in people rather than a place), and I Am Alastair Zeved (in progress).",
                shots: [
                  {
                    src: "/images/music/album-art.jpg",
                    cap: "Latest album — cover art (unreleased)",
                    cover: true
                  }
                ],
                audio: [
                  {
                    src: "/audio/with-love-math.mp3",
                    title: "With Love, Math — teaser"
                  },
                  {
                    src: "/audio/ps-im-home.mp3",
                    title: "P.S. I’m Home — teaser"
                  }
                ]
              },
              {
                id: "pg-music-discography-2",
                content: "Two teasers from the latest, still-unreleased record are below, under its cover art."
              }
            ]
          },
          {
            id: "ch-music-remixes",
            title: "Remixes",
            pages: [
              {
                id: "pg-music-remixes-1",
                content: "A hardstyle remix — rebuilding a track in a new genre, with precision vocal alignment and time-stretching feeding into a full mastering chain."
              }
            ]
          },
          {
            id: "ch-music-production",
            title: "Production",
            pages: [
              {
                id: "pg-music-production-1",
                content: "The craft under the songs — mixing and mastering in REAPER, gain staging, LUFS metering, spectral balance, and vocal editing, each track shaped by hand."
              }
            ]
          },
          {
            id: "ch-music-what-is-production",
            title: "What Is Music Production?",
            pages: [
              {
                id: "pg-music-what-is-production-1",
                content: "Music production is the whole path from an idea to a finished, listenable track, and it wears three hats: writing (the melody, chords, and rhythm — the song you'd still recognize on a bare piano), sound design (choosing and shaping the instruments that carry it), and mixing and mastering (presenting it clearly so it holds up on earbuds, in a car, and in a club). In a home studio one person wears all three — that's you."
              },
              {
                id: "pg-music-what-is-production-2",
                content: "It helps to work to one emotion. Pick a single word — bittersweet, resolute, wide-eyed — and let it be the north star for every choice, because the listener never sees the session; they feel the arc."
              },
              {
                id: "pg-music-what-is-production-3",
                content: "From there it's a sequence, not a single button: build a short loop that already moves you (if eight bars don't, an arrangement won't fix it), give every sound a job so nothing fights for the same space, then sketch the sections — intimate verse, build, wide drop, breathe, final drop, outro. Contrast is what makes the emotion land."
              },
              {
                id: "pg-music-what-is-production-4",
                content: "Vocals go on last, as the narrator — kept close and mostly dry in the verse, given room in the drop. Then you mix for balance first and reach for EQ and compression second, and premaster with headroom (peaks near −6 dBFS) so the master has room to breathe. None of it is one big skill; it's a handful of small ones in order."
              }
            ]
          },
          {
            id: "ch-music-signal-flow",
            title: "Signal Flow",
            pages: [
              {
                id: "pg-music-signal-flow-1",
                content: "Signal flow is the path your sound takes from the moment it's made to the moment it reaches your ears: source, then the track's plugins in order, then the fader, then any sends to buses, then the master. Know the path and you can predict what a change will do; don't, and mixing feels random."
              },
              {
                id: "pg-music-signal-flow-2",
                content: "Order matters because every plugin hears the one before it. A reverb inserted straight onto a vocal runs the whole voice through the room and pushes it back; the same reverb on a shared bus, fed by a send, lets you blend in just enough space while the dry vocal stays close and clear. That one distinction is how you get an in-the-room verse."
              },
              {
                id: "pg-music-signal-flow-3",
                content: "Sends have two modes worth knowing: post-fader follows the track fader (turn the vocal down and its reverb follows) and is what you want most of the time; pre-fader ignores the fader, so you can throw a single word into a delay and pull the voice out from under it."
              },
              {
                id: "pg-music-signal-flow-4",
                content: "Sidechaining lives in the flow too — route the kick to a compressor on the pad or bass so the low end ducks a couple dB on every hit and the kick always has its moment. Get the plumbing right and the emotional choices get easy: clean, direct routes for intimate verses; parallel sends and wider returns for drops that open up."
              }
            ]
          },
          {
            id: "ch-music-gain-staging",
            title: "Gain Staging",
            pages: [
              {
                id: "pg-music-gain-staging-1",
                content: "Gain staging is keeping healthy levels at every step — from the instrument, through the plugins, to the buses, to the master — so nothing distorts and every tool behaves. Think safe water pressure: too little and nothing works, too much and pipes burst."
              },
              {
                id: "pg-music-gain-staging-2",
                content: "The scale that matters in the box is dBFS, where 0 is the hard ceiling; go over and the signal clips into harsh distortion, so you leave headroom. While you build, aim individual tracks around −18 to −10 dBFS at their loudest and the master around −6 dBFS on the drop, with no limiter on the master while you mix."
              },
              {
                id: "pg-music-gain-staging-3",
                content: "Fix levels as early as you can — turn a hot synth down at its own output instead of fighting it later — and level-match inside each plugin chain so you're judging tone, not loudness (the oldest trap in mixing is thinking louder means better). Feed a compressor or saturator its sweet spot, then match the output so bypassed and active sound equally loud."
              },
              {
                id: "pg-music-gain-staging-4",
                content: "Really it's about contrast. Peaks keep you clear of clipping; average loudness tells the story — the verse should feel quieter than the drop on purpose. If the drop sounds crushed instead of big, you're out of headroom: pull everything down together and build size from width, harmony, and layering, not from shoving the faders up."
              }
            ]
          },
          {
            id: "ch-music-routing-buses",
            title: "Routing & Buses",
            pages: [
              {
                id: "pg-music-routing-buses-1",
                content: "This is the plumbing of a session, in plain English. A bus is just a track that other tracks feed into so you can treat them together; a send copies a slice of a track's signal off to a bus without pulling it out of the mix. Get the plumbing right and the emotional choices get easy."
              },
              {
                id: "pg-music-routing-buses-2",
                content: "Buses earn their keep four ways: consistency (one reverb makes everything sound like the same room), speed (one fader moves a whole group), CPU (one plugin instead of thirty), and color (a parallel bus adds grit or glue without touching the dry signal). REAPER gives you two ways to build them — folder buses, where child tracks nest under a parent, and aux buses you feed with sends. Folders for groups like DRUMS, MUSIC, and VOX; aux buses for shared effects like VERB, HALL, and DELAY."
              },
              {
                id: "pg-music-routing-buses-3",
                content: "Sends come in two flavors. Post-fader follows the track's fader — pull the vocal down and its reverb comes with it, which is what you want most of the time. Pre-fader ignores the fader, which is how you get a delay throw: automate a pre-fader send on a single word, drop the vocal for half a beat, and let the echo spotlight that one syllable."
              },
              {
                id: "pg-music-routing-buses-4",
                content: "Sidechaining is what gives the music its bounce. Route the kick to a compressor on the pad or bass through an aux channel, tell the compressor to listen to that channel, and dial in a 2–4 dB duck on every kick. Keep the sub out of it — you want the low end solid, not gasping."
              },
              {
                id: "pg-music-routing-buses-5",
                content: "The core template is small on purpose: DRUMS, MUSIC, and VOX folders plus VERB, HALL, and DELAY sends. Keep a short plate on the vocal for intimate verses, open the hall for wide drops, and you're steering the listener's whole sense of space with a couple of faders. The usual mistakes are double-routing a folder and its children to the master, or looping a bus back into itself — keep the signal flowing one way and it stays clean."
              }
            ]
          },
          {
            id: "ch-music-time-rhythm",
            title: "Time & Rhythm",
            pages: [
              {
                id: "pg-music-time-rhythm-1",
                content: "Rhythm is how music sits on a timeline. A beat is one steady pulse; tempo is how fast those beats arrive, in BPM; a bar is a box holding a fixed number of beats; and a time signature says how many go in each box. 4/4 — four beats to the bar — is home for dance music because your body already understands it: one pulse per step, nothing to think about."
              },
              {
                id: "pg-music-time-rhythm-2",
                content: "Detail lives in the subdivisions (halves, quarters, eighths, sixteenths, triplets) and in where you put the accents. The backbeat — claps and snares on 2 and 4 — is what makes you move; four-on-the-floor, a kick on every beat, is the heartbeat under most of it. For an emotional-but-danceable feel, ~118–128 BPM is the pocket: slower reads reflective, faster reads club."
              },
              {
                id: "pg-music-time-rhythm-3",
                content: "Build a groove from the floor up — kick on every beat, clap on 2 and 4, hats in eighths — then lay a long, slightly dark pad underneath and a simple sub on the root so the low end supports without cluttering."
              },
              {
                id: "pg-music-time-rhythm-4",
                content: "Two tools keep it human: quantization snaps notes to the grid for tightness, but lean on it too hard and the life drains out; humanization adds tiny timing and velocity variations so a programmed part feels played. A little swing — nudging the off-beats late — relaxes the whole thing. The steady grid is what frees the vocal and pads to carry the story."
              }
            ]
          },
          {
            id: "ch-music-synth-building",
            title: "Building a Synth Patch",
            pages: [
              {
                id: "pg-music-synth-building-1",
                content: "A synth is a sound you build instead of record, and Vital is a wavetable synth — its raw material is a set of stored shapes you can scan through. The signal runs a little factory line: MIDI notes tell it what to play, oscillators make the raw sound, a filter shapes the tone, effects add space, and the output sets the level."
              },
              {
                id: "pg-music-synth-building-2",
                content: "Oscillators are the ingredient. A sine is pure and deep (great for sub-bass); a saw is bright and rich (pads and leads); a square is hollow and woody; noise adds breath and attack. Stack copies with unison, nudge them apart with detune, and spread them across the stereo field for width — a little detune is warm, a lot gets messy."
              },
              {
                id: "pg-music-synth-building-3",
                content: "The filter is a sieve for sound. A low-pass keeps the lows and rolls off the highs to make something warmer and darker — perfect for a verse; a high-pass clears mud off sparkle layers so they don't fight the bass. Cutoff is the main tone knob, resonance adds a whistle or vowel at the cutoff, and key-tracking keeps the brightness even across the keyboard."
              },
              {
                id: "pg-music-synth-building-4",
                content: "Envelopes shape how a parameter moves over time — ADSR: attack (how fast it fades in, from an instant pluck to a blooming pad), decay, sustain (the level held while the key is down), and release (the tail after you let go). Put it together and a patch becomes something you design on purpose — a dark pad that blooms in the verse, an open one that widens in the drop — instead of a preset you settled for."
              }
            ]
          },
          {
            id: "ch-music-midi",
            title: "MIDI",
            pages: [
              {
                id: "pg-music-midi-1",
                content: "MIDI is not sound — it's a set of instructions telling an instrument what to play: start this note, stop that one, play it this hard, move this knob over time. An instrument like Vital turns those instructions into audio. Because it's just instructions, MIDI is tiny, fast, and endlessly editable."
              },
              {
                id: "pg-music-midi-2",
                content: "That's what makes it powerful: write an emotional melody once and audition it through a warm pad, a soft lead, or a glassy arp without re-recording a thing — one idea, many feelings. The tradeoff versus audio is easy to hold in your head: MIDI you can still change (notes, key, instrument); audio is the tone captured forever. Write in MIDI for flexibility, bounce to audio when a part is locked, and keep both."
              },
              {
                id: "pg-music-midi-3",
                content: "The messages worth knowing are few: note on and off (pitch), velocity (how hard, usually louder and brighter), pitch bend, and control changes like the mod wheel for vibrato or filter movement and the sustain pedal for holding notes into pad-like tails."
              },
              {
                id: "pg-music-midi-4",
                content: "In practice you either record MIDI from a keyboard or draw it in REAPER's piano roll — move notes in pitch and time, drag their length, set velocity underneath — then hit play and let the instrument voice it. You're editing the performance, not the recording."
              }
            ]
          },
          {
            id: "ch-music-frequency-spectrum",
            title: "The Frequency Spectrum",
            pages: [
              {
                id: "pg-music-frequency-spectrum-1",
                content: "Frequency is just how fast a sound vibrates, measured in Hertz — low frequencies feel deep, high ones feel bright, and the whole audible range runs from about 20 Hz to 20 kHz. Learn where things live on that map and mixing stops being guesswork."
              },
              {
                id: "pg-music-frequency-spectrum-2",
                content: "The bands each have a job. Sub (20–60 Hz) you feel more than hear; bass (60–120 Hz) is punch and note definition; the low-mids (120–400 Hz) are warmth — and where a mix turns to mud. The mids (400 Hz–2.5 kHz) carry clarity and words; presence (2.5–5 kHz) is detail that goes harsh if you overdo it; the air up top (10 kHz+) is shimmer that turns to hiss."
              },
              {
                id: "pg-music-frequency-spectrum-3",
                content: "When two sounds fight for the same band they mask each other, and the fix is usually subtractive: instead of boosting the vocal, dip a small notch out of whatever's covering it. A −2 to −4 dB cut around 2 kHz in the pad does more than any boost, with none of the harshness."
              },
              {
                id: "pg-music-frequency-spectrum-4",
                content: "Two habits keep a mix clean — high-pass anything that isn't kick or bass so the low-mids don't pile up, and roll the lows off your reverb buses so the space doesn't muddy the room. For harshness, sweep a narrow band between 2.5 and 5 kHz, find the spot that stings, and cut it a couple dB: you keep the emotion and lose the sting."
              },
              {
                id: "pg-music-frequency-spectrum-5",
                content: "And keep the bottom mono — club systems sum the lows, so a wide sub can cancel out in the real world. Center the sub and kick, save your width for pads and sparkle, and remember the best EQ move is often just choosing a sound that already fits: a darker pad in the verse, an open one in the drop, so the spectrum makes room for the vocal up close and blooms wide when it counts."
              }
            ]
          },
          {
            id: "ch-music-effects-arrangement",
            title: "Effects & Arrangement",
            pages: [
              {
                id: "pg-music-effects-arrangement-1",
                content: "Most effects share one idea: wet versus dry. Dry is the original sound; wet is the processed version — the reverb tail, the echo, the EQ'd signal. A wet/dry control just balances the two, and the clean way to work is to put reverb or delay on its own bus at 100% wet and blend the amount with each track's send, so the direct sound stays clear and the space is mixed separately."
              },
              {
                id: "pg-music-effects-arrangement-2",
                content: "Reverb is the sound of a room — short and bright feels intimate, long and lush feels epic. A short plate keeps a vocal close but polished; a hall opens the world for pads in a drop. Keep the vocal's plate short and steady across the whole song so it stays close, and send the pads to a bigger space when the drop hits — then EQ the reverb bus to roll off the lows so the space doesn't turn cloudy."
              },
              {
                id: "pg-music-effects-arrangement-3",
                content: "Delay repeats the sound in time and adds rhythm, width, and drama. Time sets when the echo lands, feedback sets how many repeats, and filtering the repeats — rolling off lows and highs — tucks them behind the lead instead of cluttering it."
              },
              {
                id: "pg-music-effects-arrangement-4",
                content: "Arrangement is where the effects earn their keep: the same loop becomes a story through contrast — strip it back to a close, human verse, build tension by opening filters and adding a quiet arp, then release into a wide, rich drop. Bigger should come from width, harmony, and layering, not just from turning it up."
              }
            ]
          },
          {
            id: "ch-music-edm-fundamentals",
            title: "EDM Production Fundamentals",
            pages: [
              {
                id: "pg-music-edm-fundamentals-1",
                content: "Before the genre tricks make sense you need the toolkit, jargon-free. There are only a handful of tools and each does one thing: EQ turns bands up or down, a compressor evens out loud and quiet, a limiter stops the master going over, and a saturator adds warmth to anything lifeless."
              },
              {
                id: "pg-music-edm-fundamentals-2",
                content: "Then the tools that move air. Sidechain makes one sound duck when another hits — the synth breathing under the kick. Automation tells a knob what to do over time; panning slides a sound left or right to give layers room; an LFO or volume-shaper makes pads bounce without a kick. And for space: reverb for depth, delay for echo, a reverse-reverb swell to build emotion, and a stereo widener on pads and vocals — never on the bass."
              },
              {
                id: "pg-music-edm-fundamentals-3",
                content: "Most mix problems have a stock fix. Too harsh? Cut a few dB around 2–5 kHz. Kick disappearing? Sidechain the synth and bass harder. Mix feels flat? Add panning and a little reverb or delay. Muddy vocals? Send them to reverb and delay and duck the sends instead of drowning the dry."
              },
              {
                id: "pg-music-edm-fundamentals-4",
                content: "Chains are just tools in order. A vocal runs EQ → compressor → de-esser, then reverb and delay on sends; a pad runs EQ → sidechain → reverb → widener; a drop lead stacks saturator → EQ → delay → reverb → compressor → sidechain. Learn the order once and you stop reaching randomly."
              },
              {
                id: "pg-music-edm-fundamentals-5",
                content: "None of it is really about the plugins, though. The bigger project is building the ear and the mindset — learning to hear what a track needs and having the tools ready when you do. Get the fundamentals solid and everything genre-specific after them is just seasoning."
              }
            ]
          }
        ]
      },
      {
        id: "book-wedding-vows",
        title: "Wedding & Vows",
        subtitle: "Ceremony and promise",
        coverColor: "#4A2A3E",
        chapters: []
      },
      {
        id: "book-celebrations",
        title: "Celebrations",
        subtitle: "Parties and surprises",
        coverColor: "#4A2A33",
        chapters: []
      },
      {
        id: "book-birth-chart",
        title: "Brian's Birth Chart",
        subtitle: "Written in the stars",
        coverColor: "#3A2A4C",
        chapters: []
      },
      {
        id: "book-rpdr-draft",
        title: "RPDR Draft",
        subtitle: "The season-long draft",
        coverColor: "#4A2440",
        chapters: []
      },
      {
        id: "book-concerts",
        title: "Concerts",
        subtitle: "Live and loud",
        coverColor: "#3E2A4A",
        chapters: []
      },
      {
        id: "book-movies",
        title: "Movies",
        subtitle: "The watch list",
        coverColor: "#2E2A4C",
        chapters: []
      },
      {
        id: "book-date-nights",
        title: "Date Nights",
        subtitle: "Time made for two",
        coverColor: "#4A2A44",
        chapters: []
      }
    ]
  }
];
