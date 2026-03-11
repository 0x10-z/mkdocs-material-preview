/**
 * Generate a 256x256 PNG icon for the extension.
 * Creates a Material-style icon with an "M" document symbol.
 *
 * Uses raw PNG encoding (no dependencies).
 */

const fs = require('fs');
const zlib = require('zlib');

const W = 256, H = 256;

// RGBA pixel buffer
const pixels = Buffer.alloc(W * H * 4, 0);

function setPixel(x, y, r, g, b, a) {
    if (x < 0 || x >= W || y < 0 || y >= H) return;
    const i = (y * W + x) * 4;
    pixels[i] = r;
    pixels[i + 1] = g;
    pixels[i + 2] = b;
    pixels[i + 3] = a;
}

function blendPixel(x, y, r, g, b, a) {
    if (x < 0 || x >= W || y < 0 || y >= H) return;
    const i = (y * W + x) * 4;
    const srcA = a / 255;
    const dstA = pixels[i + 3] / 255;
    const outA = srcA + dstA * (1 - srcA);
    if (outA === 0) return;
    pixels[i] = Math.round((r * srcA + pixels[i] * dstA * (1 - srcA)) / outA);
    pixels[i + 1] = Math.round((g * srcA + pixels[i + 1] * dstA * (1 - srcA)) / outA);
    pixels[i + 2] = Math.round((b * srcA + pixels[i + 2] * dstA * (1 - srcA)) / outA);
    pixels[i + 3] = Math.round(outA * 255);
}

function fillRect(x1, y1, x2, y2, r, g, b, a) {
    for (let y = Math.max(0, Math.floor(y1)); y < Math.min(H, Math.ceil(y2)); y++) {
        for (let x = Math.max(0, Math.floor(x1)); x < Math.min(W, Math.ceil(x2)); x++) {
            setPixel(x, y, r, g, b, a);
        }
    }
}

function fillRoundedRect(x1, y1, x2, y2, radius, r, g, b, a) {
    for (let y = Math.max(0, Math.floor(y1)); y < Math.min(H, Math.ceil(y2)); y++) {
        for (let x = Math.max(0, Math.floor(x1)); x < Math.min(W, Math.ceil(x2)); x++) {
            let inside = false;
            const cx = x + 0.5, cy = y + 0.5;

            // Check if inside rounded rectangle
            if (cx >= x1 + radius && cx <= x2 - radius) inside = true;
            else if (cy >= y1 + radius && cy <= y2 - radius) inside = true;
            else {
                // Check corner circles
                const corners = [
                    [x1 + radius, y1 + radius],
                    [x2 - radius, y1 + radius],
                    [x1 + radius, y2 - radius],
                    [x2 - radius, y2 - radius]
                ];
                for (const [ccx, ccy] of corners) {
                    const dx = cx - ccx, dy = cy - ccy;
                    if (dx * dx + dy * dy <= radius * radius) {
                        inside = true;
                        break;
                    }
                }
            }
            if (inside) setPixel(x, y, r, g, b, a);
        }
    }
}

function fillCircle(cx, cy, radius, r, g, b, a) {
    for (let y = Math.max(0, Math.floor(cy - radius)); y <= Math.min(H - 1, Math.ceil(cy + radius)); y++) {
        for (let x = Math.max(0, Math.floor(cx - radius)); x <= Math.min(W - 1, Math.ceil(cx + radius)); x++) {
            const dx = x + 0.5 - cx, dy = y + 0.5 - cy;
            if (dx * dx + dy * dy <= radius * radius) {
                blendPixel(x, y, r, g, b, a);
            }
        }
    }
}

// --- Draw the icon ---

// Background: Material indigo rounded square
fillRoundedRect(8, 8, 248, 248, 32, 63, 81, 181, 255); // #3F51B5

// Document shape (white, slightly smaller)
fillRoundedRect(48, 36, 208, 232, 8, 255, 255, 255, 240);

// Document fold corner (top-right triangle area)
// Darken the fold area
for (let y = 36; y < 76; y++) {
    for (let x = 168; x < 208; x++) {
        const inFold = (x - 168) + (y - 36) > 40;
        if (!inFold) continue;
        setPixel(x, y, 63, 81, 181, 255);
    }
}
// Fold triangle
for (let y = 36; y < 76; y++) {
    for (let x = 168; x < 208; x++) {
        const inFold = (x - 168) > (76 - y);
        if (!inFold) continue;
        setPixel(x, y, 200, 210, 240, 255);
    }
}

// --- Draw "Md" text in Material indigo ---

