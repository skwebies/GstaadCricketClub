/**
 * @file mobile-menu.test.tsx
 * @description Unit tests for mobile burger menu drawer toggle, accessibility, and navigation links.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { render, screen, fireEvent, within } from "@testing-library/react";
import { Header } from "@/shared/components/marketing/Header";
import { LanguageProvider } from "@/shared/i18n/LanguageContext";

// Mock next/navigation
vi.mock("next/navigation", () => ({
  usePathname: () => "/",
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

// Mock next/image
vi.mock("next/image", () => ({
  __esModule: true,
  default: (props: any) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img {...props} alt={props.alt || "mocked image"} />;
  },
}));

function renderHeader() {
  return render(
    <LanguageProvider>
      <Header />
    </LanguageProvider>
  );
}

describe("Mobile Navigation Drawer & Burger Menu Suite", () => {
  beforeEach(() => {
    document.body.style.overflow = "";
  });

  afterEach(() => {
    document.body.style.overflow = "";
  });

  it("should initially not render the mobile navigation drawer", () => {
    renderHeader();
    const dialog = screen.queryByRole("dialog", { name: /mobile navigation/i });
    expect(dialog).toBeNull();
  });

  it("should open the mobile drawer when clicking the burger button", () => {
    renderHeader();
    const burgerButton = screen.getByRole("button", { name: /open navigation menu/i });
    expect(burgerButton).toBeDefined();

    fireEvent.click(burgerButton);

    const dialog = screen.getByRole("dialog", { name: /mobile navigation/i });
    expect(dialog).toBeDefined();
    expect(document.body.style.overflow).toBe("hidden");
  });

  it("should render all navigation links nicely inside the mobile drawer", () => {
    renderHeader();
    const burgerButton = screen.getByRole("button", { name: /open navigation menu/i });
    fireEvent.click(burgerButton);

    const dialog = screen.getByRole("dialog", { name: /mobile navigation/i });
    expect(dialog).toBeDefined();

    // Verify all menu items exist within the drawer
    const linksWithinDrawer = within(dialog);

    expect(linksWithinDrawer.getByRole("link", { name: /^festival/i })).toBeDefined();
    expect(linksWithinDrawer.getByRole("link", { name: /^about/i })).toBeDefined();
    expect(linksWithinDrawer.getByRole("link", { name: /^committee/i })).toBeDefined();
    expect(linksWithinDrawer.getByRole("link", { name: /^gallery/i })).toBeDefined();
    expect(linksWithinDrawer.getByRole("link", { name: /^membership/i })).toBeDefined();
    expect(linksWithinDrawer.getByRole("link", { name: /^supporters/i })).toBeDefined();
    expect(linksWithinDrawer.getByRole("link", { name: /admin/i })).toBeDefined();
    expect(linksWithinDrawer.getByRole("link", { name: /register free/i })).toBeDefined();
  });

  it("should close the drawer when clicking the close button", () => {
    renderHeader();
    const burgerButton = screen.getByRole("button", { name: /open navigation menu/i });
    fireEvent.click(burgerButton);

    const dialog = screen.getByRole("dialog", { name: /mobile navigation/i });
    expect(dialog).toBeDefined();

    const closeButton = within(dialog).getByRole("button", { name: /close navigation menu/i });
    fireEvent.click(closeButton);

    expect(screen.queryByRole("dialog", { name: /mobile navigation/i })).toBeNull();
    expect(document.body.style.overflow).toBe("");
  });

  it("should close the drawer when pressing the Escape key", () => {
    renderHeader();
    const burgerButton = screen.getByRole("button", { name: /open navigation menu/i });
    fireEvent.click(burgerButton);

    expect(screen.getByRole("dialog", { name: /mobile navigation/i })).toBeDefined();

    fireEvent.keyDown(window, { key: "Escape" });

    expect(screen.queryByRole("dialog", { name: /mobile navigation/i })).toBeNull();
    expect(document.body.style.overflow).toBe("");
  });

  it("should close the drawer when a navigation link inside is clicked", () => {
    renderHeader();
    const burgerButton = screen.getByRole("button", { name: /open navigation menu/i });
    fireEvent.click(burgerButton);

    const dialog = screen.getByRole("dialog", { name: /mobile navigation/i });
    const aboutLink = within(dialog).getByText(/about/i);

    fireEvent.click(aboutLink);

    expect(screen.queryByRole("dialog", { name: /mobile navigation/i })).toBeNull();
    expect(document.body.style.overflow).toBe("");
  });

  it("should render localized German links in mobile drawer when set to German", () => {
    localStorage.setItem("gcc_lang", "de");
    const { unmount } = render(
      <LanguageProvider>
        <Header />
      </LanguageProvider>
    );
    const burgerButton = screen.getByRole("button", { name: /open navigation menu/i });
    fireEvent.click(burgerButton);

    const dialog = screen.getByRole("dialog", { name: /mobile navigation/i });
    expect(within(dialog).getByRole("link", { name: /über uns/i })).toBeDefined();
    expect(within(dialog).getByRole("link", { name: /mitgliedschaft/i })).toBeDefined();
    expect(within(dialog).getByRole("link", { name: /kostenlos anmelden/i })).toBeDefined();
    unmount();
    localStorage.removeItem("gcc_lang");
  });
});
