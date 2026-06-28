import { useMemo } from 'react'


export default function ParticlesBackground() {
    const particles = useMemo(() => 
    Array.from({ length: 60 }, (_, i) => ({
        id: i,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        duration: `${5 + Math.random() * 10}s`,
        delay: `${Math.random() * 5}s`
    })),[])
    
    return (
        <>
            <style>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0px) }
                    50% { transform: translateY(-20px) }
                }
            `}</style>
            <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                overflow: 'hidden',
                zIndex: 0,
                pointerEvents: 'none'
            }}>
                {particles.map(p => (
                    <div
                        key={p.id}
                        style={{
                            position: 'absolute',
                            width: '5px',
                            height: '5px',
                            background: '#00e676',
                            borderRadius: '50%',
                            opacity: 0.6,
                            left: p.left,
                            top: p.top,
                            animation: `float ${p.duration} ${p.delay} linear infinite`
                        }}
                    />
                ))}
            </div>
        </>
    )
}
