import { forwardRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { navbarLinks } from "@/constants";
import logoLight from "@/assets/main_logo.png";
import faviconLight from "@/assets/favicon.png";
import { cn } from "@/utils/cn";
import PropTypes from "prop-types";

export const Sidebar = forwardRef(({ collapsed }, ref) => {
    const location = useLocation();
    
    return (
        <aside
            ref={ref}
            className={cn(
                "fixed z-[100] flex h-full w-[240px] flex-col overflow-x-hidden border-r border-slate-300 bg-white [transition:_width_300ms_cubic-bezier(0.4,_0,_0.2,_1),_left_300ms_cubic-bezier(0.4,_0,_0.2,_1)]",
                collapsed ? "md:w-[70px] md:items-center" : "md:w-[240px]",
                collapsed ? "max-md:-left-full" : "max-md:left-0",
            )}
        >
            <div className="flex gap-x-3 p-3 cursor-pointer">
                <a href="https://rapidroutines.org/">
                    <img
                        src={collapsed ? faviconLight : logoLight}
                        alt="RapidRoutines"
                        className={collapsed ? "h-8 w-8" : ""}
                    />
                </a>
                {!collapsed && <p className="text-lg font-medium text-slate-900"></p>}
            </div>
            <div className="flex w-full flex-col gap-y-4 overflow-y-auto overflow-x-hidden p-3 [scrollbar-width:_thin]">
                {navbarLinks.map((navbarLink) => (
                    <nav
                        key={navbarLink.title}
                        className={cn("sidebar-group", collapsed && "md:items-center")}
                    >
                        {!collapsed && <p className="sidebar-group-title">{navbarLink.title}</p>}
                        {navbarLink.links.map((link) => (
                            <Link
                                key={link.label}
                                to={link.path}
                                className={cn(
                                    "sidebar-item", 
                                    collapsed && "md:w-[45px] md:justify-center",
                                    location.pathname === link.path && "active"
                                )}
                                title={collapsed ? link.label : ""}
                            >
                                <link.icon
                                    size={22}
                                    className="flex-shrink-0"
                                />
                                {!collapsed && <p className="whitespace-nowrap">{link.label}</p>}
                            </Link>
                        ))}
                    </nav>
                ))}
            </div>
        </aside>
    );
});

Sidebar.displayName = "Sidebar";

Sidebar.propTypes = {
    collapsed: PropTypes.bool,
};