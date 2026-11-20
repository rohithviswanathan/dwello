import { ArrowUpRight, House, Mail, Globe, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/AuthContext";

function Footer() {
  const { user } = useAuth();

  const footerGroups =
    user?.role === "landlord"
      ? [
          {
            title: "Manage",
            links: [
              { label: "My listings", to: "/landlord/listings" },
              { label: "Manage enquiries", to: "/landlord/enquiries" },
              { label: "Landlord dashboard", to: "/landlord/dashboard" },
            ],
          },
          {
            title: "Account",
            links: [
              { label: "My profile", to: "/profile" },
              { label: "Edit profile", to: "/profile" },
            ],
          },
        ]
      : user?.role === "tenant"
        ? [
            {
              title: "Explore",
              links: [
                { label: "Find a home", to: "/properties" },
                { label: "Saved properties", to: "/saved" },
                { label: "My enquiries", to: "/my-enquiries" },
              ],
            },
            {
              title: "Account",
              links: [
                { label: "My dashboard", to: "/dashboard" },
                { label: "My profile", to: "/profile" },
              ],
            },
          ]
        : [
            {
              title: "Explore",
              links: [{ label: "Find a home", to: "/properties" }],
            },
            {
              title: "Account",
              links: [
                { label: "Sign in", to: "/login" },
                { label: "Create account", to: "/register" },
              ],
            },
          ];

  const logoDestination =
    user?.role === "landlord" ? "/landlord/dashboard" : "/properties";

  return (
    <footer className="bg-[#242424] text-white">
      <div className="mx-auto max-w-[1280px] px-5 sm:px-6 lg:px-8">
        {/* Main footer */}
        <div className="grid gap-8 py-10 md:grid-cols-[1.5fr_1fr_1fr] md:gap-8 lg:py-12">
          {/* Brand section */}
          <div className="max-w-sm">
            <Link
              to={logoDestination}
              aria-label="Dwello home"
              className="group mb-2 inline-flex items-center gap-2"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand text-white transition-transform duration-200 group-hover:scale-105">
                <House size={20} strokeWidth={2.4} />
              </span>

              <span className="text-[23px] font-extrabold tracking-[-1.2px]">
                dwell<span className="text-brand">o</span>
              </span>
            </Link>

            <p className="mt-4 max-w-xs text-sm leading-7 text-white/55">
              Find a place that feels like home. Discover rental properties and
              connect with landlords through Dwello.
            </p>

            <a
              href="mailto:hello@dwello.com"
              className="
                mt-5 inline-flex items-center gap-2
                text-sm font-semibold text-white/75
                transition-colors duration-200
                hover:text-white
              "
            >
              <Mail size={15} className="text-brand" />
              hello@dwello.com
              <ArrowUpRight size={13} />
            </a>

            {/* Social / external links */}
            <div className="mt-5 flex items-center gap-2">
              <a
                href="https://www.instagram.com/"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="
                  flex h-9 w-9 items-center justify-center
                  rounded-lg border border-white/10
                  text-white/60 transition-all duration-200
                  hover:border-brand hover:bg-brand hover:text-white
                "
              >
                <Globe size={17} />
              </a>

              <a
                href="https://www.linkedin.com/"
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
                className="
                  flex h-9 w-9 items-center justify-center
                  rounded-lg border border-white/10
                  text-white/60 transition-all duration-200
                  hover:border-brand hover:bg-brand hover:text-white
                "
              >
                <Users size={17} />
              </a>
            </div>
          </div>

          {/* Dynamic navigation groups */}
          {footerGroups.map((group) => (
            <div key={group.title} className="mt-2 md:mt-0">
              <h3 className="mb-4 text-sm font-extrabold tracking-wide text-white">
                {group.title}
              </h3>

              <ul className="flex flex-col gap-3">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      className="
                        inline-flex items-center gap-1
                        text-[13px] font-medium text-white/55
                        transition-colors duration-200
                        hover:text-white
                      "
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom footer */}
        <div className="flex flex-col gap-3 border-t border-white/10 py-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-white/40">
            © {new Date().getFullYear()} Dwello. All rights reserved.
          </p>

          <p className="text-xs text-white/40">
            Made for finding a place to call home.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
