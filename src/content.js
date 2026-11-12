// All public-facing copy for the landing, SVA and system pages.
// Edit wording here; layout lives in src/pages/*.
// Numbers come from the project's measured results (Kvasir-SEG test split).

export const CONTENT = {
  /* ====================================================================== */
  en: {
    home: {
      eyebrow: "Research prototype · Universitas Negeri Surabaya",
      title: "AI that stays consistent, however the finding is worded",
      lead:
        "Clinicians describe the same lesion in different words. SVA (Semantic Visual Alignment) is a lightweight approach that aims to keep text-guided segmentation of colorectal images stable across those wordings. Explore how it works, then try it on an endoscopy image.",
      ctaPrimary: "Try the live demo",
      ctaSecondary: "How SVA works",
      illus: {
        left: "Clinician wording",
        right: "Model output",
        alt: "Three different phrases, polyp, mucosal protrusion and sessile lesion, all pointing to the same highlighted region on an endoscopy image",
        caption: "Three ways to describe one finding. The goal: one consistent result.",
      },
      numbers: [
        { v: "0.0112", l: "PR Score on Kvasir-SEG (lower is more stable)" },
        { v: "6.5 M", l: "trainable parameters (5.4% of 120.9 M)" },
        { v: "4 GB", l: "GPU memory used for training and testing" },
        { v: "1,000", l: "endoscopy images (Kvasir-SEG)" },
      ],
      problemTitle: "Why this matters",
      problem: [
        { t: "One finding, many words", d: "The same lesion may be called a polyp, a mucosal protrusion or a sessile lesion, depending on who writes the report." },
        { t: "Models can be sensitive to wording", d: "Text-guided segmentation models take a phrase as input. If the output changes with the phrasing, the tool is hard to trust in daily practice." },
        { t: "Heavy models do not fit every clinic", d: "Many foundation models need large GPUs. A lightweight model can run where hardware is limited." },
      ],
      approachTitle: "Our approach",
      approach: [
        { t: "Align image and text", d: "A cross-modal attention module lets image regions look up the words that describe them." },
        { t: "Train with many phrasings", d: "Training draws a different wording of the same finding at every step, so the result does not depend on one phrase." },
        { t: "Measure robustness", d: "A new metric, the PR Score, quantifies how much the result changes across phrasings." },
        { t: "Keep it light", d: "Only 6.5 M parameters are trained on top of frozen backbones, so a 4 GB GPU is enough." },
      ],
      exploreTitle: "Explore the project",
      explore: [
        { to: "/sva", t: "How SVA works", d: "The idea, the architecture, the training objective, the metric and the results.", cta: "Read the method" },
        { to: "/system", t: "The Coloscope system", d: "How an image travels from your browser to a segmentation and an explanation.", cta: "See the pipeline" },
        { to: "/demo", t: "Live demo", d: "Upload an endoscopy image and watch the model work, with bilingual explanations.", cta: "Open the demo" },
      ],
      notice: "Research prototype. Not a medical device and not a substitute for evaluation by a qualified clinician.",
    },

    sva: {
      eyebrow: "The method",
      title: "How SVA works",
      lead: "SVA stands for Semantic Visual Alignment. This page walks through the problem, the architecture, the training idea, the metric and the results, in that order.",
      onThisPage: "On this page",
      toc: [
        ["problem", "The problem"],
        ["architecture", "Architecture"],
        ["alignment", "Inside the SVA module"],
        ["objective", "Training objective"],
        ["metric", "Measuring robustness"],
        ["results", "Results"],
        ["limits", "Limitations"],
      ],

      problem: {
        title: "The problem: one finding, many wordings",
        body: [
          "A text-guided segmentation model receives an image and a short phrase, for example “polyp”, and returns the region that matches. Clinicians do not always use the same phrase: “mucosal protrusion” or “sessile lesion” may describe the same structure.",
          "If the model reacts differently to each phrase, its output depends on wording rather than on the image. That is a problem for clinical use, where the tool has to behave predictably.",
        ],
        without: { title: "Without alignment", cap: "Output changes with the phrase" },
        with: { title: "The goal of SVA", cap: "Same finding, same result" },
        illusNote: "Conceptual diagram, not real model output.",
      },

      architecture: {
        title: "The architecture",
        lead: "SVA-MedSAM builds on two frozen pretrained models and trains only a small bridge between them.",
        legendFrozen: "Frozen (not trained)",
        legendTrain: "Trainable",
        status: { frozen: "Frozen", train: "Trainable" },
        nodes: {
          image: { t: "Endoscopy image", d: "256 × 256 RGB" },
          text: { t: "Clinical phrase", d: "for example “mucosal protrusion”" },
          enc: { t: "MobileSAM image encoder", d: "Turns the image into patch features" },
          bert: { t: "Bio_ClinicalBERT", d: "Turns the phrase into word features; pretrained on clinical notes" },
          sva: { t: "SVA module", d: "Image patches attend to the words, then to each other" },
          dec: { t: "Mask decoder + adapter", d: "Turns the aligned features into a mask" },
          mask: { t: "Segmentation mask", d: "The highlighted lesion region" },
        },
        note: "Images are resized to 256 × 256 and upscaled internally to the 1024 × 1024 input that MobileSAM expects.",
        paramsTitle: "Where the parameters are",
        paramHead: ["Component", "Role", "Parameters", "Status"],
        params: [
          ["Bio_ClinicalBERT", "Text encoder", "108.3 M", "Frozen"],
          ["MobileSAM encoder and prompt encoder", "Image encoder", "6.1 M", "Frozen"],
          ["Text projection", "Match text size to image features", "0.2 M", "Trainable"],
          ["SVA module", "Cross-modal alignment", "2.1 M", "Trainable"],
          ["Mask decoder + adapter", "Produces the mask", "4.2 M", "Trainable"],
        ],
        paramTotal: "Total 120.9 M · trainable 6.5 M (5.4%)",
      },

      alignment: {
        title: "Inside the SVA module",
        body: "The module stacks two identical blocks with eight attention heads each. Every block does three things in order.",
        steps: [
          { t: "Cross-attention", d: "Each image patch asks which words in the phrase are relevant to it. Patches are the queries; words are the keys and values." },
          { t: "Self-attention", d: "Patches share information with each other, so neighbouring regions stay coherent." },
          { t: "Feed-forward layer", d: "A small network refines each patch before the next block." },
        ],
        attnTitle: "Cross-attention, illustrated",
        attnCaption: "Darker cells mean a patch relies more on that word. Conceptual diagram, not real model output.",
        patches: ["Patch on lesion", "Patch on lesion edge", "Patch on lumen", "Patch on fold"],
        words: ["mucosal", "protrusion"],
      },

      objective: {
        title: "Training objective",
        body: [
          "The total loss combines three terms: Focal loss, which copes with the imbalance between lesion and background pixels; Dice loss, which rewards overlap with the expert mask; and the SAC term (Semantic-Aware Contrastive), the consistency objective proposed in this work.",
          "In the SAC design, every valid phrasing of a finding counts as a positive match for the image feature, so training pulls them together instead of treating one phrasing as the only correct one. At every training step, one phrasing is drawn at random from 15 variants per class.",
        ],
        formulaTotal: "L_total = 1.0 · L_Focal + 1.0 · L_Dice + 0.5 · L_SAC",
        formulaSac: "L_SAC = − log [ exp( sim(v, t⁺) / τ ) / Σⱼ exp( sim(v, tⱼ) / τ ) ],  τ = 0.07",
        legend: "v: image feature · t⁺: a valid phrasing of the same finding · tⱼ: all phrasings in the batch · sim: cosine similarity",
        embTitle: "The idea behind SAC",
        embCaption: "Conceptual illustration of the objective.",
        embLabels: { image: "image feature", pulled: "pulled together", pushed: "pushed apart", other: "unrelated phrase" },
      },

      metric: {
        title: "Measuring robustness: the PR Score",
        body: [
          "Accuracy alone does not reveal sensitivity to wording. The PR Score (Prompt Robustness Score) runs the same image with several phrasings and takes the standard deviation of the Dice scores. A low PR Score means the result barely changes when the wording changes.",
          "We also report the worst-case DSC (the lowest score across phrasings) and the relative PR (standard deviation divided by the mean DSC).",
        ],
        formula: "PR Score = σ( DSC₁, …, DSC_K ),  K = 10 phrasings",
        stableTitle: "Stable model",
        unstableTitle: "Unstable model",
        illusNote: "Illustrative values, not measured results.",
        caveatTitle: "A caveat",
        caveat: "A low PR Score alone does not prove that a model uses the text: a model that ignores the text entirely also scores a perfect 0. That is why the results table marks that case.",
      },

      results: {
        title: "Results on Kvasir-SEG",
        lead: "All variants were trained and tested on the same Kvasir-SEG split (800 / 100 / 100 images, divided by case) and evaluated with 10 phrasings per image.",
        head: ["Model", "Uses text", "DSC", "Worst-case DSC", "NSD", "PR Score ↓", "Relative PR ↓"],
        yes: "Yes",
        no: "No",
        names: {
          ours: "SVA-MedSAM (ours)",
          a2: "A2 · without the SAC term",
          a3: "A3 · general-domain BERT",
          a4: "A4 · 3 phrasings in training",
          a1: "A1 · without the SVA module",
        },
        footnote: "A1 ignores the text, so its PR Score of 0 is not meaningful. Each variant was trained once.",
        readTitle: "How to read this",
        read: [
          "SVA-MedSAM has the lowest PR Score (0.0112) and the lowest relative PR (0.033) among the models that use text.",
          "Removing the SAC term (A2), using a general-domain BERT (A3) or training with only 3 phrasings (A4) each gave a higher PR Score: 0.0145, 0.0243 and 0.0247.",
          "SVA-MedSAM has a lower DSC than the other variants (0.7176 versus 0.7433 to 0.7652; A1 reaches 0.8454 because it ignores the text). We report this openly: in this study the most stable model is not the most accurate one.",
          "Under standard single-phrase evaluation, SVA-MedSAM scores DSC 0.7194 and NSD 0.3691.",
        ],
      },

      limits: {
        title: "Limitations and next steps",
        limitsTitle: "Limitations",
        limits: [
          "One dataset and one modality: Kvasir-SEG, white-light endoscopy. Other datasets and CT are untested.",
          "Kvasir-SEG only provides polyp masks. Phrasings for polyp, adenoma and carcinoma were therefore all evaluated against the same mask; separating lesion types by text needs a dataset with class labels, such as HyperKvasir.",
          "A deliberately wrong phrase (for example another organ) has not been tested yet. That test is needed to show how strongly the text drives the result.",
          "Each variant was trained once, so the contribution of individual components, for example the SAC term, is not yet isolated.",
          "The confidence label shown in the demo is a heuristic based on lesion coverage, not a validated measure.",
        ],
        nextTitle: "Next steps",
        next: [
          "Wrong-phrase experiment",
          "Multi-class data (HyperKvasir)",
          "Repeated runs with several random seeds",
          "Higher resolution and mixed-precision training",
          "Review of the phrasings with gastroenterologists",
        ],
      },
    },

    system: {
      eyebrow: "The platform",
      title: "How the Coloscope system works",
      lead: "Coloscope is the web application built around the SVA model. This page follows one image from your browser to the final explanation.",

      journeyTitle: "The journey of one image",
      journey: [
        { t: "Upload", d: "You choose a JPEG or PNG endoscopy image. The browser sends it to the server." },
        { t: "Preprocessing", d: "The server decodes the image, resizes it to 256 × 256 and scales the pixel values to the 0 to 1 range." },
        { t: "Choosing a phrasing", d: "The demo picks one of ten polyp-related phrasings at random, such as “polyp” or “mucosal protrusion”. Run the same image again to see a different phrasing." },
        { t: "Model inference", d: "The image and the phrase pass through SVA-MedSAM. The output is a probability for every pixel; values above 0.5 become the mask." },
        { t: "Overlay", d: "The mask is resized back to the original image, filled in green and outlined in orange." },
        { t: "Explanation", d: "The phrasing and the lesion coverage, not the image, are sent to a language model. It writes a patient-friendly and a clinician-oriented explanation in English and Indonesian, plus a possible finding and next steps. If the language model is unavailable, template text is used." },
        { t: "Result", d: "The browser shows the overlay, the summary statistics and the explanation." },
      ],

      partsTitle: "Three parts working together",
      parts: [
        { t: "Web app", tech: "React", d: "Upload, image viewer, bilingual interface." },
        { t: "Inference API", tech: "FastAPI · PyTorch", d: "Runs the SVA model and exposes the predict, explain and health endpoints." },
        { t: "Language model", tech: "Claude (Anthropic API)", d: "Writes the explanation from a short text summary." },
      ],
      flow: ["image", "text summary"],

      privacyTitle: "Privacy by design",
      privacyBody: "Uploaded images are processed in memory and are not saved by this prototype. Only a short text summary, the phrasing and the lesion coverage, is sent to the language model. The image itself is never sent.",

      outputTitle: "Reading the output",
      output: [
        { k: "Overlay", v: "Green fill marks the region the model considers a lesion; the orange line is its boundary." },
        { k: "Prompt used", v: "The phrasing the model received for this run." },
        { k: "Lesion coverage", v: "The share of the image area covered by the mask." },
        { k: "Inference time", v: "How long the model took to produce the mask." },
        { k: "Confidence (heuristic)", v: "A rough label derived from lesion coverage. It is not a measured accuracy for the image." },
        { k: "Patient and clinician views", v: "Two versions of the same explanation for different readers." },
        { k: "Possible finding and next steps", v: "Generated suggestions to discuss with a clinician, never a diagnosis." },
      ],

      stackTitle: "Technology",
      stack: ["React", "Vite", "FastAPI", "PyTorch", "MobileSAM", "Bio_ClinicalBERT", "OpenCV", "Claude API"],

      hardwareTitle: "Built for limited hardware",
      hardwareBody: "Training and testing were done on a laptop GPU with 4 GB of memory. Only 6.5 M of the 120.9 M parameters are trained; the rest are frozen, pretrained models.",

      responsibleTitle: "Responsible use",
      responsibleBody: "Coloscope is a research prototype. It is not a medical device, it does not provide a diagnosis, and its output must always be reviewed by a qualified clinician.",

      ctaTitle: "See it in action",
      ctaBody: "Upload an endoscopy image, then run it again with another phrasing to compare the results.",
      cta: "Open the live demo",
    },
  },

  /* ====================================================================== */
  id: {
    home: {
      eyebrow: "Prototipe riset · Universitas Negeri Surabaya",
      title: "AI yang tetap konsisten, apa pun cara temuan itu disebutkan",
      lead:
        "Klinisi menyebut lesi yang sama dengan kata yang berbeda. SVA (Semantic Visual Alignment) adalah pendekatan ringan yang berupaya menjaga segmentasi citra kolorektal berbasis teks tetap stabil terhadap perbedaan penyebutan itu. Pelajari cara kerjanya, lalu coba pada gambar endoskopi.",
      ctaPrimary: "Coba demo langsung",
      ctaSecondary: "Cara kerja SVA",
      illus: {
        left: "Penyebutan klinisi",
        right: "Keluaran model",
        alt: "Tiga frasa berbeda, polyp, mucosal protrusion dan sessile lesion, semuanya menunjuk ke area yang sama pada gambar endoskopi",
        caption: "Tiga cara menyebut satu temuan. Tujuannya: satu hasil yang konsisten.",
      },
      numbers: [
        { v: "0.0112", l: "PR Score pada Kvasir-SEG (makin rendah makin stabil)" },
        { v: "6,5 jt", l: "parameter yang dilatih (5,4% dari 120,9 jt)" },
        { v: "4 GB", l: "memori GPU untuk pelatihan dan pengujian" },
        { v: "1.000", l: "gambar endoskopi (Kvasir-SEG)" },
      ],
      problemTitle: "Mengapa ini penting",
      problem: [
        { t: "Satu temuan, banyak istilah", d: "Lesi yang sama bisa disebut polip, protrusi mukosa, atau lesi sesil, tergantung siapa yang menulis laporan." },
        { t: "Model bisa peka terhadap kata", d: "Model segmentasi berbasis teks menerima sebuah frasa sebagai masukan. Jika keluarannya berubah mengikuti frasa, alat ini sulit dipercaya dalam praktik sehari-hari." },
        { t: "Model besar tidak cocok untuk semua klinik", d: "Banyak foundation model membutuhkan GPU besar. Model ringan dapat berjalan di tempat dengan perangkat terbatas." },
      ],
      approachTitle: "Pendekatan kami",
      approach: [
        { t: "Menyelaraskan gambar dan teks", d: "Modul cross-modal attention membuat area gambar mencari kata-kata yang menggambarkannya." },
        { t: "Melatih dengan banyak penyebutan", d: "Setiap langkah pelatihan memakai penyebutan berbeda untuk temuan yang sama, sehingga hasil tidak bergantung pada satu frasa." },
        { t: "Mengukur ketahanan", d: "Metrik baru, PR Score, mengukur seberapa besar hasil berubah di berbagai penyebutan." },
        { t: "Tetap ringan", d: "Hanya 6,5 jt parameter yang dilatih di atas backbone yang dibekukan, sehingga GPU 4 GB sudah cukup." },
      ],
      exploreTitle: "Jelajahi proyek ini",
      explore: [
        { to: "/sva", t: "Cara kerja SVA", d: "Ide, arsitektur, tujuan pelatihan, metrik, dan hasilnya.", cta: "Baca metodenya" },
        { to: "/system", t: "Sistem Coloscope", d: "Perjalanan sebuah gambar dari browser hingga menjadi segmentasi dan penjelasan.", cta: "Lihat alurnya" },
        { to: "/demo", t: "Demo langsung", d: "Unggah gambar endoskopi dan lihat model bekerja, lengkap dengan penjelasan dua bahasa.", cta: "Buka demo" },
      ],
      notice: "Prototipe riset. Bukan alat medis dan bukan pengganti pemeriksaan oleh klinisi yang berkualifikasi.",
    },

    sva: {
      eyebrow: "Metode",
      title: "Cara kerja SVA",
      lead: "SVA adalah singkatan dari Semantic Visual Alignment. Halaman ini membahas masalah, arsitektur, ide pelatihan, metrik, dan hasilnya secara berurutan.",
      onThisPage: "Di halaman ini",
      toc: [
        ["problem", "Masalah"],
        ["architecture", "Arsitektur"],
        ["alignment", "Di dalam modul SVA"],
        ["objective", "Tujuan pelatihan"],
        ["metric", "Mengukur ketahanan"],
        ["results", "Hasil"],
        ["limits", "Keterbatasan"],
      ],

      problem: {
        title: "Masalah: satu temuan, banyak penyebutan",
        body: [
          "Model segmentasi berbasis teks menerima gambar dan frasa pendek, misalnya “polyp”, lalu mengembalikan area yang sesuai. Klinisi tidak selalu memakai frasa yang sama: “mucosal protrusion” atau “sessile lesion” bisa menggambarkan struktur yang sama.",
          "Jika model bereaksi berbeda pada tiap frasa, keluarannya bergantung pada kata, bukan pada gambar. Ini masalah untuk penggunaan klinis, karena alat harus berperilaku dapat diprediksi.",
        ],
        without: { title: "Tanpa penyelarasan", cap: "Keluaran berubah mengikuti frasa" },
        with: { title: "Tujuan SVA", cap: "Temuan sama, hasil sama" },
        illusNote: "Diagram konseptual, bukan keluaran model sebenarnya.",
      },

      architecture: {
        title: "Arsitektur",
        lead: "SVA-MedSAM memakai dua model pralatih yang dibekukan dan hanya melatih jembatan kecil di antara keduanya.",
        legendFrozen: "Dibekukan (tidak dilatih)",
        legendTrain: "Dilatih",
        status: { frozen: "Beku", train: "Dilatih" },
        nodes: {
          image: { t: "Gambar endoskopi", d: "RGB 256 × 256" },
          text: { t: "Frasa klinis", d: "misalnya “mucosal protrusion”" },
          enc: { t: "Encoder gambar MobileSAM", d: "Mengubah gambar menjadi fitur patch" },
          bert: { t: "Bio_ClinicalBERT", d: "Mengubah frasa menjadi fitur kata; dilatih awal pada catatan klinis" },
          sva: { t: "Modul SVA", d: "Patch gambar memperhatikan kata, lalu saling memperhatikan" },
          dec: { t: "Mask decoder + adapter", d: "Mengubah fitur yang selaras menjadi mask" },
          mask: { t: "Mask segmentasi", d: "Area lesi yang ditandai" },
        },
        note: "Gambar diubah ke 256 × 256 dan diperbesar secara internal ke 1024 × 1024, ukuran masukan yang diharapkan MobileSAM.",
        paramsTitle: "Sebaran parameter",
        paramHead: ["Komponen", "Peran", "Parameter", "Status"],
        params: [
          ["Bio_ClinicalBERT", "Encoder teks", "108,3 jt", "Beku"],
          ["Encoder MobileSAM dan prompt encoder", "Encoder gambar", "6,1 jt", "Beku"],
          ["Proyeksi teks", "Menyesuaikan ukuran teks dengan fitur gambar", "0,2 jt", "Dilatih"],
          ["Modul SVA", "Penyelarasan lintas modalitas", "2,1 jt", "Dilatih"],
          ["Mask decoder + adapter", "Menghasilkan mask", "4,2 jt", "Dilatih"],
        ],
        paramTotal: "Total 120,9 jt · dilatih 6,5 jt (5,4%)",
      },

      alignment: {
        title: "Di dalam modul SVA",
        body: "Modul ini menumpuk dua blok identik dengan delapan attention head. Setiap blok melakukan tiga hal secara berurutan.",
        steps: [
          { t: "Cross-attention", d: "Setiap patch gambar menanyakan kata mana dalam frasa yang relevan baginya. Patch berperan sebagai query; kata sebagai key dan value." },
          { t: "Self-attention", d: "Patch saling berbagi informasi, sehingga area yang berdekatan tetap koheren." },
          { t: "Lapisan feed-forward", d: "Jaringan kecil menyempurnakan setiap patch sebelum blok berikutnya." },
        ],
        attnTitle: "Cross-attention, ilustrasi",
        attnCaption: "Sel yang lebih gelap berarti patch lebih bergantung pada kata itu. Diagram konseptual, bukan keluaran model sebenarnya.",
        patches: ["Patch pada lesi", "Patch pada tepi lesi", "Patch pada lumen", "Patch pada lipatan"],
        words: ["mucosal", "protrusion"],
      },

      objective: {
        title: "Tujuan pelatihan",
        body: [
          "Loss total menggabungkan tiga suku: Focal loss, yang mengatasi ketimpangan antara piksel lesi dan latar; Dice loss, yang menghargai tumpang tindih dengan mask pakar; dan suku SAC (Semantic-Aware Contrastive), tujuan konsistensi yang diusulkan dalam penelitian ini.",
          "Dalam rancangan SAC, setiap penyebutan yang valid untuk suatu temuan dianggap pasangan positif bagi fitur gambar, sehingga pelatihan menyatukannya, bukan menganggap satu frasa sebagai satu-satunya yang benar. Pada setiap langkah pelatihan, satu penyebutan diambil acak dari 15 varian per kelas.",
        ],
        formulaTotal: "L_total = 1.0 · L_Focal + 1.0 · L_Dice + 0.5 · L_SAC",
        formulaSac: "L_SAC = − log [ exp( sim(v, t⁺) / τ ) / Σⱼ exp( sim(v, tⱼ) / τ ) ],  τ = 0.07",
        legend: "v: fitur gambar · t⁺: penyebutan valid untuk temuan yang sama · tⱼ: semua penyebutan dalam batch · sim: cosine similarity",
        embTitle: "Gagasan di balik SAC",
        embCaption: "Ilustrasi konseptual dari tujuan pelatihan.",
        embLabels: { image: "fitur gambar", pulled: "disatukan", pushed: "dijauhkan", other: "frasa tak terkait" },
      },

      metric: {
        title: "Mengukur ketahanan: PR Score",
        body: [
          "Akurasi saja tidak menunjukkan kepekaan terhadap penyebutan. PR Score (Prompt Robustness Score) menjalankan gambar yang sama dengan beberapa penyebutan lalu menghitung simpangan baku skor Dice. PR Score rendah berarti hasil hampir tidak berubah saat penyebutan berubah.",
          "Kami juga melaporkan DSC kasus terburuk (skor terendah di antara penyebutan) dan PR relatif (simpangan baku dibagi rata-rata DSC).",
        ],
        formula: "PR Score = σ( DSC₁, …, DSC_K ),  K = 10 penyebutan",
        stableTitle: "Model stabil",
        unstableTitle: "Model tidak stabil",
        illusNote: "Nilai ilustrasi, bukan hasil pengukuran.",
        caveatTitle: "Catatan penting",
        caveat: "PR Score rendah saja tidak membuktikan bahwa model memakai teks: model yang mengabaikan teks sepenuhnya juga mendapat skor 0 sempurna. Karena itu tabel hasil menandai kasus tersebut.",
      },

      results: {
        title: "Hasil pada Kvasir-SEG",
        lead: "Semua varian dilatih dan diuji pada pembagian Kvasir-SEG yang sama (800 / 100 / 100 gambar, dibagi per kasus) dan dievaluasi dengan 10 penyebutan per gambar.",
        head: ["Model", "Memakai teks", "DSC", "DSC terburuk", "NSD", "PR Score ↓", "PR relatif ↓"],
        yes: "Ya",
        no: "Tidak",
        names: {
          ours: "SVA-MedSAM (usulan)",
          a2: "A2 · tanpa suku SAC",
          a3: "A3 · BERT domain umum",
          a4: "A4 · 3 penyebutan saat pelatihan",
          a1: "A1 · tanpa modul SVA",
        },
        footnote: "A1 mengabaikan teks, sehingga PR Score 0 tidak bermakna. Setiap varian dilatih satu kali.",
        readTitle: "Cara membacanya",
        read: [
          "SVA-MedSAM memiliki PR Score terendah (0,0112) dan PR relatif terendah (0,033) di antara model yang memakai teks.",
          "Menghapus suku SAC (A2), memakai BERT domain umum (A3), atau melatih hanya dengan 3 penyebutan (A4) masing-masing menghasilkan PR Score lebih tinggi: 0,0145, 0,0243, dan 0,0247.",
          "SVA-MedSAM memiliki DSC lebih rendah daripada varian lain (0,7176 dibanding 0,7433 hingga 0,7652; A1 mencapai 0,8454 karena mengabaikan teks). Kami melaporkannya secara terbuka: dalam studi ini model yang paling stabil bukan yang paling akurat.",
          "Pada evaluasi standar dengan satu frasa, SVA-MedSAM mendapat DSC 0,7194 dan NSD 0,3691.",
        ],
      },

      limits: {
        title: "Keterbatasan dan langkah berikutnya",
        limitsTitle: "Keterbatasan",
        limits: [
          "Satu dataset dan satu modalitas: Kvasir-SEG, endoskopi white-light. Dataset lain dan CT belum diuji.",
          "Kvasir-SEG hanya menyediakan mask polip. Penyebutan untuk polip, adenoma, dan karsinoma karena itu dievaluasi terhadap mask yang sama; membedakan jenis lesi lewat teks membutuhkan dataset berlabel kelas, seperti HyperKvasir.",
          "Frasa yang sengaja salah (misalnya organ lain) belum diuji. Pengujian itu diperlukan untuk menunjukkan seberapa kuat teks memengaruhi hasil.",
          "Setiap varian dilatih satu kali, sehingga kontribusi tiap komponen, misalnya suku SAC, belum terisolasi.",
          "Label keyakinan pada demo adalah heuristik berdasarkan cakupan lesi, bukan ukuran yang tervalidasi.",
        ],
        nextTitle: "Langkah berikutnya",
        next: [
          "Eksperimen frasa yang salah",
          "Data multi-kelas (HyperKvasir)",
          "Pengulangan dengan beberapa random seed",
          "Resolusi lebih tinggi dan pelatihan mixed-precision",
          "Peninjauan penyebutan bersama dokter spesialis gastroenterologi",
        ],
      },
    },

    system: {
      eyebrow: "Platform",
      title: "Cara kerja sistem Coloscope",
      lead: "Coloscope adalah aplikasi web yang dibangun di sekitar model SVA. Halaman ini mengikuti satu gambar dari browser hingga penjelasan akhir.",

      journeyTitle: "Perjalanan satu gambar",
      journey: [
        { t: "Unggah", d: "Anda memilih gambar endoskopi JPEG atau PNG. Browser mengirimnya ke server." },
        { t: "Praproses", d: "Server membaca gambar, mengubah ukurannya menjadi 256 × 256, dan menskalakan nilai piksel ke rentang 0 sampai 1." },
        { t: "Memilih penyebutan", d: "Demo memilih acak satu dari sepuluh penyebutan terkait polip, seperti “polyp” atau “mucosal protrusion”. Jalankan gambar yang sama lagi untuk melihat penyebutan yang berbeda." },
        { t: "Inferensi model", d: "Gambar dan frasa melewati SVA-MedSAM. Keluarannya adalah probabilitas untuk setiap piksel; nilai di atas 0,5 menjadi mask." },
        { t: "Overlay", d: "Mask dikembalikan ke ukuran gambar asli, diisi warna hijau, dan diberi garis tepi oranye." },
        { t: "Penjelasan", d: "Penyebutan dan cakupan lesi, bukan gambarnya, dikirim ke model bahasa. Model itu menulis penjelasan ramah pasien dan penjelasan untuk klinisi dalam bahasa Inggris dan Indonesia, beserta kemungkinan temuan dan langkah lanjutan. Jika model bahasa tidak tersedia, dipakai teks templat." },
        { t: "Hasil", d: "Browser menampilkan overlay, statistik ringkas, dan penjelasan." },
      ],

      partsTitle: "Tiga bagian yang bekerja bersama",
      parts: [
        { t: "Aplikasi web", tech: "React", d: "Unggah, penampil gambar, antarmuka dua bahasa." },
        { t: "API inferensi", tech: "FastAPI · PyTorch", d: "Menjalankan model SVA dan menyediakan endpoint predict, explain, dan health." },
        { t: "Model bahasa", tech: "Claude (Anthropic API)", d: "Menulis penjelasan dari ringkasan teks singkat." },
      ],
      flow: ["gambar", "ringkasan teks"],

      privacyTitle: "Privasi sejak rancangan",
      privacyBody: "Gambar yang diunggah diproses di memori dan tidak disimpan oleh prototipe ini. Hanya ringkasan teks singkat, yaitu penyebutan dan cakupan lesi, yang dikirim ke model bahasa. Gambarnya sendiri tidak pernah dikirim.",

      outputTitle: "Membaca keluaran",
      output: [
        { k: "Overlay", v: "Isian hijau menandai area yang dianggap model sebagai lesi; garis oranye adalah batasnya." },
        { k: "Prompt yang digunakan", v: "Penyebutan yang diterima model pada proses ini." },
        { k: "Cakupan lesi", v: "Persentase area gambar yang tertutup mask." },
        { k: "Waktu inferensi", v: "Lama model menghasilkan mask." },
        { k: "Keyakinan (heuristik)", v: "Label kasar yang diturunkan dari cakupan lesi. Bukan akurasi terukur untuk gambar tersebut." },
        { k: "Tampilan pasien dan klinisi", v: "Dua versi penjelasan yang sama untuk pembaca yang berbeda." },
        { k: "Kemungkinan temuan dan langkah lanjutan", v: "Saran yang dihasilkan untuk dibahas dengan klinisi, bukan diagnosis." },
      ],

      stackTitle: "Teknologi",
      stack: ["React", "Vite", "FastAPI", "PyTorch", "MobileSAM", "Bio_ClinicalBERT", "OpenCV", "Claude API"],

      hardwareTitle: "Dibangun untuk perangkat terbatas",
      hardwareBody: "Pelatihan dan pengujian dilakukan pada GPU laptop dengan memori 4 GB. Hanya 6,5 jt dari 120,9 jt parameter yang dilatih; sisanya adalah model pralatih yang dibekukan.",

      responsibleTitle: "Penggunaan yang bertanggung jawab",
      responsibleBody: "Coloscope adalah prototipe riset. Bukan alat medis, tidak memberikan diagnosis, dan keluarannya harus selalu ditinjau oleh klinisi yang berkualifikasi.",

      ctaTitle: "Lihat langsung",
      ctaBody: "Unggah gambar endoskopi, lalu jalankan lagi dengan penyebutan lain untuk membandingkan hasilnya.",
      cta: "Buka demo langsung",
    },
  },
}
