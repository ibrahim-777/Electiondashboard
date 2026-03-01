import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { ClipboardCheck, TrendingUp } from 'lucide-react';
import { CountingResultsTab } from '../components/counting-results-tab';
import { AdvancedResultsTab } from '../components/advanced-results-tab';

export function Results() {
  const [activeTab, setActiveTab] = useState('counting');

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-3xl mb-2">النتائج والفائزون</h1>
        <p className="text-muted-foreground">
          نتائج الفرز وإحصائيات الصناديق والمرشحين الفائزين
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} dir="rtl">
        <TabsList className="grid w-full max-w-md grid-cols-2 mb-6">
          <TabsTrigger value="counting" className="flex items-center gap-2">
            <ClipboardCheck className="w-4 h-4" />
            نتائج الفرز
          </TabsTrigger>
          <TabsTrigger value="winners" className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            الفائزون
          </TabsTrigger>
        </TabsList>

        <TabsContent value="counting">
          <CountingResultsTab />
        </TabsContent>

        <TabsContent value="winners">
          <AdvancedResultsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
