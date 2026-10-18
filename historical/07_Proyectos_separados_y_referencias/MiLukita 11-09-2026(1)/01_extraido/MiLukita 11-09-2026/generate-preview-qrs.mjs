import QRCode from "qrcode";
import { mkdir } from "node:fs/promises";

const base = "https://ruletaperu-dnzxnqyn.manus.space";
const targets = [
  ["portal", `${base}/portal`],
  ["mapper", `${base}/mapper`],
  ["the-eye", `${base}/the-eye`],
  ["luka-ar", `${base}/lukita-ar-stage?entry=qr`],
];

await mkdir("/home/ubuntu/webdev-static-assets/orden51/qrs-definitive", { recursive: true });
for (const [name, url] of targets) {
  await QRCode.toFile(`/home/ubuntu/webdev-static-assets/orden51/qrs-definitive/milukita-${name}-definitive.svg`, url, {
    type: "svg",
    errorCorrectionLevel: "H",
    margin: 2,
    color: { dark: "#d7b866", light: "#07110f" },
  });
  console.log(`${name}: ${url}`);
}
