'use client';

// Fix for default locale handling in 404
export default function NotFound() {
    return (
        <html lang="en">
            <body>
                <div style={{
                    height: '100vh',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: 'system-ui, -apple-system, sans-serif'
                }}>
                    <h1 style={{ fontSize: '32px', marginBottom: '16px', fontWeight: 'bold' }}>404</h1>
                    <p style={{ fontSize: '20px', marginBottom: '16px' }}>Page Not Found</p>
                    <a href="/" style={{ color: '#0070f3' }}>Go Home</a>
                </div>
            </body>
        </html>
    );
}
