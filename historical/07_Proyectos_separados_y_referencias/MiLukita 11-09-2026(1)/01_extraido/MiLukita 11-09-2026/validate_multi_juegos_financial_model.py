from pathlib import Path
from openpyxl import load_workbook

path = Path('/home/ubuntu/financial_deliverables/modelo_tentativo_multi_juegos_peru.xlsx')
wb = load_workbook(path, data_only=False)

required_sheets = {'Supuestos', 'Presupuesto Base', 'Escenarios', 'Impacto Territorial', 'Fuentes y límites'}
assert required_sheets.issubset(set(wb.sheetnames)), f'Hojas faltantes: {required_sheets - set(wb.sheetnames)}'

assumptions = wb['Supuestos']
assert assumptions['E10'].value == 350000
assert assumptions['E11'].value == 225000
assert assumptions['D15'].value == 0.1176
assert assumptions['D18'].value == 0.295
assert assumptions['D19'].value == 0.01

budget = wb['Presupuesto Base']
assert budget['D18'].value == '=SUM(D10:D17)'
assert budget['D27'].value == '=SUM(D22:D26)'
assert budget['D29'].value == '=D18+D27'

scenarios = wb['Escenarios']
assert scenarios['E16'].value == '=E14+E15'
assert scenarios['E17'].value == '=-MAX(0,E16*Supuestos!$D$19)'
assert scenarios['D23'].value == '=Supuestos!E11/D22'

impact = wb['Impacto Territorial']
assert impact['D10'].value == '=ABS(Escenarios!D17)'
assert impact['D12'].value == '=IF(D11>=Supuestos!$D$20,"Sí","No; acumular a fondo regional")'

source_comments = [assumptions['D15'].comment, assumptions['D18'].comment, assumptions['D19'].comment]
assert all(comment is not None for comment in source_comments), 'Faltan comentarios de trazabilidad en inputs.'

# Reproduce los resultados base mostrados en el informe para verificar las fórmulas.
income = 350000
game_tax = income * 0.1176
payment = income * 0.025
variable_support = income * 0.03
fixed_cost = 225000
pre_tax = income - game_tax - payment - variable_support - fixed_cost
income_tax = max(0, pre_tax * 0.295)
net_income = pre_tax - income_tax
social = max(0, net_income * 0.01)
breakeven = fixed_cost / (1 - 0.1176 - 0.025 - 0.03)

assert round(pre_tax, 2) == 64590.00
assert round(income_tax, 2) == 19054.05
assert round(net_income, 2) == 45535.95
assert round(social, 2) == 455.36
assert round(breakeven, 2) == 271936.19

print('Modelo validado')
print(f'Utilidad neta base: S/ {net_income:,.2f}')
print(f'Aporte social base: S/ {social:,.2f}')
print(f'Punto de equilibrio: S/ {breakeven:,.2f}')
