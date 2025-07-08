# ISI Generator

A web application built with React, TypeScript, and Vite for generating ISI (Important Safety Information) content. The project features a modular component structure, state management, and a modern UI powered by Tailwind CSS.

## Project Structure

```
isi-generator/
├── src/
│   ├── components/         # UI and form components
│   ├── lib/                # Utility functions
│   ├── store/              # State management
│   ├── App.tsx             # Main app component
│   └── main.tsx            # Entry point
├── index.html
├── package.json
├── tailwind.config.js
├── postcss.config.js
└── README.md
```

## Getting Started

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Run the development server:**

   ```bash
   npm run dev
   ```

3. **Build for production:**

   ```bash
   npm run build
   ```

4. **Preview the production build:**
   ```bash
   npm run preview
   ```

## Scripts

- `dev` – Start the development server
- `build` – Build the app for production
- `preview` – Preview the production build

## Customization

- UI components can be found in `src/components/`.
- State logic is managed in `src/store/useIsiStore.ts`.
- Utility functions are in `src/lib/utils.ts`.
