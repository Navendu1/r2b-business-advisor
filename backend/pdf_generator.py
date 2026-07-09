import io
from typing import Dict, Any
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors

def generate_dpr_pdf(data: Dict[str, Any]) -> bytes:
    """
    Generates a beautifully styled PDF containing the full business report.
    """
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(
        buffer,
        pagesize=letter,
        rightMargin=54,
        leftMargin=54,
        topMargin=54,
        bottomMargin=54
    )
    
    # Theme palette
    primary_color = colors.HexColor("#1e293b")  # Slate 800
    secondary_color = colors.HexColor("#3b82f6")  # Blue 500
    text_color = colors.HexColor("#334155")  # Slate 700
    light_bg = colors.HexColor("#f8fafc")  # Slate 50
    border_color = colors.HexColor("#e2e8f0")  # Slate 200
    
    styles = getSampleStyleSheet()
    
    # Custom Typography styles
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=24,
        leading=28,
        textColor=primary_color,
        spaceAfter=15
    )
    
    subtitle_style = ParagraphStyle(
        'DocSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=12,
        leading=16,
        textColor=secondary_color,
        spaceAfter=30
    )
    
    h1_style = ParagraphStyle(
        'HeadingSection',
        parent=styles['Heading2'],
        fontName='Helvetica-Bold',
        fontSize=16,
        leading=20,
        textColor=primary_color,
        spaceBefore=15,
        spaceAfter=10,
        keepWithNext=True
    )

    h2_style = ParagraphStyle(
        'HeadingSubsection',
        parent=styles['Heading3'],
        fontName='Helvetica-Bold',
        fontSize=12,
        leading=16,
        textColor=secondary_color,
        spaceBefore=10,
        spaceAfter=5,
        keepWithNext=True
    )
    
    body_style = ParagraphStyle(
        'DocBody',
        parent=styles['BodyText'],
        fontName='Helvetica',
        fontSize=10,
        leading=14,
        textColor=text_color,
        spaceAfter=10
    )
    
    bullet_style = ParagraphStyle(
        'DocBullet',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=10,
        leading=14,
        textColor=text_color,
        leftIndent=15,
        firstLineIndent=-10,
        spaceAfter=5
    )

    bold_body_style = ParagraphStyle(
        'DocBodyBold',
        parent=body_style,
        fontName='Helvetica-Bold'
    )
    
    story = []
    
    # COVER SECTION / TITLE
    idea = data.get("idea", {})
    profile = data.get("profile", {})
    skills = data.get("skills", {})
    market = data.get("market", {})
    financials = data.get("financials", {})
    risks = data.get("risks", {})
    roadmap = data.get("roadmap", {})
    advisor = data.get("advisor", {})
    
    story.append(Spacer(1, 40))
    story.append(Paragraph("DETAILED PROJECT REPORT (DPR)", title_style))
    story.append(Paragraph(f"Business Proposal: {idea.get('title', 'N/A')}", subtitle_style))
    story.append(Spacer(1, 20))
    
    # PROFILE SUMMARY BLOCK
    story.append(Paragraph("1. Entrepreneur Profile Summary", h1_style))
    story.append(Paragraph(f"<b>Founder:</b> {profile.get('founder_name', 'Anonymous')}", body_style))
    story.append(Paragraph(f"<b>Location:</b> {profile.get('location', {}).get('city', 'N/A')}, {profile.get('location', {}).get('country', 'N/A')}", body_style))
    story.append(Paragraph(f"<b>Available Capital:</b> ${profile.get('available_capital_usd', 0.0):,.2f} USD", body_style))
    story.append(Paragraph(f"<b>Weekly Hours Available:</b> {profile.get('weekly_hours_available', 0)} hrs", body_style))
    story.append(Paragraph(f"<b>Background:</b> {profile.get('experience', 'N/A')}", body_style))
    story.append(Paragraph(f"<b>Education:</b> {profile.get('education', 'N/A')}", body_style))
    
    story.append(Paragraph("Skills and Experience Gaps", h2_style))
    story.append(Paragraph("<b>Strengths:</b> " + ", ".join(skills.get("top_strengths", [])), body_style))
    story.append(Paragraph("<b>Transferable Skills:</b> " + ", ".join(skills.get("transferable_skills", [])), body_style))
    story.append(Paragraph("<b>Gaps to Address:</b> " + ", ".join(skills.get("skill_gaps", [])), body_style))
    story.append(Spacer(1, 15))
    
    # BUSINESS OVERVIEW
    story.append(Paragraph("2. Business Concept Overview", h1_style))
    story.append(Paragraph(f"<b>Concept Title:</b> {idea.get('title', 'N/A')}", body_style))
    story.append(Paragraph(f"<b>Suitability Score:</b> {idea.get('suitability_score', 0.0)}%", body_style))
    story.append(Paragraph(f"<b>Description:</b> {idea.get('description', 'N/A')}", body_style))
    story.append(Paragraph(f"<b>Fit Justification:</b> {idea.get('fit_justification', 'N/A')}", body_style))
    story.append(Spacer(1, 15))
    
    # MARKET ANALYSIS
    story.append(Paragraph("3. Market Opportunity Analysis", h1_style))
    story.append(Paragraph(f"<b>Market Demand:</b> {market.get('market_demand', 'N/A')}", body_style))
    story.append(Paragraph(f"<b>Demand Analysis:</b> {market.get('demand_justification', 'N/A')}", body_style))
    
    story.append(Paragraph("Target Customer Segments", h2_style))
    for segment in market.get("target_customer_segments", []):
        story.append(Paragraph(f"• <b>{segment.get('segment_name', 'N/A')}</b> (Est. Size: {segment.get('estimated_count', 'N/A')})<br/>"
                               f"Pain Point: {segment.get('pain_point', 'N/A')}<br/>"
                               f"Willingness to Pay: {segment.get('willingness_to_pay', 'N/A')}", bullet_style))
    
    story.append(Paragraph("Key Market Trends", h2_style))
    for trend in market.get("market_trends", []):
        story.append(Paragraph(f"• {trend}", bullet_style))
        
    story.append(Paragraph("Competitive Landscape", h2_style))
    for competitor in market.get("competitor_profiles", []):
        story.append(Paragraph(f"• <b>{competitor.get('competitor_name', 'N/A')}</b> (Funding: {competitor.get('funding', 'N/A')} | Position: {competitor.get('market_position', 'N/A')})<br/>"
                               f"Founder's Advantage: {competitor.get('why_you_win', 'N/A')}<br/>"
                               f"Threat Level: {competitor.get('threat_level', 'N/A')}", bullet_style))
    
    story.append(Spacer(1, 15))
    
    # FINANCIAL ANALYSIS
    story.append(Paragraph("4. Financial Plan", h1_style))
    story.append(Paragraph(f"<b>Revenue Model Type:</b> {financials.get('revenue_model_type', 'N/A')}", body_style))
    story.append(Paragraph(f"<b>Estimated Break-Even Timeline:</b> {financials.get('break_even_timeline_months', 0)} months", body_style))
    story.append(Paragraph(f"<b>Target Monthly Revenue:</b> ${financials.get('monthly_revenue_target', 0.0):,.2f} USD", body_style))
    story.append(Paragraph(f"<b>Expected Year 1 Profit:</b> ${financials.get('profit_estimate_12_months', 0.0):,.2f} USD", body_style))
    
    # Tables for financials
    story.append(Paragraph("One-Time Startup Costs", h2_style))
    startup_costs = financials.get("startup_costs_breakdown", [])
    if startup_costs:
        table_data = [["Category", "Estimated Cost"]]
        total_startup = 0.0
        for item in startup_costs:
            table_data.append([item.get("category", "N/A"), f"${item.get('amount', 0.0):,.2f}"])
            total_startup += item.get("amount", 0.0)
        table_data.append(["<b>Total Startup Capital Required</b>", f"<b>${total_startup:,.2f}</b>"])
        
        t = Table(table_data, colWidths=[300, 150])
        t.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,0), primary_color),
            ('TEXTCOLOR', (0,0), (-1,0), colors.white),
            ('ALIGN', (0,0), (-1,-1), 'LEFT'),
            ('FONTNAME', (0,0), (-1,0), 'Helvetica-Bold'),
            ('BOTTOMPADDING', (0,0), (-1,0), 6),
            ('BACKGROUND', (0,1), (-1,-1), light_bg),
            ('GRID', (0,0), (-1,-1), 1, border_color),
            ('ROWBACKGROUNDS', (0,1), (-1,-2), [colors.white, light_bg])
        ]))
        story.append(t)
        
    story.append(Paragraph("Monthly Operating Costs", h2_style))
    operating_costs = financials.get("monthly_operating_costs_breakdown", [])
    if operating_costs:
        table_data = [["Category", "Monthly Cost"]]
        total_operating = 0.0
        for item in operating_costs:
            table_data.append([item.get("category", "N/A"), f"${item.get('amount', 0.0):,.2f}"])
            total_operating += item.get("amount", 0.0)
        table_data.append(["<b>Total Monthly Operating Costs</b>", f"<b>${total_operating:,.2f}</b>"])
        
        t = Table(table_data, colWidths=[300, 150])
        t.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,0), primary_color),
            ('TEXTCOLOR', (0,0), (-1,0), colors.white),
            ('ALIGN', (0,0), (-1,-1), 'LEFT'),
            ('FONTNAME', (0,0), (-1,0), 'Helvetica-Bold'),
            ('BOTTOMPADDING', (0,0), (-1,0), 6),
            ('BACKGROUND', (0,1), (-1,-1), light_bg),
            ('GRID', (0,0), (-1,-1), 1, border_color),
            ('ROWBACKGROUNDS', (0,1), (-1,-2), [colors.white, light_bg])
        ]))
        story.append(t)

    story.append(Spacer(1, 15))
    story.append(PageBreak())
    
    # RISKS & COMPLIANCE
    story.append(Paragraph("5. Risk Mitigation & Compliance Validation", h1_style))
    story.append(Paragraph(f"<b>Legal Verdict:</b> {risks.get('legal_verdict', 'N/A')}", body_style))
    story.append(Paragraph(f"<b>Compliance Details:</b> {risks.get('legal_message', 'N/A')}", body_style))
    
    story.append(Paragraph("Doom Scenarios Failure Mode Analysis", h2_style))
    for scenario in risks.get("doom_scenarios", []):
        story.append(Paragraph(f"<b>Scenario {scenario.get('rank', 'N/A')}: {scenario.get('scenario', 'N/A')}</b>", bold_body_style))
        story.append(Paragraph(f"Probability: {scenario.get('probability', 'N/A')} | Impact: {scenario.get('impact', 'N/A')}", body_style))
        story.append(Paragraph("Early Warning Signs: " + ", ".join(scenario.get("early_warning_signs", [])), body_style))
        story.append(Paragraph(f"Mitigation Strategy: {scenario.get('mitigation', 'N/A')}", body_style))
        story.append(Spacer(1, 5))
    
    story.append(Spacer(1, 15))
    
    # ACTION PLAN (ROADMAP)
    story.append(Paragraph("6. Step-by-Step Action Plan (Launch Roadmap)", h1_style))
    
    for wk in ["week_1_validation", "week_2_setup", "week_3_mvp", "week_4_marketing"]:
        week_data = roadmap.get(wk, {})
        if week_data:
            wk_title = wk.replace("_", " ").title()
            story.append(Paragraph(f"<b>{wk_title}:</b>", bold_body_style))
            for deliverable in week_data.get("deliverables", []):
                story.append(Paragraph(f"• {deliverable}", bullet_style))
            story.append(Paragraph(f"Success Criteria: {week_data.get('success_criteria', 'N/A')}", body_style))
            story.append(Spacer(1, 5))
            
    story.append(Spacer(1, 15))
    
    # GOVERNMENT SCHEMES & LOCAL SUPPORT
    story.append(Paragraph("7. Regional Government Schemes & Grants", h1_style))
    for scheme in advisor.get("government_schemes", []):
        story.append(Paragraph(f"• <b>{scheme.get('scheme_name', 'N/A')}</b> ({scheme.get('type', 'N/A')})<br/>"
                               f"Description: {scheme.get('description', 'N/A')}<br/>"
                               f"Application Instructions: {scheme.get('link_or_instructions', 'N/A')}", bullet_style))
    
    story.append(Spacer(1, 10))
    story.append(Paragraph("Final Advisor Recommendations", h2_style))
    story.append(Paragraph(advisor.get("final_recommendation", "N/A"), body_style))
    
    # Build document
    doc.build(story)
    pdf_bytes = buffer.getvalue()
    buffer.close()
    return pdf_bytes
