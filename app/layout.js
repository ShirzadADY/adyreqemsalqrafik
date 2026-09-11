import './globals.css';

export const metadata = {
  title: 'AZD Lokomotiv İdarəetmə',
  description: 'Aylıq növbə qrafiki sistemi',
};

export default function RootLayout({ children }) {
  return (
    <html lang="az">
      <body>{children}</body>
    </html>
  );
}
