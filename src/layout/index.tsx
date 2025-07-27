// src/layout/index.tsx
import { Outlet, useNavigation } from 'react-router'
import SliderMenu from './components/SliderMenu'

import LoadingFallback from '@/components/PageLoading';
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar"
import { ScrollArea } from "@/components/ui/scroll-area"

const Layout = () => {
	const navigation = useNavigation()
	const isLoading = navigation.state === 'loading';
	return (
		<SidebarProvider>
			<SliderMenu inset />
			{/* <SidebarInset> */}
				<ScrollArea className="h-full">
					<header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
						<SidebarTrigger className="-ml-1" />
						<div className="text-lg font-semibold">管理后台</div>
					</header>
					<main className="flex-1 p-4">
						{isLoading ? (
							<LoadingFallback isAbsolute />
						) : (
							<Outlet />
						)}
					</main>
				</ScrollArea>
			{/* </SidebarInset> */}
		</SidebarProvider>
	)
}

export default Layout