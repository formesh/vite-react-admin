// src/layout/index.tsx
import { Outlet, useNavigation } from 'react-router'
import SliderMenu from './components/SliderMenu'

import LoadingFallback from '@/components/PageLoading';
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar"
import { useTheme } from "@/components/ThemeProvider"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Moon, Sun, Monitor, Check } from 'lucide-react';
// import { ScrollArea } from "@/components/ui/scroll-area"

const Layout = () => {
	const navigation = useNavigation()
	const isLoading = navigation.state === 'loading';
	const { theme, setTheme } = useTheme()
	return (
		<SidebarProvider>
			<SliderMenu inset />
			<SidebarInset>
				{/* <ScrollArea className="h-full"> */}
				<header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b px-4">
					<div className="flex items-center gap-2">
						<SidebarTrigger className="-ml-1" />
						<div className="text-lg font-semibold">管理后台</div>
					</div>
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="outline" size="icon" className="relative">
								<Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
								<Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
								<span className="sr-only">切换主题</span>
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end" className="w-40">
							<DropdownMenuItem 
								onClick={() => setTheme("light")}
								className="flex items-center justify-between cursor-pointer"
							>
								<div className="flex items-center gap-2">
									<Sun className="h-4 w-4" />
									<span>浅色模式</span>
								</div>
								{theme === "light" && <Check className="h-4 w-4" />}
							</DropdownMenuItem>
							<DropdownMenuItem 
								onClick={() => setTheme("dark")}
								className="flex items-center justify-between cursor-pointer"
							>
								<div className="flex items-center gap-2">
									<Moon className="h-4 w-4" />
									<span>深色模式</span>
								</div>
								{theme === "dark" && <Check className="h-4 w-4" />}
							</DropdownMenuItem>
							<DropdownMenuItem 
								onClick={() => setTheme("system")}
								className="flex items-center justify-between cursor-pointer"
							>
								<div className="flex items-center gap-2">
									<Monitor className="h-4 w-4" />
									<span>跟随系统</span>
								</div>
								{theme === "system" && <Check className="h-4 w-4" />}
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</header>
				<main className="flex-1 p-4">
					{isLoading ? (
						<LoadingFallback isAbsolute />
					) : (
						<Outlet />
					)}
				</main>
				{/* </ScrollArea> */}
			</SidebarInset>
		</SidebarProvider>
	)
}

export default Layout