'use client'

import { useCallback, useState } from 'react'
import { motion } from 'framer-motion'
import { Upload, X, FileText, Image, CheckCircle } from 'lucide-react'

interface EnhancedUploadProps {
  onFilesChange: (files: File[]) => void
  acceptedTypes?: string[]
  maxSize?: number
  multiple?: boolean
}

export function EnhancedUpload({
  onFilesChange,
  acceptedTypes = ['.pdf', '.doc', '.docx', '.jpg', '.png'],
  maxSize = 10,
  multiple = true
}: EnhancedUploadProps) {
  const [isDragActive, setIsDragActive] = useState(false)
  const [files, setFiles] = useState<File[]>([])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragActive(false)
    
    const droppedFiles = Array.from(e.dataTransfer.files)
    handleFiles(droppedFiles)
  }, [])

  const handleFiles = (newFiles: File[]) => {
    const validFiles = newFiles.filter(file => {
      const isValidSize = file.size <= maxSize * 1024 * 1024
      const isValidType = acceptedTypes.some(type => 
        file.name.toLowerCase().endsWith(type.toLowerCase())
      )
      return isValidSize && isValidType
    })

    setFiles(prev => [...prev, ...validFiles])
    onFilesChange([...files, ...validFiles])
  }

  const removeFile = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index)
    setFiles(newFiles)
    onFilesChange(newFiles)
  }

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) return <Image className="w-6 h-6 text-purple-400" />
    return <FileText className="w-6 h-6 text-cyan-400" />
  }

  return (
    <div className="space-y-4">
      <motion.div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onDragEnter={() => setIsDragActive(true)}
        onDragLeave={() => setIsDragActive(false)}
        whileHover={{ scale: 1.02 }}
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-300 ${
          isDragActive 
            ? 'border-cyan-500 bg-cyan-500/10' 
            : 'border-cyan-500/50 hover:border-cyan-500 hover:bg-cyan-500/5'
        }`}
      >
        <Upload className="w-12 h-12 mx-auto text-cyan-400 mb-4" />
        <p className="text-white text-lg mb-2">
          {isDragActive ? 'Drop files here' : 'Drag & drop files here'}
        </p>
        <p className="text-gray-400 text-sm">
          or <label className="text-cyan-400 cursor-pointer hover:underline">
            browse files
            <input 
              type="file" 
              multiple={multiple}
              accept={acceptedTypes.join(',')}
              onChange={(e) => handleFiles(Array.from(e.target.files || []))}
              className="hidden" 
            />
          </label>
        </p>
        <p className="text-gray-500 text-xs mt-2">
          Supports: {acceptedTypes.join(', ')} • Max {maxSize}MB each
        </p>
      </motion.div>

      {files.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-white font-medium">Uploaded Files ({files.length})</h4>
          <div className="grid grid-cols-1 gap-2 max-h-60 overflow-y-auto">
            {files.map((file, index) => (
              <motion.div
                key={`${file.name}-${index}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center justify-between p-3 glass-card rounded border border-white/10"
              >
                <div className="flex items-center gap-3">
                  {getFileIcon(file)}
                  <div>
                    <p className="text-white text-sm font-medium">{file.name}</p>
                    <p className="text-gray-400 text-xs">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <button
                    onClick={() => removeFile(index)}
                    className="text-gray-400 hover:text-red-400 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
