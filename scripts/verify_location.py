#!/usr/bin/env python3
"""
Hard Gate: Location Verification
Validates that the business idea is geographically feasible.
Checks for location-specific blockers and regulatory constraints.
"""

import yaml
import json
import sys
from pathlib import Path
from typing import Tuple, Dict, Any, List


# REGION DEFINITIONS & CONSTRAINTS
REGION_DB = {
    "US": {
        "startup_friendly": True,
        "visa_work_legal": True,
        "avg_startup_cost_adjustment": 1.0,
        "regulatory_barriers": {
            "finance": "SEC oversight, state money transmitter laws",
            "healthcare": "FDA approval required for medical claims",
            "fintech": "Bank Secrecy Act, FinCEN registration",
            "food": "FDA food facility registration",
        }
    },
    "EU": {
        "startup_friendly": True,
        "visa_work_legal": False,  # Non-EU citizens face restrictions
        "avg_startup_cost_adjustment": 1.2,
        "regulatory_barriers": {
            "data": "GDPR compliance mandatory (can be expensive)",
            "finance": "PSD2, ESMA oversight",
            "healthcare": "EU medical device directive",
        }
    },
    "ASIA": {
        "startup_friendly": True,
        "visa_work_legal": False,  # Visa work restrictions vary
        "avg_startup_cost_adjustment": 0.7,
        "regulatory_barriers": {
            "data": "Local data residency requirements",
            "finance": "Central bank oversight varies",
        }
    },
    "OTHER": {
        "startup_friendly": False,
        "visa_work_legal": False,
        "avg_startup_cost_adjustment": 1.5,
        "regulatory_barriers": {
            "all": "Limited startup ecosystem, legal uncertainty",
        }
    }
}

# IDEA CATEGORIES & LOCATION REQUIREMENTS
IDEA_LOCATION_REQUIREMENTS = {
    "agtech": {
        "requires_physical_presence": True,
        "requires_local_network": True,
        "location_critical": True,
        "preferred_countries": ["US", "EU", "ASIA"],
        "note": "Works best in agricultural regions; requires farmer network"
    },
    "fintech": {
        "requires_physical_presence": False,
        "requires_local_network": False,
        "location_critical": False,
        "preferred_countries": ["US", "EU"],
        "note": "Can be remote, but regulatory varies by jurisdiction"
    },
    "saas": {
        "requires_physical_presence": False,
        "requires_local_network": False,
        "location_critical": False,
        "preferred_countries": ["US"],
        "note": "Can be built from anywhere; US market is largest"
    },
    "consulting": {
        "requires_physical_presence": False,  # Can be remote
        "requires_local_network": True,
        "location_critical": True,
        "preferred_countries": ["US", "EU"],
        "note": "Requires existing network; location can enable or block"
    },
    "logistics": {
        "requires_physical_presence": True,
        "requires_local_network": True,
        "location_critical": True,
        "preferred_countries": ["US"],
        "note": "Highly location-dependent; works best in major metros"
    }
}


def load_passport(passport_path: str) -> Dict[str, Any]:
    """Load the entrepreneur passport YAML."""
    try:
        with open(passport_path, 'r') as f:
            return yaml.safe_load(f)
    except Exception as e:
        print(f"ERROR: Could not load passport from {passport_path}: {e}")
        sys.exit(1)


def load_idea(idea_path: str) -> Dict[str, Any]:
    """Load the idea definition (JSON)."""
    try:
        with open(idea_path, 'r') as f:
            return json.load(f)
    except Exception as e:
        print(f"ERROR: Could not load idea from {idea_path}: {e}")
        sys.exit(1)


def get_region_from_country(country: str) -> str:
    """Map country to region."""
    country_upper = country.upper()
    
    us_countries = ["US", "USA", "UNITED STATES"]
    eu_countries = ["UK", "GERMANY", "FRANCE", "ITALY", "SPAIN", "NETHERLANDS", "EU"]
    asia_countries = ["INDIA", "CHINA", "JAPAN", "SINGAPORE", "KOREA", "VIETNAM"]
    
    if country_upper in us_countries:
        return "US"
    elif country_upper in eu_countries:
        return "EU"
    elif country_upper in asia_countries:
        return "ASIA"
    else:
        return "OTHER"


