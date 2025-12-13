# 🛒 Smart Shopping Cart Application

A modern, feature-rich shopping cart application built with React, TypeScript, and Tailwind CSS. Experience seamless shopping with real-time calculations, special offers, and an intuitive user interface.

![Shopping Cart Banner](https://via.placeholder.com/1200x300/4F46E5/FFFFFF?text=Smart+Shopping+Cart)

## ✨ Features

### 🎯 Core Functionality
- **Dynamic Product Catalog** - Browse products organized by categories (Bakery, Dairy, Canned)
- **Smart Shopping Cart** - Add, remove, and update quantities with real-time calculations
- **Special Offers System** - Automatic application of discounts and promotions
- **Responsive Design** - Seamless experience across desktop, tablet, and mobile devices
- **Interactive Search** - Quickly find products with live search functionality
- **Category Filtering** - Filter products by category with an elegant sidebar

### 💰 Special Offers
| Offer | Description | Savings |
|-------|-------------|---------|
| 🧀 Cheese BOGO | Buy One Get One Free | 50% off |
| 🥫 Soup Special | Get half-price bread with soup | £0.55 off per bread |
| 🧈 Butter Discount | Premium butter at 33% off | Save £0.40 each |

### 📊 Statistics Dashboard
Track your shopping metrics in real-time:
- 🛒 Total items in cart
- 💷 Current cart total
- 💚 Total savings
- 📦 Order history

## 🎨 Screenshots

### Product Catalog
```
┌─────────────────────────────────────────────────┐
│  🏪 Categories    🔍 Search Products...          │
├─────────────────────────────────────────────────┤
│  🍞 Bread         🥛 Milk         🧀 Cheese      │
│  £1.10            £0.50           £0.90          │
│  [+ Add]          [+ Add]         [+ Add]        │
│                                                   │
│  🥫 Soup          🧈 Butter                      │
│  £0.60            £1.20                          │
│  [+ Add]          [+ Add]                        │
└─────────────────────────────────────────────────┘
```

### Shopping Cart View
```
┌─────────────────────────────────────────────────┐
│  🛒 Shopping Cart (3 items)                      │
├─────────────────────────────────────────────────┤
│  🍞 Bread                          £1.10         │
│  [-] 2 [+]                         £2.20         │
│                                                   │
│  🧀 Cheese                         £0.90         │
│  [-] 4 [+]                 -£1.80 saved          │
│                                    £1.80         │
│                                                   │
│  Subtotal:                         £4.00         │
│  Total Savings:                   -£1.80         │
│  ─────────────────────────────────────────       │
│  Total:                            £2.20         │
│                                                   │
│  [💳 Proceed to Checkout]                        │
└─────────────────────────────────────────────────┘
```

## 🏗️ Project Structure

```
src/
├── types/
│   └── index.ts                 # TypeScript type definitions
├── context/
│   └── AppContext.tsx           # Global state management
├── reducers/
│   └── cartReducer.ts           # Cart state reducer logic
├── data/
│   ├── products.ts              # Product catalog
│   └── specialOffers.ts         # Promotional offers
├── utils/
│   └── calculations.ts          # Price & discount calculations
├── components/
│   ├── Sidebar.tsx              # Category navigation
│   ├── ProductCard.tsx          # Individual product display
│   ├── ProductsGrid.tsx         # Product listing with search
│   ├── CartItem.tsx             # Cart item with controls
│   ├── ShoppingCart.tsx         # Full cart view & checkout
│   ├── SpecialOffers.tsx        # Promotions display
│   └── StatisticsDashboard.tsx  # Shopping metrics
├── App.tsx                      # Main application component
└── index.tsx                    # Application entry point
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/shopping-cart-app.git
   cd shopping-cart-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start the development server**
   ```bash
   npm start
   # or
   yarn start
   ```

4. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📜 Available Scripts

### `npm start`
Runs the app in development mode at [http://localhost:3000](http://localhost:3000).
- Hot reload on file changes
- Displays lint errors in console

### `npm test`
Launches the test runner in interactive watch mode.
- Run unit tests for components
- See test coverage reports

### `npm run build`
Creates an optimized production build in the `build` folder.
- Minified and optimized code
- Ready for deployment
- Includes cache-busting hashes

### `npm run eject`
⚠️ **One-way operation** - Exposes all configuration files for full customization.

## 🛠️ Technologies Used

- **React 18** - Modern UI library with hooks
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Lucide React** - Beautiful icon set
- **Context API** - Global state management
- **useReducer Hook** - Complex state logic

## 🎯 Key Features Explained

### Smart Discount System
The application automatically calculates and applies discounts:
- **BOGO on Cheese**: Every 2 cheeses, get 1 free
- **Soup + Bread Combo**: Buy soup to unlock half-price bread
- **Butter Discount**: Automatic 33% off on all butter

### Responsive Design
- **Desktop**: Full sidebar navigation with grid layout
- **Tablet**: Collapsible sidebar with optimized grid
- **Mobile**: Drawer navigation with touch-friendly controls

### Real-time Calculations
Every action updates:
- Individual item totals
- Applied discounts
- Running subtotal
- Final total with savings

## 🎨 Customization

### Adding New Products
Edit `src/data/products.ts`:
```typescript
{
  id: 'new-product',
  name: 'Product Name',
  price: 2.50,
  category: 'Category',
  icon: '🎁',
  description: 'Product description'
}
```

### Creating New Offers
Edit `src/data/specialOffers.ts`:
```typescript
{
  productId: 'product-id',
  description: 'Special offer text',
  calculate: (quantity, price) => {
    // Return discount amount
    return discountValue;
  }
}
```

### Styling
- Tailwind classes in component files
- Global styles in `src/index.css`
- Theme colors configurable in `tailwind.config.js`

## 📱 Mobile Features

- Touch-friendly buttons and controls
- Swipeable sidebar drawer
- Optimized layout for small screens
- Responsive navigation tabs

## 🔒 Best Practices

- ✅ Modular component architecture
- ✅ TypeScript for type safety
- ✅ Context API for state management
- ✅ Separation of concerns (logic/UI)
- ✅ Reusable utility functions
- ✅ Responsive design principles

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📧 Contact

Your Name - [@yourtwitter](https://twitter.com/yourtwitter)

Project Link: [https://github.com/yourusername/shopping-cart-app](https://github.com/yourusername/shopping-cart-app)

## 🙏 Acknowledgments

- [Create React App](https://github.com/facebook/create-react-app) - Project bootstrapping
- [Tailwind CSS](https://tailwindcss.com/) - Styling framework
- [Lucide Icons](https://lucide.dev/) - Beautiful icon set
- [React Documentation](https://reactjs.org/) - Official React docs

---

**Built with ❤️ using React and TypeScript**

🌟 Star this repo if you found it helpful!
