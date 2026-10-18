from math import comb
D=comb(39,5)
def rtp(p5,p4,p3,p2):
 return sum(comb(5,k)*comb(34,5-k)*{5:p5,4:p4,3:p3,2:p2}.get(k,0) for k in range(6))/D
best=None
for p5 in range(20000,50001,1000):
 for p4 in range(300,1501,50):
  for p3 in range(10,101,5):
   for p2 in range(1,8):
    x=rtp(p5,p4,p3,p2)
    if .85 <= x <= .86 and (best is None or abs(x-.85)<abs(best[0]-.85)):
     best=(x,p5,p4,p3,p2)
print(best)
