import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { useAuth } from '../context/auth-context';
import img2011 from "figma:asset/bdf828901c50b0e686755415de7adf1c3d09795f.png";

export function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (login(username, password)) {
      navigate('/');
    } else {
      setError('اسم المستخدم أو كلمة السر غير صحيحة');
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <img 
            src={img2011} 
            alt="لوغو مجموعة حجر وبشر" 
            className="w-64 h-64 object-contain"
          />
        </div>

        {/* Title */}
        <h1 className="text-[30px] font-bold text-center mb-12 font-['Cairo']">
          تطبيق ماكينة حجر وبشر
        </h1>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="username" className="text-[20px] text-right block font-['Cairo']">
              الإسم
            </Label>
            <Input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="h-[43px] text-lg border-black rounded-[10px]"
              dir="rtl"
              autoComplete="username"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-[20px] text-right block font-['Cairo']">
              كلمة السر
            </Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-[43px] text-lg border-black rounded-[10px]"
              dir="rtl"
              autoComplete="current-password"
            />
          </div>

          {error && (
            <div className="text-red-600 text-center text-sm bg-red-50 p-3 rounded-lg">
              {error}
            </div>
          )}

          <Button
            type="submit"
            className="w-full h-[65px] text-[20px] bg-black text-white rounded-[50px] hover:bg-gray-800 font-['Cairo']"
          >
            تسجيل دخول
          </Button>
        </form>
      </div>
    </div>
  );
}