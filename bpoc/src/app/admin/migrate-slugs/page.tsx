'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, CheckCircle, Play, FileText, Users, Database } from 'lucide-react';

export default function MigrateSlugsPage() {
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const runMigration = async (dryRun: boolean = true) => {
    setIsRunning(true);
    setError(null);
    setResults(null);

    try {
      const response = await fetch('/api/migrate-resume-slugs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ dryRun }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Migration failed');
      }

      setResults(data.results);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Resume Slug Migration</h1>
          <p className="text-gray-400">
            Update all existing resume slugs to the new format: <code className="bg-gray-800 px-2 py-1 rounded">firstName-lastName-XX</code>
          </p>
        </div>

        {/* Migration Controls */}
        <Card className="bg-gray-900 border-gray-700 mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Migration Controls
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4">
              <Button
                onClick={() => runMigration(true)}
                disabled={isRunning}
                variant="outline"
                className="border-yellow-600 text-yellow-400 hover:bg-yellow-600/10"
              >
                {isRunning ? (
                  <div className="animate-spin h-4 w-4 border-2 border-yellow-400 border-t-transparent rounded-full mr-2" />
                ) : (
                  <Play className="h-4 w-4 mr-2" />
                )}
                Dry Run (Preview)
              </Button>
              
              <Button
                onClick={() => runMigration(false)}
                disabled={isRunning}
                className="bg-red-600 hover:bg-red-700"
              >
                {isRunning ? (
                  <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                ) : (
                  <AlertTriangle className="h-4 w-4 mr-2" />
                )}
                Run Live Migration
              </Button>
            </div>
            
            <div className="text-sm text-gray-400">
              <p><strong>Dry Run:</strong> Preview changes without modifying the database</p>
              <p><strong>Live Migration:</strong> Apply changes to the database (irreversible)</p>
            </div>
          </CardContent>
        </Card>

        {/* Error Display */}
        {error && (
          <Card className="bg-red-900/20 border-red-600 mb-6">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-red-400">
                <AlertTriangle className="h-5 w-5" />
                <span className="font-semibold">Migration Error</span>
              </div>
              <p className="mt-2 text-red-300">{error}</p>
            </CardContent>
          </Card>
        )}

        {/* Results Display */}
        {results && (
          <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="bg-blue-900/20 border-blue-600">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-blue-400" />
                    <div>
                      <p className="text-2xl font-bold text-blue-400">{results.total}</p>
                      <p className="text-sm text-blue-300">Total Resumes</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-green-900/20 border-green-600">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-400" />
                    <div>
                      <p className="text-2xl font-bold text-green-400">{results.updated}</p>
                      <p className="text-sm text-green-300">Updated</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-yellow-900/20 border-yellow-600">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-yellow-400" />
                    <div>
                      <p className="text-2xl font-bold text-yellow-400">{results.skipped}</p>
                      <p className="text-sm text-yellow-300">Skipped</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-red-900/20 border-red-600">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-red-400" />
                    <div>
                      <p className="text-2xl font-bold text-red-400">{results.errors}</p>
                      <p className="text-sm text-red-300">Errors</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Updates List */}
            {results.updates && results.updates.length > 0 && (
              <Card className="bg-gray-900 border-gray-700">
                <CardHeader>
                  <CardTitle>Slug Updates</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {results.updates.map((update: any, index: number) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                        <div>
                          <p className="font-medium">{update.user_name}</p>
                          <p className="text-sm text-gray-400">Resume ID: {update.resume_id}</p>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-red-400 border-red-400">
                              {update.old_slug}
                            </Badge>
                            <span>→</span>
                            <Badge variant="outline" className="text-green-400 border-green-400">
                              {update.new_slug}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Conflicts List */}
            {results.conflicts && results.conflicts.length > 0 && (
              <Card className="bg-red-900/20 border-red-600">
                <CardHeader>
                  <CardTitle className="text-red-400">Slug Conflicts</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {results.conflicts.map((conflict: any, index: number) => (
                      <div key={index} className="p-3 bg-red-900/30 rounded-lg">
                        <p className="font-medium text-red-300">{conflict.user_name}</p>
                        <p className="text-sm text-red-400">
                          Resume {conflict.resume_id} conflicts with Resume {conflict.conflicting_resume_id}
                        </p>
                        <p className="text-sm text-gray-400">Slug: {conflict.slug}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Instructions */}
        <Card className="bg-gray-900 border-gray-700 mt-6">
          <CardHeader>
            <CardTitle>Instructions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-gray-400">
            <div>
              <h4 className="font-semibold text-white mb-2">New Slug Format:</h4>
              <p><code className="bg-gray-800 px-2 py-1 rounded">firstName-lastName-lastTwoDigitsOfUID</code></p>
              <p className="mt-1">Example: John Doe (UID: 12345) → <code className="bg-gray-800 px-2 py-1 rounded">john-doe-45</code></p>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-2">Before Running:</h4>
              <ul className="list-disc list-inside space-y-1">
                <li>Always run a dry run first to preview changes</li>
                <li>Ensure database backup is available</li>
                <li>Check for any slug conflicts</li>
                <li>Notify users if URLs will change</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
