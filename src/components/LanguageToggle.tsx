import { useLanguage } from '@/context/LanguageContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Globe } from 'lucide-react';

export function LanguageToggle() {
  const { lang, setLang } = useLanguage();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-9 w-9 sm:h-10 sm:w-10 relative">
          <Globe className="h-4 w-4 sm:h-5 sm:w-5" />
          <span className="absolute -bottom-0.5 -right-0.5 text-[9px] font-black bg-primary text-primary-foreground rounded-full w-4 h-4 flex items-center justify-center leading-none">
            {lang === 'vi' ? 'VI' : 'EN'}
          </span>
          <span className="sr-only">Toggle language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() => setLang('vi')}
          className={`cursor-pointer gap-2 ${lang === 'vi' ? 'bg-primary/10 text-primary font-bold' : ''}`}
        >
          <span className="text-base">🇻🇳</span>
          <span>Tiếng Việt</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setLang('en')}
          className={`cursor-pointer gap-2 ${lang === 'en' ? 'bg-primary/10 text-primary font-bold' : ''}`}
        >
          <span className="text-base">🇬🇧</span>
          <span>English</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
