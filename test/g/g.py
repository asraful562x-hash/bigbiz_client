"""
CV / Resume Generator
----------------------
Edit the DATA section below with your details, then run:

    python generate_cv.py

This will create "Asraful_Islam_CV.pdf" in the same folder.

Requirements (install once):
    pip install reportlab
"""

from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.lib import colors
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable, ListFlowable, ListItem
)
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.enums import TA_LEFT, TA_RIGHT

# ============================================================
# 1. EDIT YOUR DATA HERE — everything below is easy to change
# ============================================================

NAME = "MD ASRAFUL ISLAM"
TITLE = "Full-Stack Web Developer"
SUBTITLE = "Mobile & ML/DL (Secondary)"

CONTACT = {
    "location": "Bangladesh",
    "email": "asraful808088@gmail.com",
    "portfolio": ("Portfolio", "https://owner-rouge.vercel.app"),
    "github": ("GitHub", "https://github.com/asraful808088"),
    "linkedin": ("LinkedIn", "https://www.linkedin.com/in/md-asraful-399a86250"),
}

PROFILE = (
    "Dedicated Full-Stack Web Developer, self-taught and highly motivated, with a strong "
    "foundation across modern frontend and backend technologies. Builds fast, adapts quickly, "
    "and ships working products. Carries additional working skills in Mobile Development and "
    "Machine Learning / Deep Learning as secondary strengths, offering flexible support beyond "
    "core web work when a project needs it. Actively seeking a full-time role, internship, or "
    "freelance opportunity to apply this dedication immediately."
)

# Each tuple = (Label, Value)
CORE_SKILLS = [
    ("Frontend", "HTML5, CSS3, SCSS, JavaScript (ES6+), Tailwind CSS, Bootstrap"),
    ("Frontend Frameworks", "React.js, Next.js, Angular, Vue.js, Nuxt.js, Redux"),
    ("Backend", "Node.js (Express, Raw Node), Django, FastAPI, Gin (Go)  —  Intermediate: .NET, Nest.js"),
    ("Languages", "JavaScript, TypeScript, Python, Go, Dart, Java, C#"),
    ("Databases", "PostgreSQL, MySQL, MongoDB, Redis, Elasticsearch"),
    ("Cloud & Services", "Firebase, Cloudinary, Vercel, Render"),
    ("Mobile (Secondary)", "Flutter (Provider, BLoC, Rx-Dart), Java (Android)"),
    ("ML / DL (Secondary)", "Scikit-learn, TensorFlow, Pandas, NumPy"),
    ("Real-Time", "WebSocket / Socket.IO, WebRTC"),
    ("Tools", "Git & GitHub, VS Code, Figma, Adobe XD, Postman, PM2"),
    ("AI Tools", "Claude, ChatGPT, DeepSeek, Google AI Studio, Ollama"),
]

# Each dict: name, url, bullet description
PROJECTS = [
    {
        "name": "NexTrade — Trading Web Application",
        "url": "https://nex-client-kappa.vercel.app/",
        "desc": "Angular frontend with an Express.js backend, styled in SCSS, using Firebase for backend services. Deployed on Vercel.",
    },
    {
        "name": "Chain Hook Wallet — Web Application",
        "url": "https://chain-hook-client.vercel.app",
        "desc": "React.js frontend with a Django backend, styled with Tailwind CSS, backed by PostgreSQL. Deployed on Vercel.",
    },
    {
        "name": "Lyren — Full-Stack Application",
        "url": "https://lyren-client.vercel.app",
        "desc": "Next.js and .NET full-stack build using PostgreSQL and Redis. Deployed on Vercel and Render.",
    },
]

# Each tuple = (Degree/Title, Subtitle or "", Year)
EDUCATION = [
    ("Honours (Bachelor's Degree)", "Final year examinations recently completed", "2020 – 2021"),
    ("Higher Secondary Certificate (HSC)", "", "2020"),
    ("Secondary School Certificate (SSC)", "", "2018"),
]

CURRENTLY_DEEPENING = [
    "React & Next.js — advanced patterns, SSR/SSG, App Router",
    "Flutter & Mobile — BLoC pattern, Rx-Dart, cross-platform apps",
    "AI & Machine Learning — TensorFlow, Scikit-learn, applied model integration",
    "Real-Time Systems — Socket.IO, WebRTC for live, collaborative features",
]

WHAT_I_BRING = [
    "Strong, dependable focus on full-stack web development as a core specialty",
    "Fast adaptation to new tools — ships working solutions under time pressure",
    "Flexible support in mobile and ML/DL when projects call for it",
    "Wide, practical range — from pixel-level frontend detail to backend and deployment",
]

AVAILABILITY = "Open to full-time roles, internships, freelance, and remote work. Available to start immediately."

OUTPUT_FILENAME = "Asraful_Islam_CV.pdf"

# ============================================================
# 2. STYLING — change colors/fonts here if you want a new look
# ============================================================

BLACK = colors.HexColor("#1A1A1A")
DARKGREY = colors.HexColor("#3D3D3D")
MIDGREY = colors.HexColor("#666666")
LIGHTLINE = colors.HexColor("#BBBBBB")