def check_location_feasibility(
    passport: Dict[str, Any],
    idea: Dict[str, Any]
) -> Tuple[bool, List[str], List[str]]:
    """
    Check if the business idea is geographically feasible.
    
    Returns:
        Tuple of (passed: bool, warnings: List[str], blockers: List[str])
    """
    
    warnings = []
    blockers = []
    
    # Extract location info from passport
    location = passport.get('location', {})
    city = location.get('city', 'Unknown')
    country = location.get('country', 'Unknown')
    region = get_region_from_country(country)
    
    # Extract geographic constraints
    constraints = passport.get('constraints', {})
    geographic_limits = constraints.get('geographic_limitations', [])
    
    # Extract idea category
    idea_category = idea.get('category', 'saas').lower()
    idea_name = idea.get('name', 'Unknown Idea')
    
    # Get location requirements for this idea category
    if idea_category not in IDEA_LOCATION_REQUIREMENTS:
        warnings.append(
            f"⚠️  Idea category '{idea_category}' not in database. "
            f"Manual review recommended."
        )
        return None, warnings, blockers  # Neutral result; not a blocker
    
    requirements = IDEA_LOCATION_REQUIREMENTS[idea_category]
    region_data = REGION_DB.get(region, REGION_DB["OTHER"])
    
    # CHECK 1: Is this location startup-friendly?
    if not region_data["startup_friendly"]:
        blockers.append(
            f"🚫 LOCATION BLOCKER: {region} is not startup-friendly. "
            f"Regulatory uncertainty and lack of ecosystem. "
            f"Consider relocating or pivoting idea."
        )
        return False, warnings, blockers
    
    # CHECK 2: Geographic constraints
    if geographic_limits:
        warnings.append(
            f"⚠️  GEOGRAPHIC CONSTRAINT: {', '.join(geographic_limits)}"
        )
        
        # If idea requires physical presence and founder is locked in
        if requirements["requires_physical_presence"]:
            # Check if the locked location is compatible with idea
            if requirements.get("location_critical"):
                warnings.append(
                    f"⚠️  LOCATION CRITICALITY: {idea_name} requires physical presence "
                    f"in specific locations (e.g., agricultural hubs, major metros). "
                    f"Verify {city} is optimal for this business."
                )
    
    # CHECK 3: Regulatory barriers
    sector = idea.get('sector', 'general')
    if sector in region_data["regulatory_barriers"]:
        reg_barrier = region_data["regulatory_barriers"][sector]
        warnings.append(
            f"⚠️  REGULATORY NOTE ({region}): {reg_barrier}"
        )
    
    # CHECK 4: Network requirements
    if requirements["requires_local_network"]:
        existing_network = passport.get('capabilities', {}).get('existing_assets', [])
        if not existing_network:
            warnings.append(
                f"⚠️  NETWORK GAP: {idea_name} requires strong local network. "
                f"Passport shows no existing networks. "
                f"Mitigation: Start with 1-2 network introductions."
            )
    
    # CHECK 5: Non-resident visa issues (EU/ASIA)
    if region in ["EU", "ASIA"]:
        if not region_data["visa_work_legal"]:
            warnings.append(
                f"⚠️  VISA WARNING ({region}): Non-EU/non-local citizens face work visa restrictions. "
                f"Verify your visa status allows business ownership and employment."
            )
    
    # If we reached here, location is feasible (though possibly with mitigations)
    return True, warnings, blockers


def main():
    """
    Main entry point. Expects two arguments:
    1. Path to entrepreneur_passport.yaml
    2. Path to idea definition (JSON)
    """
    
    if len(sys.argv) < 3:
        print("Usage: python verify_location.py <passport.yaml> <idea.json>")
        print()
        print("Arguments:")
        print("  passport.yaml   Path to entrepreneur_passport.yaml")
        print("  idea.json       Path to idea definition JSON")
        sys.exit(1)
    
    passport_path = sys.argv[1]
    idea_path = sys.argv[2]
    
    # Load data
    passport = load_passport(passport_path)
    idea = load_idea(idea_path)
    
    # Run location verification
    passed, warnings, blockers = check_location_feasibility(passport, idea)
    
    # Report
    print("=" * 70)
    print("LOCATION VERIFICATION REPORT")
    print("=" * 70)
    print()
    
    location = passport.get('location', {})
    print(f"Entrepreneur: {passport.get('name', 'Unknown')}")
    print(f"Location: {location.get('city', 'Unknown')}, {location.get('country', 'Unknown')}")
    print(f"Idea: {idea.get('name', 'Unknown Idea')}")
    print()
    
    # Blockers (hard stops)
    if blockers:
        print("🚫 BLOCKERS (HARD STOPS):")
        for blocker in blockers:
            print(f"  {blocker}")
        print()
    
    # Warnings (mitigations needed)
    if warnings:
        print("⚠️  WARNINGS (MITIGATIONS):")
        for warning in warnings:
            print(f"  {warning}")
        print()
    
    # Verdict
    if passed is False:
        print("VERDICT: ❌ NOT FEASIBLE (Blocker detected)")
        sys.exit(1)
    elif passed is True:
        if warnings:
            print("VERDICT: ✅ FEASIBLE (With mitigations)")
        else:
            print("VERDICT: ✅ FEASIBLE (No blockers)")
        sys.exit(0)
    else:
        # Neutral (manual review needed)
        print("VERDICT: ⚠️  INCONCLUSIVE (Manual review recommended)")
        sys.exit(0)


if __name__ == "__main__":
    main()
