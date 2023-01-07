/**
 * @see https://juejin.cn/post/6953177188262740005
 */
const filetype: { [key: string]: string } = {
  '47494638': 'image/gif',
  '89504e47': 'image/png',
  ffd8ffe0: 'image/jpeg',
  ffd8ffe1: 'image/jpeg',
  ffd8ffe2: 'image/jpeg',
  ffd8ffe3: 'image/jpeg',
  ffd8ffe8: 'image/jpeg',
  '52494646{8,4}5745': 'image/webp',
  '52494646{8,4}4156': 'video/avi',
  '464C56': 'video/flv',
  '00000018': 'video/mp4',
  '00000020': 'video/mp4',
  '52494646,4143': 'ani',
  '52494646,4344': 'cda',
  '52494646,514c': 'qcp'
};

/**
 * 文件转buffer
 * @param file
 * @returns
 */
export const fileToBuffer = async (file: File | Blob): Promise<ArrayBuffer> => {
  return new Promise(resolve => {
    const fr = new FileReader();

    fr.readAsArrayBuffer(file);
    fr.onloadend = () => resolve(fr.result as ArrayBuffer);
  });
};

/**
 * 图片节点转base64
 * @param src
 * @param outputFormat
 * @returns
 */
export const convertImgToBase64 = async (src: string, outputFormat: string): Promise<string> => {
  let canvas: HTMLCanvasElement | null = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  let img: HTMLImageElement | null = document.createElement('img');
  img.crossOrigin = 'Anonymous';
  img.src = src;
  return new Promise(resolve => {
    img!.onload = () => {
      canvas!.height = img!.height;
      canvas!.width = img!.width;
      ctx!.drawImage(img!, 0, 0);
      const dataURL = canvas!.toDataURL(outputFormat || 'image/png');
      resolve(dataURL);
      canvas = null;
      img = null;
    };
  });
};

/**
 * base64转blob
 * @param dataURL
 * @param type
 * @returns
 */
export const convertBase64UrlToBlob = (dataURL: string, type: string): Promise<Blob> => {
  return new Promise(resolve => {
    let bytes = null;
    if (dataURL.split(',').length > 1) {
      // 是否带前缀
      bytes = window.atob(dataURL.split(',')[1]); // 去掉url的头，并转换为byte
    } else {
      bytes = window.atob(dataURL);
    }
    // 处理异常,将ascii码小于0的转换为大于0
    const ab = new ArrayBuffer(bytes.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < bytes.length; i++) {
      ia[i] = bytes.charCodeAt(i);
    }
    resolve(new Blob([ab], { type }));
  });
};

// const handleFileType = (value16: string) => {
//   const header3 = value16.substring(0, 3 * 2);
//   const header4 = value16.substring(0, 4 * 2);
//   const header8 = value16.substring(0, 16 * 2);
//   let type = filetype[header4] || filetype[header3] || '';
//   if (type === '') {
//     for (let key of Object.keys(filetype)) {
//       let arr = key.split(/\{\d+,\d+\}/, 2);
//       if (!arr[1]) {
//         continue;
//       }
//       if (header8.substring(0, arr[0].length) === arr[0]) {
//         const siteArr = key.match(/\{(\d+,\d+)\}/)[1].split(',').map(e => e | 0);
//         const startSite = arr[1].length + siteArr[0] + 2
//         if (header8.substring(startSite, startSite + siteArr[1]) === arr[1]) {
//           type = filetype[key];
//           break;
//         }
//       } else {
//         continue;
//       }
//     }
//   }
//   return type;
// }
// const getHeaderValue = (value: ArrayBuffer) => {
//   const arr = new Uint8Array(value);
//   let header = '';
//   for (let i = 0; i < arr.length; i++) {
//     const v = arr[i].toString(16);
//     header += v.length === 1 && v === '0' ? '0' + v : v;
//   }
//   return header;
// }

/**
 * 复制图片
 * @param dom
 */
export const copyImage = async (dom: HTMLImageElement) => {
  const base64Url = await convertImgToBase64(dom.src, 'image/png');
  const blob = await convertBase64UrlToBlob(base64Url, 'image/png');
  // 向剪切板写入流数据
  navigator.clipboard.write([
    // @ts-ignore
    new ClipboardItem({
      // @ts-ignore
      [blob.type]: blob
    })
  ]);
};
