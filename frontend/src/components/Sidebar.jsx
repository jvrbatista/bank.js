import logo from '../assets/logoBankJs.png'

export default function Sidebar({ links, onSair }) {
    return (
        <div className="w-64 bg-zinc-900 p-6 flex flex-col">
            <div className="flex items-center gap-3 mb-8">
                <img src={logo} alt="BankJS" className="w-10 mix-blend-screen" />
                <h1 className="text-white text-2xl font-bold tracking-widest">
                    BANK<span className="text-emerald-500">JS</span>
                </h1>
            </div>
            <nav className="flex flex-col gap-2">
                {links.map((link) => (
                    <a
                        key={link.href}
                        href={link.href}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl ${link.ativo ? 'text-emerald-500 bg-emerald-500/10' : 'text-gray-400 hover:text-white'}`}
                    >
                        {link.label}
                    </a>
                ))}
            </nav>
            <button onClick={onSair} className="flex items-center gap-3 text-gray-400 hover:text-white px-4 py-3 rounded-xl mt-4">
                Sair
            </button>
        </div>
    )
}