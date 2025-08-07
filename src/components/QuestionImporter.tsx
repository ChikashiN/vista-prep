import { useState } from 'react';
import { DirectImporter } from '@/lib/directImporter';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

export function QuestionImporter() {
  const [text, setText] = useState('');
  const [domain, setDomain] = useState('');
  const [subunit, setSubunit] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ success: number; errors: string[] } | null>(null);

  const domains = [
    'Information and Ideas',
    'Craft and Structure', 
    'Expression of Ideas',
    'Standard English Conventions'
  ];

  const subunits = {
    'Information and Ideas': [
      'Central Ideas and Details',
      'Command of Evidence',
      'Inferences'
    ],
    'Craft and Structure': [
      'Words in Context',
      'Text Structure and Purpose',
      'Cross-Text Connections'
    ],
    'Expression of Ideas': [
      'Boundaries',
      'Form, Structure, and Sense',
      'Transitions'
    ],
    'Standard English Conventions': [
      'Sentence Structure',
      'Conventions of Punctuation',
      'Conventions of Usage'
    ]
  };

  const handleImport = async () => {
    if (!text.trim() || !domain || !subunit) {
      alert('Please fill in all fields');
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const result = await DirectImporter.importFromYourFormat(text, domain, subunit);
      setResult(result);
    } catch (error) {
      setResult({ success: 0, errors: [`Import failed: ${error}`] });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Import Your Google Docs Questions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Domain Selection */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Domain</label>
          <Select value={domain} onValueChange={setDomain}>
            <SelectTrigger>
              <SelectValue placeholder="Select a domain" />
            </SelectTrigger>
            <SelectContent>
              {domains.map((domainName) => (
                <SelectItem key={domainName} value={domainName}>
                  {domainName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Subunit Selection */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Subunit</label>
          <Select value={subunit} onValueChange={setSubunit} disabled={!domain}>
            <SelectTrigger>
              <SelectValue placeholder="Select a subunit" />
            </SelectTrigger>
            <SelectContent>
              {domain && subunits[domain as keyof typeof subunits]?.map((subunitName) => (
                <SelectItem key={subunitName} value={subunitName}>
                  {subunitName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Text Input */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Paste Your Questions</label>
          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste your Google Docs questions here..."
            className="min-h-[400px] font-mono text-sm"
          />
        </div>

        {/* Import Button */}
        <Button 
          onClick={handleImport} 
          disabled={loading || !text.trim() || !domain || !subunit}
          className="w-full"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Importing...
            </>
          ) : (
            'Import Questions'
          )}
        </Button>

        {/* Results */}
        {result && (
          <div className="space-y-2">
            {result.success > 0 && (
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  Successfully imported {result.success} questions!
                </AlertDescription>
              </Alert>
            )}
            
            {result.errors.length > 0 && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <div className="space-y-1">
                    <p>Import completed with {result.errors.length} errors:</p>
                    <ul className="list-disc list-inside text-sm">
                      {result.errors.slice(0, 5).map((error, index) => (
                        <li key={index}>{error}</li>
                      ))}
                      {result.errors.length > 5 && (
                        <li>... and {result.errors.length - 5} more errors</li>
                      )}
                    </ul>
                  </div>
                </AlertDescription>
              </Alert>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
} 