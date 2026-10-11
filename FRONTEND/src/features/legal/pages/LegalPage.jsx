import { Link } from "react-router";

const CONTENT = {
    privacy: {
        label: "Privacy",
        title: "Privacy Policy",
        intro: "SnapSeek is built to help you think clearly without collecting more information than we need.",
        sections: [
            ["Information we collect", "We collect the account details you provide, such as your username and email address, along with the conversations and settings needed to provide the service."],
            ["How we use information", "We use this information to authenticate you, keep your workspace available, improve reliability, and respond to support requests. We do not sell your personal information."],
            ["Your choices", "You can ask us to correct or delete your account information. You can also stop using SnapSeek at any time by signing out or requesting account deletion."],
        ],
    },
    terms: {
        label: "Terms",
        title: "Terms of Service",
        intro: "These terms explain the rules for using SnapSeek responsibly and safely.",
        sections: [
            ["Using SnapSeek", "You may use SnapSeek for lawful purposes and must keep your account credentials secure. You are responsible for activity performed through your account."],
            ["Your content", "You retain responsibility for the content you submit. Do not use SnapSeek to upload unlawful, abusive, or harmful material, or to violate another person's rights."],
            ["Service availability", "We work to keep SnapSeek reliable, but the service may change or be temporarily unavailable for maintenance, updates, or circumstances outside our control."],
        ],
    },
};

const LegalPage = ({ type }) => {
    const content = CONTENT[type];

    return (
        <main className="min-h-dvh bg-[#f5f4ef] px-4 py-5 sm:px-10 sm:py-6 text-[#20211f] lg:px-14">
            <div className="mx-auto max-w-3xl">
                <header className="flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-3" aria-label="SnapSeek home">
                        <span className="flex h-10 w-10 items-center justify-center rounded-[14px] bg-[#20211f] text-lg font-semibold text-[#f5f4ef]">S</span>
                        <span className="text-lg font-semibold tracking-[-0.04em]">SnapSeek</span>
                    </Link>
                    <Link to="/" className="text-sm font-semibold text-[#436448] transition hover:text-[#20211f]">Home</Link>
                </header>

                <article className="my-8 rounded-2xl border border-[#deded6] bg-white p-5 sm:my-16 shadow-[0_8px_25px_rgba(32,33,31,0.06)] sm:p-12">
                    <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#747a70]">{content.label}</p>
                    <h1 className="mt-3 text-3xl font-semibold tracking-[-0.05em] sm:text-4xl">{content.title}</h1>
                    <p className="mt-4 text-base leading-7 sm:mt-5 sm:text-lg sm:leading-8 text-[#687066]">{content.intro}</p>
                    <div className="mt-10 space-y-8">
                        {content.sections.map(([heading, body]) => (
                            <section key={heading}>
                                <h2 className="text-lg font-semibold">{heading}</h2>
                                <p className="mt-2 leading-7 text-[#687066]">{body}</p>
                            </section>
                        ))}
                    </div>
                </article>
            </div>
        </main>
    );
};

export default LegalPage;
