import * as THREE from 'three';

/**
 * Generates high-resolution front (King of Diamonds) and back (UT Monogram)
 * textures for the 3D playing card using HTML5 Canvas.
 */

export function createCardFrontTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1434;
  const ctx = canvas.getContext('2d');

  const w = canvas.width;
  const h = canvas.height;

  // 1. Background Parchment / Ivory
  ctx.fillStyle = '#fdfbf7';
  ctx.fillRect(0, 0, w, h);

  // Subtle paper grain/vignette
  const vignette = ctx.createRadialGradient(w / 2, h / 2, w * 0.3, w / 2, h / 2, w * 0.75);
  vignette.addColorStop(0, 'rgba(255, 255, 255, 0)');
  vignette.addColorStop(1, 'rgba(212, 175, 55, 0.12)');
  ctx.fillStyle = vignette;
  ctx.fillRect(0, 0, w, h);

  // 2. Gold Foil Ornate Outer & Inner Borders
  ctx.save();
  ctx.lineWidth = 14;
  ctx.strokeStyle = '#d4af37';
  ctx.strokeRect(36, 36, w - 72, h - 72);

  ctx.lineWidth = 3;
  ctx.strokeStyle = '#b38f2a';
  ctx.strokeRect(48, 48, w - 96, h - 96);

  ctx.lineWidth = 6;
  ctx.strokeStyle = '#ffd700';
  ctx.strokeRect(70, 70, w - 140, h - 140);
  ctx.restore();

  // Corner decorative scroll flourishes
  drawCornerFlourish(ctx, 70, 70, 1, 1);
  drawCornerFlourish(ctx, w - 70, 70, -1, 1);
  drawCornerFlourish(ctx, 70, h - 70, 1, -1);
  drawCornerFlourish(ctx, w - 70, h - 70, -1, -1);

  // 3. Corner Pips: Top-Left
  drawCornerPip(ctx, 110, 150, false);
  // Bottom-Right (Rotated 180deg)
  ctx.save();
  ctx.translate(w, h);
  ctx.rotate(Math.PI);
  drawCornerPip(ctx, 110, 150, false);
  ctx.restore();

  // 4. Center Court Artwork - King of Diamonds
  const courtX = 170;
  const courtY = 160;
  const courtW = w - 340;
  const courtH = h - 320;

  // Court frame
  ctx.save();
  ctx.fillStyle = '#fffdf9';
  ctx.fillRect(courtX, courtY, courtW, courtH);
  ctx.lineWidth = 8;
  ctx.strokeStyle = '#d4af37';
  ctx.strokeRect(courtX, courtY, courtW, courtH);

  ctx.lineWidth = 2;
  ctx.strokeStyle = '#991b1b';
  ctx.strokeRect(courtX + 10, courtY + 10, courtW - 20, courtH - 20);

  // Draw Two-Way King
  drawHalfKing(ctx, courtX, courtY, courtW, courtH / 2);

  // Bottom half inverted
  ctx.translate(w, h);
  ctx.rotate(Math.PI);
  drawHalfKing(ctx, courtX, courtY, courtW, courtH / 2);
  ctx.restore();

  // Dividing line across the center
  ctx.save();
  ctx.lineWidth = 4;
  ctx.strokeStyle = '#d4af37';
  ctx.beginPath();
  ctx.moveTo(courtX + 10, h / 2);
  ctx.lineTo(courtX + courtW - 10, h / 2);
  ctx.stroke();

  // Central small diamond emblem on divider
  drawDiamond(ctx, w / 2, h / 2, 28, 38, '#b91c1c', '#ffd700');
  ctx.restore();

  const texture = new THREE.CanvasTexture(canvas);
  texture.anisotropy = 16;
  return texture;
}

function drawCornerFlourish(ctx, x, y, sx, sy) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(sx, sy);
  ctx.strokeStyle = '#ffd700';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.quadraticCurveTo(30, 0, 45, 20);
  ctx.quadraticCurveTo(20, 45, 0, 30);
  ctx.stroke();
  ctx.restore();
}

function drawCornerPip(ctx, x, y) {
  ctx.save();
  ctx.fillStyle = '#b91c1c'; // Regal crimson
  ctx.font = 'bold 96px "Cormorant Garamond", Georgia, serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('K', x, y);

  // Diamond pip below K
  drawDiamond(ctx, x, y + 80, 42, 60, '#b91c1c', '#ffd700');
  ctx.restore();
}

