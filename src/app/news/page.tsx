
'use client';

import { useState, useContext } from 'react';
import Image from 'next/image';
import { SiteHeader } from '@/components/layout/site-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getNews } from '@/lib/news-data';
import type { NewsItem } from '@/lib/types';
import { AppContext } from '@/context/app-provider';
import { t } from '@/lib/translations';

export default function NewsPage() {
  const { locale } = useContext(AppContext);
  const newsItems = getNews(locale);
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(newsItems[0] || null);

  return (
    <div className="flex flex-col h-full">
      <SiteHeader title={t('News & Updates', locale)} />
      <div className="flex-1 space-y-8 p-4 pt-6 md:p-8">
        <div className="max-w-7xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>{t('Latest Updates from LifeHub', locale)}</CardTitle>
              <CardDescription>{t('Click on a headline to read the full story.', locale)}</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <aside className="md:col-span-1 flex flex-col gap-2">
                {newsItems.map((item) => (
                  <Button
                    key={item.id}
                    variant={selectedNews?.id === item.id ? 'secondary' : 'ghost'}
                    className="justify-start text-left h-auto py-2"
                    onClick={() => setSelectedNews(item)}
                  >
                    {item.title}
                  </Button>
                ))}
              </aside>
              <main className="md:col-span-3">
                {selectedNews ? (
                  <div className="space-y-4">
                    <div className="relative aspect-video w-full overflow-hidden rounded-lg">
                       <Image
                        src={selectedNews.imageUrl}
                        alt={selectedNews.title}
                        fill
                        className="object-cover"
                        data-ai-hint={selectedNews.imageHint}
                      />
                    </div>
                    <h2 className="text-2xl font-bold font-headline">{selectedNews.title}</h2>
                    <div className="prose prose-sm max-w-none text-muted-foreground">
                      <p>{selectedNews.content}</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-muted-foreground">{t('Select a news item to read.', locale)}</p>
                  </div>
                )}
              </main>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
