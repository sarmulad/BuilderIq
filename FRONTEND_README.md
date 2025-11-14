# BuilderIQ Frontend - Premium UI Guide

## Design System

BuilderIQ features a premium, luxury real estate aesthetic with sophisticated design patterns.

### Color Palette

- **Primary (Navy Blue)**: `hsl(215 85% 20%)` - Trust, professionalism, authority
- **Secondary (Gold)**: `hsl(38 90% 62%)` - Luxury, exclusivity, premium
- **Accent**: Used for interactive elements and highlights
- **Neutrals**: Warm grays for background and text

### Typography

- **Headlines**: Playfair Display (serif) - Editorial, sophisticated
- **Body**: Inter (sans-serif) - Clean, readable, modern
- **Monospace**: Geist Mono - Code and technical content

### Premium Components

#### Advanced Search
- Multi-filter support with active filter pills
- Saved search functionality
- Real-time filtering with advanced options
- Dropdown menus for categorical filters
- Range inputs for numerical values

#### Results Toolbar
- View mode switcher (List/Grid/Map)
- Export functionality (CSV, Excel, PDF)
- Save search feature
- Live statistics (avg value, builder count, expiring count)

#### Incentive Cards
- Gradient accent bar
- Hover animations with lift effect
- Premium shadows (shadow-premium, shadow-premium-hover)
- Interactive favorite button
- Value breakdown with colored badges
- AI content generation button

### Premium Effects

- **Shadows**: Multi-layer shadows for depth
- **Glass Morphism**: Backdrop blur for modern feel
- **Transitions**: Smooth 300ms animations
- **Hover States**: Subtle lift and shadow changes
- **Custom Scrollbars**: Themed to match brand

### Custom Classes

\`\`\`css
.shadow-premium        /* Subtle multi-layer shadow */
.shadow-premium-hover  /* Enhanced shadow on hover */
.glass-morphism        /* Frosted glass effect */
.animate-in            /* Fade and slide animation */
.premium-gradient      /* Navy gradient background */
\`\`\`

### Best Practices

1. Always use semantic colors (accent, muted, foreground)
2. Maintain consistent spacing (p-4, p-6, gap-3, gap-6)
3. Use rounded corners (rounded-lg, rounded-xl)
4. Apply hover states to interactive elements
5. Include loading states for async operations
6. Show visual feedback for user actions

### Responsive Design

- Mobile-first approach
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- Grid layouts adapt from 1 to 3 columns
- Touch-friendly button sizes on mobile
- Collapsible filters on small screens

### Accessibility

- Semantic HTML elements
- ARIA labels where needed
- Keyboard navigation support
- Focus states with ring utilities
- Color contrast meets WCAG AA standards
- Screen reader friendly content
