# EcoSync AI - Carbon Footprint Awareness Platform

[![Open in Bolt](https://bolt.new/static/open-in-bolt.svg)](https://bolt.new/~/sb1-r6iuha53)

A comprehensive carbon footprint tracking and awareness platform that empowers users to understand, track, and reduce their environmental impact through gamification and AI-powered insights.

## Problem Statement

### The Environmental Challenge

Climate change is one of the most pressing challenges of our time, with individual carbon footprints contributing significantly to global greenhouse gas emissions. However, most people lack:

1. **Visibility**: No clear understanding of their personal carbon footprint or how daily decisions impact the environment
2. **Actionability**: Limited access to personalized, practical suggestions for reducing emissions
3. **Motivation**: No immediate feedback or rewards for making sustainable choices
4. **Context**: Difficulty understanding how their footprint compares to others or what "good" looks like

### The Awareness Gap

Traditional carbon calculators are:
- One-time tools with no ongoing engagement
- Complex and technical, alienating average users
- Lacking in personalization and actionable next steps
- Missing social and motivational elements that drive behavior change

### Our Mission

EcoSync AI bridges the gap between awareness and action by making carbon tracking:
- **Continuous**: Integrated into daily life through receipt scanning and habit logging
- **Personalized**: AI-powered recommendations based on individual patterns
- **Rewarding**: Gamification elements that celebrate progress and encourage competition
- **Social**: Community features that create accountability and shared purpose

---

## Solution Architecture

### High-Level Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        EcoSync AI Platform                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐     │
│  │   Frontend   │    │   Backend    │    │   External   │     │
│  │   (React)    │◄──►│  (Supabase)  │◄──►│   Services   │     │
│  └──────────────┘    └──────────────┘    └──────────────┘     │
│         │                   │                   │             │
│         ▼                   ▼                   ▼             │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐     │
│  │  Dashboard   │    │  PostgreSQL  │    │  AI Models   │     │
│  │  Components  │    │   Database   │    │  (Future)    │     │
│  └──────────────┘    └──────────────┘    └──────────────┘     │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Component Architecture

```
src/
├── App.tsx                          # Application entry point
├── components/
│   └── EcoSyncDashboard.tsx        # Main dashboard orchestrator
│       ├── CO2Chart                 # Donut chart for emission breakdown
│       ├── VirtualForest            # Visual progress indicator
│       ├── KPICard                  # Key metrics display
│       ├── ReceiptScanner           # Receipt upload & analysis
│       ├── ChallengeCard            # Gamified challenge display
│       └── AIChatbot                # EcoCoach AI assistant
├── test/
│   ├── EcoSyncDashboard.test.tsx   # Component unit tests
│   └── setup.ts                     # Test configuration
└── index.css                        # Tailwind CSS imports
```

### Data Flow

1. **User Input**: Users upload receipts, log activities, or interact with the chatbot
2. **Processing**: Carbon emissions are calculated using category-specific multipliers
3. **Storage**: Data persists in Supabase PostgreSQL with Row Level Security
4. **Visualization**: Real-time dashboard updates show progress and trends
5. **Feedback**: AI provides personalized recommendations and encouragement

---

## Carbon Tracking Engine

### Emission Categories

The platform tracks carbon emissions across three primary categories:

| Category    | Sub-Categories                          | Data Sources              |
|-------------|----------------------------------------|---------------------------|
| Transport   | Car, Public Transit, Flights, Walking  | User logs, GPS integration|
| Food        | Meat, Dairy, Produce, Processed        | Receipt scanning          |
| Utilities   | Electricity, Gas, Water, Internet     | Manual entry, API feeds   |

### Carbon Multipliers

```typescript
// Emission factors (kg CO2 per unit)
const EMISSION_FACTORS = {
  // Transport (kg CO2 per km)
  transport: {
    car: 0.21,        // Average petrol vehicle
    electric: 0.05,   // Electric vehicle (grid average)
    bus: 0.089,       // Public transit
    train: 0.041,     // Rail transport
    flight: 0.255,    // Short-haul economy
    bike: 0,          // Zero emissions
    walk: 0,          // Zero emissions
  },

  // Food (kg CO2 per kg of food)
  food: {
    beef: 27.0,       // highest impact
    lamb: 39.2,
    pork: 12.1,
    chicken: 6.9,
    fish: 6.1,
    dairy: 3.2,
    vegetables: 0.4,
    fruits: 0.5,
    grains: 1.4,
    legumes: 0.9,     // lowest impact protein
  },

  // Utilities (kg CO2 per unit)
  utilities: {
    electricity_kwh: 0.42,  // Grid average
    gas_m3: 2.0,            // Natural gas
    water_m3: 0.34,         // Water treatment
  },
};
```

### Receipt Analysis Algorithm

The Receipt Scanner component processes uploaded receipts through:

1. **OCR Integration**: Extracts text from receipt images
2. **Item Classification**: Categorizes items using keyword matching
3. **Quantity Extraction**: Parses weights and quantities
4. **Carbon Calculation**: Applies emission factors to each item
5. **Aggregate Reporting**: Summarizes total impact with equivalents

```typescript
function calculateReceiptImpact(items: ReceiptItem[]): number {
  return items.reduce((total, item) => {
    const category = classifyItem(item.name);
    const factor = EMISSION_FACTORS.food[category] || 1.0;
    return total + (item.weight_kg * factor);
  }, 0);
}
```

### Carbon Equivalents

To make emissions tangible, the platform displays equivalents:

| Emission    | Equivalent                            |
|-------------|---------------------------------------|
| 1 kg CO2    | 4.5 km driven in average car          |
| 5 kg CO2    | 1 smartphone charged for 1 year       |
| 10 kg CO2   | 2.5 cheeseburgers                     |
| 100 kg CO2  | 1 tree absorbs in 1 year              |
| 1000 kg CO2 | One flight from NYC to London         |

---

## Gamification Logic

### Eco-Credits System

Users earn Eco-Credits for sustainable actions:

| Action                              | Credits Earned |
|-------------------------------------|----------------|
| Scan receipt                        | +5             |
| Complete a challenge                | +50-100        |
| Reduce weekly footprint by 10%      | +25            |
| Log activities daily (streak)       | +10 per day    |
| Invite a friend (future)            | +100           |
| Share achievement (future)           | +15            |

### Virtual Forest

A visual representation of environmental impact:

```typescript
function calculateVirtualForest(credits: number): ForestState {
  const trees = Math.floor(credits / 100);
  const growthProgress = (credits % 100) / 100;

  return {
    totalTrees: trees,
    currentGrowth: growthProgress,
    milestones: [10, 50, 100, 250, 500, 1000].map(m => ({
      threshold: m,
      unlocked: credits >= m,
    })),
  };
}
```

**Forest Milestones:**
- 100 credits = 1 tree planted
- 500 credits = Grove unlocked
- 1,000 credits = Forest badge
- 10,000 credits = Guardian of Earth title

### Challenge System

Active challenges provide structured goals:

| Challenge Type      | Description                              | Reward  | Duration |
|---------------------|------------------------------------------|---------|----------|
| Meatless Monday     | Go meat-free for one day                  | 50      | Weekly   |
| Commute Commando    | Walk/bike 5 miles instead of driving     | 75      | Weekly   |
| Unplugged Evening   | Turn off electronics for 3 hours        | 100     | One-time |
| Zero-Waste Week     | Complete 7 days without food waste      | 200     | Weekly   |
| Carbon Neutral Day  | Offset your entire day's emissions      | 150     | Daily    |

### Progress Tracking

```typescript
interface ChallengeProgress {
  id: string;
  progress: number;
  total: number;
  progressPercent: number;
  isComplete: boolean;
  isLocked: boolean;
}

function calculateProgress(challenge: Challenge): ChallengeProgress {
  const progressPercent = Math.min((challenge.progress / challenge.total) * 100, 100);
  const isComplete = challenge.progress >= challenge.total;

  return {
    ...challenge,
    progressPercent,
    isComplete,
  };
}
```

### Guilds & Leaderboards (Future)

- Join eco-communities (Guilds) for shared goals
- Compete in weekly footprint reduction challenges
- Earn collective rewards for guild achievements

---

## Tech Stack

### Frontend

| Technology    | Version | Purpose                              |
|---------------|---------|--------------------------------------|
| React         | 18.3    | UI component framework               |
| TypeScript    | 5.5     | Type safety and developer experience |
| Tailwind CSS  | 3.4     | Utility-first styling                |
| Vite          | 5.4     | Build tool and dev server            |
| Lucide React  | 0.344   | Icon library                          |

### Backend & Database

| Technology         | Purpose                                    |
|--------------------|--------------------------------------------|
| Supabase           | Backend-as-a-Service (PostgreSQL + Auth)   |
| PostgreSQL         | Relational database with RLS              |
| Row Level Security | Data isolation per user                    |
| Edge Functions     | Serverless API endpoints (future)          |

### Testing

| Technology              | Purpose                              |
|-------------------------|--------------------------------------|
| Vitest                  | Unit testing framework               |
| @testing-library/react  | React component testing              |
| @testing-library/jest-dom| DOM assertions                       |
| jsdom                   | DOM simulation for tests             |

### Development Tools

| Tool            | Purpose                                    |
|-----------------|--------------------------------------------|
| ESLint          | Code linting and quality                    |
| PostCSS         | CSS preprocessing                          |
| TypeScript ESLint | TypeScript-specific linting rules         |

---

## Installation & Setup

### Prerequisites

- Node.js 18+
- npm or pnpm

### Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm run test

# Build for production
npm run build

# Preview production build
npm run preview
```

### Environment Variables

Create a `.env` file with:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

---

## Accessibility

EcoSync AI is built with accessibility as a core principle:

- **Semantic HTML5**: Proper use of `<header>`, `<main>`, `<section>`, `<article>`, `<aside>`, `<footer>`
- **ARIA Labels**: Descriptive labels on all interactive elements
- **Keyboard Navigation**: Skip links, focus management, logical tab order
- **Screen Reader Support**: `.sr-only` text, live regions, proper headings
- **Focus Indicators**: Visible focus rings on all interactive elements
- **Color Contrast**: WCAG AA compliant color combinations

---

## Testing

The project includes comprehensive unit tests:

```bash
# Run all tests
npm run test

# Run tests with coverage
npm run test:run

# Watch mode
npm run test -- --watch
```

### Test Coverage

- Component rendering verification
- User interaction flows
- Accessibility attribute checks
- Prop validation
- State management

---

## Project Structure

```
ecosync/
├── src/
│   ├── components/
│   │   └── EcoSyncDashboard.tsx    # Main dashboard with all sub-components
│   ├── test/
│   │   ├── EcoSyncDashboard.test.tsx
│   │   └── setup.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── public/
├── dist/                           # Production build output
├── package.json
├── vite.config.ts
├── vitest.config.ts
├── tailwind.config.js
├── tsconfig.json
└── README.md
```

---

## Future Enhancements

### Phase 2
- [ ] OAuth authentication (Google, Apple)
- [ ] Receipt OCR integration (Tesseract.js or cloud API)
- [ ] Real-time carbon API connections
- [ ] Push notifications for challenges

### Phase 3
- [ ] ML-powered emission prediction
- [ ] Social features and leaderboards
- [ ] Carbon offset marketplace
- [ ] Corporate/team accounts

### Phase 4
- [ ] IoT device integration (smart meters)
- [ ] Voice assistant support
- [ ] AR visualization of environmental impact
- [ ] Blockchain-based carbon credit verification

---

## License

MIT License - See LICENSE file for details.

---

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## Acknowledgments

Built with sustainability in mind, for a greener tomorrow.

---

*EcoSync AI - Making sustainable living simple and rewarding*
