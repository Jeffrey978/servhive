import { ImageManipulator, SaveFormat } from 'expo-image-manipulator';
import * as ImagePicker from 'expo-image-picker';

/**
 * Photos go to the website as data URLs (data:image/jpeg;base64,...) — the same
 * field format its upload forms send. The server accepts up to ~2.1MB per
 * image and Vercel caps a whole request at ~4.5MB, so every photo is shrunk on
 * the phone first.
 */

const MAX_DATA_URL = 1_900_000; // stay under the server's 2.1MB limit with margin

export type PickedImage = { dataUrl: string; uri: string; fileName: string };

async function shrink(uri: string, srcWidth: number, maxWidth: number, quality: number): Promise<{ dataUrl: string; uri: string }> {
  const ctx = ImageManipulator.manipulate(uri);
  if (srcWidth > maxWidth) ctx.resize({ width: maxWidth, height: null }); // never upscale
  const out = await (await ctx.renderAsync()).saveAsync({ format: SaveFormat.JPEG, compress: quality, base64: true });
  return { dataUrl: `data:image/jpeg;base64,${out.base64 ?? ''}`, uri: out.uri };
}

/** Make sure the photo fits the server's limit, stepping quality and size down if needed. */
async function toDataUrl(uri: string, srcWidth: number, maxWidth: number): Promise<{ dataUrl: string; uri: string }> {
  const steps: [number, number][] = [
    [maxWidth, 0.72],
    [Math.round(maxWidth * 0.8), 0.6],
    [Math.round(maxWidth * 0.6), 0.5],
  ];
  let last = { dataUrl: '', uri };
  for (const [w, q] of steps) {
    last = await shrink(uri, srcWidth, w, q);
    if (last.dataUrl.length <= MAX_DATA_URL) return last;
  }
  return last;
}

/**
 * Let the user take a photo or choose one, then shrink it. Returns null if they
 * cancel or refuse permission. `source` picks camera or library.
 */
export async function pickImage(source: 'camera' | 'library', opts: { maxWidth?: number } = {}): Promise<PickedImage | null> {
  const maxWidth = opts.maxWidth ?? 1280;
  if (source === 'camera') {
    const perm = await ImagePicker.requestCameraPermissionsAsync();
    if (!perm.granted) throw new Error('Allow camera access in Settings to take a photo.');
  }
  const result =
    source === 'camera'
      ? await ImagePicker.launchCameraAsync({ mediaTypes: ['images'], quality: 1 })
      : await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], quality: 1 });
  if (result.canceled || !result.assets?.[0]) return null;
  const asset = result.assets[0];
  const out = await toDataUrl(asset.uri, asset.width, maxWidth);
  if (out.dataUrl.length > MAX_DATA_URL) throw new Error('That photo is too large. Try another one.');
  return { ...out, fileName: asset.fileName ?? 'photo.jpg' };
}
