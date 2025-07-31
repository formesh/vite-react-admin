import { routes } from '@/router';
import { useNavigate, useLocation } from 'react-router';
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
import AppIcon from '@/components/AppIcon';

function getMenuRoutes(routes: AppRouteObject[], path?: string) {

	return routes
		.filter(route => {
			// 不展示 404 和 login 页面（或根据需要修改）
			if (route.path === '*' || route.path === '/login' || route.path === '/unauthorized' || route.meta?.hideInMenu) return false;
			return true;
		})
		.map(route => {
			const parentPath = path ? path + route.path : route.path;
			const menuItem: {
				path: string | undefined;
				children: any[];
				meta: {
					title: string | undefined;
					icon: any;
				}
			} = {
				path: parentPath,
				meta: {
					title: route.meta?.title,
					icon: route.meta?.icon || null,
				},
				children: getMenuRoutes(route.children || [], parentPath),
			};
			return menuItem;
		});
}

const SliderMenu = ({ ...props }) => {
	const { isAuthenticated, currentUser } = useAuth();
	const menus: AppRouteObject[] = getMenuRoutes(routes)[0].children || [];
	const navigate = useNavigate();
	const location = useLocation();
	// 检查菜单项是否被选中
	const isMenuItemActive = (item: AppRouteObject): boolean => {
		if (!item.path) return false;
		// 精确匹配当前路径
		return location.pathname === item.path;
	};

	// 检查子菜单项是否被选中
	const isSubMenuItemActive = (item: AppRouteObject): boolean => {
		if (!item.children) return false;
		return item.children.some(child => child.path === location.pathname);
	};

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
								<AppIcon size={20} className="!size-5" />
								<span className="text-base font-semibold">Nexus Admin Pro</span>
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
									<Collapsible className="group/collapsible" defaultOpen={isSubMenuItemActive(item)}>
										<CollapsibleTrigger asChild>
											<SidebarMenuButton
												tooltip={item.meta?.title}
												childMenus={item.children}
												className={`${isSubMenuItemActive(item)
														? 'bg-accent text-accent-foreground'
														: 'hover:bg-accent hover:text-accent-foreground'
													}`}
											>
												{item.meta?.icon && <item.meta.icon />}
												<span>{item.meta?.title}</span>
												<ChevronRight className="cursor-pointer ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
											</SidebarMenuButton>
										</CollapsibleTrigger>
										<CollapsibleContent>
											<SidebarMenuSub>
												{item.children.map((child) => (
													<SidebarMenuSubItem key={child.path}>
														<SidebarMenuSubButton
															asChild
															onClick={() => handleClick(child)}
															className={`${location.pathname === child.path
																	? 'cursor-pointer bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground'
																	: 'cursor-pointer hover:bg-accent hover:text-accent-foreground'
																}`}
														>
															<div>
																{(child as AppRouteObject).meta?.title}
															</div>
														</SidebarMenuSubButton>
													</SidebarMenuSubItem>
												))}
											</SidebarMenuSub>
										</CollapsibleContent>
									</Collapsible>
								) : (
									<SidebarMenuButton
										className={`min-w-8 duration-200 ease-linear ${isMenuItemActive(item)
												? 'cursor-pointer bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground'
												: 'cursor-pointer hover:bg-accent hover:text-accent-foreground'
											}`}
										tooltip={item.meta?.title}
										onClick={() => handleClick(item)}
									>
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