function drawDiamond(ctx, cx, cy, width, height, fillColor = '#b91c1c', strokeColor = null) {
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(cx, cy - height / 2);
  ctx.lineTo(cx + width / 2, cy);
  ctx.lineTo(cx, cy + height / 2);
  ctx.lineTo(cx - width / 2, cy);
  ctx.closePath();

  ctx.fillStyle = fillColor;
  ctx.fill();

  if (strokeColor) {
    ctx.lineWidth = 3;
    ctx.strokeStyle = strokeColor;
    ctx.stroke();
  }
  ctx.restore();
}

function drawHalfKing(ctx, x, y, w, h) {
  ctx.save();
  const cx = x + w / 2;

  // Robe body
  ctx.fillStyle = '#16231f';
  ctx.beginPath();
  ctx.moveTo(cx - 160, y + h);
  ctx.lineTo(cx - 140, y + 180);
  ctx.lineTo(cx - 70, y + 140);
  ctx.lineTo(cx + 70, y + 140);
  ctx.lineTo(cx + 140, y + 180);
  ctx.lineTo(cx + 160, y + h);
  ctx.closePath();
  ctx.fill();

  // Robe Gold & Crimson Stripes
  ctx.strokeStyle = '#ffd700';
  ctx.lineWidth = 6;
  ctx.stroke();

  ctx.fillStyle = '#991b1b';
  ctx.beginPath();
  ctx.moveTo(cx - 60, y + 140);
  ctx.lineTo(cx, y + 190);
  ctx.lineTo(cx + 60, y + 140);
  ctx.lineTo(cx + 35, y + h);
  ctx.lineTo(cx - 35, y + h);
  ctx.closePath();
  ctx.fill();

  // Golden Royal Sceptre / Battleaxe in King of Diamonds tradition
  ctx.strokeStyle = '#ffd700';
  ctx.lineWidth = 8;
  ctx.beginPath();
  ctx.moveTo(cx + 110, y + 210);
  ctx.lineTo(cx + 140, y + 80);
  ctx.stroke();

  // Axe Blade
  ctx.fillStyle = '#ffd700';
  ctx.beginPath();
  ctx.arc(cx + 140, y + 85, 30, -Math.PI / 2, Math.PI / 2);
  ctx.fill();

  // King Head & Face
  ctx.fillStyle = '#fce7d2';
  ctx.beginPath();
  ctx.arc(cx, y + 105, 48, 0, Math.PI * 2);
  ctx.fill();

  // Royal Beard & Mustache
  ctx.fillStyle = '#1e1b18';
  ctx.beginPath();
  ctx.arc(cx, y + 115, 36, 0, Math.PI);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(cx - 24, y + 106);
  ctx.quadraticCurveTo(cx, y + 118, cx + 24, y + 106);
  ctx.lineWidth = 5;
  ctx.strokeStyle = '#1e1b18';
  ctx.stroke();

  // Crown
  ctx.fillStyle = '#ffd700';
  ctx.beginPath();
  ctx.moveTo(cx - 52, y + 68);
  ctx.lineTo(cx - 52, y + 36);
  ctx.lineTo(cx - 26, y + 54);
  ctx.lineTo(cx, y + 22);
  ctx.lineTo(cx + 26, y + 54);
  ctx.lineTo(cx + 52, y + 36);
  ctx.lineTo(cx + 52, y + 68);
  ctx.closePath();
  ctx.fill();

  // Jewels on crown
  ctx.fillStyle = '#b91c1c';
  ctx.beginPath();
  ctx.arc(cx, y + 46, 6, 0, Math.PI * 2);
  ctx.arc(cx - 32, y + 54, 5, 0, Math.PI * 2);
  ctx.arc(cx + 32, y + 54, 5, 0, Math.PI * 2);
  ctx.fill();

  // Giant Diamond Pip beside the King
  drawDiamond(ctx, cx - 110, y + 190, 48, 68, '#b91c1c', '#ffd700');

  ctx.restore();
}

/**
 * Generates the card back texture:
 * Ornate dark obsidian and gold filigree back design with the "UT" monogram.
 */