styles = {
    "name": ParagraphStyle("name", fontName="Helvetica-Bold", fontSize=21, textColor=BLACK, leading=24, spaceAfter=3),
    "title": ParagraphStyle("title", fontName="Helvetica-Bold", fontSize=11.5, textColor=DARKGREY, leading=14, spaceAfter=2),
    "subtitle": ParagraphStyle("subtitle", fontName="Helvetica", fontSize=10, textColor=MIDGREY),
    "contact": ParagraphStyle("contact", fontName="Helvetica", fontSize=8.7, textColor=MIDGREY, spaceBefore=3, spaceAfter=5),
    "section": ParagraphStyle("section", fontName="Helvetica-Bold", fontSize=11, textColor=BLACK,
                               spaceBefore=5, spaceAfter=2, letterSpacing=0.5),
    "body": ParagraphStyle("body", fontName="Helvetica", fontSize=9.4, textColor=DARKGREY, leading=12.6, spaceAfter=3),
    "skill_label": ParagraphStyle("skill_label", fontName="Helvetica-Bold", fontSize=9.4, textColor=BLACK, leading=12.6),
    "project_name": ParagraphStyle("project_name", fontName="Helvetica-Bold", fontSize=9.7, textColor=BLACK, spaceBefore=3, spaceAfter=0),
    "bullet": ParagraphStyle("bullet", fontName="Helvetica", fontSize=9.2, textColor=DARKGREY, leading=11.6, leftIndent=12, spaceAfter=0),
    "edu_title": ParagraphStyle("edu_title", fontName="Helvetica-Bold", fontSize=9.5, textColor=BLACK),
    "edu_subtitle": ParagraphStyle("edu_subtitle", fontName="Helvetica", fontSize=8.5, textColor=MIDGREY),
    "edu_year": ParagraphStyle("edu_year", fontName="Helvetica-Bold", fontSize=9.2, textColor=MIDGREY, alignment=TA_RIGHT),
}


def hr(color=BLACK, thickness=1.1, space_before=1, space_after=5):
    return [Spacer(1, space_before), HRFlowable(width="100%", thickness=thickness, color=color), Spacer(1, space_after)]


def section_heading(text):
    flow = [Paragraph(text.upper(), styles["section"])]
    flow += hr(color=BLACK, thickness=1.0, space_before=0, space_after=4)
    return flow


def skill_row(label, value):
    text = f'<font name="Helvetica-Bold">{label}:</font>  {value}'
    return Paragraph(text, styles["body"])


def bullet_list(items):
    return ListFlowable(
        [ListItem(Paragraph(i, styles["bullet"]), leftIndent=12, bulletColor=DARKGREY) for i in items],
        bulletType="bullet", start="•", leftIndent=10,
    )


def build():
    doc = SimpleDocTemplate(
        OUTPUT_FILENAME, pagesize=A4,
        topMargin=12 * mm, bottomMargin=12 * mm, leftMargin=18 * mm, rightMargin=18 * mm,
    )
    story = []

    # Header
    story.append(Paragraph(NAME, styles["name"]))
    story.append(Paragraph(f'{TITLE} &nbsp;|&nbsp; <font color="#666666">{SUBTITLE}</font>', styles["title"]))

    contact_bits = [CONTACT["location"], CONTACT["email"]]
    for key in ("portfolio", "github", "linkedin"):
        label, url = CONTACT[key]
        contact_bits.append(f'<link href="{url}" color="#1A1A1A"><u>{label}</u></link>')
    story.append(Paragraph("   •   ".join(contact_bits), styles["contact"]))
    story += hr(color=LIGHTLINE, thickness=0.8, space_before=0, space_after=8)

    # Profile
    story += section_heading("Profile")
    story.append(Paragraph(PROFILE, styles["body"]))

    # Core Skills
    story += section_heading("Core Skills")
    for label, value in CORE_SKILLS:
        story.append(skill_row(label, value))

    # Projects
    story += section_heading("Projects")
    for p in PROJECTS:
        story.append(Paragraph(
            f'{p["name"]}  <link href="{p["url"]}" color="#1A1A1A"><u>Visit →</u></link>',
            styles["project_name"]
        ))
        story.append(bullet_list([p["desc"]]))

    # Education
    story += section_heading("Education")
    edu_rows = []
    for title, subtitle, year in EDUCATION:
        left_cell = [Paragraph(title, styles["edu_title"])]
        if subtitle:
            left_cell.append(Paragraph(subtitle, styles["edu_subtitle"]))
        edu_rows.append([left_cell, Paragraph(year, styles["edu_year"])])

    edu_table = Table(edu_rows, colWidths=[140 * mm, 34 * mm])
    edu_table.setStyle(TableStyle([
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("TOPPADDING", (0, 0), (-1, -1), 4),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
        ("LEFTPADDING", (0, 0), (-1, -1), 0),
        ("RIGHTPADDING", (0, 0), (-1, -1), 0),
    ]))
    story.append(edu_table)

    # Currently Deepening
    story += section_heading("Currently Deepening")
    story.append(bullet_list(CURRENTLY_DEEPENING))

    # What I Bring
    story += section_heading("What I Bring")
    story.append(bullet_list(WHAT_I_BRING))

    # Availability
    story += section_heading("Availability")
    story.append(Paragraph(AVAILABILITY, styles["body"]))

    doc.build(story)
    print(f"✅ CV generated: {OUTPUT_FILENAME}")


if __name__ == "__main__":
    build()