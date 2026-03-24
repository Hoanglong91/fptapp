import { useState } from 'react';
import { GraduationCap, LogOut, User, Menu, Flame, Home, Calculator, Heart, ShieldCheck } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useLearningStreak } from '@/hooks/useLearningStreak';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import StreakBadge from '@/components/profile/StreakBadge';
import { ThemeToggle } from '@/components/ThemeToggle';
import OnlineUsersCounter from '@/components/OnlineUsersCounter';

export default function Navbar() {
  const { user, isAdmin, signOut } = useAuth();
  const { streak } = useLearningStreak();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  const userInitials = user?.email?.substring(0, 2).toUpperCase() || 'U';

  const navLinks = [
    { href: '/majors', label: 'Trang chủ', icon: Home },
    { href: '/gpa', label: 'Tính GPA', icon: Calculator },
    { href: '/favorites', label: 'Yêu thích', icon: Heart },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="container flex items-center justify-between h-14 sm:h-16 px-4 sm:px-6">
        {/* Logo */}
        <Link to="/majors" className="flex items-center gap-2 sm:gap-3 group">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-gradient-to-br from-primary to-warning flex items-center justify-center group-hover:scale-105 transition-transform">
            <GraduationCap className="w-4 h-4 sm:w-6 sm:h-6 text-primary-foreground" />
          </div>
          <div className="hidden xs:block">
            <h1 className="text-base sm:text-lg font-bold text-foreground">FPT Learn</h1>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link 
              key={link.href}
              to={link.href} 
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive(link.href) ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right side: Online Users + Theme + Streak + User Menu */}
        <div className="flex items-center gap-1 sm:gap-3">
          {/* Online Users Counter */}
          {user && <OnlineUsersCounter compact />}

          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Streak Badge */}
          {user && streak.currentStreak > 0 && (
            <StreakBadge
              currentStreak={streak.currentStreak}
              longestStreak={streak.longestStreak}
              totalVisits={streak.totalVisits}
              compact
            />
          )}

          {/* User Menu - Desktop */}
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild className="hidden sm:flex">
                <Button variant="ghost" className="relative h-9 w-9 sm:h-10 sm:w-10 rounded-full">
                  <Avatar className="h-9 w-9 sm:h-10 sm:w-10 border-2 border-primary/20">
                    <AvatarFallback className="bg-primary text-primary-foreground font-semibold text-sm">
                      {userInitials}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    <p className="font-medium text-sm">{user.email}</p>
                    <p className="text-xs text-muted-foreground">FPT Student</p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/profile" className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    Hồ sơ của tôi
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} className="text-destructive cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  Đăng xuất
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button variant="default" size="sm" onClick={() => navigate('/auth')} className="hidden sm:flex">
              Đăng nhập
            </Button>
          )}

          {/* Mobile Menu */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild className="sm:hidden">
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px] sm:w-[320px] p-0">
              <div className="flex flex-col h-full">
                {/* Mobile Header */}
                <div className="p-4 border-b border-border">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10 border-2 border-primary/20">
                        <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
                          {userInitials}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-sm">{user?.email?.split('@')[0]}</p>
                        <p className="text-xs text-muted-foreground">FPT Student</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Mobile Streak */}
                  {user && streak.currentStreak > 0 && (
                    <div className="mt-4 flex items-center gap-2 bg-orange-500/10 px-3 py-2 rounded-lg">
                      <Flame className="w-5 h-5 text-orange-500" />
                      <span className="font-bold text-orange-600">{streak.currentStreak}</span>
                      <span className="text-sm text-muted-foreground">ngày liên tiếp</span>
                    </div>
                  )}
                </div>

                {/* Mobile Navigation */}
                <nav className="flex-1 p-4 space-y-1">
                  {navLinks.map((link) => (
                    <SheetClose asChild key={link.href}>
                      <Link
                        to={link.href}
                        className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-colors ${
                          isActive(link.href) 
                            ? 'bg-primary/10 text-primary' 
                            : 'hover:bg-muted text-foreground'
                        }`}
                      >
                        <link.icon className="w-5 h-5" />
                        {link.label}
                      </Link>
                    </SheetClose>
                  ))}
                  <SheetClose asChild>
                    <Link
                      to="/profile"
                      className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-colors ${
                        isActive('/profile') 
                          ? 'bg-primary/10 text-primary' 
                          : 'hover:bg-muted text-foreground'
                      }`}
                    >
                      <User className="w-5 h-5" />
                      Hồ sơ của tôi
                    </Link>
                  </SheetClose>
                </nav>

                {/* Mobile Footer */}
                <div className="p-4 border-t border-border">
                  <SheetClose asChild>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start text-destructive hover:text-destructive"
                      onClick={handleSignOut}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Đăng xuất
                    </Button>
                  </SheetClose>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
