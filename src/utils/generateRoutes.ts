import type { ISisebarItem } from "@/type";

export const generateRoutes =(sidebarItems:ISisebarItem[])=>{
    return sidebarItems.flatMap((section)=>section.items.map((route)=>({
        path:route.url,
        Component:route.component,
        
    })));
} 