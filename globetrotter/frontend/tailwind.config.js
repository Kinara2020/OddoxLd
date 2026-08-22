export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        background: '#09090b', // Ultra modern dark
        surface: '#18181b', // Zinc 900
        'surface-hover': '#27272a', // Zinc 800
        border: '#27272a',
        primary: '#14b8a6', // Teal 500
        'primary-hover': '#0d9488', // Teal 600
        accent: '#8b5cf6', // Violet 500 for magical moments
        muted: '#a1a1aa', // Zinc 400 for secondary text
        
        // Legacy colors to prevent immediate breaking
        navy: { DEFAULT: '#09090b' },
        card: '#18181b',
        ink: '#09090b'
      },
      fontFamily: {
        display: ['Inter', 'system-ui', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif']
      },
      boxShadow: {
        'glow-primary': '0 0 20px rgba(20, 184, 166, 0.25)',
        'glow-accent': '0 0 20px rgba(139, 92, 246, 0.25)',
        card: '0 8px 30px rgba(0,0,0,0.4)',
        'card-hover': '0 20px 40px rgba(0,0,0,0.6)',
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(to bottom, rgba(9,9,11,0.2) 0%, rgba(9,9,11,1) 100%)',
        'glass': 'linear-gradient(135deg, rgba(24,24,27,0.8) 0%, rgba(24,24,27,0.4) 100%)',
      },
      keyframes: {
        blob: {
          '0%': { transform: 'translate(0px, 0px) scale(1)' },
          '33%': { transform: 'translate(30px, -50px) scale(1.1)' },
          '66%': { transform: 'translate(-20px, 20px) scale(0.9)' },
          '100%': { transform: 'translate(0px, 0px) scale(1)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        dash: {
          'to': { strokeDashoffset: '-1000' }
        }
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out forwards',
        'slide-up': 'slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'float': 'float 6s ease-in-out infinite',
        'float-delayed': 'float 6s ease-in-out 3s infinite',
        'dash': 'dash 20s linear infinite',
        'blob': 'blob 15s infinite',
      }
    },
  },
  plugins: [],
}