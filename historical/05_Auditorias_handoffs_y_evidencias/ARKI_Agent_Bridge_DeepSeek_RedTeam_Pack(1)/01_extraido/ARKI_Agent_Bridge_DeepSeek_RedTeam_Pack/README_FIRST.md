# ARKI Agent Bridge — DeepSeek Independent Red-Team Pack

## Purpose

This package is for an independent adversarial architecture/security review by DeepSeek.

DeepSeek is **not** being asked to implement code or create a competing version of the Bridge.
Its role is:

- independent architecture reviewer;
- security/red-team reviewer;
- failure-mode analyst;
- challenger of assumptions made by ChatGPT and Manus.

## Files included

1. `DEEPSEEK_REVIEW_ORDER.md`
   - Exact review order and required report format.

2. `ARKI_AGENT_BRIDGE_V02_TECHNICAL_SPEC.md`
   - Approved v0.2 technical specification.

3. `ARKI Agent Bridge v0.2A — Implementation Report.md`
   - Manus implementation report for phases 0–4.

4. `arki-agent-bridge-v0.1-audit.md`
   - Technical audit of the original v0.1 seed.

5. `arki-agent-bridge-v0.1.zip`
   - Original v0.1 seed source.

## Important limitation

The actual **v0.2A source-code directory is not present in the materials currently available to ChatGPT**.
Therefore DeepSeek must not treat the v0.2A Implementation Report as equivalent to inspecting v0.2A source code.

If DeepSeek has independent access to the v0.2A source in its environment, it may inspect it.
Otherwise it must mark code-level claims about v0.2A as `UNVERIFIED`.

## Authority

Yvan = Human Authority  
ChatGPT = principal architect / reconciler  
Manus = technical implementer  
DeepSeek = independent reviewer / red team

No AI output is execution authority by itself.
