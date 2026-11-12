// Shared interface strings (header, footer) and the demo page.
// Long-form page copy lives in content.js.

export const STR = {
  en: {
    brandSub: 'Colorectal image analysis',
    online: 'Backend online',
    offline: 'Backend offline',
    checking: 'Checking backend',
    menu: 'Menu',
    nav: { sva: 'How SVA works', system: 'The system', demo: 'Live demo' },

    demoEyebrow: 'Live demo',
    demoTitle: 'Coloscope demo',
    demoLead:
      'Upload a colorectal endoscopy image. Then use “Try another phrasing” to run the same image with a different wording and compare the results.',

    uploadTitle: 'Upload image',
    dzTitle: 'Drag and drop an image here',
    dzOr: 'or',
    browse: 'Browse files',
    dzHint: 'JPEG or PNG, up to 10 MB',
    replace: 'Replace',
    run: 'Run analysis',
    uploadNote:
      'Uploaded images are processed in memory and are not saved by this prototype. Do not upload images that contain patient-identifying information.',
    errType: 'Please choose a JPEG or PNG image.',
    errSize: 'The file is larger than 10 MB.',

    steps: ['Image received', 'Segmentation', 'Interpretation'],

    resultTitle: 'Analysis result',
    downloadOverlay: 'Download overlay',
    newAnalysis: 'New analysis',
    rerun: 'Try another phrasing',
    rerunning: 'Running...',
    segmentation: 'Segmentation',
    viewSide: 'Side by side',
    viewSlider: 'Slider',
    viewOverlay: 'Overlay',
    original: 'Original',
    overlay: 'Overlay',
    originalAlt: 'Original endoscopy image',
    overlayAlt: 'Endoscopy image with segmentation overlay',
    sliderLabel: 'Compare original and overlay',
    legendFill: 'Detected region',
    legendEdge: 'Boundary',

    summary: 'Detection summary',
    prompt: 'Prompt used',
    coverage: 'Lesion coverage',
    inference: 'Inference time',
    confidence: 'Confidence (heuristic)',
    conf: { high: 'High', mid: 'Moderate', low: 'Low' },
    confNote:
      'Confidence is a heuristic derived from lesion coverage. It is not a measured accuracy for this image.',

    runsTitle: 'Same image, different phrasings',
    runsHint:
      'A robust model should mark a similar region whichever phrasing is used. Compare the lesion coverage below.',
    colRun: 'Run',
    colPhrasing: 'Phrasing',
    colCoverage: 'Lesion coverage',
    colTime: 'Time',
    spread: 'Coverage spread (max minus min)',
    ppUnit: 'percentage points',

    interpretation: 'Clinical interpretation',
    patient: 'Patient',
    clinician: 'Clinician',
    finding: 'Possible finding',
    nextSteps: 'Recommended next steps',
    explainFail:
      'The explanation service is unavailable. The segmentation result is still shown above.',
    disclaimer:
      'AI-generated output for research purposes only. It is not a diagnosis and does not replace evaluation by a qualified gastroenterologist.',

    errorTitle: 'Analysis failed',
    errorHint: 'Check that the backend is running and reachable, then try again.',

    footerBlurb: 'A research prototype of the SVA Framework for prompt-robust colorectal lesion segmentation.',
    footerModel: 'Model: SVA-MedSAM (MobileSAM and Bio_ClinicalBERT), trained on Kvasir-SEG.',
    footerCredits: 'Credits',
  },

  id: {
    brandSub: 'Analisis citra kolorektal',
    online: 'Backend aktif',
    offline: 'Backend tidak aktif',
    checking: 'Memeriksa backend',
    menu: 'Menu',
    nav: { sva: 'Cara kerja SVA', system: 'Sistem', demo: 'Demo langsung' },

    demoEyebrow: 'Demo langsung',
    demoTitle: 'Demo Coloscope',
    demoLead:
      'Unggah gambar endoskopi kolorektal. Lalu gunakan “Coba penyebutan lain” untuk menjalankan gambar yang sama dengan frasa berbeda dan bandingkan hasilnya.',

    uploadTitle: 'Unggah gambar',
    dzTitle: 'Seret dan lepas gambar di sini',
    dzOr: 'atau',
    browse: 'Pilih file',
    dzHint: 'JPEG atau PNG, maksimal 10 MB',
    replace: 'Ganti',
    run: 'Jalankan analisis',
    uploadNote:
      'Gambar yang diunggah diproses di memori dan tidak disimpan oleh prototipe ini. Jangan mengunggah gambar yang memuat identitas pasien.',
    errType: 'Pilih gambar berformat JPEG atau PNG.',
    errSize: 'Ukuran file melebihi 10 MB.',

    steps: ['Gambar diterima', 'Segmentasi', 'Interpretasi'],

    resultTitle: 'Hasil analisis',
    downloadOverlay: 'Unduh overlay',
    newAnalysis: 'Analisis baru',
    rerun: 'Coba penyebutan lain',
    rerunning: 'Memproses...',
    segmentation: 'Segmentasi',
    viewSide: 'Berdampingan',
    viewSlider: 'Slider',
    viewOverlay: 'Overlay',
    original: 'Asli',
    overlay: 'Overlay',
    originalAlt: 'Gambar endoskopi asli',
    overlayAlt: 'Gambar endoskopi dengan overlay segmentasi',
    sliderLabel: 'Bandingkan gambar asli dan overlay',
    legendFill: 'Area terdeteksi',
    legendEdge: 'Batas',

    summary: 'Ringkasan deteksi',
    prompt: 'Prompt yang digunakan',
    coverage: 'Cakupan lesi',
    inference: 'Waktu inferensi',
    confidence: 'Keyakinan (heuristik)',
    conf: { high: 'Tinggi', mid: 'Sedang', low: 'Rendah' },
    confNote:
      'Keyakinan adalah heuristik berdasarkan cakupan lesi, bukan akurasi terukur untuk gambar ini.',

    runsTitle: 'Gambar sama, penyebutan berbeda',
    runsHint:
      'Model yang tahan variasi seharusnya menandai area yang mirip apa pun penyebutannya. Bandingkan cakupan lesi di bawah ini.',
    colRun: 'Proses',
    colPhrasing: 'Penyebutan',
    colCoverage: 'Cakupan lesi',
    colTime: 'Waktu',
    spread: 'Selisih cakupan (maks dikurangi min)',
    ppUnit: 'poin persentase',

    interpretation: 'Interpretasi klinis',
    patient: 'Pasien',
    clinician: 'Klinisi',
    finding: 'Kemungkinan temuan',
    nextSteps: 'Langkah lanjutan yang disarankan',
    explainFail:
      'Layanan penjelasan tidak tersedia. Hasil segmentasi tetap ditampilkan di atas.',
    disclaimer:
      'Keluaran AI hanya untuk tujuan riset. Bukan diagnosis dan tidak menggantikan pemeriksaan oleh dokter spesialis gastroenterologi.',

    errorTitle: 'Analisis gagal',
    errorHint: 'Pastikan backend berjalan dan dapat diakses, lalu coba lagi.',

    footerBlurb: 'Prototipe riset SVA Framework untuk segmentasi lesi kolorektal yang tahan variasi prompt.',
    footerModel: 'Model: SVA-MedSAM (MobileSAM dan Bio_ClinicalBERT), dilatih pada Kvasir-SEG.',
    footerCredits: 'Kredit',
  },
}
