import importlib.util

for name in ("cv2", "pyzbar", "PIL"):
    print(f"{name}={'available' if importlib.util.find_spec(name) else 'missing'}")
