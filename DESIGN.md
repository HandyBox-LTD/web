# HandyBox Design Library & Element Breakdown

## 1. Design Philosophy: "The Master Craftsman"

The HandyBox visual identity is built on trust, precision, and utility. It mimics the aesthetic of a high-end architectural blueprint combined with the warmth of a job well done.

---

## 2. Global Style Tokens (Blueprint & Amber)

### Colors

- **Primary (Blueprint Blue):** `#1A56DB` — Used for main actions, brand identity, and "verified" states. Represents stability and professional expertise.
- **Accent (Construction Amber):** `#F2994A` — Used for highlighting value, urgency (Emergency jobs), and the "Pro" membership tier.
- **Success (Safety Green):** `#059669` — Used for "Job Completed" states and positive ratings.
- **Base (Worksite Gray):**
  - `bg-slate-50` (Surface)
  - `bg-slate-100` (Borders/Dividers)
  - `text-slate-600` (Body)
  - `text-slate-900` (Headings)

### Typography

- **Headings:** `Plus Jakarta Sans` (Bold/Extra Bold) — Chosen for its modern, geometric look that feels architectural.
- **Body:** `Inter` or `Plus Jakarta Sans` (Medium/Regular) — Optimized for readability in lists and chat messages.

### Elevation & Shapes

- **Roundness:** `8px` (Round Eight) — A balance between industrial (sharp) and approachable (soft).
- **Shadows:** Subtle `shadow-sm` for cards to keep the UI feeling "flat" and blueprint-like, rather than overly layered.

---

## 3. Element Breakdown

### Atoms (Smallest Units)

- **Primary Buttons:** High-contrast blue, 8px radius, white text.
- **Secondary Buttons:** Ghost style with blue border or slate background.
- **Status Badges:**
  - `Emergency`: Amber background with icon.
  - `Verified`: Blue badge with checkmark.
  - `Completed`: Green badge.
- **Input Fields:** Clean white background, 1px slate border, Jakarta Sans placeholder text.

### Molecules (Functional Groups)

- **Job Summary Card:** Contains job title, location (with icon), budget, and time since posted.
- **Pro Endorsement Item:** User avatar, name, skill badge, and a short testimonial quote.
- **Rating Summary:** 5-star display with numerical average and total review count.
- **Filter Chip:** Toggleable badges for categories like "Plumbing", "Electrical", etc.

### Organisms (Complex Components)

- **Top Navigation Bar:** Global header with logo, search, and profile actions.
- **Pro Dashboard Sidebar:** Vertical navigation for "Marketplace", "Earnings", and "Messages".
- **Offer Management View:** A list of incoming offers with "Accept" and "Message" actions.
- **Review Submission Form:** Star rating group + text area + highlight chips (e.g., "Fair Price").

---

## 4. Interaction Patterns

- **Hover States:** Links turn primary blue; cards lift slightly with a shadow transition.
- **Loading States:** Shimmer/Skeleton screens following the layout of the job cards.
- **Feedback:** Toast notifications for "Offer Sent" or "Job Completed".

---

## 5. Accessibility Standards

- Minimum contrast ratio of 4.5:1 for all text.
- Large tap targets (min 44x44px) for the eventual mobile version.
- Clear error states for form validation in the "Post a Job" flow.
