# BPOC AI - Resume Parser & Builder

A Next.js application that uses AI to parse resumes from various file formats and convert them into structured data using a multi-stage pipeline with CloudConvert and OpenAI GPT Vision.

## Features

- **Multi-format resume parsing**: PDF, DOC, DOCX, JPG, PNG support
- **CloudConvert integration**: Converts documents to images for OCR processing  
- **GPT Vision OCR**: Extracts text from images with high accuracy
- **Structured output**: Generates organized DOCX and JSON formats
- **Supabase authentication**: Secure user authentication and data storage

## Processing Pipeline

The application uses a sophisticated 4-step pipeline:

1. **Document Conversion**: PDF/DOC/DOCX → CloudConvert → JPEG
2. **OCR Processing**: JPEG → GPT Vision → Extracted Text  
3. **Document Creation**: Text → Organized DOCX
4. **JSON Extraction**: DOCX → Structured JSON Data

## Setup Instructions

### 1. Environment Variables

Create a `.env.local` file in the root directory:

```bash
# OpenAI API Key (required)
OPENAI_API_KEY=your_openai_api_key_here

# CloudConvert API Key (required for document conversion)
CLOUDCONVERT_API_KEY=your_cloudconvert_api_key_here

# Supabase Configuration (required for authentication)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 2. CloudConvert API Setup

1. **Create CloudConvert Account**:
   - Go to [cloudconvert.com](https://cloudconvert.com)
   - Sign up for a free account

2. **Generate API Key**:
   - Visit: [cloudconvert.com/dashboard/api/keys](https://cloudconvert.com/dashboard/api/keys)
   - Click "Create New API Key"
   - **Required Scopes**:
     - ✅ `task.read` - View your tasks and jobs
     - ✅ `task.write` - Create tasks and jobs for you
   - **Optional Scopes** (not needed):
     - ❌ `user.read`, `user.write`, `webhook.read`, `webhook.write`, `preset.read`, `preset.write`

3. **Usage Limits**:
   - **Free Tier**: 5 concurrent conversions, 1000 conversions/month
   - **Paid Plans**: Start at $8/month for higher limits
   - **File Limits**: Up to 1GB per file

### 3. OpenAI API Setup

1. **Get API Key**:
   - Visit [platform.openai.com/api-keys](https://platform.openai.com/api-keys)
   - Create a new secret key
   - **Required Model Access**: GPT-4 Vision (for OCR processing)

2. **Billing**:
   - Ensure you have billing set up for API usage
   - GPT-4 Vision costs vary based on image size and processing

### 4. Supabase Setup

1. **Create Supabase Project**:
   - Go to [supabase.com](https://supabase.com)
   - Create a new project

2. **Get Configuration**:
   - Copy your project URL and anon key from Settings > API

### 5. Installation & Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
npm start
```

## Supported File Types

| Format | Processing Method | Notes |
|--------|------------------|-------|
| **PDF** | CloudConvert → JPEG → GPT OCR | Best for complex layouts |
| **DOCX** | CloudConvert → JPEG → GPT OCR | Preserves formatting |
| **DOC** | CloudConvert → JPEG → GPT OCR | Legacy format support |
| **JPG/JPEG** | Direct GPT OCR | No conversion needed |
| **PNG** | Direct GPT OCR | No conversion needed |

## Troubleshooting

### CloudConvert Issues

- **"File upload failed"**: Check API key permissions (`task.read` + `task.write`)
- **"Job creation failed"**: Verify API key is valid and has proper scopes
- **Timeout errors**: Large files may take longer; check CloudConvert dashboard

### OpenAI Issues

- **"API key required"**: Ensure `OPENAI_API_KEY` is set in environment
- **"Insufficient quota"**: Check billing and usage limits on OpenAI dashboard

### General Issues

- **Build errors**: Run `npm install` to ensure all dependencies are installed
- **Environment variables**: Restart development server after adding new variables

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is private and proprietary.