export function createCardBackTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1434;
  const ctx = canvas.getContext('2d');

  const w = canvas.width;
  const h = canvas.height;

  // 1. Deep Obsidian / Emerald Background
  const bgGrad = ctx.createRadialGradient(w / 2, h / 2, w * 0.1, w / 2, h / 2, h * 0.7);
  bgGrad.addColorStop(0, '#0a1d17');
  bgGrad.addColorStop(0.6, '#050c09');
  bgGrad.addColorStop(1, '#020504');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, w, h);

  // 2. White Card Border edge
  ctx.lineWidth = 32;
  ctx.strokeStyle = '#ffffff';
  ctx.strokeRect(16, 16, w - 32, h - 32);

  // Gold Inner Border
  ctx.lineWidth = 10;
  ctx.strokeStyle = '#ffd700';
  ctx.strokeRect(42, 42, w - 84, h - 84);

  ctx.lineWidth = 3;
  ctx.strokeStyle = '#d4af37';
  ctx.strokeRect(58, 58, w - 116, h - 116);

  // Ornate Guilloche Lattice Pattern in the background
  ctx.save();
  ctx.strokeStyle = 'rgba(212, 175, 55, 0.15)';
  ctx.lineWidth = 1.5;
  const step = 40;
  for (let i = 80; i < w - 80; i += step) {
    ctx.beginPath();
    ctx.moveTo(i, 80);
    ctx.lineTo(w - i, h - 80);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(w - i, 80);
    ctx.lineTo(i, h - 80);
    ctx.stroke();
  }
  ctx.restore();

  // Central Ornate Frame
  const cx = w / 2;
  const cy = h / 2;

  // Outer glowing rings
  ctx.save();
  ctx.lineWidth = 6;
  ctx.strokeStyle = '#ffd700';
  ctx.beginPath();
  ctx.arc(cx, cy, 260, 0, Math.PI * 2);
  ctx.stroke();

  ctx.lineWidth = 2;
  ctx.strokeStyle = '#d4af37';
  ctx.beginPath();
  ctx.arc(cx, cy, 275, 0, Math.PI * 2);
  ctx.stroke();

  // Intricate Sunburst rays
  const numRays = 48;
  for (let r = 0; r < numRays; r++) {
    const angle = (r * Math.PI * 2) / numRays;
    const r1 = 260;
    const r2 = r % 2 === 0 ? 300 : 285;
    ctx.beginPath();
    ctx.moveTo(cx + Math.cos(angle) * r1, cy + Math.sin(angle) * r1);
    ctx.lineTo(cx + Math.cos(angle) * r2, cy + Math.sin(angle) * r2);
    ctx.strokeStyle = r % 2 === 0 ? '#ffd700' : 'rgba(212, 175, 55, 0.4)';
    ctx.lineWidth = r % 2 === 0 ? 3 : 1.5;
    ctx.stroke();
  }

  // Central medallion plate
  const medGrad = ctx.createRadialGradient(cx, cy, 40, cx, cy, 240);
  medGrad.addColorStop(0, '#09251c');
  medGrad.addColorStop(0.7, '#04110d');
  medGrad.addColorStop(1, '#020504');
  ctx.fillStyle = medGrad;
  ctx.beginPath();
  ctx.arc(cx, cy, 240, 0, Math.PI * 2);
  ctx.fill();

  // Gold beaded circle inside
  const beadCount = 36;
  for (let b = 0; b < beadCount; b++) {
    const angle = (b * Math.PI * 2) / beadCount;
    const bx = cx + Math.cos(angle) * 225;
    const by = cy + Math.sin(angle) * 225;
    ctx.fillStyle = '#ffd700';
    ctx.beginPath();
    ctx.arc(bx, by, 4, 0, Math.PI * 2);
    ctx.fill();
  }

  // Regal Monogram "UT" (Upendra Thakur)
  ctx.font = 'bold italic 190px "Cormorant Garamond", Georgia, serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  // Glow shadow
  ctx.shadowColor = 'rgba(255, 215, 0, 0.8)';
  ctx.shadowBlur = 24;
  ctx.fillStyle = '#ffd700';
  ctx.fillText('UT', cx, cy - 10);

  ctx.shadowBlur = 0;
  ctx.font = '600 24px "Plus Jakarta Sans", sans-serif';
  ctx.letterSpacing = '6px';
  ctx.fillStyle = '#d4af37';
  ctx.fillText('UPENDRA THAKUR', cx, cy + 120);

  ctx.font = '400 16px "Plus Jakarta Sans", sans-serif';
  ctx.letterSpacing = '10px';
  ctx.fillStyle = 'rgba(255, 215, 0, 0.7)';
  ctx.fillText('INDIAN MAGICIAN', cx, cy + 155);

  ctx.restore();

  // 4 Corner Diamond Pips on the back
  const cornerPad = 130;
  drawDiamond(ctx, cornerPad, cornerPad, 32, 44, '#d4af37', '#ffd700');
  drawDiamond(ctx, w - cornerPad, cornerPad, 32, 44, '#d4af37', '#ffd700');
  drawDiamond(ctx, cornerPad, h - cornerPad, 32, 44, '#d4af37', '#ffd700');
  drawDiamond(ctx, w - cornerPad, h - cornerPad, 32, 44, '#d4af37', '#ffd700');

  const texture = new THREE.CanvasTexture(canvas);
  texture.anisotropy = 16;
  return texture;
}
