from fractions import Fraction
from math import comb

def pct(value):
    return f"{float(value * 100):.8f}%"

den = comb(13, 3)
p3 = Fraction(comb(3, 3) * comb(10, 0), den)
p2 = Fraction(comb(3, 2) * comb(10, 1), den)
p1 = Fraction(comb(3, 1) * comb(10, 2), den)
p0 = Fraction(comb(3, 0) * comb(10, 3), den)

paytable = {3: 700, 2: 35, 1: 4}
expected = p3 * paytable[3] + p2 * paytable[2] + p1 * paytable[1]
ticket = Fraction(10, 1)

print("TRIO_13")
for matches, probability in [(3, p3), (2, p2), (1, p1), (0, p0)]:
    print(f"p_{matches}", pct(probability))
print("ev_creditos", f"{float(expected):.8f}")
print("rtp", pct(expected / ticket))
print("margen", pct(1 - expected / ticket))

print("MERCADO_VIRTUAL_SI_NO")
print("contrato_si_gana", "100 creditos virtuales si ocurre; 0 si no ocurre")
print("precio_60", "60 creditos por contrato; valor implicito 60% antes de comision")
print("comision_liquidacion", "2% solo sobre ganancia virtual positiva; 0 en piloto")
