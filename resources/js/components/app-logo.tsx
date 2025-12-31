

export default function AppLogo() {
    return (
        <>
            <div className="bg-sidebar text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-md">
                <img src="/images/logo-kantor.png" alt="Logo"  className="size-8 fill-current text-white dark:text-black" />
            </div>
            <div className="ml-1 grid flex-1 text-left text-sm">
                <span className="mb-0.5 truncate leading-none font-semibold">UG. RMS</span>
            </div>
        </>
    );
}
