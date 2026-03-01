import { useNavigate } from 'react-router';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { AlertCircle, Home } from 'lucide-react';

export function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-gradient-to-br from-slate-50 to-slate-100">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <AlertCircle className="w-20 h-20 text-red-500" />
          </div>
          <CardTitle className="text-3xl">404 - الصفحة غير موجودة</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-muted-foreground">
            عذراً، الصفحة التي تبحث عنها غير موجودة أو تم نقلها.
          </p>
          <Button
            onClick={() => navigate('/')}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            <Home className="w-4 h-4 ml-2" />
            العودة إلى الصفحة الرئيسية
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
