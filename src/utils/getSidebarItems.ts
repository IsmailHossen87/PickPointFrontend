import { role } from "@/constant/role";
import { adminSilebarItems } from "@/router/adminSidebarItems";
import { UserSidebarItems } from "@/router/UserSidebarItems";
import type { IRole } from "@/type";

export const sideBarItem =(Userrole:IRole)=>{
    switch (Userrole) {
        case role.superAdmin:
          return[...adminSilebarItems];
        case role.user:
          return[...UserSidebarItems];

        case role.admin:
          return[...adminSilebarItems];
    default: return []
    }
}
