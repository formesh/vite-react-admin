import { routes } from '@/router';
import { useNavigate } from 'react-router';
import type { AppRouteObject } from '@/utils/type';
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarMenuSub,
	SidebarMenuSubButton,
	SidebarMenuSubItem
} from "@/components/ui/sidebar"
import { useAuth } from '@/hooks/useAuth'
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@/components/ui/collapsible';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ChevronUp, User2, ChevronRight } from 'lucide-react';

function getMenuRoutes(routes: AppRouteObject[]) {
	return routes
		.filter(route => {
			// 不展示 404 和 login 页面（或根据需要修改）
			if (route.path === '*' || route.path === '/login' || route.path === '/unauthorized') return false;
			return true;
		})
		.map(route => {
			const menuItem = {
				path: route.path,
				title: route.meta?.title,
				icon: route.meta?.icon || null,
				children: route.children,
			};
			return menuItem;
		});
}

const SliderMenu = ({...props}) => {
	const { isAuthenticated, currentUser } = useAuth();
	const menus: AppRouteObject[] = getMenuRoutes(routes)[0].children || [];
	const navigate = useNavigate();
	
	const handleClick = (item: AppRouteObject) => {
		console.log('点击了:', item);
		navigate(item.path || '/');
	}

	const handleLogout = () => {
		// logout();
		navigate('/login');
	}

	return (
		<Sidebar collapsible="icon" variant={props.inset ? 'inset' : 'sidebar'}>
			<SidebarHeader>
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton
						asChild
						className="data-[slot=sidebar-menu-button]:!p-1.5"
						>
						<a href="#">
							<User2 className="!size-5" />
							<span className="text-base font-semibold">Acme Inc.</span>
						</a>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarHeader>
			<SidebarContent>
				<SidebarGroup>
					<SidebarMenu>
						{menus.map((item) => (
							<SidebarMenuItem key={item.path}>
								{item.children && item.children.length > 0 ? (
									<Collapsible className="group/collapsible">
										<CollapsibleTrigger asChild>
											<SidebarMenuButton>
												{item.meta?.icon && <item.meta.icon />}
												<span>{item.meta?.title}</span>
												<ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
											</SidebarMenuButton>
										</CollapsibleTrigger>
										<CollapsibleContent>
											<SidebarMenuSub>
												{item.children.map((child) => (
													<SidebarMenuSubItem key={child.path}>
														<SidebarMenuSubButton 
															asChild
															onClick={() => handleClick(child)}
														>
															<a>
																<span>{(child as AppRouteObject).meta?.title}</span>
															</a>
														</SidebarMenuSubButton>
													</SidebarMenuSubItem>
												))}
											</SidebarMenuSub>
										</CollapsibleContent>
									</Collapsible>
								) : (
									<SidebarMenuButton onClick={() => handleClick(item)}>
										{item.meta?.icon && <item.meta.icon />}
										<span>{item.meta?.title}</span>
									</SidebarMenuButton>
								)}
							</SidebarMenuItem>
						))}
					</SidebarMenu>
				</SidebarGroup>
			</SidebarContent>
			<SidebarFooter>
				<SidebarMenu>
					<SidebarMenuItem>
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<SidebarMenuButton>
									<User2 />
									{isAuthenticated && (
										<span className="text-sm">
											{currentUser?.name || '用户'} ({currentUser?.role})
										</span>
									)}
									<ChevronUp className="ml-auto" />
								</SidebarMenuButton>
							</DropdownMenuTrigger>
							<DropdownMenuContent
								side="top"
								className="w-[--radix-popper-anchor-width]"
							>
								<DropdownMenuItem>
									<span>账户设置</span>
								</DropdownMenuItem>
								<DropdownMenuItem>
									<span>个人资料</span>
								</DropdownMenuItem>
								<DropdownMenuItem onClick={handleLogout}>
									<span>退出登录</span>
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarFooter>
		</Sidebar>
	)
}

export default SliderMenu;