# React + TypeScript + Vite
## Maithili Shark – Web3 E-Commerce Platform

**Tech Stack:** React, Node.js, MongoDB, Solidity, MetaMask, Stripe

A full-stack Web3 e-commerce platform combining decentralized blockchain payments with traditional payment infrastructure.

### Key Features

* Built a complete e-commerce platform with **10+ core features**, including:

  * Product uploads and management
  * Shopping cart functionality
  * Secure checkout flow
  * Order tracking system
  * Vendor and customer dashboards

* Implemented **role-based access control** for customers and vendors, enabling secure multi-user interactions.

* Developed a responsive product and cart management system with full **CRUD operations**, optimizing state updates for improved UI performance.

* Integrated **blockchain-based payments** using Solidity smart contracts and MetaMask.

* Added traditional payment processing using Stripe, providing users with both decentralized and centralized payment options.

* Improved transaction flexibility and security by supporting multiple payment methods.

### Screenshots

#### Homepage

<img width="2548" height="1425" alt="image" src="https://github.com/user-attachments/assets/728673cd-bfcb-4aeb-9a51-48b09727449d" />


#### Product Listing

<img width="2520" height="1286" alt="image" src="https://github.com/user-attachments/assets/6cb7f80d-ce48-4a08-8dde-4e6569361516" />



#### Cart & Checkout

<img width="2019" height="1374" alt="image" src="https://github.com/user-attachments/assets/a25162e7-e8f8-4f48-953f-32895ed81164" />


#### Web3 Payment Integration

<img width="2026" height="1363" alt="image" src="https://github.com/user-attachments/assets/457f923d-c6af-4282-a753-32ed2011638d" />
<img width="2537" height="1519" alt="image" src="https://github.com/user-attachments/assets/bcf8e4d0-84c1-4b5e-b4e3-5c139f6f4bff" />


#### Vendor Dashboard

<img width="2446" height="1310" alt="image" src="https://github.com/user-attachments/assets/ca565df8-468c-4039-9c99-61018bb2696b" />

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config({
  extends: [
    // Remove ...tseslint.configs.recommended and replace with this
    ...tseslint.configs.recommendedTypeChecked,
    // Alternatively, use this for stricter rules
    ...tseslint.configs.strictTypeChecked,
    // Optionally, add this for stylistic rules
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config({
  plugins: {
    // Add the react-x and react-dom plugins
    'react-x': reactX,
    'react-dom': reactDom,
  },
  rules: {
    // other rules...
    // Enable its recommended typescript rules
    ...reactX.configs['recommended-typescript'].rules,
    ...reactDom.configs.recommended.rules,
  },
})
```
