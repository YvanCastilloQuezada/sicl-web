from fractions import Fraction
from math import comb

def pct(value):
    return f"{float(value * 100):.8f}%"

def money(value):
    return f"{float(value):.8f}"

print("RULETA")
ruleta_rtp = Fraction(360, 20) * Fraction(1, 37)
print("prob_exacta", pct(Fraction(1, 37)))
print("rtp", pct(ruleta_rtp))
print("margen", pct(1 - ruleta_rtp))

print("\nJACKPOT")
den = comb(20, 5)
expected_fixed = Fraction(0, 1)
for k, payout in [(5, 0), (4, 1200), (3, 240)]:
    probability = Fraction(comb(5, k) * comb(15, 5-k), den)
    expected_fixed += probability * payout
    print(f"p_{k}", pct(probability))
print("p_0", pct(Fraction(comb(5,0)*comb(15,5),den)))
print("p_1", pct(Fraction(comb(5,1)*comb(15,4),den)))
print("p_2", pct(Fraction(comb(5,2)*comb(15,3),den)))
print("ev_fijo", money(expected_fixed))
print("rtp_sin_pozo", pct(expected_fixed / 45))
print("margen_sin_pozo", pct(1 - expected_fixed / 45))
for n in (100, 1000):
    pool = Fraction(18400, 1) + Fraction(35, 100) * 45 * n
    p_any = 1 - (1 - Fraction(1, den)) ** n
    pool_ev_per_ticket = pool * p_any / n
    total_ev = expected_fixed + pool_ev_per_ticket
    print(f"n_{n}_pozo", money(pool))
    print(f"n_{n}_p_alguien_5", pct(p_any))
    print(f"n_{n}_ev_pozo_por_ticket", money(pool_ev_per_ticket))
    print(f"n_{n}_rtp_total", pct(total_ev / 45))
    print(f"n_{n}_margen_total", pct(1 - total_ev / 45))

print("\nBINGO")
bingo_rtp = Fraction(450, 35) * Fraction(1, 3)
print("p_cartilla", pct(Fraction(1,3)))
print("rtp", pct(bingo_rtp))
print("margen", pct(1-bingo_rtp))

print("\nLOTERIA")
den_lot = comb(49, 6)
expected_lot = Fraction(0, 1)
for k, payout in [(6, 9000), (5, 1500), (4, 250), (3, 40), (2, 0), (1, 0), (0, 0)]:
    probability = Fraction(comb(6,k)*comb(43,6-k), den_lot)
    expected_lot += probability*payout
    print(f"p_{k}", pct(probability))
print("ev", money(expected_lot))
print("rtp", pct(expected_lot/Fraction(25,1)))
print("margen", pct(1-expected_lot/Fraction(25,1)))

print("\nBONOS_LOTERIA_PROPUESTOS")
p_5_plus_bonus = Fraction(comb(6,5)*comb(43,1), den_lot) * Fraction(1,43)
p_4_plus_bonus = Fraction(comb(6,4)*comb(43,2), den_lot) * Fraction(2,43)
p_no_prize = sum(Fraction(comb(6,k)*comb(43,6-k), den_lot) for k in (0,1,2))
safe_ball_rtp = p_no_prize * Fraction(2,25)
monthly_pool_rtp = p_no_prize * Fraction(2,100)
new_lottery_ev = (Fraction(750,1)*Fraction(comb(6,3)*comb(43,3),den_lot) + Fraction(4500,1)*Fraction(comb(6,4)*comb(43,2),den_lot) + Fraction(28000,1)*Fraction(comb(6,5)*comb(43,1),den_lot) + Fraction(170000,1)*Fraction(comb(6,6)*comb(43,0),den_lot))
print("p_5_mas_bola_extra", pct(p_5_plus_bonus))
print("p_4_mas_bola_extra", pct(p_4_plus_bonus))
print("p_sin_premio_principal", pct(p_no_prize))
print("rtp_bola_segura_2cr", pct(safe_ball_rtp))
print("rtp_pozo_mensual_2pct_solo_perdedores", pct(monthly_pool_rtp))
print("rtp_tabla_loteria_propuesta", pct(new_lottery_ev/Fraction(25,1)))
print("rtp_total_loteria_propuesto", pct(new_lottery_ev/Fraction(25,1)+safe_ball_rtp+monthly_pool_rtp))
print("margen_total_loteria_propuesto", pct(1-(new_lottery_ev/Fraction(25,1)+safe_ball_rtp+monthly_pool_rtp)))

print("\nMINIRULETA_CON_POZO_PROPUESTO")
for n in (7,13,21,27):
    base_rtp = Fraction(77,100)
    pool_rtp = Fraction(5,100) * (1-Fraction(1,n))
    print(n, "premio_base_por_10cr", f"{float(base_rtp*10*n):.2f}", "rtp_base", pct(base_rtp), "rtp_pozo_aprox", pct(pool_rtp), "rtp_total_aprox", pct(base_rtp+pool_rtp), "margen_aprox", pct(1-base_rtp-pool_rtp))

print("\nRULETAS_PROPUESTAS_RTP_80_APROX")
for n, payout in [(7,6),(13,10),(21,17),(27,22)]:
    rtp = Fraction(payout,n)
    print(n, payout, pct(rtp), pct(1-rtp))

print("\nJACKPOT_TABLEROS_PROPUESTOS")
for side in range(3, 8):
    cells = side * side
    picks = side
    total = comb(cells, picks)
    print(f"tablero_{side}x{side}", "celdas", cells, "seleccion", picks, "odds_jackpot", f"1/{total}", "p_jackpot", pct(Fraction(1,total)))
    for matches in range(picks, max(picks - 3, 0), -1):
        p = Fraction(comb(picks,matches)*comb(cells-picks,picks-matches),total)
        print(f"  match_{matches}", pct(p))

print("\nTABLAS_JACKPOT_RTP_PROPUESTAS")
paytables = {
    3: {3: 90, 2: 29, 1: 1},
    4: {4: 2000, 3: 50, 2: 25},
    5: {5: 30000, 4: 1200, 3: 140},
    6: {6: 900000, 5: 6000, 4: 2030},
    7: {7: 4000000, 6: 300000, 5: 32000},
}
for side, payouts in paytables.items():
    cells = side * side
    picks = side
    total = comb(cells, picks)
    ev = sum(Fraction(comb(picks,matches)*comb(cells-picks,picks-matches), total) * payout for matches,payout in payouts.items())
    base_rtp = ev / 10
    total_rtp = base_rtp + Fraction(7,100) + Fraction(1,100)
    print(f"{side}x{side}", "pagos", payouts, "ev", money(ev), "rtp_base", pct(base_rtp), "rtp_con_pozo7_y_bonos1", pct(total_rtp), "margen", pct(1-total_rtp))
