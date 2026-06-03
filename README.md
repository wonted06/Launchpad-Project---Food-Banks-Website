# Launchpad-Project---Food-Banks-Website
Kimi Tang - Maestro

eldridge styling : 
    Design System Reference
    Color Palette

    Primary accent:   #2563eb  (blue, buttons, links, highlights)
    Accent gradient:  linear-gradient(135deg, #2563eb, #3b82f6)
    Text primary:     #1f2937
    Text secondary:   #6b7280
    Border:           #dbeafe  (light blue)
    Card bg:          #ffffff
    Page bg:          linear-gradient(135deg, #eef7f2, #e8f0ff)
    Section bg:       #f8fbff
    Error bg/text:    #fee2e2 / #b91c1c
    Accent card bg:   #2563eb (white text on it)
    Tailwind equivalents: blue-600, gray-800, gray-500, blue-100 border, white, blue-50 badge bg, red-100/red-700

    Dark Mode
    Toggle a .dark-theme class on <body>. Swap:

    Page bg → #111827 → #1f2937
    Card bg → #1e293b
    Borders → #334155
    Text primary → #f9fafb, secondary → #cbd5e1
    In Tailwind: use dark: variants throughout.

    Typography
    Font: Arial, Helvetica (body) / Inter (forms)
    Hero heading: clamp(2.2rem, 5vw, 4rem), weight 800, tight line-height
    Section heading: 2.4rem, weight 800
    Card heading: 1.4rem
    Labels: font-weight: 800 (bold labels are a signature of this style)
    Secondary text: #6b7280, italic for empty states
    Border Radius Scale
    Use case	Value	Tailwind
    Large cards / hero	28–32px	rounded-3xl
    Medium cards	18–24px	rounded-2xl
    Small cards / lists	12–16px	rounded-xl
    Inputs / buttons	14–16px	rounded-xl
    Pill badges	999px	rounded-full
    Shadow Scale

    Hero/profile card:  0 24px 70px rgba(37,99,235,0.14)   → large blue-tinted
    Dashboard card:     0 20px 50px rgba(37,99,235,0.08)   → medium blue-tinted
    Metric/stat card:   0 14px 35px rgba(15,23,42,0.08)    → medium dark-tinted
    List/activity:      0 10px 30px rgba(15,23,42,0.08)    → small dark-tinted
    Button (primary):   0 10px 25px rgba(37,99,235,0.25)   → strong blue
    Button (default):   0 8px 22px rgba(15,23,42,0.08)     → soft dark
    In Tailwind use shadow-xl + a custom shadow-blue-200/40 or a config variable.

    Buttons
    Three variants, all font-weight: 800, border-radius: 14px, padding: 12px 20px:


    Primary:   bg gradient blue, white text, blue shadow
            → bg-blue-600 text-white shadow-blue-300/50
    Secondary: #e5e7eb or #f1f5f9, dark text, light border
            → bg-gray-200 text-gray-900
    Default:   white bg, dark text, soft shadow
            → bg-white text-gray-800 shadow-md
    Active:    same as primary (shared with tab buttons)
    Hover:     translateY(-1px) + opacity 0.9
    Inputs / Forms

    border: 1.8px solid #d1d5db;   /* gray-300 */
    border-radius: 14px;
    padding: 12px 14px;
    font-size: 1rem;

    focus:
    border-color: #2563eb;
    box-shadow: 0 0 0 4px rgba(37,99,235,0.14);  /* ring-blue-500/20 */
    Labels are always display: block, font-weight: 800, margin-bottom: 8px. Form groups use margin-bottom: 18px.

    Form rows (two side-by-side fields) use a 2-col grid → 1-col on mobile.

    Layout Structure
    Two layout types:

    Public (landing/auth):


    body.public-page
    header.app-header          ← max-w 1100px, flex, space-between
        .header-brand             ← logo mark + app name
        nav.header-nav            ← links with gap
    main.public-main           ← max-w 1100px, padding 60px 32px
    Dashboard (authenticated):


    body.dashboard-page
    header.app-header          ← max-w 1180px, flex, space-between
        .header-brand
        nav.header-nav            ← tab buttons (white bg, active = blue)
        .header-user              ← logout/account
    main.dashboard-main        ← max-w 1180px, padding 24px 32px 60px
    Grid Patterns
    Pattern	Columns	Breakpoint
    Stats / metrics	4 col	→ 2 col at 900px
    Content overview	2 col	→ 1 col at 650px
    Card library	auto-fill minmax(280px,1fr)	fluid
    Routine cards	auto-fill minmax(320px,1fr)	fluid
    Feature pills	4 col	→ 2 col at 700px
    Form rows	2 col	→ 1 col at 700px
    Footer	5 col (20% each)	→ 2 col at 768px → 1 col at 320px
    Card Patterns
    Standard card:
    white bg + 1px solid #dbeafe + rounded-3xl + blue-tinted shadow

    Accent/highlight card:
    #2563eb bg, all text white — used for one standout stat in a grid

    Hover-lift card (library/routines):

    transform: translateY(-2px) + bigger shadow on hover
    Top accent bar via ::before pseudo-element: 4px tall, full width, scaleX(0→1) on hover
    Auth card:
    Centered, max-w 520px, white, heavy shadow, text-align: center

    Tag / Badge Pattern

    background: #eef4ff;  color: #1e3a8a;
    border-radius: 999px; padding: 6px 10px;
    font-weight: 800; font-size: 0.9rem;
    Used for metadata labels (duration, distance, calories). In Tailwind: bg-blue-50 text-blue-900 rounded-full px-2.5 py-1 text-sm font-extrabold.

    Animations

    /* Section entrance */
    @keyframes fadeIn {
    from { opacity: 0; transform: translateY(6px); }
    to   { opacity: 1; transform: translateY(0); }
    }
    animation: fadeIn 0.2s ease-in-out;

    /* Global transitions */
    transition: background 0.3s ease, color 0.3s ease;  /* theme switch */
    transition: all 0.2s ease;                           /* buttons/cards */
    Error States

    <div class="error-box">Message here</div>
    /* bg #fee2e2, text #b91c1c, rounded-xl, font-weight 700 */
    Tailwind: bg-red-100 text-red-700 rounded-xl p-3 font-bold

    Footer Rules
    5-column layout with section headers + underline accent bar (::before, 3rem wide, accent color)
    Social icons: circular 2.4rem links, hover → white bg
    Bottom ribbon: full-width bar, accent blue bg, height: 3.8rem, centered copyright text
    Font: Roboto (separate from body font)
    Key Tailwind Config Additions
    When setting up Tailwind for this style, extend with:


    theme: { extend: {
    borderRadius: { '4xl': '2rem', '5xl': '2.5rem' },
    boxShadow: {
        'card': '0 20px 50px rgba(37,99,235,0.08)',
        'hero': '0 24px 70px rgba(37,99,235,0.14)',
        'btn':  '0 10px 25px rgba(37,99,235,0.25)',
    },
    fontWeight: { '900': '900' }
    }}