# Solver Mutant Test Plan

Future governed tests must inject wrong solver/version/unit/sign/boundary condition/load/material, stale geometry, duplicate load, corrupted result, non-convergence ignored, fake output and output from another project. Expected behavior is rejection, quarantine or typed UNKNOWN/FAILED—not fabricated success. Expensive solver tests are not executed in this order.
