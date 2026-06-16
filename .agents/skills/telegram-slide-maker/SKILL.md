---
name: telegram-slide-maker
description: Extracts text from PDFs, YouTube URLs, or Obsidian markdown sent via Telegram, asks for design/page preferences, and generates an open-slide presentation.
---

# Telegram Slide Maker

This skill intercepts file uploads (PDF, TXT) or YouTube URLs sent via messaging platforms (like Telegram) and converts them into presentation slides using `Master Of Slide`.

## Trigger
Use this skill when:
1. The user drops a file (e.g. `.pdf`, `.txt`, `.md`, `.docx`, `.png`, `.jpg`) or a YouTube link (`youtube.com` or `youtu.be`) in the chat.
2. The user asks to "make a presentation", "summarize into slides", or "PPT로 만들어줘" from a given file/link.

## Execution Flow

1. **Extraction (Silent)**
   - Pass the file path or URL to the local parser script: `python3 scripts/parse_input.py "<target>"`.
   - Read the extracted text. If the text is massive, keep it in your context. Do NOT print the raw text back to the user.
   - If the script outputs that it's an image file, use your `view_file` tool to analyze the image directly.

2. **User Consultation**
   - Reply to the user in a friendly tone: "문서를 성공적으로 읽어 들였습니다. 원하시는 프레젠테이션 테마(예: Y2K, 미니멀 등 선택하거나 자유롭게 직접 입력)와 슬라이드 장수(1장, 5장, 10장 외에 원하는 장수 직접 입력 가능)를 알려주세요!"
   - Make sure to clearly communicate that they can type whatever theme they want and input any exact number of pages.
   - Wait for the user's response.

3. **Generation**
   - Once the user provides the theme and page count, summarize the extracted text into the requested number of core messages.
   - Use the `create-slide-from-markdown` or the `slide` skill internally, OR directly write the React `index.tsx` file inside `apps/demo/slides/<new-slide-name>/` applying the user's chosen aesthetic and the summarized content.
   
4. **Delivery**
   - Inform the user that the slide is ready.
   - Provide the web link to the new slide (e.g. `http://127.0.0.1:5175/s/<new-slide-name>`).
   - Offer them the option to "Download as PDF/PPTX" if they access the web dashboard.
