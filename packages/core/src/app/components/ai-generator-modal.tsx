import React, { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Sparkles, Upload, Loader2, AlertCircle, FileText } from 'lucide-react';

interface AiGeneratorModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: (slideId: string) => void;
}

export function AiGeneratorModal({ open, onOpenChange, onSuccess }: AiGeneratorModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [slideId, setSlideId] = useState('');
  const [slideCount, setSlideCount] = useState(8);
  const [theme, setTheme] = useState('minimalist');
  const [customPrompt, setCustomPrompt] = useState('');
  const [modelName, setModelName] = useState('gemma4:e2b');
  
  const [loading, setLoading] = useState(false);
  const [loadingStage, setLoadingStage] = useState('');
  const [error, setError] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Convert string to safe kebab-case
  const toKebabCase = (str: string) => {
    return str
      .toLowerCase()
      .replace(/[^a-z0-9가-힣\s-]/g, '') // Keep letters, numbers, spaces, hyphens, and Korean characters
      .trim()
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  };

  const handleFileChange = (selectedFile: File) => {
    setFile(selectedFile);
    
    // Auto-generate title and slideId
    const nameWithoutExt = selectedFile.name.substring(0, selectedFile.name.lastIndexOf('.')) || selectedFile.name;
    setTitle(nameWithoutExt);
    
    // Romanize/cleanup slideId
    let idCandidate = toKebabCase(nameWithoutExt);
    // If it's mostly non-english/korean, fall back
    if (!idCandidate || idCandidate.length < 2) {
      idCandidate = `ai-slide-${Date.now().toString().slice(-6)}`;
    } else {
      // Simple translation for Korean characters to pinyin/romanized is complex,
      // so we just replace non-ascii characters with a safe prefix or timestamp if needed.
      const asciiOnly = idCandidate.replace(/[^a-z0-9_-]/g, '');
      if (asciiOnly.length < 2) {
        idCandidate = `slide-${Date.now().toString().slice(-6)}`;
      } else {
        idCandidate = asciiOnly;
      }
    }
    setSlideId(idCandidate);
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  // Helper to extract text from various document formats client-side
  const extractText = async (targetFile: File): Promise<string> => {
    const extension = targetFile.name.split('.').pop()?.toLowerCase();
    
    if (extension === 'txt' || extension === 'md') {
      return await targetFile.text();
    }
    
    if (extension === 'opml') {
      const text = await targetFile.text();
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(text, 'text/xml');
      const outlines = xmlDoc.getElementsByTagName('outline');
      let extracted = '';
      for (let i = 0; i < outlines.length; i++) {
        const outline = outlines[i];
        const outlineText = outline.getAttribute('text') || outline.getAttribute('title') || '';
        if (outlineText.trim()) {
          extracted += `* ${outlineText}\n`;
        }
      }
      return extracted;
    }
    
    if (extension === 'docx') {
      setLoadingStage('Word 파일 (.docx) 텍스트 추출 엔진 로딩 중...');
      if (!(window as any).mammoth) {
        await new Promise<void>((resolve, reject) => {
          const script = document.createElement('script');
          script.src = 'https://cdnjs.cloudflare.com/ajax/libs/mammoth/1.6.0/mammoth.browser.min.js';
          script.onload = () => resolve();
          script.onerror = () => reject(new Error('Mammoth.js 라이브러리 로딩에 실패했습니다.'));
          document.head.appendChild(script);
        });
      }
      const mammoth = (window as any).mammoth;
      const buffer = await targetFile.arrayBuffer();
      const result = await mammoth.extractRawText({ arrayBuffer: buffer });
      return result.value;
    }
    
    if (extension === 'pdf') {
      setLoadingStage('PDF 파일 텍스트 추출 엔진 로딩 중...');
      if (!(window as any).pdfjsLib) {
        await new Promise<void>((resolve, reject) => {
          const script = document.createElement('script');
          script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
          script.onload = () => resolve();
          script.onerror = () => reject(new Error('PDF.js 라이브러리 로딩에 실패했습니다.'));
          document.head.appendChild(script);
        });
      }
      const pdfjsLib = (window as any)['pdfjs-dist/build/pdf'];
      pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
      
      const buffer = await targetFile.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: buffer }).promise;
      let extracted = '';
      
      for (let i = 1; i <= pdf.numPages; i++) {
        setLoadingStage(`PDF 분석 중 (${i} / ${pdf.numPages} 페이지)...`);
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items
          // @ts-ignore
          .map((item) => item.str)
          .join(' ');
        extracted += pageText + '\n';
      }
      return extracted;
    }
    
    throw new Error(`지원하지 않는 파일 형식입니다: .${extension}`);
  };

  const handleGenerate = async () => {
    if (!file) {
      setError('원본 문서를 업로드해 주세요.');
      return;
    }
    if (!title.trim()) {
      setError('슬라이드 제목을 입력해 주세요.');
      return;
    }
    if (!slideId.trim()) {
      setError('슬라이드 ID를 입력해 주세요.');
      return;
    }
    if (!/^[a-z0-9_-]+$/i.test(slideId)) {
      setError('슬라이드 ID는 영문 소문자, 숫자, 하이픈(-), 언더바(_)만 가능합니다.');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      // Step 1: Text extraction
      const systemPrompt = `[제약 사항]
1. 전체 슬라이드 개수는 표지 슬라이드를 제외하고 정확히 ${slideCount}장으로 나누어 요약해 주세요.
2. 각 슬라이드는 제목(title), 핵심 내용 리스트(bullets), 그리고 발표자 스크립트(notes)로 이루어져야 합니다.
3. bullets는 각 슬라이드당 3~5개 사이의 핵심 문장으로 채워주세요.
4. 모든 슬라이드 제목과 내용은 원문의 핵심 개념을 유실하지 않고 논리적으로 이어져야 합니다.
5. 언어는 한국어로 답변해 주세요.
6. 주의: 응답하는 JSON 배열 내의 각 객체의 Key 이름은 절대 번역하지 말고 반드시 영문 "title", "bullets", "notes" 로만 작성하세요.

[요청 사항]
${customPrompt ? `특별 요청 사항: ${customPrompt}` : ''}

반드시 아래 JSON 스키마를 만족하는 JSON 배열 형태로만 응답하세요. 다른 설명 문구는 절대 추가하지 마세요:
[
  {
    "title": "실제 생성된 슬라이드 제목",
    "bullets": [
      "첫 번째 상세 요약 내용",
      "두 번째 상세 요약 내용",
      "세 번째 상세 요약 내용"
    ],
    "notes": "발표자가 이야기할 구어체 스크립트 내용 (30~80단어 사이)"
  }
]`;


      const response = await fetch('http://127.0.0.1:11434/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: modelName,
          messages: [
            { role: 'user', content: systemPrompt },
            { role: 'user', content: `분석할 문서 텍스트:\n${documentText.slice(0, 10000)}` } // Limit to 10k chars to avoid token blowout
          ],
          stream: false,
          format: 'json'
        }),
      });

      if (!response.ok) {
        throw new Error(`Ollama 서버 연결 실패 (포트 11434가 켜져 있고, '${modelName}' 모델이 존재하는지 확인해 주세요)`);
      }

      const responseData = await response.json();
      const contentStr = responseData.message?.content;
      
      if (!contentStr) {
        throw new Error('Ollama로부터 응답 콘텐츠를 받지 못했습니다.');
      }

      let slidesData;
      try {
        slidesData = JSON.parse(contentStr);
      } catch (err) {
        throw new Error('Ollama의 응답이 올바른 JSON 형식이 아닙니다. 다시 시도해 주세요.');
      }

      // If Ollama wrapped the array inside an object (e.g. { "slides": [...] } or { "presentation": [...] })
      if (slidesData && !Array.isArray(slidesData) && typeof slidesData === 'object') {
        const possibleKeys = ['slides', 'presentation', 'data', 'list', 'outline'];
        for (const key of possibleKeys) {
          if (Array.isArray((slidesData as any)[key])) {
            slidesData = (slidesData as any)[key];
            break;
          }
        }
        
        // If still not an array, search for ANY array property in the object
        if (!Array.isArray(slidesData)) {
          const firstArrayKey = Object.keys(slidesData).find(key => Array.isArray((slidesData as any)[key]));
          if (firstArrayKey) {
            slidesData = (slidesData as any)[firstArrayKey];
          }
        }
      }

      if (!Array.isArray(slidesData)) {
        throw new Error('Ollama의 응답 JSON이 슬라이드 목록 배열이 아닙니다: ' + JSON.stringify(slidesData).slice(0, 150));
      }

      // Step 3: Write React Slide on server
      setLoadingStage('로컬 서버에 React 슬라이드 파일 쓰는 중...');
      const saveResponse = await fetch('/__slides', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          slideId,
          title,
          slidesData,
          theme
        }),
      });

      if (!saveResponse.ok) {
        const errJson = await saveResponse.json();
        throw new Error(errJson.error || '슬라이드 저장에 실패했습니다.');
      }

      setLoadingStage('슬라이드 생성 완료! 로딩 중...');
      setTimeout(() => {
        onSuccess(slideId);
        onOpenChange(false);
      }, 1000);

    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!loading) onOpenChange(v); }}>
      <DialogContent className="max-w-[700px] border-4 border-foreground bg-card text-foreground shadow-[8px_8px_0_var(--foreground)]">
        <DialogHeader className="border-b-2 border-foreground pb-4">
          <DialogTitle className="font-heading text-2xl font-black tracking-normal flex items-center gap-2">
            <Sparkles className="size-6 text-brand" />
            AI로 슬라이드 생성 (Local Ollama)
          </DialogTitle>
          <DialogDescription className="font-semibold text-muted-foreground text-sm">
            토큰 비용 없이 본인의 Mac에서 로컬 LLM을 사용하여 문서 파일을 발표 자료로 자동 변환합니다.
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 gap-4">
            <Loader2 className="size-12 animate-spin text-brand" />
            <p className="font-bold text-lg">{loadingStage}</p>
            <p className="text-xs text-muted-foreground">이 작업은 수십 초가량 걸릴 수 있으며 컴퓨터 자원을 사용합니다.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4 max-h-[70vh] overflow-y-auto pr-2">
            {/* Left Column: File Upload & Input Info */}
            <div className="flex flex-col gap-4">
              <div className="font-bold text-sm text-foreground">1. 파일 업로드</div>
              <div
                onDragOver={onDragOver}
                onDrop={onDrop}
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-foreground rounded-[6px] p-6 text-center cursor-pointer bg-background hover:bg-accent/40 transition-colors flex flex-col items-center gap-2"
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept=".pdf,.docx,.opml,.txt,.md"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      handleFileChange(e.target.files[0]);
                    }
                  }}
                />
                <Upload className="size-8 text-muted-foreground" />
                <span className="font-bold text-xs">문서 드래그 앤 드롭 또는 클릭</span>
                <span className="text-[10px] text-muted-foreground">PDF, DOCX, OPML, TXT, MD 지원 (최대 50MB)</span>
              </div>

              {file && (
                <div className="flex items-center gap-2 bg-background p-3 rounded-[6px] border-2 border-foreground">
                  <FileText className="size-6 text-brand shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-xs truncate">{file.name}</p>
                    <p className="text-[10px] text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                </div>
              )}

              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-[11px] uppercase tracking-wider text-muted-foreground">슬라이드 제목</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="슬라이드 제목"
                  className="h-9 w-full rounded-[4px] border-2 border-foreground bg-background px-3 text-[12.5px] font-bold outline-none"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-[11px] uppercase tracking-wider text-muted-foreground">슬라이드 ID (경로명)</label>
                <input
                  type="text"
                  value={slideId}
                  onChange={(e) => setSlideId(toKebabCase(e.target.value))}
                  placeholder="slide-id-in-kebab-case"
                  className="h-9 w-full rounded-[4px] border-2 border-foreground bg-background px-3 text-[12.5px] font-bold outline-none"
                />
              </div>
            </div>

            {/* Right Column: Configuration */}
            <div className="flex flex-col gap-4">
              <div className="font-bold text-sm text-foreground">2. 세부 설정</div>
              
              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-[11px] uppercase tracking-wider text-muted-foreground">로컬 Ollama 모델</label>
                <input
                  type="text"
                  value={modelName}
                  onChange={(e) => setModelName(e.target.value)}
                  placeholder="gemma4:e2b"
                  className="h-9 w-full rounded-[4px] border-2 border-foreground bg-background px-3 text-[12.5px] font-bold outline-none"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between items-center">
                  <label className="font-bold text-[11px] uppercase tracking-wider text-muted-foreground">슬라이드 장수</label>
                  <span className="font-heading text-xs font-black">{slideCount} 장</span>
                </div>
                <input
                  type="range"
                  min="3"
                  max="20"
                  value={slideCount}
                  onChange={(e) => setSlideCount(Number(e.target.value))}
                  className="w-full accent-brand cursor-pointer"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-[11px] uppercase tracking-wider text-muted-foreground">디자인 비주얼 테마</label>
                <select
                  value={theme}
                  onChange={(e) => setTheme(e.target.value)}
                  className="h-9 w-full rounded-[4px] border-2 border-foreground bg-background px-3 text-[12.5px] font-bold outline-none cursor-pointer"
                >
                  <option value="minimalist">Minimalist (미니멀 화이트)</option>
                  <option value="cyberpunk">Cyberpunk (다크 네온)</option>
                  <option value="neo-brutalism">Neo-Brutalism (옐로우 대비)</option>
                  <option value="paper-press">Paper Report (베이지 리포트)</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-[11px] uppercase tracking-wider text-muted-foreground">AI 지시사항 (선택)</label>
                <textarea
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  placeholder="예: 스타트업 IR 피치덱 스타일로 작성해줘, 기술적인 부분은 축약하지 말고 강조해줘"
                  rows={3}
                  className="w-full rounded-[4px] border-2 border-foreground bg-background p-3 text-[12px] font-bold outline-none resize-none"
                />
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-destructive/10 text-destructive border-2 border-destructive p-3 rounded-[6px] flex items-start gap-2 text-xs font-bold my-2">
            <AlertCircle className="size-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <DialogFooter className="border-t-2 border-foreground pt-4 mt-2">
          <Button
            variant="ghost"
            onClick={() => onOpenChange(false)}
            disabled={loading}
            className="border-2 border-foreground bg-secondary font-black shadow-[2px_2px_0_var(--foreground)]"
          >
            취소
          </Button>
          <Button
            onClick={handleGenerate}
            disabled={loading}
            className="border-2 border-foreground bg-brand text-brand-foreground font-black shadow-[2px_2px_0_var(--foreground)] hover:bg-brand/80"
          >
            슬라이드 생성하기
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
