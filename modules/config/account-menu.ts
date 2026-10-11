import { creatorContacts } from "../../config/creator-contacts";
import { routes } from "./navigation";
import { accountCopy } from "@platform/data/account";
export const accountMenuContent = {
  label: accountCopy.menu, imageLabel: accountCopy.image,
  links: [{ href: routes.profile, label: accountCopy.profile }, { href: routes.settings, label: accountCopy.settings }, { href: creatorContacts.whatsapp, label: accountCopy.support, external: true }],
  logoutLabel: accountCopy.logout, errorLabel: accountCopy.error,
};

export const adminAccountMenuContent = { ...accountMenuContent, links: accountMenuContent.links.map(link => ({ ...link, href: link.href === routes.profile ? routes.adminProfile : link.href === routes.settings ? routes.adminSettings : link.href })) };