// Letter M (left side)
const mLeft = 66, mTop = 90, mH = 80, mW = 12;
// Left vertical bar
fillRect(mLeft, mTop, mLeft + mW, mTop + mH, 63, 81, 181, 255);
// Right vertical bar
fillRect(mLeft + 48, mTop, mLeft + 48 + mW, mTop + mH, 63, 81, 181, 255);
// Left diagonal
for (let i = 0; i < 30; i++) {
    fillRect(mLeft + mW + i - 1, mTop + i * 1.2, mLeft + mW + i + 5, mTop + i * 1.2 + 6, 63, 81, 181, 255);
}
// Right diagonal
for (let i = 0; i < 30; i++) {
    fillRect(mLeft + 48 - i - 4, mTop + i * 1.2, mLeft + 48 - i + 2, mTop + i * 1.2 + 6, 63, 81, 181, 255);
}

// Letter d (right side, lowercase)
const dLeft = 140, dTop = 85, dBodyTop = 115;
// Vertical stroke (full height)
fillRect(dLeft + 32, dTop, dLeft + 44, dTop + mH + 5, 63, 81, 181, 255);
// Body circle (left part of d)
const dCx = dLeft + 20, dCy = 148, dR = 24;
for (let y = Math.max(0, dCy - dR - 2); y <= Math.min(H - 1, dCy + dR + 2); y++) {
    for (let x = Math.max(0, dCx - dR - 2); x <= Math.min(W - 1, dCx + dR + 2); x++) {
        const dx = x + 0.5 - dCx, dy = y + 0.5 - dCy;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist <= dR && dist >= dR - 11) {
            setPixel(x, y, 63, 81, 181, 255);
        }
    }
}

// --- Small colored bars at bottom (representing admonition types) ---
const barY = 195, barH = 12, barGap = 6;
const barColors = [
    [0, 200, 83],    // green (success)
    [255, 145, 0],   // orange (warning)
    [68, 138, 255],  // blue (note)
    [255, 23, 68],   // red (danger)
];
const totalBarW = 140;
const singleBarW = (totalBarW - (barColors.length - 1) * barGap) / barColors.length;
const barStartX = 66;
for (let i = 0; i < barColors.length; i++) {
    const bx = barStartX + i * (singleBarW + barGap);
    fillRoundedRect(bx, barY, bx + singleBarW, barY + barH, 3,
        barColors[i][0], barColors[i][1], barColors[i][2], 255);
}

// --- Encode as PNG ---

function writePNG(pixels, w, h) {
    // Build raw image data with filter bytes
    const raw = Buffer.alloc(h * (1 + w * 4));
    for (let y = 0; y < h; y++) {
        raw[y * (1 + w * 4)] = 0; // filter: None
        pixels.copy(raw, y * (1 + w * 4) + 1, y * w * 4, (y + 1) * w * 4);
    }

    const compressed = zlib.deflateSync(raw, { level: 9 });

    const chunks = [];

    // Signature
    chunks.push(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]));

    function writeChunk(type, data) {
        const len = Buffer.alloc(4);
        len.writeUInt32BE(data.length);
        const typeB = Buffer.from(type, 'ascii');
        const crcData = Buffer.concat([typeB, data]);
        let crc = crc32(crcData);
        const crcB = Buffer.alloc(4);
        crcB.writeUInt32BE(crc >>> 0);
        chunks.push(len, typeB, data, crcB);
    }

    // IHDR
    const ihdr = Buffer.alloc(13);
    ihdr.writeUInt32BE(w, 0);
    ihdr.writeUInt32BE(h, 4);
    ihdr[8] = 8;  // bit depth
    ihdr[9] = 6;  // RGBA
    ihdr[10] = 0; // compression
    ihdr[11] = 0; // filter
    ihdr[12] = 0; // interlace
    writeChunk('IHDR', ihdr);

    // IDAT
    writeChunk('IDAT', compressed);

    // IEND
    writeChunk('IEND', Buffer.alloc(0));

    return Buffer.concat(chunks);
}

// CRC32 implementation
function crc32(buf) {
    let table = [];
    for (let i = 0; i < 256; i++) {
        let c = i;
        for (let j = 0; j < 8; j++) {
            c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
        }
        table[i] = c;
    }
    let crc = 0xFFFFFFFF;
    for (let i = 0; i < buf.length; i++) {
        crc = table[(crc ^ buf[i]) & 0xFF] ^ (crc >>> 8);
    }
    return (crc ^ 0xFFFFFFFF) >>> 0;
}

const png = writePNG(pixels, W, H);
fs.writeFileSync('media/icon.png', png);
console.log(`Icon written: media/icon.png (${png.length} bytes)`);
