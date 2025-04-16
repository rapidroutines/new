export const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="flex flex-wrap items-center justify-between gap-4 pt-4 text-slate-600">
            <p className="text-sm font-medium">
                © {currentYear} RapidRoutines AI. All Rights Reserved.
            </p>
            <div className="flex flex-wrap gap-x-4 text-sm">
                <a 
                    href="https://docs.google.com/document/d/18YQf-p_lAWLWkv4xXltvtJMY8fW0MRn5ur2BUNjhdHE/edit?tab=t.0" 
                    className="hover:text-slate-900 transition-colors"
                >
                    Privacy Policy
                </a>
                <a 
                    href="https://docs.google.com/document/d/18YQf-p_lAWLWkv4xXltvtJMY8fW0MRn5ur2BUNjhdHE/edit?tab=t.lx86jybafkpq" 
                    className="hover:text-slate-900 transition-colors"
                >
                    Terms & Conditions
                </a>
            </div>
        </footer>
    );
};
