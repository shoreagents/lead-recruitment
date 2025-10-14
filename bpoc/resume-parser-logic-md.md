# Resume Parser Logic Documentation

## Overview
This document outlines the complete logic for a multi-format resume parser that uses **CloudConvert API** for document conversion, **GPT Vision OCR** for text extraction, and outputs structured JSON data through an organized DOCX pipeline.

## Updated Core Processing Logic (CloudConvert + GPT Pipeline)

### File Type Handling Workflow
```
NEW PIPELINE WITH CLOUDCONVERT API:
1. PDF → CLOUDCONVERT TO JPEG → GPT VISION OCR → ORGANIZED DOCX → JSON
2. DOCX → CLOUDCONVERT TO JPEG → GPT VISION OCR → ORGANIZED DOCX → JSON  
3. DOC → CLOUDCONVERT TO JPEG → GPT VISION OCR → ORGANIZED DOCX → JSON
4. JPG/JPEG → DIRECT GPT VISION OCR → ORGANIZED DOCX → JSON
5. PNG → DIRECT GPT VISION OCR → ORGANIZED DOCX → JSON
```

### Updated Processing Pipeline
```
Input File → File Type Detection → CloudConvert API (for docs) → JPEG Generation → 
GPT Vision OCR → Text Extraction → Organized DOCX Creation → JSON Output
```

## Required Packages

### Core Dependencies
```json
{
  "dependencies": {
    // CloudConvert API integration
    "axios": "^1.6.0",                   // HTTP client for CloudConvert API calls
    
    // AI Processing
    "openai": "^4.0.0",                  // GPT-4 Vision for OCR
    
    // Document processing
    "mammoth": "^1.6.0",                // DOCX reading and creation
    "officegen": "^0.6.5",              // DOCX generation
    
    // Utilities
    "lodash": "^4.17.21",               // Data manipulation
    "date-fns": "^2.30.0",              // Date parsing
    
    // React/UI
    "react": "^18.2.0",
    "lucide-react": "^0.263.1"          // Icons
  },
  "devDependencies": {
    "@types/node": "^20.0.0"            // TypeScript support
  }
}
```

## CloudConvert API Integration

### Environment Setup
```bash
# Add to your .env.local or environment variables
NEXT_PUBLIC_CLOUDCONVERT_API_KEY=your_cloudconvert_api_key_here
```

### CloudConvert Conversion Method
```javascript
// Using CloudConvert API to convert documents to JPEG
const convertToJPEGWithCloudConvert = async (file, fileType) => {
  const CLOUDCONVERT_API_KEY = process.env.NEXT_PUBLIC_CLOUDCONVERT_API_KEY;
  
  // Step 1: Create conversion job
  const jobResponse = await fetch('https://api.cloudconvert.com/v2/jobs', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${CLOUDCONVERT_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      tasks: {
        'import-file': {
          operation: 'import/upload'
        },
        'convert-file': {
          operation: 'convert',
          input: 'import-file',
          output_format: 'jpg',
          options: {
            quality: 95,
            strip: false
          }
        },
        'export-file': {
          operation: 'export/url',
          input: 'convert-file'
        }
      }
    })
  });

  const jobData = await jobResponse.json();

  // Step 2: Upload file
  const uploadTask = jobData.data.tasks.find(task => task.operation === 'import/upload');
  const formData = new FormData();
  formData.append('file', file);
  
  await fetch(uploadTask.result.form.url, {
    method: 'POST',
    body: formData
  });

  // Step 3: Wait for conversion and download result
  // (polling logic for job completion)
  
  return [jpegDataUrl]; // Returns converted JPEG
};
```

## GPT Vision OCR Processing

### GPT-4 Vision OCR Implementation
```javascript
const performGPTOCROnImages = async (jpegImages, openaiApiKey) => {
  const OpenAI = (await import('openai')).default;
  const openai = new OpenAI({
    apiKey: openaiApiKey,
    dangerouslyAllowBrowser: true
  });
  
  let allExtractedText = '';
  
  for (const jpegUrl of jpegImages) {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an expert OCR system specialized in extracting text from resume images. Extract ALL visible text exactly as it appears, preserving formatting, spacing, and structure."
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Please extract ALL text from this resume image. Include every detail visible - names, contact info, job titles, company names, dates, descriptions, skills, education, etc."
            },
            {
              type: "image_url",
              image_url: {
                url: base64Image
              }
            }
          ]
        }
      ],
      temperature: 0.1,
      max_tokens: 4000
    });
    
    const extractedText = completion.choices[0]?.message?.content;
    if (extractedText) {
      allExtractedText += extractedText + '\n\n';
    }
  }
  
  return allExtractedText.trim();
};
```

## Updated File Processing Logic

