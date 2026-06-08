export function buildPdfViewerHtml(pdfUrl: string): string {
  return `<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { background: #1a1a1a; display: flex; flex-direction: column; height: 100vh; }
    #toolbar {
      background: #2d2d2d;
      color: #fff;
      padding: 8px 12px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-family: sans-serif;
      font-size: 13px;
      flex-shrink: 0;
    }
    #canvas-container {
      flex: 1;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 12px 0;
      gap: 10px;
    }
    canvas { max-width: 100%; box-shadow: 0 2px 8px rgba(0,0,0,0.5); background: white; }
    #loading { color: #aaa; font-family: sans-serif; margin: auto; }
  </style>
</head>
<body>
  <div id="toolbar">
    <span id="page-info">Cargando...</span>
    <div style="display:flex;gap:12px">
      <button onclick="changePage(-1)" style="background:none;border:none;color:#fff;font-size:18px;cursor:pointer">‹</button>
      <button onclick="changePage(1)"  style="background:none;border:none;color:#fff;font-size:18px;cursor:pointer">›</button>
    </div>
  </div>
  <div id="canvas-container">
    <div id="loading">Cargando PDF...</div>
  </div>

  <script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.4.168/pdf.min.mjs" type="module"></script>
  <script type="module">
    import * as pdfjsLib from 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.4.168/pdf.min.mjs';
    pdfjsLib.GlobalWorkerOptions.workerSrc =
      'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.4.168/pdf.worker.min.mjs';

    let pdfDoc = null;
    let currentPage = 1;
    const container = document.getElementById('canvas-container');
    const pageInfo  = document.getElementById('page-info');

    async function renderPage(num) {
      container.innerHTML = '';
      const page   = await pdfDoc.getPage(num);
      const scale  = Math.min(window.innerWidth / page.getViewport({ scale: 1 }).width, 2);
      const vp     = page.getViewport({ scale });
      const canvas = document.createElement('canvas');
      canvas.height = vp.height;
      canvas.width  = vp.width;
      container.appendChild(canvas);
      await page.render({ canvasContext: canvas.getContext('2d'), viewport: vp }).promise;
      pageInfo.textContent = 'Página ' + num + ' / ' + pdfDoc.numPages;
    }

    window.changePage = (delta) => {
      const next = currentPage + delta;
      if (next < 1 || next > pdfDoc.numPages) return;
      currentPage = next;
      renderPage(currentPage);
    };

    pdfjsLib.getDocument('${pdfUrl}').promise
      .then(doc => { pdfDoc = doc; renderPage(1); })
      .catch(() => {
        container.innerHTML = '<div id="loading">No se pudo cargar el PDF.</div>';
        window.ReactNativeWebView?.postMessage('PDF_ERROR');
      });
  </script>
</body>
</html>`;
}