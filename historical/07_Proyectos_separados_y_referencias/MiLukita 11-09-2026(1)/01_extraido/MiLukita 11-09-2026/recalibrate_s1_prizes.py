from fractions import Fraction
from math import comb

def p(n, k, picks=6):
    return Fraction(comb(picks, k) * comb(n-picks, picks-k), comb(n, picks))

def rtp(n, table, price=1):
    return sum(p(n, k) * prize for k, prize in table.items()) / price

candidates = {
    'loteria_29_current': (29, {6:7000, 5:320, 4:46, 3:5}),
    'loteria_29_adjusted': (29, {6:7000, 5:320, 4:46, 3:6}),
    'loteria_39_s1': (39, {6:50000, 5:1167, 4:108, 3:10, 2:1}),
    'loteria_59_current': (59, {6:500000, 5:10000, 4:250, 3:25, 2:4}),
    'loteria_59_adjusted': (59, {6:500000, 5:10000, 4:250, 3:25, 2:5}),
}
for name, (n, table) in candidates.items():
    value = rtp(n, table)
    print(name, table, float(value), f'{float(value)*100:.6f}%')

# For roulette, winning pockets are floor((n-1)/2) for color and parity in these odd-pocket wheels.
for name, pockets, price, payout in [
    ('ruleta_17_current',17,5,9),
    ('ruleta_17_s1',17,1,2),
    ('ruleta_27_current',27,9,16),
    ('ruleta_27_s1',27,1,2),
    ('ruleta_37_current',37,4,7),
    ('ruleta_37_s1',37,1,2),
]:
    wins=(pockets-1)//2
    value=Fraction(wins*payout,pockets*price)
    print(name, f'{float(value)*100:.6f}%', 'gross_hold', f'{float(1-value)*100:.6f}%')
