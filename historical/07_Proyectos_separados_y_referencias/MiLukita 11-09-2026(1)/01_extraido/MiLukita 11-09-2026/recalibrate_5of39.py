from math import comb
D=comb(39,5)
def rtp(t):
    return sum(comb(5,k)*comb(34,5-k)*v for k,v in t.items())/D
base={5:50000,4:1200,3:35,2:3,1:0}
print('base',rtp(base))
# Find a low-distortion adjustment using a jackpot and intermediate increments.
best=[]
for p4 in range(1200,1801,25):
  for p3 in range(35,101,5):
    for p2 in range(3,11):
      t={5:50000,4:p4,3:p3,2:p2,1:0}
      x=rtp(t)
      if x>=.85:
        best.append((x,t))
print(min(best,key=lambda x:x[0]))
