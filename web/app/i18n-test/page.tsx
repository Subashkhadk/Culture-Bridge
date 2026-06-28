'use client';

import { useTranslation } from 'react-i18next';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';

export default function I18nTestPage() {
const { t, i18n } = useTranslation();

return (
<>
<Navbar />
<div className="min-h-screen bg-surface p-8">
<div className="max-w-4xl mx-auto">
<h1 className="text-3xl font-bold text-on-surface mb-4">i18n Test Page</h1>
<p className="text-on-surface-variant mb-4">Current Language: {i18n.language}</p>

<div className="grid grid-cols-2 gap-4">
<div className="p-4 bg-surface-container-low rounded-xl">
<h2 className="font-bold">Home: {t('nav.home')}</h2>
</div>
<div className="p-4 bg-surface-container-low rounded-xl">
<h2 className="font-bold">Explore: {t('nav.explore')}</h2>
</div>
<div className="p-4 bg-surface-container-low rounded-xl">
<h2 className="font-bold">App Name: {t('app.name')}</h2>
</div>
<div className="p-4 bg-surface-container-low rounded-xl">
<h2 className="font-bold">Hero Title: {t('hero.title')}</h2>
</div>
</div>

<button
onClick={() => {
i18n.changeLanguage('ja');
console.log('Changed to Japanese');
}}
className="mt-4 px-4 py-2 bg-primary text-white rounded-lg mr-2"
>
Switch to Japanese
</button>
<button
onClick={() => {
i18n.changeLanguage('es');
console.log('Changed to Spanish');
}}
className="mt-4 px-4 py-2 bg-primary text-white rounded-lg mr-2"
>
Switch to Spanish
</button>
<button
onClick={() => {
i18n.changeLanguage('en');
console.log('Changed to English');
}}
className="mt-4 px-4 py-2 bg-primary text-white rounded-lg"
>
Switch to English
</button>
</div>
</div>
<Footer />
</>
);
}
