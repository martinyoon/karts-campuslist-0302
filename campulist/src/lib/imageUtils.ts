// ============================================================
// 이미지 압축 유틸리티
// Canvas API를 사용하여 이미지를 JPEG로 압축
// ============================================================

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

function validateImageFile(file: File): void {
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error(`지원하지 않는 파일 형식입니다: ${file.type}`);
  }
  if (file.size > MAX_FILE_SIZE) {
    throw new Error(`파일 크기가 10MB를 초과합니다 (${(file.size / 1024 / 1024).toFixed(1)}MB)`);
  }
}

/** 게시글 이미지 압축 (최대 600px, JPEG 0.5 품질 — localStorage 용량 절약) */
export async function compressImage(file: File, maxDim = 600, quality = 0.5): Promise<string> {
  validateImageFile(file);
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let w = img.width;
      let h = img.height;
      if (w > maxDim || h > maxDim) {
        if (w > h) { h = (h / w) * maxDim; w = maxDim; }
        else { w = (w / h) * maxDim; h = maxDim; }
      }
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d');
      if (!ctx) { URL.revokeObjectURL(img.src); reject(new Error('Canvas 지원 불가')); return; }
      ctx.drawImage(img, 0, 0, w, h);
      resolve(canvas.toDataURL('image/jpeg', quality));
      URL.revokeObjectURL(img.src);
    };
    img.onerror = () => { URL.revokeObjectURL(img.src); reject(new Error('이미지 로드 실패')); };
    img.src = URL.createObjectURL(file);
  });
}

/** 프로필 사진 압축 (200x200 정사각형 크롭, JPEG 0.8 품질) */
export async function compressProfileImage(file: File): Promise<string> {
  validateImageFile(file);
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const size = 200;
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d');
      if (!ctx) { URL.revokeObjectURL(img.src); reject(new Error('Canvas 지원 불가')); return; }
      // 중앙 기준 정사각형 크롭
      const min = Math.min(img.width, img.height);
      const sx = (img.width - min) / 2;
      const sy = (img.height - min) / 2;
      ctx.drawImage(img, sx, sy, min, min, 0, 0, size, size);
      resolve(canvas.toDataURL('image/jpeg', 0.8));
      URL.revokeObjectURL(img.src);
    };
    img.onerror = () => { URL.revokeObjectURL(img.src); reject(new Error('이미지 로드 실패')); };
    img.src = URL.createObjectURL(file);
  });
}
