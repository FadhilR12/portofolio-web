// Tailwind Play CDN config — palette from referensi/color_pallete.png
tailwind.config = {
  theme: {
    extend: {
      colors: {
        porto: {
          bg: '#DCE0D9',      // Alabaster Grey  — page background
          surface: '#ECEEEA', // lighter Alabaster — cards / panels
          ink: '#31081F',     // Midnight Violet — headings, body text, dark surfaces
          accent: '#6B0F1A',  // Black Cherry    — primary CTA, highlights
          muted: '#595959',   // Charcoal        — secondary text
          soft: '#808F85',    // Grey Olive      — borders, chips, secondary UI
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      maxWidth: {
        layout: '77rem',
      },
      keyframes: {
        'hero-float': {
          '0%, 100%': { transform: 'translateY(0) rotate(0)' },
          '50%': { transform: 'translateY(var(--float-y, 16px)) rotate(var(--float-rotate, 4deg))' },
        },
        marquee: {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(calc(-100% - var(--gap)))' },
        },
        ripple: {
          '0%, 100%': { transform: 'translate(-50%, -50%) scale(1)' },
          '50%': { transform: 'translate(-50%, -50%) scale(0.9)' },
        },
      },
      animation: {
        'hero-float': 'hero-float 7s ease-in-out infinite',
        marquee: 'marquee var(--duration, 40s) linear infinite',
        ripple: 'ripple 3.4s ease infinite',
      },
    },
  },
};