### Universal File Processor (CloudConvert + GPT Pipeline)
```javascript
const processResumeFile = async (file, openaiApiKey) => {
  console.log('🚀 Starting CloudConvert + GPT OCR pipeline');
  
  // Step 1: Convert to JPEG using CloudConvert or direct processing
  const jpegImages = await convertFileToJPEG(file);
  
  // Step 2: Extract text using GPT Vision OCR from JPEG images
  const extractedText = await performGPTOCROnImages(jpegImages, openaiApiKey);
  
  // Step 3: Create organized DOCX from extracted text
  const { docxFile, docxPreview } = await createOrganizedDOCX(extractedText, file.name);
  
  // Step 4: Convert DOCX content to JSON
  const jsonData = await convertDOCXContentToJSON(docxFile, openaiApiKey);
  
  // Step 5: Build final resume object
  const finalResume = buildResumeWithCloudConvertPipeline(
    file, extractedText, docxFile, docxPreview, jsonData, jpegImages
  );
  
  return finalResume;
};

// File type routing
const convertFileToJPEG = async (file) => {
  const fileType = file.type.toLowerCase();
  
  if (fileType.includes('pdf')) {
    return await convertToJPEGWithCloudConvert(file, 'PDF');
  } else if (fileType.includes('wordprocessingml')) {
    return await convertToJPEGWithCloudConvert(file, 'DOCX');
  } else if (fileType.includes('msword')) {
    return await convertToJPEGWithCloudConvert(file, 'DOC');
  } else if (fileType.includes('jpeg') || fileType.includes('jpg')) {
    return [URL.createObjectURL(file)]; // Direct processing
  } else if (fileType.includes('png')) {
    return [URL.createObjectURL(file)]; // Direct processing
  } else {
    throw new Error(`Unsupported file type: ${fileType}`);
  }
};
```

## Processing Method Determination

### Updated Processing Methods
```javascript
const determineProcessingMethod = (fileType) => {
  const type = fileType.toLowerCase();
  
  if (type.includes('pdf')) return 'PDF→CloudConvert→JPEG→GPT-OCR→DOCX→JSON';
  if (type.includes('wordprocessingml')) return 'DOCX→CloudConvert→JPEG→GPT-OCR→DOCX→JSON';
  if (type.includes('msword')) return 'DOC→CloudConvert→JPEG→GPT-OCR→DOCX→JSON';
  if (type.includes('jpeg') || type.includes('jpg')) return 'JPEG→GPT-OCR→DOCX→JSON';
  if (type.includes('png')) return 'PNG→GPT-OCR→DOCX→JSON';
  
  return 'Unknown→CloudConvert→JPEG→GPT-OCR→DOCX→JSON';
};
```

## Implementation Notes

### Advantages of New Pipeline

#### CloudConvert Benefits
- **Professional document conversion** with high accuracy
- **Multi-format support** (PDF, DOC, DOCX) in a single API
- **Reliable cloud processing** with 99.9% uptime
- **Quality preservation** with configurable output settings
- **No client-side dependencies** for complex document formats

#### GPT Vision OCR Benefits
- **Superior accuracy** compared to traditional OCR engines
- **Context awareness** for better text understanding
- **Layout preservation** maintains document structure
- **Multi-language support** out of the box
- **Error handling** with intelligent text correction

### Performance Considerations
- **CloudConvert processing time**: 10-30 seconds per document
- **GPT Vision processing**: 5-15 seconds per image
- **Total pipeline time**: 20-60 seconds depending on document complexity
- **Implement progress indicators** for better user experience
- **Consider file size limits** (CloudConvert: 1GB, GPT Vision: optimal < 10MB)

### Cost Considerations
- **CloudConvert**: Pay-per-conversion model, starts at $8/month
- **OpenAI GPT-4 Vision**: Token-based pricing, approximately $0.01-0.03 per image
- **Combined cost**: ~$0.05-0.10 per resume processing

### Error Handling Strategy
```javascript
const safeProcessResumeFile = async (file, openaiApiKey) => {
  try {
    return await processResumeFile(file, openaiApiKey);
  } catch (error) {
    console.error('Processing error:', error);
    
    // Provide specific error messages
    if (error.message.includes('CloudConvert')) {
      throw new Error('Document conversion service temporarily unavailable. Please try again.');
    } else if (error.message.includes('OpenAI')) {
      throw new Error('OCR service temporarily unavailable. Please try again.');
    } else {
      throw new Error('Resume processing failed. Please check your file and try again.');
    }
  }
};
```

### Security Considerations
- **API keys protection**: Store in environment variables, never in client code
- **File validation**: Validate file types and sizes before processing
- **Data privacy**: CloudConvert and OpenAI process files externally
- **Temporary file cleanup**: Ensure converted files are properly disposed
- **Rate limiting**: Implement appropriate rate limits for API calls

## Usage Example

```javascript
// React component usage with new pipeline
const ResumeUploader = () => {
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState('');
  
  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    setProcessing(true);
    
    try {
      setProgress('Converting document to image...');
      
      const resumeJSON = await safeProcessResumeFile(file, openaiApiKey);
      
      setProgress('Processing complete!');
      console.log('Processed resume:', resumeJSON);
      
      // Download JSON result
      const blob = new Blob([JSON.stringify(resumeJSON, null, 2)], 
        { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `${file.name}_processed.json`;
      link.click();
      
    } catch (error) {
      console.error('Upload failed:', error);
      setProgress(`Error: ${error.message}`);
    } finally {
      setProcessing(false);
    }
  };
  
  return (
    <div>
      <input 
        type="file" 
        accept=".pdf,.docx,.doc,.jpg,.jpeg,.png"
        onChange={handleFileUpload}
        disabled={processing}
      />
      {processing && <p>{progress}</p>}
    </div>
  );
};
```

## Migration from Previous System

### Key Changes
1. **CloudConvert replaces**: PDF.js, Mammoth.js conversion, html2canvas
2. **GPT Vision replaces**: Tesseract.js, direct text extraction
3. **Unified pipeline**: All document types follow same conversion path
4. **Improved accuracy**: Better text extraction and structure preservation
5. **Simplified maintenance**: Fewer dependencies and conversion methods

### Breaking Changes
- **API key requirements**: Now requires both CloudConvert and OpenAI API keys
- **Processing time**: Longer processing time due to external API calls
- **Network dependency**: Requires internet connection for document processing
- **Cost implications**: Pay-per-use model instead of free local processing