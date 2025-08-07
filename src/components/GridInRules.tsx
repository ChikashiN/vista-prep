import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, X, AlertCircle } from "lucide-react";

export function GridInRules() {
  return (
    <Card className="bg-blue-50 border-blue-200">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2 text-blue-800">
          <AlertCircle className="h-4 w-4" />
          Grid-In Answer Rules
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <div className="space-y-2">
          <div className="font-medium text-blue-800">✅ You can enter:</div>
          <ul className="space-y-1 text-blue-700">
            <li className="flex items-center gap-2">
              <Check className="h-3 w-3 text-green-600" />
              Whole numbers: <code className="bg-white px-1 rounded">5</code>
            </li>
            <li className="flex items-center gap-2">
              <Check className="h-3 w-3 text-green-600" />
              Decimals: <code className="bg-white px-1 rounded">0.75</code>
            </li>
            <li className="flex items-center gap-2">
              <Check className="h-3 w-3 text-green-600" />
              Fractions: <code className="bg-white px-1 rounded">1/2</code>
            </li>
            <li className="flex items-center gap-2">
              <Check className="h-3 w-3 text-green-600" />
              Negative numbers: <code className="bg-white px-1 rounded">-3</code>
            </li>
          </ul>
        </div>

        <div className="space-y-2">
          <div className="font-medium text-red-800">❌ Don't enter:</div>
          <ul className="space-y-1 text-red-700">
            <li className="flex items-center gap-2">
              <X className="h-3 w-3 text-red-600" />
              Mixed numbers like <code className="bg-white px-1 rounded">1 1/2</code> → write <code className="bg-white px-1 rounded">1.5</code> or <code className="bg-white px-1 rounded">3/2</code>
            </li>
            <li className="flex items-center gap-2">
              <X className="h-3 w-3 text-red-600" />
              Symbols like $, %, etc.
            </li>
            <li className="flex items-center gap-2">
              <X className="h-3 w-3 text-red-600" />
              More than 4 digits: <code className="bg-white px-1 rounded">3.1416</code> (❌) → <code className="bg-white px-1 rounded">3.14</code> (✅)
            </li>
          </ul>
        </div>

        <div className="bg-blue-100 p-2 rounded text-blue-800">
          <div className="font-medium">💡 Tips:</div>
          <ul className="text-xs space-y-1 mt-1">
            <li>• Fractions and decimals are both okay: <code className="bg-white px-1 rounded">0.5</code> or <code className="bg-white px-1 rounded">1/2</code></li>
            <li>• You don't need to reduce fractions: <code className="bg-white px-1 rounded">2/4</code> is fine</li>
            <li>• Maximum 4 digits total (including decimal or minus sign)</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
} 