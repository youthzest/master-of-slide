#!/usr/bin/env python3
import sys
import os
import re

def parse_youtube(url):
    from youtube_transcript_api import YouTubeTranscriptApi
    
    # Extract video ID
    video_id = None
    patterns = [
        r'(?:v=|\/)([0-9A-Za-z_-]{11}).*',
        r'(?:youtu\.be\/)([0-9A-Za-z_-]{11})'
    ]
    for pattern in patterns:
        match = re.search(pattern, url)
        if match:
            video_id = match.group(1)
            break
            
    if not video_id:
        return "Error: Could not extract YouTube Video ID."
        
    try:
        # Try fetching Korean first, then fallback
        transcript_list = YouTubeTranscriptApi.list_transcripts(video_id)
        try:
            transcript = transcript_list.find_transcript(['ko', 'en'])
        except:
            # Fallback to the first available transcript
            transcript = list(transcript_list)[0]
            
        data = transcript.fetch()
        text = " ".join([t['text'] for t in data])
        return text
    except Exception as e:
        return f"Error fetching YouTube transcript: {str(e)}"

def parse_pdf(file_path):
    try:
        from pypdf import PdfReader
        reader = PdfReader(file_path)
        text = ""
        for page in reader.pages:
            text += page.extract_text() + "\n"
        return text
    except Exception as e:
        return f"Error reading PDF: {str(e)}"

def parse_text(file_path):
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            return f.read()
    except Exception as e:
        return f"Error reading text file: {str(e)}"

def parse_docx(file_path):
    try:
        import zipfile
        import xml.etree.ElementTree as ET
        text = ""
        with zipfile.ZipFile(file_path) as docx:
            xml_content = docx.read('word/document.xml')
            tree = ET.fromstring(xml_content)
            for node in tree.iter():
                if node.tag.endswith('}t') and node.text:
                    text += node.text + " "
        return text.strip()
    except Exception as e:
        return f"Error reading DOCX: {str(e)}"

def parse_image(file_path):
    return f"[IMAGE_FILE] {file_path}\n(Note to AI: Use your view_file tool to analyze this image)"

def main():
    if len(sys.argv) < 2:
        print("Usage: parse_input.py <url_or_filepath>")
        sys.exit(1)
        
    target = sys.argv[1]
    
    # Check if it's a URL
    if target.startswith("http://") or target.startswith("https://"):
        if "youtube.com" in target or "youtu.be" in target:
            text = parse_youtube(target)
            print(text)
        else:
            print("Error: Only YouTube URLs are currently supported.")
    else:
        # Assume it's a local file path
        if not os.path.exists(target):
            print(f"Error: File not found: {target}")
            sys.exit(1)
            
        _, ext = os.path.splitext(target)
        ext = ext.lower()
        
        if ext == '.pdf':
            text = parse_pdf(target)
            print(text)
        elif ext in ['.txt', '.md', '.csv', '.json']:
            text = parse_text(target)
            print(text)
        elif ext in ['.docx']:
            text = parse_docx(target)
            print(text)
        elif ext in ['.png', '.jpg', '.jpeg', '.gif', '.bmp', '.webp']:
            text = parse_image(target)
            print(text)
        else:
            print(f"Error: Unsupported file extension {ext}")

if __name__ == "__main__":
    main()
