
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				grace: {
					100: 'hsl(var(--grace-100))',
					200: 'hsl(var(--grace-200))',
					blue: 'hsl(var(--grace-blue))',
					gold: 'hsl(var(--grace-gold))'
				},
				lightBeige: 'hsl(var(--light-beige))',
				softPeach: 'hsl(var(--soft-peach))',
				/* ---- Selah brand palette ---- */
				paper: 'hsl(var(--paper))',
				sand: 'hsl(var(--sand))',
				line: 'hsl(var(--line))',
				ink: {
					DEFAULT: 'hsl(var(--ink))',
					soft: 'hsl(var(--ink-soft))'
				},
				sage: {
					DEFAULT: 'hsl(var(--sage))',
					soft: 'hsl(var(--sage-soft))'
				},
				clay: {
					DEFAULT: 'hsl(var(--clay))',
					soft: 'hsl(var(--clay-soft))'
				},
				gold: {
					DEFAULT: 'hsl(var(--gold))',
					soft: 'hsl(var(--gold-soft))'
				},
				plum: 'hsl(var(--plum))',
				sky: 'hsl(var(--sky))',
				forest: {
					DEFAULT: 'hsl(var(--forest))',
					soft: 'hsl(var(--forest-soft))'
				},
				lavender: {
					DEFAULT: 'hsl(var(--lavender))',
					soft: 'hsl(var(--lavender-soft))'
				},
				mood: {
					happy: 'hsl(var(--mood-happy))',
					calm: 'hsl(var(--mood-calm))',
					anxious: 'hsl(var(--mood-anxious))',
					grateful: 'hsl(var(--mood-grateful))'
				},
			},
			backgroundImage: {
				'dawn': 'linear-gradient(150deg,#E9B98A 0%,#C26B4A 45%,#7A6A86 100%)',
				'sage-grad': 'linear-gradient(150deg,#8FB089 0%,#6E8E70 100%)',
				'vesper': 'radial-gradient(120% 90% at 50% 18%,#3a2f49 0%,#241d2d 55%,#171320 100%)',
			},
			boxShadow: {
				'soft': '0 10px 30px -12px rgba(60,45,30,0.18)',
				'glow-clay': '0 12px 28px -8px rgba(194,107,74,0.45)',
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'fade-in': {
					'0%': {
						opacity: '0',
						transform: 'translateY(10px)'
					},
					'100%': {
						opacity: '1',
						transform: 'translateY(0)'
					}
				},
				'fade-out': {
					'0%': {
						opacity: '1',
						transform: 'translateY(0)'
					},
					'100%': {
						opacity: '0',
						transform: 'translateY(10px)'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.3s ease-out',
				'fade-out': 'fade-out 0.3s ease-out'
			},
			fontFamily: {
				'display': ['Cormorant Garamond', 'Georgia', 'serif'],
				'serif': ['EB Garamond', 'Georgia', 'serif'],
				'sans': ['Inter', 'system-ui', 'sans-serif']
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
