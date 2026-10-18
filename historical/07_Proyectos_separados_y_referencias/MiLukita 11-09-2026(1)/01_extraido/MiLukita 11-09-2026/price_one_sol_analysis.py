from decimal import Decimal, ROUND_HALF_UP

games = [
    ("Ruleta", 1, 0.8378),
    ("Ruleta 7", 1, 0.857143),
    ("Ruleta 17", 5, 0.847059),
    ("Ruleta 27", 9, 0.855967),
    ("Ruleta 37", 4, 0.851351),
    ("Jackpot", 1, 0.850426),
    ("Bingo Flash", 1, 0.850549),
    ("Bingo Keno", 1, 0.850000),
    ("Bingo 75", 1, 0.845636),
    ("Lotería 19", 1, 0.8648),
    ("Lotería 29", 1, 0.8480),
    ("Lotería 39", 6, 0.851485),
    ("Lotería 49", 1, 0.8508),
    ("Lotería 59", 1, 0.8463),
    ("Trío 13", 1, 0.8497),
    ("Sueldo de por vida", 1, 0.848896),
    ("Raspa Digital", 1, 0.850000),
    ("Pick 3", 1, 0.851000),
    ("Pick 4", 1, 0.848200),
    ("Loto Diario", 1, 0.852012),
    ("Loto Express", 1, 0.850000),
]

def money(x):
    return f"S/ {x.quantize(Decimal('0.0001'), rounding=ROUND_HALF_UP)}"

print("juego|precio_actual_cr|rtp|retencion_bruta_por_S1|resultado_tras_12pct_y_2pct|resultado_tras_ISC1pct|resultado_tras_pasarela5pct|precio_1_mismo_premio_rtp")
for name, current_price, rtp in games:
    rtp = Decimal(str(rtp))
    hold = Decimal(1) - rtp
    before = hold
    after_game_tax = hold * Decimal('0.8824') # 12% applied after 2% maintenance deduction
    after_isc = after_game_tax - Decimal('0.01')
    after_gateway = after_isc - Decimal('0.05')
    same_table_rtp_at_one = rtp * Decimal(str(current_price))
    print(f"{name}|{current_price}|{(rtp*100).quantize(Decimal('0.0001'))}%|{money(before)}|{money(after_game_tax)}|{money(after_isc)}|{money(after_gateway)}|{(same_table_rtp_at_one*100).quantize(Decimal('0.0001'))}%")

print("\nFormula: B=price; prize=RTP*B; hold=B-prize; gaming_tax=12%*(hold-2%*hold); ISC=1%*B; gateway=5%*B. Gateway and rates are scenario assumptions, not confirmed project costs.")
