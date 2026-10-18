from fractions import Fraction
from math import comb


def hypergeometric_rtp(pool: int, picks: int, prizes: dict[int, int]) -> Fraction:
    total = comb(pool, picks)
    return sum(
        Fraction(comb(picks, matches) * comb(pool - picks, picks - matches), total) * prize
        for matches, prize in prizes.items()
    )


def positional_rtp(digits: int, prizes: dict[int, int]) -> Fraction:
    return sum(
        Fraction(comb(digits, matches) * 9 ** (digits - matches), 10 ** digits) * prize
        for matches, prize in prizes.items()
    )


games = {
    "sueldo_vida_4_de_30": hypergeometric_rtp(30, 4, {4: 21600, 3: 16}),
    "loto_diario_4_de_20": hypergeometric_rtp(20, 4, {4: 2000, 3: 22, 2: 1}),
    "loto_express_3_de_10": hypergeometric_rtp(10, 3, {3: 60, 2: 2}),
    "pick_3_posicional": positional_rtp(3, {3: 500, 2: 13}),
    "pick_4_posicional": positional_rtp(4, {4: 4000, 3: 57, 2: 5}),
}

for name, rtp in games.items():
    print(f"{name}: {float(rtp) * 100:.6f}% ({rtp})")
