# UE Starter Framework

A starter template for building **content-managed web pages** with **AEM Content Fragments + Universal Editor**. Built 100% on Adobe's official UE architecture.

## Quick Start

```bash
# 1. Clone this repo
git clone https://github.com/SumeerP/ue-starter-framework.git
cd ue-starter-framework

# 2. Install dependencies
npm install

# 3. Configure AEM connection
cp .env.example .env
# Edit .env with your AEM Author host

# 4. Start dev server (HTTPS required for UE)
npm start

# 5. Deploy to GitHub Pages
npm run deploy
```

## Architecture

This project is the **Remote App** in Adobe's [4-block UE architecture](https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/implementing/developing/universal-editor/architecture):

```
Universal Editor (Editor) → Our React App (Remote App) → UE Service (API Layer) → AEM (Persistence)
```

All UE instrumentation uses official `data-aue-*` attributes per [Adobe's spec](https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/implementing/developing/universal-editor/attributes-types).

## Project Structure

```
src/
├── helpers/           # Thin convenience wrappers
│   ├── useUEProps.js  # Generates data-aue-* attribute objects
│   ├── useIsPreview.js
│   └── componentRegistry.js
├── containers/        # Reusable containers
│   └── PageContainer.jsx
├── components/        # Starter components
│   ├── Hero.jsx, Title.jsx, RichText.jsx
│   ├── ImageBlock.jsx, CTA.jsx
│   ├── ColumnLayout.jsx, Separator.jsx
├── pages/             # Demo pages
│   ├── HomePage.jsx, AboutPage.jsx
├── layout/            # App shell
├── api/useGraphQL.js  # AEM headless client
└── utils/fetchData.js # AEM connection utilities
```

## Starter Components

| Component | AEM Fields | UE Types |
|-----------|-----------|----------|
| Hero | title, image | text, media |
| Title | title | text |
| RichText | text | richtext |
| ImageBlock | image, altText, caption | media, text |
| CTA | label, url, variant | text |
| ColumnLayout | layout, column1/2/3 | container |
| Separator | _(none)_ | _(none)_ |

## Adding a New Component

### Step 1: Create the AEM Content Fragment Model

In AEM, create a CF model with your fields.

### Step 2: Create the React component

```jsx
// src/components/Banner.jsx
import React from 'react';
import { useUEProps } from '../helpers';

const Banner = ({ title, subtitle, _path, isPreview }) => {
    const ue = useUEProps(_path, 'Banner');

    return (
        <div className="ue-banner" {...ue.container()}>
            <h1 {...ue.prop('title', 'text')}>{title}</h1>
            <p {...ue.prop('subtitle', 'text')}>{subtitle}</p>
        </div>
    );
};

export default Banner;
```

Or use raw `data-aue-*` attributes directly:

```jsx
const Banner = ({ title, subtitle, _path }) => (
    <div data-aue-resource={`urn:aemconnection:${_path}/jcr:content/data/master`}
         data-aue-type="reference" data-aue-filter="cf" data-aue-label="Banner">
        <h1 data-aue-prop="title" data-aue-type="text">{title}</h1>
        <p data-aue-prop="subtitle" data-aue-type="text">{subtitle}</p>
    </div>
);
```

### Step 3: Register it

```js
// src/helpers/componentRegistry.js
import Banner from '../components/Banner';

const COMPONENT_MAP = {
    // ... existing
    'banner': Banner,
};
```

### Step 4: Update the GraphQL query

Add `... on BannerModel { ... }` to your persisted query's `references` block.

**That's it!**

## Creating a New Page

```jsx
// src/pages/ContactPage.jsx
import PageContainer from '../containers/PageContainer';

const ContactPage = () => (
    <PageContainer
        query="vyingdigitalpartnersandboxprogram/contact"
        queryKey="contactList"
        label="Contact Page"
    />
);
```

Then add a route in `App.jsx`:
```jsx
<Route path="/contact" element={<ContactPage />} />
```

## UE Definition Files

| File | Purpose |
|------|---------|
| `public/static/component-definition.json` | Components available in UE "Add" panel |
| `public/static/model-definition.json` | Properties panel fields per component |
| `public/static/filter-definition.json` | Allowed children per container type |

## Tech Stack

- **React 18** + Vite 5
- **@adobe/aem-headless-client-js** — GraphQL persisted queries
- **UE CORS Library** — `universal-editor-service.adobe.io/cors.js`
- **react-helmet-async** — UE connection meta tags
- **SCSS** — Spectrum-inspired design tokens
- **gh-pages** — GitHub Pages deployment
