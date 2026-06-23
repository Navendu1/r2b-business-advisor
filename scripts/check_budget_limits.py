#!/usr/bin/env python3
"""
Hard Gate: Budget Validator
Ensures estimated startup costs do not exceed available capital.
This is a deterministic gate that LLMs cannot handle reliably.
"""

import yaml
import json
import sys
from pathlib import Path
from typing import Tuple, Dict, Any


def load_passport(passport_path: str) -> Dict[str, Any]:
    """Load the entrepreneur passport YAML."""
    try:
        with open(passport_path, 'r') as f:
            return yaml.safe_load(f)
    except Exception as e:
        print(f"ERROR: Could not load passport from {passport_path}: {e}")
        sys.exit(1)


def check_budget_limits(
    available_capital_usd: float,
    estimated_startup_cost_usd: float,
    idea_name: str = "Unknown Idea"
) -> Tuple[bool, str]:
    """
    Hard gate check: Is the estimated startup cost <= available capital?
    
    Args:
        available_capital_usd: Amount from passport
        estimated_startup_cost_usd: Amount from DPR
        idea_name: Name of the idea (for reporting)
    
    Returns:
        Tuple of (passed: bool, message: str)
    """
    
    if estimated_startup_cost_usd <= available_capital_usd:
        message = (
            f"✅ BUDGET GATE PASSED\n"
            f"   Idea: {idea_name}\n"
            f"   Available Capital: ${available_capital_usd:,.2f}\n"
            f"   Estimated Startup Cost: ${estimated_startup_cost_usd:,.2f}\n"
            f"   Buffer: ${(available_capital_usd - estimated_startup_cost_usd):,.2f}\n"
        )
        return True, message
    else:
        shortfall = estimated_startup_cost_usd - available_capital_usd
        message = (
            f"❌ BUDGET GATE FAILED (HARD STOP)\n"
            f"   Idea: {idea_name}\n"
            f"   Available Capital: ${available_capital_usd:,.2f}\n"
            f"   Estimated Startup Cost: ${estimated_startup_cost_usd:,.2f}\n"
            f"   Shortfall: ${shortfall:,.2f}\n"
            f"\n"
            f"   ACTION REQUIRED:\n"
            f"   1. Reduce startup cost to ≤ ${available_capital_usd:,.2f}\n"
            f"   2. OR increase available capital by ${shortfall:,.2f}\n"
            f"   3. OR reject this idea and pivot\n"
        )
        return False, message


def main():
    """
    Main entry point. Expects two arguments:
    1. Path to entrepreneur_passport.yaml
    2. Path to DPR or JSON with idea estimates
    """
    
    if len(sys.argv) < 3:
        print("Usage: python check_budget_limits.py <passport.yaml> <dpr.json> [idea_name]")
        print()
        print("Arguments:")
        print("  passport.yaml   Path to entrepreneur_passport.yaml")
        print("  dpr.json        Path to DPR JSON with 'estimated_startup_cost_usd'")
        print("  idea_name       Optional: Name of the idea (for reporting)")
        sys.exit(1)
    
    passport_path = sys.argv[1]
    dpr_path = sys.argv[2]
    idea_name = sys.argv[3] if len(sys.argv) > 3 else "Unknown Idea"
    
    # Load passport
    passport = load_passport(passport_path)
    available_capital = passport.get('capital', {}).get('available_investment_usd', 0)
    
    if available_capital <= 0:
        print("ERROR: Available capital not found in passport")
        sys.exit(1)
    
    # Load DPR estimate
    try:
        with open(dpr_path, 'r') as f:
            dpr_data = json.load(f)
        estimated_cost = dpr_data.get('estimated_startup_cost_usd', 0)
    except Exception as e:
        print(f"ERROR: Could not load DPR from {dpr_path}: {e}")
        sys.exit(1)
    
    if estimated_cost <= 0:
        print("ERROR: Estimated startup cost not found in DPR")
        sys.exit(1)
    
    # Run the gate
    passed, message = check_budget_limits(
        available_capital,
        estimated_cost,
        idea_name
    )
    
    print(message)
    
    # Exit code reflects gate status
    sys.exit(0 if passed else 1)


if __name__ == "__main__":
    main()
